# techbyte — 開發 Context

> Single source of truth。任何要繼續開發的 session 重讀這份就能無縫接續。

---

## 1. 產品定位

每天 5–10 分鐘，學一個科技概念，做互動驗證，強化記憶。

- **目標使用者**: 已在科技業但想補知識的人（非新手、非學生）
- **內容定調**: 「你聽過但說不清楚」的概念，有深度、有取捨討論
- **核心假設**: 互動驗證（答題 + 即時解說）真的比純閱讀更幫助記憶
- **MVP 不需要多功能**, 只要讓這個實驗能跑、收到數據

---

## 2. Tech Stack & Deployment

| 元件 | 選擇 |
|---|---|
| 框架 | Next.js 16 (App Router) + React 19 |
| 後端 / Auth | Supabase（auth.users + RLS + Postgres） |
| 知識地圖視覺化 | 已從 ReactFlow 換成自製 grouped list（@xyflow/react 已移除） |
| 部署 | Vercel（push to main 自動部署 production；feature branch 自動建 preview） |
| Repo | github.com/cachuang/techbyte |

**部署 flow**:
1. 在 feature branch 開發 → push → Vercel 自動建 preview deploy
2. 開 PR to main → review preview → merge
3. Merge 後 Vercel 自動部署 production

**目前 feature branch**: `claude/continue-main-development-aJQOB`

---

## 3. 檔案結構

```
/
├── app/
│   ├── layout.jsx              # 含 viewport export（mobile-friendly）
│   ├── globals.css             # base + 手機 @media 響應式 overrides
│   ├── providers.jsx           # AuthProvider wrapper
│   ├── page.jsx                # 首頁 day list（client component，含 daily lock）
│   ├── day/[day]/page.jsx      # 個別概念頁（generateStaticParams 預先 SSG）
│   └── map/page.jsx            # 知識地圖頁（grouped list + stats）
├── components/
│   ├── TechByte.jsx            # 概念主元件（READ / QUIZ / RESULT 三階段）
│   ├── KnowledgeMap.jsx        # /map 用的 grouped list
│   ├── Header.jsx              # 全站 sticky header
│   └── AuthForm.jsx            # username + password 登入/註冊
├── data/
│   └── concepts.js             # 全部 16 個概念（資料 + 題目）
├── lib/
│   ├── supabase.js             # Supabase client init
│   ├── auth-context.jsx        # useAuth() hook
│   └── day-progress.js         # daily release localStorage logic
├── scripts/
│   └── gen-concept.mjs         # 用 Claude 生內容草稿（含 reviewer pass，見 §11.5）
├── README.md                   # 部署 / 開發說明
└── context.md                  # 你正在讀的這份
```

---

## 4. 概念資料結構（v2，含新欄位）

```js
{
  day: Number,
  tag: String,                 // 分類：API 設計 / 工程 / 安全 / 程式設計 ...
  title: String,
  hook: String,                // 開場問句，勾住注意力
  body: String,                // 正文兩段，用 \n\n 分隔

  analogy: {                   // 生活化類比
    icon: String,              // emoji
    title: String,
    text: String,
  },
  analogyHint: String,         // 一句話摘要，用於下一日預告

  // === v2 新增（全 optional）===
  originStory: String,         // 「這玩意誰在什麼問題下發明」一段 narrative
  example: {                   // optional, 5-15 行 code/設定/指令
    code: String,
    note: String,              // 看完 code 後的 takeaway
  },
  oneLiner: String,            // 30 秒向人解釋的「一句話救援」
  furtherReading: [{           // 2 個精選資源
    title: String,
    url: String,
    why: String,               // 為什麼推薦這個（一句話）
  }],

  tradeoffs: [                 // 恰好 3 條：✅ / ⚠️ / ❌
    { label: String, text: String }
  ],
  questions: [                 // 恰好 3 題
    {
      id: Number,
      type: "概念辨識" | "情境判斷" | "錯誤假設",
      question: String,
      options: [
        { id: "a"|"b"|"c", text: String, correct: Boolean }
      ],
      explanation: String,     // 答完後的完整解說
      misconception: String,   // 常見誤解一句話
    }
  ],
}
```

**新舊版本狀態**: Day 1-16 全部齊備所有 v2 欄位（v2 backfill 已完成）。新寫的 Day 17+ 也照 v2 結構走。

**`example` 為什麼有些 day 沒寫**: 協定/抽象級概念（Day 3 CDN、Day 5 TCP/UDP、Day 13 Eventual Consistency）塞 code 反而誤導，故意跳過；rendering 自動跳過空欄位。

---

## 5. 已完成的概念（Day 1-25）

| Day | 標題 | Tag |
|---|---|---|
| 1 | JWT vs Session | API 設計 |
| 2 | REST vs GraphQL | API 設計 |
| 3 | CDN 是什麼 | 效能 |
| 4 | RAG（檢索增強生成） | AI |
| 5 | TCP vs UDP | 網路 |
| 6 | Docker 的核心價值 | 工程 |
| 7 | 資料庫 Index | 資料庫 |
| 8 | OAuth 2.0 | 安全 |
| 9 | Webhook vs Polling | API 設計 |
| 10 | 向量資料庫 | AI |
| 11 | Kubernetes 的核心價值 | 工程 |
| 12 | gRPC vs REST | API 設計 |
| 13 | Eventual Consistency | 分散式系統 |
| 14 | Cache 策略 | 效能 |
| 15 | Rate Limiting | 安全 |
| 16 | Closure（閉包） | 程式設計 |
| 17 | Mutability vs Immutability | 程式設計 |
| 18 | Race Condition | 並發 |
| 19 | Big-O 複雜度 | 演算法 |
| 20 | Composition vs Inheritance | 程式設計 |
| 21 | Static vs Dynamic Typing | 型別系統 |
| 22 | Mock / Stub / Spy | 測試 |
| 23 | Garbage Collection | 工程 |
| 24 | Idempotency | API 設計 |
| 25 | Hashing vs Encryption | 安全 |

---

## 6. 待寫概念

Day 1-25 全部完成。Day 26+ 尚未規劃主題。

---

## 7. Feature: Daily Release（每日解鎖）

**邏輯**: 使用者第一次造訪當天 = Day 1，每天本地 00:00 解鎖下一天。

```js
// lib/day-progress.js
const STORAGE_KEY = "techbyte_first_visit";
// firstVisit 用 YYYY-MM-DD 字串避免時區坑
// currentDay = daysBetween(firstVisit, today) + 1
```

**規則**:
- 已解鎖的天可隨時補做（不需照順序）
- 未解鎖的未來天在首頁顯示「明天解鎖」/「N 天後」並 disabled
- 直接訪問 `/day/N` 會看到鎖定畫面（icon + 解鎖時間 + 概念預告 + 回首頁 CTA）
- 軟限制 — 改 localStorage 即可繞過。MVP 不擋這層

**測試指令**:
```js
// 設成 5 天前 → Day 1-5 解鎖
localStorage.setItem('techbyte_first_visit', '2026-01-01'); location.reload();
// 重置回新使用者
localStorage.removeItem('techbyte_first_visit'); location.reload();
```

---

## 8. Feature: Auth

**設計**: username + password via Supabase Auth。

**為什麼不是 magic link**: Supabase 免費方案 SMTP 全 project 每小時 4 封，測試很容易撞到 rate limit。產品本身又不需要驗證 email。

**為什麼不是另起 users 表**: 沿用 auth.users + RLS（attempts 表的 user_id reference 不用改），重寫成本太高。

**內部 trick**: username 包成 fake email `techbyte_<username>@gmail.com` 給 Supabase。
- 為什麼用 gmail.com: Supabase Auth 會驗證 email 域名 DNS，虛構域名（試過 `user.techbyte.app`）會被擋
- 為什麼前綴 `techbyte_`: 避免跟真 Gmail 用戶撞名
- 真實 username 存 `user_metadata.username`，UI 顯示用它（Header `@username`）

**Supabase 後台必做設定**:
> Authentication → Sign In / Providers → Email → **Confirm email = OFF（false）**

不關的話，新註冊使用者會被 Supabase 視為「未驗證」無法登入。

**程式碼位置**: `components/AuthForm.jsx`（含 username 規則 `^[a-zA-Z0-9_]{3,24}$`、密碼 ≥ 6 字元、錯誤訊息中文化）。

---

## 9. Feature: 知識地圖（/map）

**從 ReactFlow 換成 grouped list**：force-directed graph 在手機上擠到看不清楚，且空間關係對學習進度沒實質意義。新版分兩塊:

**Stats Card（頂部）**:
- 三欄大數字：已掌握 / 嘗試中 / 未做
- 漸層黃進度條 + 「掌握進度 N%」label

**Grouped List（下方）**:
- 依 tag 分組，每組 header 顯示「N / M 已掌握」
- 每筆概念 row：狀態圓點（金/橙/灰）+ Day 編號 + 標題 + 分數
- 整 row 是 `<Link>`，tap 區夠大

**狀態判斷**（per concept）:
- score ≥ 2/3 → 已掌握（金色 + glow）
- 1 ≤ score < 2 → 嘗試中（橙色）
- 沒嘗試過 → 未做（暗灰）
- 取每個 day 的 best score（多次嘗試取最高）

**程式碼位置**: `components/KnowledgeMap.jsx`（attempts 從 `app/map/page.jsx` 透過 props 傳入）。

---

## 10. UI/UX 設計規範

### 色彩

| 用途 | 色碼 |
|---|---|
| 主背景 | `#0e0e10`（從原本純黑 #0a0a0a 微提亮） |
| 卡片背景 | `#111` / `#141418` |
| 邊框 / 分隔 | `#1c1c20` / `#2a2a2a` |
| 主文字 | `#dcd8cc`（從 #e8e8e0 暖灰化降對比） |
| 次要文字 | `#888` / `#7a766c` |
| 強調黃 | `#facc15`（按鈕、今天、強調） |
| 暖黃 | `#fbbf24`（標籤 / 次強調） |
| 答對綠 | `#4ade80` |
| 答錯紅 | `#f87171` |
| 不確定藍 | `#60a5fa` |

### 字型

- **標題 / 正文**: `Georgia`, `Noto Serif TC`, serif
- **數字（Day 編號 / 統計）**: Georgia serif, 大號 + tabular-nums
- **標籤 / 按鈕 / badge / monospace 元素**: `Courier New`, monospace
- **Code 區塊**: `SF Mono`, `Menlo`, `Consolas`, `Courier New`

### Mobile-first 守則

- ≤ 640px 用 className overrides（globals.css `@media`）覆蓋桌面 inline style
- 360px breakpoint 再降一級（iPhone SE 等窄機）
- Tap target ≥ 44px（Apple HIG）
- input `font-size: 16px` 防 iOS 自動 zoom
- `viewport-fit: cover` + `env(safe-area-inset-bottom)` 處理 notch / home indicator
- hover 樣式包進 `@media (hover: hover)` 避免手機卡 active state
- 答題選項用 `<button>` 而非 `<div>`（鍵盤可達 + aria-pressed）

### TechByte 渲染順序（READ stage）

```
Hook
↓
Body（2 段）
↓
[optional] Code / 範例
↓
Analogy（生活類比）
↓
[optional] Origin Story
↓
Tradeoffs（✅ / ⚠️ / ❌）
↓
[optional] One-liner（一句話救援）
↓
CTA（手機 sticky bottom）
```

**RESULT stage** 在「明天學什麼」之前插 `[optional] Further Reading`。

---

## 11. Voice / 寫作風格規範

寫新概念時必照下面這份語氣:

- **直接，不油腔**: 「JWT 不是加密的」勝過「許多人以為 JWT 是加密的，但其實不是」
- **講取捨，不只是定義**: 每個段落要有「換來什麼、付什麼代價」
- **避免買書感的客套**: 不寫「在這個 AI 時代...」「總之」「希望這篇對你有幫助」
- **舉例要具體**: 「100 台伺服器」勝過「在分散式環境」
- **誤解要點出來**: 每題 misconception 是一句話的「常見錯誤思考方式」
- **中英文混排自然**: 技術名詞英文（JWT, Closure, Race Condition），框架用語可中文（陣列、字串）

### 11.5 內容產生流程（必照）

新內容**一律走 `scripts/gen-concept.mjs` 兩段式管線**，不要手寫貼進 `data/concepts.js`：

1. **Generation pass** — Claude Opus 4.7、`thinking: adaptive`、`effort: high`、Zod schema 強制結構。產出落 `data/drafts/day-N.json`。
2. **Reviewer pass**（預設啟用，`--no-review` 才跳過）— 同個 model、共用 cached VOICE，但角色換成「挑刺工程師」。產出落 `data/drafts/day-N.review.md`，含 verdict (`pass` / `needs-edit` / `rewrite`) 與 issues[]（severity `blocker` / `warn` / `nit`）。

**Merge 進 concepts.js 前的硬性條件**：

- 所有 `blocker` 必須處理（事實錯誤、選項邏輯崩壞）
- `verdict: rewrite` → 重生，不是手動補丁
- `warn` 至少要看過、決定「修」或「明確不修」（commit message 解釋為什麼）
- `nit` 可選擇性處理

Reviewer 不是橡皮圖章。事實層面 reviewer 也可能錯（特別是冷僻領域），但結構問題（選項立場重疊、循環論證、類比破綻）reviewer 抓得很準，**不要忽略它的結構抓錯**。

---

## 12. 觀察到的使用者偏好（cachuang）

從互動中歸納出來的取捨：

- **手機優先**: 主要使用者裝置是手機，桌面是次要
- **降對比**: 純黑 + 全白太刺眼，喜歡暖灰系統
- **字體要紮實**: 寧願 semibold/700 不要 regular
- **資訊密度高但不擁擠**: 喜歡 stats card 一眼看完
- **務實**: 不喜歡過早優化（DB schema 不急著搬、admin UI 不急著做）
- **deploy 願意自動進 production**: PR 開了就直接 merge（風險可控的前提下）
- **要看 review**: 重大內容（如新 day）要先看內容再 ship；架構問題要先討論再動

---

## 13. 已知 Supabase Schema

```sql
-- attempts: 答題紀錄
create table attempts (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  day integer not null,
  score integer not null,
  unsure_count integer not null,
  answers jsonb not null,
  completed_at timestamptz default now()
);

alter table attempts enable row level security;

create policy "users see own attempts" on attempts
  for all using (auth.uid() = user_id);
```

`answers` 欄位的 jsonb 結構:
```js
[
  { qId: Number, correct: Boolean, unsure: Boolean }
]
```

---

## 14. 互動規則（Quiz 細節）

1. **閱讀進度 > 60% 才能進入答題**（進度條自動計時，6 秒後達標。防止跳過。）
2. **選完選項才能點「確認答案」**（按鈕 opacity 0.3 → 1）
3. **確認後選項鎖定**，顯示對錯顏色 + 解說，才能進下一題
4. **「我不確定答案」是獨立 UI 元素**：虛線藍邊、選了視為答錯（unsure: true）+ 結果頁顯示 🤔 圖示
5. **答完三題後寫入 Supabase**（如果有登入）；未登入則丟失，並在結果頁顯示「💾 登入後即可保存進度」

---

## 15. 已決定但尚未實作（Backlog）

按優先序排：

- **Day 17-25 內容**（已決定主題 + 結構，待寫）
- **未登入結果頁更明確的登入 CTA**（提升轉換）
- **改名功能 / 修改密碼**（目前只能登入登出）
- **進階題（optional）+ 「想想看」自由作答**（互動深化）
- **Result page 的 share card**（社群擴散）
- **Streak / 連續天數機制**（黏著度）
- **Concept admin UI**（當有非工程師寫手後再做）
- **把 concepts 從 JS 搬進 Supabase**（當主題量 > 80 或非工程師寫手出現後再做，目前不必）

---

## 16. PR 流程約定

- 開 feature 用 `claude/continue-main-development-aJQOB` 分支
- 每個 logical change 一個 commit，message 用第三人稱現在式
- Commit message 末尾附 `https://claude.ai/code/session_<id>`
- 開 PR 時帶 Summary + Test plan 兩個段落
- merge_method 用 `merge`（保留歷史 / 對應 PR #1 樣式）
- 主要使用者（cachuang）會 review PR diff 但鼓勵直接 merge 加快迭代

---

## 17. Quick Status Snapshot（截至 2026-05-09）

- ✅ Day 1-25 全部 v2 結構完成（Day 17-25 於本 session 完成）
- ✅ Daily release lock 已上 production
- ✅ Auth 已切到 username + password（Supabase 設定使用者已關 confirm email）
- ✅ /map 已重做為 grouped list
- ✅ 全頁面手機 UX 優化已上
- ✅ 首頁 day list 重設計（軟調 + 大數字 + 強 today highlight）已上

**下一步**: 規劃 Day 26+ 主題 / 其他 backlog 功能（streak、share card 等）。

---

## 18. 給未來 session 的指令

如果你（Claude）剛接手這個 session：

1. **讀完這份 context.md** 即可了解全部現況，不必爬整個 codebase
2. **要開發新功能就直接開工**，不必先「探索 codebase」
3. **遵循這份的 voice / 設計規範**
4. **PR / commit 規範**照 §16
5. **遇到不確定的設計決策**先問使用者再動，不要自行假設方向
6. **更新 context.md** 是 ongoing 的事 — 重大改動完成後更新對應段落
