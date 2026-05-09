-- Migration: attempts.day (int) -> attempts.concept_slug (text)
--
-- 為什麼：把「概念身分」(slug) 跟「發行時程」(releaseDay) 拆開。
-- 之前 day 同時當兩者用，未來想調整 release 順序就會把舊紀錄打亂。
--
-- 假設此 migration 跑在 production 上、且 attempts 已有資料：
--   1. 加 concept_slug 欄位（nullable）
--   2. backfill：照 day -> slug 對照表寫入
--   3. 設 NOT NULL、drop day 欄位
--
-- 若 attempts 還沒有任何資料，可以直接跑：
--   alter table attempts drop column day;
--   alter table attempts add column concept_slug text not null;

-- Step 1: add column (nullable)
alter table attempts add column concept_slug text;

-- Step 2: backfill from day → slug
-- 這份對照表跟 data/concepts.js 對齊，新增/重排 concepts 時務必同步更新
update attempts set concept_slug = case day
  when 1  then 'jwt-vs-session'
  when 2  then 'rest-vs-graphql'
  when 3  then 'cdn'
  when 4  then 'rag'
  when 5  then 'tcp-vs-udp'
  when 6  then 'docker'
  when 7  then 'database-index'
  when 8  then 'oauth2'
  when 9  then 'webhook-vs-polling'
  when 10 then 'vector-database'
  when 11 then 'kubernetes'
  when 12 then 'grpc-vs-rest'
  when 13 then 'eventual-consistency'
  when 14 then 'cache-strategies'
  when 15 then 'rate-limiting'
  when 16 then 'closure'
  when 17 then 'mutability-vs-immutability'
  when 18 then 'race-condition'
  when 19 then 'big-o'
  when 20 then 'composition-vs-inheritance'
  when 21 then 'static-vs-dynamic-typing'
  when 22 then 'mock-stub-spy'
  when 23 then 'garbage-collection'
  when 24 then 'idempotency'
  when 25 then 'hashing-vs-encryption'
end
where concept_slug is null;

-- Step 3: enforce NOT NULL, drop old column
alter table attempts alter column concept_slug set not null;
alter table attempts drop column day;

-- Optional: index for per-user queries grouped by concept
create index if not exists attempts_user_concept_idx
  on attempts (user_id, concept_slug);
