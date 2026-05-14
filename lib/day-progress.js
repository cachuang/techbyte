// Per-user daily release：以「使用者第一次造訪」當 Day 1，每天本地 00:00 解鎖下一天。
// 軟限制 — 存在 localStorage，使用者改 storage 可繞過。MVP 階段不擋這層。

// v2 重置：2026-05-10 由淺入深重排（31 篇含 L1 foundations）後讓所有人從 Day 1 重來。
// 改 key 名等於遺忘舊的 first_visit，下次造訪會以「今天」當 Day 1。
const STORAGE_KEY = "techbyte_first_visit_v2";

const pad = (n) => String(n).padStart(2, "0");

function todayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function daysBetween(fromYmd, toYmd) {
  const ms =
    new Date(`${toYmd}T00:00:00`).getTime() -
    new Date(`${fromYmd}T00:00:00`).getTime();
  return Math.round(ms / 86400000);
}

export function getFirstVisit() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setFirstVisit(date) {
  if (typeof window === "undefined" || !date) return;
  window.localStorage.setItem(STORAGE_KEY, date);
}

export function ensureFirstVisit() {
  if (typeof window === "undefined") return null;
  let v = window.localStorage.getItem(STORAGE_KEY);
  if (!v) {
    v = todayLocal();
    window.localStorage.setItem(STORAGE_KEY, v);
  }
  return v;
}

export function getCurrentDay() {
  const first = ensureFirstVisit();
  if (!first) return null;
  return Math.max(1, daysBetween(first, todayLocal()) + 1);
}

export function getDayStatus(targetDay) {
  const current = getCurrentDay();
  if (current == null) return { unlocked: true, label: null, daysUntil: 0 };
  if (targetDay < current) {
    return { unlocked: true, label: null, daysUntil: 0, past: true };
  }
  if (targetDay === current) {
    return { unlocked: true, label: "今天", daysUntil: 0, today: true };
  }
  const diff = targetDay - current;
  return {
    unlocked: false,
    label: diff === 1 ? "明天" : `${diff} 天後`,
    daysUntil: diff,
  };
}
