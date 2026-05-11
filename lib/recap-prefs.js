// recap 完成紀錄。MVP 用 localStorage，不入 Supabase。
// 之後 Phase 3 全 32 題上線時再考慮 attempts 表加 kind column。

const STORAGE_KEY = "techbyte_recap_done_v1";

// 多少天後 recap（today_day - RECAP_DELAY = target_day）
export const RECAP_DELAY = 5;

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

export function isRecapDone(slug) {
  return readSet().has(slug);
}

export function markRecapDone(slug) {
  if (typeof window === "undefined") return;
  const s = readSet();
  s.add(slug);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...s]));
}

export function getRecapTarget(currentDay, conceptsByDay) {
  if (currentDay == null || currentDay < RECAP_DELAY + 1) return null;
  const target = currentDay - RECAP_DELAY;
  const concept = conceptsByDay.get(target);
  if (!concept) return null;
  if (!concept.recapQuestion) return null;
  return concept;
}
