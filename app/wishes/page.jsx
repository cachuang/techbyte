"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchWishes, createWish, deleteWish } from "@/lib/wishes";
import { ALL_TRACKS, TRACK_LABELS } from "@/lib/track-prefs";

export default function WishesPage() {
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [topic, setTopic] = useState("");
  const [track, setTrack] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (user) {
        const data = await fetchWishes(user.id);
        if (cancelled) return;
        setWishes(data);
      }
      if (cancelled) return;
      setMounted(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || submitting) return;
    setErrorMsg("");
    setSubmitting(true);
    const result = await createWish(user.id, { topic, track });
    setSubmitting(false);
    if (result.error) {
      setErrorMsg(result.error);
      return;
    }
    setWishes((prev) => [result.data, ...prev]);
    setTopic("");
    setTrack("");
  }

  async function handleDelete(wishId) {
    if (!confirm("確定要刪除這個願望嗎？")) return;
    const result = await deleteWish(wishId);
    if (!result.error) {
      setWishes((prev) => prev.filter((w) => w.id !== wishId));
    }
  }

  if (!mounted || authLoading) {
    return <div style={styles.root} />;
  }

  if (!user) {
    return (
      <div style={styles.root}>
        <div style={styles.gate}>
          <h1 style={styles.gateTitle}>💡 我想學</h1>
          <p style={styles.gateText}>
            登入後可以許願 — 告訴我們你想學什麼，我會把它寫成 byte 上架。
          </p>
        </div>
      </div>
    );
  }

  const pending = wishes.filter((w) => w.status !== "published");
  const published = wishes.filter((w) => w.status === "published");

  return (
    <div style={styles.root}>
      <h1 style={styles.title}>我想學</h1>
      <p style={styles.subtitle}>
        想學的主題寫在這裡。我會挑出大家最想要的，寫成 byte 發布。
      </p>

      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.formLabel} htmlFor="wish-topic">
          想學的主題
        </label>
        <input
          id="wish-topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如：Kafka 的 partition 是什麼？Service Mesh？Vector Search？"
          style={styles.input}
          maxLength={200}
          required
        />

        <label style={styles.formLabel} htmlFor="wish-track">
          方向（可選）
        </label>
        <div style={styles.trackOptions}>
          <button
            type="button"
            onClick={() => setTrack("")}
            style={
              track === ""
                ? { ...styles.trackChip, ...styles.trackChipActive }
                : styles.trackChip
            }
          >
            不限
          </button>
          {ALL_TRACKS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTrack(t)}
              style={
                track === t
                  ? { ...styles.trackChip, ...styles.trackChipActive }
                  : styles.trackChip
              }
            >
              {TRACK_LABELS[t].zh}
            </button>
          ))}
        </div>

        {errorMsg ? <p style={styles.errorMsg}>{errorMsg}</p> : null}

        <button
          type="submit"
          disabled={submitting || !topic.trim()}
          style={
            submitting || !topic.trim()
              ? { ...styles.submitBtn, ...styles.submitBtnDisabled }
              : styles.submitBtn
          }
        >
          {submitting ? "送出中⋯" : "送出願望"}
        </button>
      </form>

      {pending.length > 0 ? (
        <>
          <h2 style={styles.sectionTitle}>
            等待中 <span style={styles.countBadge}>{pending.length}</span>
          </h2>
          <ul style={styles.list}>
            {pending.map((w) => (
              <li key={w.id} style={styles.item}>
                <div style={styles.itemBody}>
                  <p style={styles.itemTopic}>{w.topic}</p>
                  <div style={styles.itemMeta}>
                    {w.track ? (
                      <span style={styles.metaTag}>
                        {TRACK_LABELS[w.track]?.zh || w.track}
                      </span>
                    ) : null}
                    <span style={styles.metaStatus}>等待生成</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(w.id)}
                  style={styles.deleteBtn}
                  aria-label="刪除願望"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {published.length > 0 ? (
        <>
          <h2 style={styles.sectionTitle}>
            已實現 <span style={styles.countBadge}>{published.length}</span>
          </h2>
          <ul style={styles.list}>
            {published.map((w) => (
              <li key={w.id} style={{ ...styles.item, ...styles.itemDone }}>
                <div style={styles.itemBody}>
                  <p style={styles.itemTopic}>{w.topic}</p>
                  <div style={styles.itemMeta}>
                    {w.track ? (
                      <span style={styles.metaTag}>
                        {TRACK_LABELS[w.track]?.zh || w.track}
                      </span>
                    ) : null}
                    <span style={styles.metaPublished}>✓ 已生成</span>
                  </div>
                </div>
                {w.linked_concept_slug ? (
                  <Link
                    href={`/concept/${w.linked_concept_slug}`}
                    style={styles.goLink}
                  >
                    去讀 →
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {wishes.length === 0 ? (
        <p style={styles.emptyHint}>
          還沒許過願。寫一個你最想了解的主題試試看！
        </p>
      ) : null}
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0e0e10",
    color: "#dcd8cc",
    fontFamily: "var(--font-sans)",
    maxWidth: 680,
    margin: "0 auto",
    padding: "24px 20px 80px",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#f5efdc",
    margin: "0 0 8px",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: "#7a766c",
    lineHeight: 1.6,
    margin: "0 0 24px",
  },
  form: {
    background: "#16161a",
    border: "1px solid #1e1e22",
    borderRadius: 12,
    padding: "18px 18px 16px",
    marginBottom: 32,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  formLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "#7a766c",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: 700,
    marginTop: 4,
  },
  input: {
    background: "#0e0e10",
    border: "1px solid #2a2a30",
    borderRadius: 8,
    padding: "12px 14px",
    color: "#dcd8cc",
    fontFamily: "var(--font-sans)",
    fontSize: 16,
    outline: "none",
  },
  trackOptions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  trackChip: {
    padding: "6px 12px",
    background: "transparent",
    border: "1px solid #2a2a30",
    borderRadius: 999,
    color: "#9a968a",
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    cursor: "pointer",
  },
  trackChipActive: {
    background: "rgba(250, 204, 21, 0.1)",
    border: "1px solid #facc15",
    color: "#facc15",
  },
  errorMsg: {
    fontSize: 12,
    color: "#f87171",
    margin: 0,
  },
  submitBtn: {
    marginTop: 6,
    padding: "11px 16px",
    background: "#facc15",
    color: "#0a0a0a",
    border: "1px solid #facc15",
    borderRadius: 8,
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: 700,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  submitBtnDisabled: {
    background: "#2a2a30",
    border: "1px solid #2a2a30",
    color: "#5a574e",
    cursor: "not-allowed",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#dcd8cc",
    margin: "20px 0 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  countBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "#7a766c",
    background: "#16161a",
    border: "1px solid #1e1e22",
    padding: "2px 8px",
    borderRadius: 999,
    fontWeight: 700,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  item: {
    background: "#16161a",
    border: "1px solid #1e1e22",
    borderRadius: 10,
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  itemDone: {
    background:
      "linear-gradient(135deg, rgba(74, 222, 128, 0.06) 0%, rgba(74, 222, 128, 0.02) 100%)",
    border: "1px solid rgba(74, 222, 128, 0.32)",
  },
  itemBody: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  itemTopic: {
    fontSize: 15,
    color: "#dcd8cc",
    fontWeight: 600,
    margin: 0,
    wordBreak: "break-word",
  },
  itemMeta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  metaTag: {
    fontFamily: "var(--font-mono)",
    fontSize: 10.5,
    color: "#7a766c",
    background: "#0e0e10",
    border: "1px solid #2a2a30",
    padding: "2px 8px",
    borderRadius: 999,
    letterSpacing: 0.5,
  },
  metaStatus: {
    fontFamily: "var(--font-mono)",
    fontSize: 10.5,
    color: "#fbbf24",
    letterSpacing: 0.5,
  },
  metaPublished: {
    fontFamily: "var(--font-mono)",
    fontSize: 10.5,
    color: "#4ade80",
    letterSpacing: 0.5,
    fontWeight: 700,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    background: "transparent",
    border: "1px solid #2a2a30",
    borderRadius: 6,
    color: "#7a766c",
    cursor: "pointer",
    fontSize: 14,
    lineHeight: 1,
    flexShrink: 0,
  },
  goLink: {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "#4ade80",
    textDecoration: "none",
    flexShrink: 0,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  emptyHint: {
    fontSize: 13,
    color: "#7a766c",
    textAlign: "center",
    marginTop: 32,
  },
  gate: {
    textAlign: "center",
    padding: "60px 16px 24px",
  },
  gateTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: "#f5efdc",
    marginBottom: 18,
    letterSpacing: -0.5,
  },
  gateText: {
    fontSize: 14,
    color: "#9a968a",
    lineHeight: 1.7,
  },
};
