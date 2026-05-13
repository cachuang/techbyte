// Batch recap：每 5 天一次，覆蓋前 5 天範圍。
// Day 6 觸發 batch 1-5、Day 11 觸發 batch 6-10、...
// MVP 用 localStorage，不入 Supabase。整批做完才算 done，中斷不存 state。

const STORAGE_KEY = "techbyte_recap_done_v1";

export const RECAP_BATCH_SIZE = 5;

// currentDay → 該天「最新可做」的 batch，或 null
// Day 6-10 都會看到 batch 1-5（如果還沒做）；Day 11 起切到 batch 6-10
export function getCurrentBatch(currentDay) {
  if (currentDay == null || currentDay <= RECAP_BATCH_SIZE) return null;
  const endDay =
    Math.floor((currentDay - 1) / RECAP_BATCH_SIZE) * RECAP_BATCH_SIZE;
  if (endDay < RECAP_BATCH_SIZE) return null;
  const startDay = endDay - RECAP_BATCH_SIZE + 1;
  return { startDay, endDay, key: `${startDay}-${endDay}` };
}

export function parseBatchKey(key) {
  const m = /^(\d+)-(\d+)$/.exec(key || "");
  if (!m) return null;
  const startDay = parseInt(m[1], 10);
  const endDay = parseInt(m[2], 10);
  if (endDay - startDay !== RECAP_BATCH_SIZE - 1) return null;
  return { startDay, endDay, key };
}

function readSet() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function isBatchDone(key) {
  return readSet().has(key);
}

export function markBatchDone(key) {
  if (typeof window === "undefined") return;
  const s = readSet();
  s.add(key);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...s]));
}

// 給定 batch 範圍 + 所有概念，回傳該 batch 內**有 recapQuestion**的概念（已 sort by releaseDay）。
// Track 過濾由 caller 處理（lib 不依賴 track-prefs）。
export function getBatchConcepts(batch, allConcepts) {
  if (!batch) return [];
  return allConcepts
    .filter(
      (c) =>
        c.releaseDay >= batch.startDay &&
        c.releaseDay <= batch.endDay &&
        c.recapQuestion,
    )
    .sort((a, b) => a.releaseDay - b.releaseDay);
}
