// 我想學 / 許願功能：user 提交主題，admin 後台 review + 生成。

import { supabase } from "./supabase";

const MAX_TOPIC_LENGTH = 200;

export async function fetchWishes(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from("wishes")
    .select("id, topic, track, status, linked_concept_slug, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[fetchWishes]", error);
    return [];
  }
  return data || [];
}

export async function createWish(userId, { topic, track }) {
  if (!userId) return { error: "未登入" };
  const cleanTopic = (topic || "").trim().slice(0, MAX_TOPIC_LENGTH);
  if (!cleanTopic) return { error: "請輸入主題" };
  const { data, error } = await supabase
    .from("wishes")
    .insert({ user_id: userId, topic: cleanTopic, track: track || null })
    .select("id, topic, track, status, linked_concept_slug, created_at")
    .single();
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[createWish]", error);
    return { error: error.message || "送出失敗" };
  }
  return { data };
}

export async function deleteWish(wishId) {
  if (!wishId) return { error: "missing id" };
  const { error } = await supabase.from("wishes").delete().eq("id", wishId);
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[deleteWish]", error);
    return { error: error.message };
  }
  return { ok: true };
}
