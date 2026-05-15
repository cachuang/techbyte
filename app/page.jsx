"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { concepts } from "@/data/concepts";
import {
  ensureFirstVisit,
  getCurrentDay,
  setFirstVisit,
} from "@/lib/day-progress";
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
  getDoneBatches,
  setDoneBatches,
  RECAP_BATCH_SIZE,
} from "@/lib/recap-prefs";
import { fetchProfile, upsertProfile, fetchUserActivity } from "@/lib/profile-sync";
import { computeStreak } from "@/lib/streak";
import { useAuth } from "@/lib/auth-context";
import TrackSelection from "@/components/TrackSelection";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [currentDay, setCurrentDay] = useState(null);
  const [userTracks, setUserTracks] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [editingTracks, setEditingTracks] = useState(false);
  const [attemptedSlugs, setAttemptedSlugs] = useState(() => new Set());
  const [streak, setStreak] = useState({ current: 0, max: 0 });
  const [hubCollapsed, setHubCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("techbyte_day0_collapsed") === "1") {
      setHubCollapsed(true);
    }
  }, []);

  function toggleHub() {
    setHubCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "techbyte_day0_collapsed",
          next ? "1" : "0",
        );
      }
      return next;
    });
  }

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (user) {
        const profile = await fetchProfile(user.id);
        if (cancelled) return;
        if (profile && profile.first_visit) {
          // DB wins — 跨裝置進度以 DB 為準
          setFirstVisit(profile.first_visit);
          if (Array.isArray(profile.tracks)) setTracks(profile.tracks);
          if (Array.isArray(profile.recap_done)) setDoneBatches(profile.recap_done);
        } else {
          // 此用戶 DB 還沒紀錄：把當前 local state 推上去
          const first = ensureFirstVisit();
          await upsertProfile(user.id, {
            username: user.user_metadata?.username ?? null,
            first_visit: first,
            tracks: getTracks() || null,
            recap_done: getDoneBatches(),
          });
        }
        const activity = await fetchUserActivity(user.id);
        if (cancelled) return;
        setAttemptedSlugs(activity.slugs);
        setStreak(computeStreak(activity.dates));
      } else {
        ensureFirstVisit();
      }
      if (cancelled) return;
      setCurrentDay(getCurrentDay());
      setUserTracks(getTracks());
      setMounted(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const ordered = useMemo(
    () => concepts.slice().sort((a, b) => a.releaseDay - b.releaseDay),
    [],
  );

  const filtered = useMemo(
    () => ordered.filter((c) => matchesTracks(c.tracks, userTracks)),
    [ordered, userTracks],
  );

  const dayZeroConcepts = useMemo(
    () => filtered.filter((c) => c.releaseDay === 0 && c.questions),
    [filtered],
  );
  const dayZeroAllDone = useMemo(
    () =>
      dayZeroConcepts.length > 0 &&
      dayZeroConcepts.every((c) => attemptedSlugs.has(c.slug)),
    [dayZeroConcepts, attemptedSlugs],
  );
  const dayZeroDoneCount = useMemo(
    () => dayZeroConcepts.filter((c) => attemptedSlugs.has(c.slug)).length,
    [dayZeroConcepts, attemptedSlugs],
  );
  const dayList = useMemo(
    () => filtered.filter((c) => c.releaseDay > 0),
    [filtered],
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
          if (user) upsertProfile(user.id, { tracks: arr });
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
      <div style={styles.topRow}>
        <p style={styles.tagline} className="tb-tagline">
          A byte a day, keeps the layoff away
        </p>
        {user && streak.current > 0 ? (
          <Link href="/stats" style={styles.streakChip}>
            <span style={styles.streakFlame}>🔥</span>
            <span style={styles.streakNum}>{streak.current}</span>
            <span style={styles.streakLabel}>連續</span>
          </Link>
        ) : null}
      </div>

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

      {dayZeroConcepts.length > 0 && !dayZeroAllDone ? (
        <div
          style={
            hubCollapsed
              ? { ...styles.dayZeroCard, ...styles.dayZeroCardCollapsed }
              : styles.dayZeroCard
          }
        >
          <button
            type="button"
            onClick={toggleHub}
            style={styles.dayZeroHead}
            aria-expanded={!hubCollapsed}
            aria-controls="day-zero-body"
          >
            <span style={styles.dayZeroEyebrow}>DAY 00 · 開機</span>
            <span style={styles.dayZeroHeadRight}>
              <span style={styles.dayZeroCount}>
                {dayZeroDoneCount} / {dayZeroConcepts.length}
              </span>
              <span
                style={styles.dayZeroChevron}
                aria-hidden="true"
              >
                {hubCollapsed ? "▸" : "▾"}
              </span>
            </span>
          </button>
          {!hubCollapsed ? (
            <div id="day-zero-body">
              <p style={styles.dayZeroSubtitle}>
                不分方向都該會的入門概念。全部讀完此區會消失。
              </p>
              <div style={styles.dayZeroGrid} className="tb-day-zero-grid">
                {dayZeroConcepts.map((c) => {
                  const done = attemptedSlugs.has(c.slug);
                  return (
                    <Link
                      key={c.slug}
                      href={`/concept/${c.slug}`}
                      style={
                        done
                          ? { ...styles.dayZeroItem, ...styles.dayZeroItemDone }
                          : styles.dayZeroItem
                      }
                      className="tb-day-zero-item"
                    >
                      {done ? (
                        <span style={styles.dayZeroCheckIcon} aria-label="已讀">
                          ✓
                        </span>
                      ) : null}
                      <span style={styles.dayZeroItemTag}>{c.tag}</span>
                      <span
                        style={
                          done
                            ? { ...styles.dayZeroItemTitle, ...styles.dayZeroItemTitleDone }
                            : styles.dayZeroItemTitle
                        }
                      >
                        {c.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <ul style={styles.list}>
        {dayList.map((c) => {
          const isReady = !!c.questions;
          const beforeFirstVisit = currentDay == null;
          const isToday = !beforeFirstVisit && c.releaseDay === currentDay;
          const isFuture = !beforeFirstVisit && c.releaseDay > currentDay;
          const daysUntil = isFuture ? c.releaseDay - currentDay : 0;
          const isUnlocked = isReady && !isFuture;
          const isDone = isUnlocked && attemptedSlugs.has(c.slug);

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
          } else if (isDone) {
            statusEl = (
              <span style={styles.statusDone} aria-label="已讀">
                ✓
              </span>
            );
          } else {
            statusEl = <span style={styles.statusArrow}>→</span>;
          }

          const rowStyle = isToday
            ? { ...styles.row, ...styles.rowToday }
            : isFuture
            ? { ...styles.row, ...styles.rowFuture }
            : isDone
            ? { ...styles.row, ...styles.rowDone }
            : styles.row;

          const titleStyle = isToday
            ? styles.titleToday
            : isDone
            ? { ...styles.title, ...styles.titleDone }
            : styles.title;

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
                <span style={titleStyle} className="tb-day-title">
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
    fontFamily: "var(--font-sans)",
    maxWidth: 680,
    margin: "0 auto",
    padding: "0 0 80px",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 20px 8px",
    gap: 12,
  },
  tagline: {
    fontSize: 15,
    color: "#7a766c",
    fontStyle: "italic",
    letterSpacing: 0.3,
    margin: 0,
    flex: 1,
    minWidth: 0,
  },
  streakChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 11px 5px 9px",
    background: "rgba(248, 113, 113, 0.1)",
    border: "1px solid rgba(248, 113, 113, 0.4)",
    borderRadius: 999,
    textDecoration: "none",
    flexShrink: 0,
  },
  streakFlame: {
    fontSize: 14,
    lineHeight: 1,
  },
  streakNum: {
    fontFamily: "var(--font-mono)",
    fontSize: 14,
    color: "#fca5a5",
    fontWeight: 800,
    letterSpacing: 0.5,
    lineHeight: 1,
  },
  streakLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 10.5,
    color: "#fca5a5",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: 700,
    lineHeight: 1,
  },
  tracksRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 20px 16px",
    fontSize: 14,
  },
  tracksLabel: {
    fontFamily: "var(--font-mono)",
    color: "#6b6960",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12,
  },
  tracksValue: {
    color: "#9a968a",
    fontSize: 14,
  },
  tracksEditBtn: {
    marginLeft: "auto",
    padding: "6px 12px",
    background: "transparent",
    border: "1px solid #2a2a30",
    borderRadius: 6,
    color: "#9a968a",
    fontFamily: "inherit",
    fontSize: 13,
    cursor: "pointer",
  },
  recapLink: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    margin: "0 20px 20px",
  },
  recapCard: {
    background:
      "linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(96, 165, 250, 0.03) 100%)",
    border: "1px solid rgba(96, 165, 250, 0.35)",
    borderLeft: "3px solid #60a5fa",
    borderRadius: 12,
    padding: "18px 20px 16px",
    boxShadow: "0 0 20px rgba(96, 165, 250, 0.08)",
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
    fontFamily: "var(--font-mono)",
    fontSize: 18,
    color: "#60a5fa",
    fontWeight: 700,
    lineHeight: 1,
  },
  recapEyebrow: {
    fontFamily: "var(--font-mono)",
    fontSize: 12.5,
    color: "#60a5fa",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  recapTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#f5efdc",
    lineHeight: 1.3,
    margin: 0,
    wordBreak: "break-word",
    letterSpacing: -0.3,
  },
  recapSubtitle: {
    fontSize: 14.5,
    color: "#9a968a",
    lineHeight: 1.55,
    margin: 0,
    wordBreak: "break-word",
  },
  recapCta: {
    marginTop: 6,
    alignSelf: "flex-start",
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    color: "#60a5fa",
    background: "rgba(96, 165, 250, 0.15)",
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid rgba(96, 165, 250, 0.4)",
    letterSpacing: 1,
    fontWeight: 700,
  },

  dayZeroCard: {
    margin: "0 20px 20px",
    background:
      "linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(74, 222, 128, 0.03) 100%)",
    border: "1px solid rgba(74, 222, 128, 0.4)",
    borderLeft: "3px solid #4ade80",
    borderRadius: 12,
    padding: "16px 16px 14px",
    boxShadow: "0 0 20px rgba(74, 222, 128, 0.08)",
  },
  dayZeroCardCollapsed: {
    padding: "14px 16px",
  },
  dayZeroHead: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 0,
    background: "transparent",
    border: "none",
    padding: 0,
    width: "100%",
    fontFamily: "inherit",
    color: "inherit",
    fontSize: "inherit",
    cursor: "pointer",
    textAlign: "left",
  },
  dayZeroHeadRight: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  dayZeroChevron: {
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    color: "#4ade80",
    lineHeight: 1,
    transition: "transform 0.15s ease",
  },
  dayZeroEyebrow: {
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    color: "#4ade80",
    letterSpacing: 1.4,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  dayZeroCount: {
    fontFamily: "var(--font-mono)",
    fontSize: 12.5,
    color: "#9a968a",
    letterSpacing: 0.5,
    fontWeight: 600,
  },
  dayZeroSubtitle: {
    fontSize: 13.5,
    color: "#7a766c",
    lineHeight: 1.5,
    margin: "8px 0 12px",
  },
  dayZeroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
  },
  dayZeroItem: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "10px 30px 10px 12px",
    background: "rgba(255, 255, 255, 0.015)",
    border: "1px solid rgba(74, 222, 128, 0.16)",
    borderRadius: 8,
    textDecoration: "none",
    color: "inherit",
    transition: "all 0.15s ease",
    minHeight: 68,
  },
  dayZeroItemTag: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "#7a766c",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    fontWeight: 600,
  },
  dayZeroItemTitle: {
    fontSize: 15,
    color: "#dcd8cc",
    fontWeight: 600,
    lineHeight: 1.3,
    wordBreak: "break-word",
  },
  dayZeroItemDone: {
    background: "rgba(74, 222, 128, 0.06)",
    borderColor: "rgba(74, 222, 128, 0.35)",
    opacity: 0.7,
  },
  dayZeroItemTitleDone: {
    color: "#9a968a",
    textDecoration: "line-through",
    textDecorationColor: "rgba(154, 150, 138, 0.5)",
  },
  dayZeroCheckIcon: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#4ade80",
    color: "#0a0a0a",
    fontSize: 13,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    fontFamily: "var(--font-mono)",
  },

  list: { listStyle: "none", padding: "8px 0", margin: 0 },
  item: { borderBottom: "1px solid #1c1c20" },
  link: { textDecoration: "none", color: "inherit", display: "block" },

  row: {
    display: "grid",
    gridTemplateColumns: "66px 1fr auto",
    alignItems: "center",
    gap: 14,
    padding: "20px 20px",
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
  rowDone: {
    background:
      "linear-gradient(90deg, rgba(74, 222, 128, 0.05) 0%, transparent 60%)",
    borderLeft: "3px solid rgba(74, 222, 128, 0.45)",
  },

  dayNumWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: 0,
    gap: 3,
  },
  dayLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "#6b6960",
    letterSpacing: 2,
    fontWeight: 700,
  },
  dayNum: {
    fontFamily: "var(--font-sans)",
    fontSize: 32,
    fontWeight: 800,
    color: "#c8c4b8",
    letterSpacing: -1,
    lineHeight: 1,
    fontFeatureSettings: '"tnum"',
  },
  dayNumToday: {
    fontFamily: "var(--font-sans)",
    fontSize: 34,
    fontWeight: 800,
    color: "#facc15",
    letterSpacing: -1,
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
    fontFamily: "var(--font-sans)",
    fontSize: 14,
    color: "#fbbf24",
    fontWeight: 500,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 19,
    color: "#dcd8cc",
    lineHeight: 1.4,
    fontWeight: 600,
    wordBreak: "break-word",
  },
  titleToday: {
    fontSize: 20,
    color: "#f5efdc",
    lineHeight: 1.4,
    fontWeight: 700,
    wordBreak: "break-word",
  },
  titleDone: {
    color: "#8a8678",
  },

  statusCol: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 60,
  },
  statusArrow: {
    fontFamily: "var(--font-sans)",
    fontSize: 20,
    color: "#5a574e",
    fontWeight: 400,
  },
  statusDone: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "#4ade80",
    color: "#0a0a0a",
    fontFamily: "var(--font-mono)",
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1,
  },
  statusFuture: {
    fontFamily: "var(--font-mono)",
    fontSize: 12.5,
    color: "#6b6960",
    letterSpacing: 0.3,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  lockIcon: { fontSize: 13 },
  statusSoon: {
    fontFamily: "var(--font-mono)",
    fontSize: 11.5,
    color: "#444",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  todayBadge: {
    background: "#facc15",
    color: "#0a0a0a",
    padding: "5px 12px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 1.2,
    fontFamily: "var(--font-mono)",
    boxShadow: "0 0 16px rgba(250, 204, 21, 0.25)",
  },
};
