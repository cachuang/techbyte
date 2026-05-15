// 跨裝置同步：登入後從 profiles 拉 prefs，沒登入就只動 localStorage。
// Read 路徑只用 cache（localStorage），DB 同步在 mount / 寫入時 fire。

import { supabase } from "./supabase";

export async function fetchProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("first_visit, tracks, recap_done")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[fetchProfile]", error);
    return null;
  }
  return data;
}

export async function upsertProfile(userId, patch) {
  if (!userId) return;
  const row = {
    user_id: userId,
    updated_at: new Date().toISOString(),
    ...patch,
  };
  const { error } = await supabase
    .from("profiles")
    .upsert(row, { onConflict: "user_id" });
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[upsertProfile]", error);
  }
}

export async function fetchUserActivity(userId) {
  const empty = { slugs: new Set(), dates: [], attempts: [] };
  if (!userId) return empty;
  const { data, error } = await supabase
    .from("attempts")
    .select("concept_slug, created_at, score")
    .eq("user_id", userId);
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[fetchUserActivity] failed:", error.message, error.details || "");
    return empty;
  }
  const rows = data || [];
  const slugs = new Set();
  const dates = [];
  for (const r of rows) {
    if (r.concept_slug) slugs.add(r.concept_slug);
    if (r.created_at) {
      const d = new Date(r.created_at);
      const pad = (n) => String(n).padStart(2, "0");
      dates.push(
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      );
    }
  }
  return { slugs, dates, attempts: rows };
}

// 舊 API 保留，免得到處 grep 改
export async function fetchAttemptedSlugs(userId) {
  const { slugs } = await fetchUserActivity(userId);
  return slugs;
}

