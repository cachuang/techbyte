#!/usr/bin/env node
// Daily wish processor.
// Reads pending wishes from Supabase, derives a stub via Haiku, runs
// gen-concept.mjs to produce a full draft + review, marks the wish as
// generated. Drafts get committed by the GH Action's create-pull-request
// step (see .github/workflows/process-wishes.yml).
//
// env required:
//   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY  ← service role, bypasses RLS
//   ANTHROPIC_API_KEY

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ANTHROPIC_API_KEY) {
  console.error(
    "Missing env: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / ANTHROPIC_API_KEY",
  );
  process.exit(1);
}

const MAX_PER_RUN = 3;
const STUB_MODEL = "claude-haiku-4-5-20251001";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const StubSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe("kebab-case 英文 slug, 2-3 詞, 全小寫，沒空格"),
  title: z.string().describe("zh-Hant 標題、必要時可附 (English Term)"),
  hook: z.string().describe("zh-Hant hook 問題, 1-2 句, 勾起好奇"),
  analogyHint: z.string().describe("zh-Hant 類比一句話摘要, 5-20 字"),
  tag: z.enum([
    "網路",
    "API 設計",
    "安全",
    "效能",
    "工程",
    "資料庫",
    "AI",
    "程式設計",
    "演算法",
    "並發",
    "型別系統",
    "分散式系統",
    "測試",
    "監控",
  ]),
});

async function deriveStub(topic, track) {
  const response = await anthropic.messages.parse({
    model: STUB_MODEL,
    max_tokens: 600,
    output_config: {
      format: zodOutputFormat(StubSchema, "stub"),
    },
    messages: [
      {
        role: "user",
        content: `使用者許願的主題："${topic}"${track ? `\n用戶選的方向：${track}` : ""}

請產生 concept stub：
- slug：kebab-case 英文，2-3 個詞，全小寫，不要太抽象
- title：中文，必要時帶英文原名（例：「向量資料庫」「Closure（閉包）」）
- hook：中文 1-2 句問句，勾住「為什麼要懂這個」
- analogyHint：中文一句話、5-20 字描述類比角度（例：「電話 vs 寫信」）
- tag：從固定列表選最貼近的一個`,
      },
    ],
  });
  return response.parsed_output;
}

function runGenConcept(args) {
  return new Promise((res) => {
    const proc = spawn("node", ["scripts/gen-concept.mjs", ...args], {
      cwd: ROOT,
      stdio: "inherit",
      env: { ...process.env },
    });
    proc.on("close", (code) => res(code ?? 1));
    proc.on("error", (err) => {
      console.error("gen-concept spawn error:", err.message);
      res(1);
    });
  });
}

async function main() {
  console.log("Fetching pending wishes...");
  const { data: wishes, error } = await supabase
    .from("wishes")
    .select("id, topic, track, user_id")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(MAX_PER_RUN);

  if (error) {
    console.error("Fetch failed:", error.message);
    process.exit(1);
  }

  if (!wishes || wishes.length === 0) {
    console.log("No pending wishes.");
    return;
  }

  console.log(`Processing ${wishes.length} wishes\n`);

  for (const wish of wishes) {
    console.log(`\n=== ${wish.id}: "${wish.topic}" ===`);
    let stub;
    try {
      stub = await deriveStub(wish.topic, wish.track);
      console.log(
        `  stub: slug=${stub.slug}, title=${stub.title}, tag=${stub.tag}`,
      );
    } catch (e) {
      console.error(`  stub derivation failed: ${e.message}`);
      continue;
    }

    // releaseDay placeholder = 999. Admin assigns real day during integration.
    const code = await runGenConcept([
      "--slug",
      stub.slug,
      "--title",
      stub.title,
      "--hook",
      stub.hook,
      "--analogy-hint",
      stub.analogyHint,
      "--tag",
      stub.tag,
      "--release-day",
      "999",
    ]);

    if (code !== 0) {
      console.warn(
        `  gen-concept exited ${code} (review may have flagged issues; draft saved either way)`,
      );
    }

    const { error: updErr } = await supabase
      .from("wishes")
      .update({
        status: "generated",
        linked_concept_slug: stub.slug,
      })
      .eq("id", wish.id);

    if (updErr) {
      console.error(`  DB update failed: ${updErr.message}`);
    } else {
      console.log(`  ✓ marked as generated`);
    }
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
