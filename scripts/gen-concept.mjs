#!/usr/bin/env node
// Generate a Day-N concept draft via Claude Opus 4.7.
//
// Usage:
//   ANTHROPIC_API_KEY=sk-... npm run gen:concept -- --day 3
//   ANTHROPIC_API_KEY=sk-... npm run gen:concept -- --day 3 --title "CDN" --hook "..." --analogy-hint "..." --tag "效能"
//   ANTHROPIC_API_KEY=sk-... npm run gen:concept -- --day 3 --stdout
//
// Reads metadata stub from data/concepts.js by default; --title / --hook /
// --analogy-hint / --tag override. Writes data/drafts/day-N.json (or stdout
// with --stdout). Always pretty-prints to stderr a summary for review.

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { parseArgs } from "node:util";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { concepts } from "../data/concepts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const { values } = parseArgs({
  options: {
    day: { type: "string" },
    title: { type: "string" },
    hook: { type: "string" },
    "analogy-hint": { type: "string" },
    tag: { type: "string" },
    model: { type: "string", default: "claude-opus-4-7" },
    stdout: { type: "boolean", default: false },
    "no-review": { type: "boolean", default: false },
  },
});

if (!values.day) {
  console.error("missing --day");
  process.exit(1);
}
const day = Number(values.day);
const stub = concepts.find((c) => c.day === day) ?? {};
const title = values.title ?? stub.title;
const hook = values.hook ?? stub.hook;
const analogyHint = values["analogy-hint"] ?? stub.analogyHint;
const tag = values.tag ?? stub.tag;

if (!title || !hook || !analogyHint) {
  console.error(
    `Day ${day} has incomplete metadata. Provide --title --hook --analogy-hint (and --tag).`,
  );
  process.exit(1);
}

const ConceptSchema = z.object({
  day: z.number().int(),
  tag: z.string(),
  title: z.string(),
  hook: z.string(),
  body: z
    .string()
    .describe("正文，兩段，用 \\n\\n 分隔。第一段點出問題或現狀，第二段說明解法和取捨。"),
  analogy: z.object({
    icon: z.string().describe("一個生活化 emoji"),
    title: z.string().describe("類比的標題，如「入場手環 vs 接待員記名冊」"),
    text: z.string().describe("類比的解說，2-3 句"),
  }),
  analogyHint: z.string().describe("類比一句話摘要，用於下一日預告"),
  tradeoffs: z
    .array(
      z.object({
        label: z
          .string()
          .describe("以 ✅ / ⚠️ / ❌ 開頭的標籤，例如「✅ 適合用 X 當」"),
        text: z.string(),
      }),
    )
    .describe("恰好三條：✅ 適合 / ⚠️ 注意 / ❌ 不適合"),
  questions: z
    .array(
      z.object({
        id: z.number().int(),
        type: z.enum(["概念辨識", "情境判斷", "錯誤假設"]),
        question: z.string(),
        options: z
          .array(
            z.object({
              id: z.enum(["a", "b", "c"]),
              text: z.string(),
              correct: z.boolean(),
            }),
          )
          .describe("恰好三個選項；恰好一個 correct: true"),
        explanation: z
          .string()
          .describe("為什麼正確答案正確、其他選項錯在哪。100-200 字。"),
        misconception: z.string().describe("常見誤解一句話，30 字以內"),
      }),
    )
    .describe("恰好三題：第一題概念辨識、第二題情境判斷、第三題錯誤假設"),
});

const day1 = concepts.find((c) => c.day === 1);
const day2 = concepts.find((c) => c.day === 2);

const VOICE = `# 你是 techbyte 的內容作者

techbyte 是一個給「已在科技業但想補知識」的工程師讀的每日學習產品。每天 5-10 分鐘讀一個科技概念、答 3 題驗證理解。

# 風格鐵律

- 鎖定「你聽過但說不清楚」的概念。寫給「能 google 但懶得 google」的人，不寫給新手。
- 永遠帶**取捨討論**。沒有絕對的好壞，只有場景。「沒有銀彈，只有取捨」是 techbyte 的核心觀念。
- 用**生活類比**降低認知負擔。類比要具體、夠不一樣（不要兩個都是「東西」），讀者一看就懂兩者差在哪。
- **Hook** 用一個讓人想知道答案的問句，不要平鋪直敘。例：「為什麼 X 自己發明了 Y，但大部分人還是用 Z？」
- 三題覆蓋三種題型：
  1. **概念辨識** — 測有沒有記住核心定義（破除「以為是 X 其實是 Y」）
  2. **情境判斷** — 測能不能在真實場景做選擇（這題最重要）
  3. **錯誤假設** — 測能不能破除常見誤解（同事/網路上常聽到的錯話）
- 每題恰好 **3 個選項**，**恰好 1 個正確**。錯誤選項要「合理但錯」，不要明顯錯到沒人選。
- **解說**回答「為什麼」，不只是「什麼」。100-200 字。
- **誤解**一句話，銳利、可記住，30 字以內。
- 字體用繁體中文。技術名詞保留英文（JWT、REST、N+1）。

# 範例輸出（這是你過去寫的內容，照這個品質）

## 範例 1：Day 1
${JSON.stringify(day1, null, 2)}

## 範例 2：Day 2
${JSON.stringify(day2, null, 2)}`;

const userPrompt = `請寫 Day ${day} 的概念內容。

主題：${title}
標籤：${tag ?? "未指定"}
類比提示：${analogyHint}
核心問題：${hook}

請依 schema 輸出 JSON，沿用上述兩個範例的語氣與結構。day 欄位寫 ${day}。`;

const client = new Anthropic();

console.error(`▸ Generating Day ${day}: ${title}`);
console.error(`  model: ${values.model}, effort: high\n`);

const response = await client.messages.parse({
  model: values.model,
  max_tokens: 16000,
  thinking: { type: "adaptive" },
  output_config: {
    effort: "high",
    format: zodOutputFormat(ConceptSchema, "concept"),
  },
  system: [{ type: "text", text: VOICE, cache_control: { type: "ephemeral" } }],
  messages: [{ role: "user", content: userPrompt }],
});

const concept = response.parsed_output;
if (!concept) {
  console.error("✗ Model did not return parseable JSON. Raw content:");
  console.error(JSON.stringify(response.content, null, 2));
  process.exit(2);
}

for (const q of concept.questions) {
  const correctCount = q.options.filter((o) => o.correct).length;
  if (correctCount !== 1) {
    console.error(
      `✗ Question ${q.id} (${q.type}) has ${correctCount} correct answers, expected 1.`,
    );
    process.exit(3);
  }
}
if (concept.questions.length !== 3) {
  console.error(`✗ Expected 3 questions, got ${concept.questions.length}.`);
  process.exit(3);
}
if (concept.tradeoffs.length !== 3) {
  console.error(`✗ Expected 3 tradeoffs, got ${concept.tradeoffs.length}.`);
  process.exit(3);
}

const u = response.usage;
console.error(
  `▸ Done. tokens: input=${u.input_tokens} cache_read=${u.cache_read_input_tokens ?? 0} cache_write=${u.cache_creation_input_tokens ?? 0} output=${u.output_tokens}`,
);
console.error(`▸ Hook: ${concept.hook}`);
console.error(`▸ Analogy: ${concept.analogy.icon} ${concept.analogy.title}`);
console.error(
  `▸ Questions: ${concept.questions.map((q) => q.type).join(" / ")}\n`,
);

if (values.stdout) {
  process.stdout.write(JSON.stringify(concept, null, 2) + "\n");
} else {
  const outPath = resolve(ROOT, `data/drafts/day-${day}.json`);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(concept, null, 2) + "\n");
  console.error(`▸ Wrote ${outPath}`);
}

// Reviewer pass: 同個 model、共用 cached VOICE，角色換成挑刺工程師。
// 找事實錯誤、干擾選項強度問題、循環論證、風格偏移。不會自動改稿，
// 只會印 issues 並寫 day-N.review.md 給人類審稿用。
let reviewExitCode = 0;
if (!values["no-review"] && !values.stdout) {
  const ReviewSchema = z.object({
    verdict: z
      .enum(["pass", "needs-edit", "rewrite"])
      .describe("pass = 可直接合併；needs-edit = 有需修的點但骨架對；rewrite = 重來"),
    summary: z.string().describe("整體一句話評論"),
    issues: z
      .array(
        z.object({
          severity: z.enum(["blocker", "warn", "nit"]),
          location: z
            .string()
            .describe(
              "JSON 路徑，例如 'body'、'analogy.text'、'questions[1].options[b]'、'questions[2].explanation'",
            ),
          issue: z.string().describe("問題是什麼。事實錯誤要寫出正確版本。"),
          suggestion: z.string().describe("具體怎麼修，可貼可改的句子最好"),
        }),
      )
      .describe("找到的問題清單。沒問題就回空陣列，不要硬找碴。"),
  });

  const reviewUserPrompt = `下面是剛產出的 Day ${day} 草稿，請 review。

\`\`\`json
${JSON.stringify(concept, null, 2)}
\`\`\`

你是 techbyte 的挑刺工程師。重點檢查：

1. **事實錯誤** — 技術細節是否正確（最重要）。如果你不確定某個 claim，就標 warn，不要假裝確定。
2. **干擾選項強度** — 三個選項裡，錯誤的兩個是不是「合理但錯」？太弱（明顯沒人選）或太強（連正確答案都站不住）都要抓。
3. **解說品質** — 是回答「為什麼」還是只在重述「什麼」？有沒有循環論證？
4. **類比破綻** — 兩邊對應關係是否成立？會不會誤導？
5. **風格偏移** — 違反上面 voice rules（例：寫給新手、缺取捨討論、hook 平鋪直敘）。

每個 issue 給 severity / location / issue / suggestion。沒問題回空陣列，不要硬找碴。
verdict 嚴格判：有 blocker → rewrite 或 needs-edit；只有 nit → pass。`;

  console.error(`\n▸ Running reviewer pass...`);
  const reviewResponse = await client.messages.parse({
    model: values.model,
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: zodOutputFormat(ReviewSchema, "review"),
    },
    system: [
      { type: "text", text: VOICE, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: reviewUserPrompt }],
  });

  const review = reviewResponse.parsed_output;
  if (!review) {
    console.error("✗ Reviewer did not return parseable JSON. Skipping review.");
  } else {
    const ru = reviewResponse.usage;
    console.error(
      `▸ Review done. tokens: input=${ru.input_tokens} cache_read=${ru.cache_read_input_tokens ?? 0} output=${ru.output_tokens}`,
    );
    console.error(`▸ Verdict: ${review.verdict.toUpperCase()} — ${review.summary}`);

    const sevIcon = { blocker: "🛑", warn: "⚠️ ", nit: "·" };
    if (review.issues.length === 0) {
      console.error(`  No issues found.`);
    } else {
      for (const i of review.issues) {
        console.error(
          `  ${sevIcon[i.severity]} [${i.severity}] ${i.location}\n      ${i.issue}\n      → ${i.suggestion}`,
        );
      }
    }

    const md = [
      `# Day ${day} review`,
      ``,
      `**Verdict**: ${review.verdict}`,
      ``,
      review.summary,
      ``,
      `## Issues (${review.issues.length})`,
      ``,
      ...(review.issues.length === 0
        ? ["_No issues found._"]
        : review.issues.flatMap((i) => [
            `### ${sevIcon[i.severity]} [${i.severity}] \`${i.location}\``,
            ``,
            i.issue,
            ``,
            `**Fix**: ${i.suggestion}`,
            ``,
          ])),
    ].join("\n");
    const reviewPath = resolve(ROOT, `data/drafts/day-${day}.review.md`);
    await writeFile(reviewPath, md);
    console.error(`▸ Wrote ${reviewPath}`);

    const blockers = review.issues.filter((i) => i.severity === "blocker").length;
    if (blockers > 0 || review.verdict === "rewrite") reviewExitCode = 4;
  }
}

console.error(`\n  Review the draft, then merge into data/concepts.js.`);
process.exit(reviewExitCode);
