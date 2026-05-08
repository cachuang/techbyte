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
  console.error(`  Review, then merge into data/concepts.js.`);
}
