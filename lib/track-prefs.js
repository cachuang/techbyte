// 使用者選擇的方向（multi-select）。OR 比對：concept.tracks 與 user tracks 有交集就顯示。
// 軟限制 — 跟 day-progress 一樣存 localStorage，可被使用者改。MVP 不擋。

const STORAGE_KEY = "techbyte_tracks_v1";

export const ALL_TRACKS = ["backend", "frontend", "devops", "ai"];

export const TRACK_LABELS = {
  backend: { zh: "後端", en: "Backend" },
  frontend: { zh: "前端", en: "Frontend" },
  devops: { zh: "DevOps / SRE", en: "DevOps" },
  ai: { zh: "AI / ML", en: "AI" },
};

export function getTracks() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr.filter((t) => ALL_TRACKS.includes(t));
  } catch {
    return null;
  }
}

export function setTracks(arr) {
  if (typeof window === "undefined") return;
  const cleaned = (arr || []).filter((t) => ALL_TRACKS.includes(t));
  if (cleaned.length === 0) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
}

export function matchesTracks(conceptTracks, userTracks) {
  if (!userTracks || userTracks.length === 0) return true;
  if (!conceptTracks || conceptTracks.length === 0) return true;
  return conceptTracks.some((t) => userTracks.includes(t));
}
