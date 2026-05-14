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
