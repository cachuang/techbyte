"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { concepts } from "@/data/concepts";
import { getCurrentDay } from "@/lib/day-progress";
import {
  getTracks,
  setTracks,
  matchesTracks,
  TRACK_LABELS,
} from "@/lib/track-prefs";
import {
  getCurrentBatch,
  isBatchDone,
  getBatchConcepts,
  RECAP_BATCH_SIZE,
} from "@/lib/recap-prefs";
import TrackSelection from "@/components/TrackSelection";

export default function Home() {
  const [currentDay, setCurrentDay] = useState(null);
  const [userTracks, setUserTracks] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [editingTracks, setEditingTracks] = useState(false);

  useEffect(() => {
    const t = getTracks();
    // eslint-disable-next-line no-console
    console.log("[page mount] getTracks() returned=", t);
    setCurrentDay(getCurrentDay());
    setUserTracks(t);
    setMounted(true);
  }, []);

  const ordered = useMemo(
    () => concepts.slice().sort((a, b) => a.releaseDay - b.releaseDay),
    [],
  );

  const filtered = useMemo(
    () => ordered.filter((c) => matchesTracks(c.tracks, userTracks)),
    [ordered, userTracks],
  );

  const recapBatch = useMemo(() => {
    if (!mounted || currentDay == null) return null;
    const batch = getCurrentBatch(currentDay);
    if (!batch || isBatchDone(batch.key)) return null;
    const inBatch = getBatchConcepts(batch, ordered).filter((c) =>
      matchesTracks(c.tracks, userTracks),
    );
    if (inBatch.length === 0) return null;
    return { ...batch, concepts: inBatch };
  }, [mounted, currentDay, ordered, userTracks]);

  if (!mounted) return <div style={styles.root} />;

  if (!userTracks || editingTracks) {
    return (
      <TrackSelection
        initial={userTracks || []}
        onConfirm={(arr) => {
          setTracks(arr);
          setUserTracks(arr);
          setEditingTracks(false);
        }}
        onCancel={
          editingTracks
            ? () => setEditingTracks(false)
            : undefined
        }
        title={editingTracks ? "調整你的方向" : "你主要做哪些方向？"}
        confirmLabel={editingTracks ? "儲存" : "開始學習"}
      />
    );
  }

  const tracksLabel = userTracks
    .map((t) => TRACK_LABELS[t]?.zh)
    .filter(Boolean)
    .join("、");

  return (
    <div style={styles.root}>
      <p style={styles.tagline} className="tb-tagline">
        A byte a day, keeps the layoff away
      </p>

      <div style={styles.tracksRow}>
        <span style={styles.tracksLabel}>你的方向</span>
        <span style={styles.tracksValue}>{tracksLabel}</span>
        <button
          type="button"
          onClick={() => setEditingTracks(true)}
          style={styles.tracksEditBtn}
        >
          調整
        </button>
      </div>

      {recapBatch ? (
        <Link
          href={`/recap/${recapBatch.key}`}
          style={styles.recapLink}
          className="tb-recap-link"
        >
          <div style={styles.recapCard}>
            <div style={styles.recapHead}>
              <span style={styles.recapIcon}>↺</span>
              <span style={styles.recapEyebrow}>
                Day {recapBatch.startDay}–{recapBatch.endDay} 回想 · {recapBatch.concepts.length} 題
              </span>
            </div>
            <h2 style={styles.recapTitle}>
              還記得這 {recapBatch.concepts.length} 個概念嗎？
            </h2>
            <p style={styles.recapSubtitle}>
              {recapBatch.concepts.map((c) => c.title).join(" · ")}
            </p>
            <span style={styles.recapCta}>開始回想 →</span>
          </div>
        </Link>
      ) : null}

      <ul style={styles.list}>
        {filtered.map((c) => {
          const isReady = !!c.questions;
          const beforeFirstVisit = currentDay == null;
          const isToday = !beforeFirstVisit && c.releaseDay === currentDay;
          const isFuture = !beforeFirstVisit && c.releaseDay > currentDay;
          const daysUntil = isFuture ? c.releaseDay - currentDay : 0;
          const isUnlocked = isReady && !isFuture;

          let statusEl;
          if (!isReady) {
            statusEl = <span style={styles.statusSoon}>soon</span>;
          } else if (isFuture) {
            statusEl = (
              <span style={styles.statusFuture}>
                <span style={styles.lockIcon}>⏳</span>
                {daysUntil === 1 ? "明天" : `${daysUntil} 天後`}
              </span>
            );
          } else if (isToday) {
            statusEl = <span style={styles.todayBadge}>今天</span>;
          } else {
            statusEl = <span style={styles.statusArrow}>→</span>;
          }

          const rowStyle = isToday
            ? { ...styles.row, ...styles.rowToday }
            : isFuture
            ? { ...styles.row, ...styles.rowFuture }
            : styles.row;

          const inner = (
            <div style={rowStyle} className="tb-day-row">
              <div style={styles.dayNumWrap}>
                <span style={styles.dayLabel}>DAY</span>
                <span
                  style={isToday ? styles.dayNumToday : styles.dayNum}
                  className="tb-day-num"
                >
                  {String(c.releaseDay).padStart(2, "0")}
                </span>
              </div>
              <div style={styles.contentWrap}>
                <span style={styles.tag} className="tb-day-tag">
                  {c.tag}
                </span>
                <span
                  style={isToday ? styles.titleToday : styles.title}
                  className="tb-day-title"
                >
                  {c.title}
                </span>
              </div>
              <div style={styles.statusCol}>{statusEl}</div>
            </div>
          );

          return (
            <li key={c.slug} style={styles.item}>
              {isUnlocked ? (
                <Link href={`/concept/${c.slug}`} style={styles.link}>
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0e0e10",
    color: "#dcd8cc",
    fontFamily: "'Georgia', var(--font-noto-serif-tc), 'Noto Serif TC', serif",
    maxWidth: 680,
    margin: "0 auto",
    padding: "0 0 80px",
  },
  tagline: {
    fontSize: 13,
    color: "#7a766c",
    fontStyle: "italic",
    padding: "28px 28px 8px",
    letterSpacing: 0.3,
  },
  tracksRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 28px 16px",
    fontSize: 12,
  },
  tracksLabel: {
    fontFamily: "'Courier New', monospace",
    color: "#6b6960",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 10,
  },
  tracksValue: {
    color: "#9a968a",
    fontSize: 12,
  },
  tracksEditBtn: {
    marginLeft: "auto",
    padding: "4px 10px",
    background: "transparent",
    border: "1px solid #2a2a30",
    borderRadius: 6,
    color: "#9a968a",
    fontFamily: "inherit",
    fontSize: 11,
    cursor: "pointer",
  },
  recapLink: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    margin: "0 28px 24px",
  },
  recapCard: {
    background:
      "linear-gradient(135deg, rgba(96, 165, 250, 0.18) 0%, rgba(96, 165, 250, 0.05) 100%)",
    border: "1px solid rgba(96, 165, 250, 0.55)",
    borderLeft: "4px solid #60a5fa",
    borderRadius: 14,
    padding: "20px 22px 18px",
    boxShadow: "0 0 36px rgba(96, 165, 250, 0.15)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  recapHead: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  recapIcon: {
    fontFamily: "'Courier New', monospace",
    fontSize: 16,
    color: "#60a5fa",
    fontWeight: 700,
    lineHeight: 1,
  },
  recapEyebrow: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#60a5fa",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  recapTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#f5efdc",
    lineHeight: 1.3,
    margin: 0,
    wordBreak: "break-word",
    letterSpacing: -0.3,
  },
  recapSubtitle: {
    fontSize: 13,
    color: "#9a968a",
    lineHeight: 1.55,
    margin: 0,
    wordBreak: "break-word",
  },
  recapCta: {
    marginTop: 8,
    alignSelf: "flex-start",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#0a0a0a",
    background: "#60a5fa",
    padding: "9px 16px",
    borderRadius: 8,
    letterSpacing: 1,
    fontWeight: 700,
    boxShadow: "0 4px 16px rgba(96, 165, 250, 0.35)",
  },
  list: { listStyle: "none", padding: "8px 0", margin: 0 },
  item: { borderBottom: "1px solid #1c1c20" },
  link: { textDecoration: "none", color: "inherit", display: "block" },

  row: {
    display: "grid",
    gridTemplateColumns: "72px 1fr auto",
    alignItems: "center",
    gap: 18,
    padding: "20px 28px",
    transition: "background 0.2s ease",
    borderLeft: "3px solid transparent",
  },
  rowToday: {
    background:
      "linear-gradient(90deg, rgba(250, 204, 21, 0.08) 0%, rgba(250, 204, 21, 0.02) 60%, transparent 100%)",
    borderLeft: "3px solid #facc15",
  },
  rowFuture: {
    opacity: 0.55,
  },

  dayNumWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: 0,
    gap: 2,
  },
  dayLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 9,
    color: "#6b6960",
    letterSpacing: 2,
    fontWeight: 700,
  },
  dayNum: {
    fontFamily: "'Georgia', var(--font-noto-serif-tc), serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#9a968a",
    letterSpacing: -1.2,
    lineHeight: 1,
    fontFeatureSettings: '"tnum"',
  },
  dayNumToday: {
    fontFamily: "'Georgia', var(--font-noto-serif-tc), serif",
    fontSize: 28,
    fontWeight: 700,
    color: "#facc15",
    letterSpacing: -1.2,
    lineHeight: 1,
    fontFeatureSettings: '"tnum"',
  },

  contentWrap: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    gap: 5,
  },
  tag: {
    fontFamily: "'Georgia', var(--font-noto-serif-tc), 'Noto Serif TC', serif",
    fontSize: 12,
    color: "#fbbf24",
    fontWeight: 500,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 17,
    color: "#dcd8cc",
    lineHeight: 1.4,
    fontWeight: 600,
    wordBreak: "break-word",
  },
  titleToday: {
    fontSize: 18,
    color: "#f5efdc",
    lineHeight: 1.4,
    fontWeight: 700,
    wordBreak: "break-word",
  },

  statusCol: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 60,
  },
  statusArrow: {
    fontFamily: "'Georgia', var(--font-noto-serif-tc), serif",
    fontSize: 18,
    color: "#5a574e",
    fontWeight: 400,
  },
  statusFuture: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#6b6960",
    letterSpacing: 0.3,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  lockIcon: { fontSize: 11 },
  statusSoon: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    color: "#444",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  todayBadge: {
    background: "#facc15",
    color: "#0a0a0a",
    padding: "4px 10px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 10.5,
    letterSpacing: 1.2,
    fontFamily: "'Courier New', monospace",
    boxShadow: "0 0 16px rgba(250, 204, 21, 0.25)",
  },
};
