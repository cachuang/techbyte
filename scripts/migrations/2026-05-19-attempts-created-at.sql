-- Migration: attempts 補上 created_at（Supabase 預設應該都有，這張表是手動建的就漏了）。
--
-- 為什麼：streak（連續天數）跟「最近活動」需要日期資料。
-- fetchUserActivity 的 select 帶 created_at，沒這欄整個 SELECT 會 fail
-- → 連完成 ✓ 都不顯示。
--
-- 舊 rows 的 created_at 是 NULL（不 backfill 成 now()，避免假連續天數）。
-- 新做的 quiz 會自動帶當下時間，streak 從今天起累積。

alter table attempts
  add column if not exists created_at timestamptz default now();
