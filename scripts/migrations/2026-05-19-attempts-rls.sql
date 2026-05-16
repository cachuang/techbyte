-- Migration: attempts 表 RLS 政策（讀寫都鎖到自己這個 user_id）。
--
-- 為什麼：profiles 表有 RLS（select policy auth.uid() = user_id）所以
-- 跨裝置同步 OK，但 attempts 沒對應的 SELECT policy → 一旦 RLS 被啟用
-- （可能 Supabase 預設、可能手動），所有讀取就回 0 筆，完成 ✓ 永遠不出現。
--
-- 這份 migration 是 idempotent，重複跑沒副作用。

alter table attempts enable row level security;

drop policy if exists "attempts_select_own" on attempts;
drop policy if exists "attempts_insert_own" on attempts;
drop policy if exists "attempts_update_own" on attempts;
drop policy if exists "attempts_delete_own" on attempts;

create policy "attempts_select_own"
  on attempts for select
  using (auth.uid() = user_id);

create policy "attempts_insert_own"
  on attempts for insert
  with check (auth.uid() = user_id);

create policy "attempts_update_own"
  on attempts for update
  using (auth.uid() = user_id);

create policy "attempts_delete_own"
  on attempts for delete
  using (auth.uid() = user_id);
