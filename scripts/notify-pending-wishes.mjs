#!/usr/bin/env node
// Daily check: if pending wishes count >= THRESHOLD, open a GitHub issue
// so the admin gets an email notification. No LLM calls, no cost.
//
// env required:
//   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY  ← bypasses RLS
//   GITHUB_TOKEN               ← auto-provided by GH Actions
//   GITHUB_REPO                ← e.g. cachuang/techbyte

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;

const THRESHOLD = Number(process.env.WISH_THRESHOLD || 3);
const TITLE_PREFIX = "📬 Wishes 待處理";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GITHUB_TOKEN || !GITHUB_REPO) {
  console.error(
    "Missing env: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / GITHUB_TOKEN / GITHUB_REPO",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function ghFetch(path, init = {}) {
  return fetch(`https://api.github.com/repos/${GITHUB_REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
  });
}

async function main() {
  const { data: wishes, error } = await supabase
    .from("wishes")
    .select("id, topic, track, created_at, user_id")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch wishes failed:", error.message);
    process.exit(1);
  }

  const count = wishes?.length || 0;
  console.log(`Pending wishes: ${count}, threshold: ${THRESHOLD}`);

  if (count < THRESHOLD) {
    console.log("Below threshold, no notification.");
    return;
  }

  // Dedup：如果有 open issue 標題前綴一致就更新，不開新的
  const listResp = await ghFetch("/issues?state=open&per_page=100");
  if (!listResp.ok) {
    console.error("List issues failed:", await listResp.text());
    process.exit(1);
  }
  const existing = (await listResp.json()).find((i) =>
    i.title.startsWith(TITLE_PREFIX),
  );

  const body = renderBody(wishes, count);

  if (existing) {
    console.log(`Existing issue #${existing.number}, updating...`);
    const updResp = await ghFetch(`/issues/${existing.number}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: `${TITLE_PREFIX}（${count} 個）`,
        body,
      }),
    });
    if (!updResp.ok) {
      console.error("Update failed:", await updResp.text());
      process.exit(1);
    }
    console.log(`✓ Updated ${(await updResp.json()).html_url}`);
    return;
  }

  console.log("Creating new issue...");
  const createResp = await ghFetch("/issues", {
    method: "POST",
    body: JSON.stringify({
      title: `${TITLE_PREFIX}（${count} 個）`,
      body,
    }),
  });
  if (!createResp.ok) {
    console.error("Create failed:", await createResp.text());
    process.exit(1);
  }
  const issue = await createResp.json();
  console.log(`✓ Created ${issue.html_url}`);
}

function renderBody(wishes, count) {
  const lines = [
    `**${count} 個 pending wishes 等你處理。**`,
    "",
    "## 願望清單",
    "",
  ];
  for (let i = 0; i < wishes.length; i++) {
    const w = wishes[i];
    const date = new Date(w.created_at).toISOString().slice(0, 10);
    const trackLabel = w.track ? ` · _${w.track}_` : "";
    lines.push(`${i + 1}. **${w.topic}**${trackLabel}  \n   \`${w.id}\` · ${date}`);
  }
  lines.push("", "## 處理流程", "", "1. 開 Claude Code session 在這個 repo");
  lines.push("2. 跟它說「處理 pending wishes」");
  lines.push("3. AI 會逐一寫 draft / review / 整合到 `data/concepts.js` / deploy");
  lines.push("4. 跑 SQL 把 wish 標 published（每篇一條）：");
  lines.push("   ```sql");
  lines.push(
    "   UPDATE wishes SET status='published', linked_concept_slug='<slug>' WHERE id='<id>';",
  );
  lines.push("   ```");
  lines.push("5. 全部處理完就關掉這個 issue");
  lines.push("");
  lines.push(`_Threshold: ${THRESHOLD}。少於這個數量不會通知。_`);
  return lines.join("\n");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
