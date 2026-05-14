-- Migration: profiles table for cross-device sync of per-user prefs.
--
-- 為什麼：first_visit / tracks / recap_done 之前只存 localStorage，
-- 換裝置或清快取就遺失。登入用戶應該跨裝置同步。
-- 沒登入的人繼續用 localStorage（這份 migration 不影響匿名流程）。

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_visit date,
  tracks jsonb,
  recap_done jsonb,
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- 每個用戶只能讀/寫自己這列
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = user_id);

create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = user_id);
