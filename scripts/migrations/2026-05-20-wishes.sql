-- Migration: wishes table（user 許願 / 我想學功能）
--
-- 設計：
--   - user 提交想學的主題 → INSERT 一筆 pending wish
--   - 你（admin）人工跑 gen-concept.mjs 生成、review、merge 到 data/concepts.js
--   - 內容上線後，把 wish 狀態改成 published、linked_concept_slug 連到 concept
--   - 該 user 在許願頁能看到「✓ 已生成 → 去讀」
--
-- 不做：update / 一個 user 同時許多個願的 limit（先不擋，看資料再說）

create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  track text,
  status text not null default 'pending',
  linked_concept_slug text,
  created_at timestamptz not null default now()
);

create index if not exists wishes_user_idx on wishes (user_id, created_at desc);

alter table wishes enable row level security;

drop policy if exists "wishes_select_own" on wishes;
drop policy if exists "wishes_insert_own" on wishes;
drop policy if exists "wishes_delete_own" on wishes;

create policy "wishes_select_own"
  on wishes for select
  using (auth.uid() = user_id);

create policy "wishes_insert_own"
  on wishes for insert
  with check (auth.uid() = user_id);

create policy "wishes_delete_own"
  on wishes for delete
  using (auth.uid() = user_id);
