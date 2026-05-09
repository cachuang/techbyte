# techbyte

A byte a day, keeps the layoff away.

每天 5–10 分鐘，學一個科技概念，做互動驗證，強化記憶。

## Stack

- Next.js 16 (App Router)
- React 19
- Supabase (Auth + Postgres) — 從瀏覽器直接打，無需後端
- @xyflow/react — 知識地圖視覺化
- 部署：Vercel

## Local dev

### 1. Supabase 設定（首次）

1. 在 https://supabase.com 開新 project（free tier 即可）
2. SQL Editor 跑這段 schema：

   ```sql
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

3. **Authentication → Sign In / Providers → Email** 把 **Confirm email 關掉**（這是關鍵：因為改用 username + password 登入，不寄信也不驗證）
4. Settings → API → 拷貝 `Project URL` 與 `anon public` key

### 2. 環境變數

```bash
cp .env.example .env.local
# 填入剛才拷貝的兩個值
```

### 3. 跑起來

```bash
npm install
npm run dev
```

開 `http://localhost:3000`：
- Header 點「登入」→ 切到「註冊」tab → 輸入 username（英文/數字/底線 3–24 字）+ 密碼（≥6 字元）→ 建立帳號
- 進 `/day/1` 答題 → RESULT 頁顯示「✓ 已儲存」
- 進 `/map` 看你的知識地圖

> 註：Supabase 仍會把帳號存進 `auth.users`，內部用 `techbyte_<username>@gmail.com` 當 fake email（Supabase 會驗證 email 域名 DNS，所以借用 gmail.com 當載體；我們從不真的寄信）。使用者本身只看到 username。

## Deploy

連 Vercel：
1. vercel.com → Import Project → 選此 repo
2. Environment Variables 設 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy。後續 push 自動觸發。
4. 部署後在 Supabase URL Configuration 把 Vercel domain 加進 Redirect URLs。

## Scripts

- `npm run dev` — 本機 dev
- `npm run build` — production build
- `npm run gen:concept -- --day N` — 用 Claude 生成概念草稿（可選）

## Daily release（每日解鎖）

- 「Day 1」起算點 = 使用者第一次造訪那一天（存 localStorage `techbyte_first_visit`，YYYY-MM-DD）
- 換日依使用者**本地時區** 00:00（不是 UTC）
- 已解鎖的天可以隨時補做（不需照順序）
- 未解鎖的未來天在首頁顯示「明天解鎖」/「N 天後」並 disabled，直接訪問 `/day/N` 會看到鎖定畫面
- 軟限制 — 改 localStorage 即可繞過。MVP 階段不擋這層
