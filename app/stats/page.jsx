"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { concepts } from "@/data/concepts";
import { useAuth } from "@/lib/auth-context";
import { fetchUserActivity } from "@/lib/profile-sync";
import { computeStreak } from "@/lib/streak";
import { ALL_TRACKS, TRACK_LABELS } from "@/lib/track-prefs";

export default function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const [activity, setActivity] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (user) {
        const a = await fetchUserActivity(user.id);
        if (cancelled) return;
        setActivity(a);
      }
      if (cancelled) return;
      setMounted(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const streak = useMemo(
    () => computeStreak(activity?.dates || []),
    [activity],
  );

  const stats = useMemo(() => {
    const attempts = activity?.attempts || [];
    const conceptsWithQuiz = concepts.filter((c) => c.questions);
    const conceptsRead = activity?.slugs?.size || 0;
    let totalQuestions = 0;
    let totalCorrect = 0;
    for (const a of attempts) {
      const ans = Array.isArray(a.answers) ? a.answers : [];
      totalQuestions += ans.length;
      totalCorrect += a.score ?? 0;
    }
    const accuracy =
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0;
    return {
      conceptsRead,
      totalConcepts: conceptsWithQuiz.length,
      totalQuestions,
      totalCorrect,
      accuracy,
    };
  }, [activity]);

  const trackProgress = useMemo(() => {
    const slugs = activity?.slugs || new Set();
    return ALL_TRACKS.map((track) => {
      const inTrack = concepts.filter(
        (c) => c.questions && (c.tracks || []).includes(track),
      );
      const done = inTrack.filter((c) => slugs.has(c.slug)).length;
      return {
        track,
        done,
        total: inTrack.length,
        pct: inTrack.length === 0 ? 0 : Math.round((done / inTrack.length) * 100),
      };
    });
  }, [activity]);

  if (!mounted || authLoading) {
    return <div style={styles.root} />;
  }

  if (!user) {
    return (
      <div style={styles.root}>
        <div style={styles.gate}>
          <h1 style={styles.gateTitle}>📊 我的數據</h1>
          <p style={styles.gateText}>
            登入後可以看到你的連續天數、累積概念、答對率與各方向進度。
          </p>
          <p style={styles.gateText}>右上角點「登入」即可。</p>
          <Link href="/" style={styles.backLink}>
            ← 回首頁
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <h1 style={styles.title}>我的數據</h1>
      </div>

      <div style={styles.heroGrid}>
        <StatCard
          icon="🔥"
          label="目前連續"
          value={streak.current}
          suffix="天"
          accent="#fca5a5"
          big
        />
        <StatCard
          icon="⭐"
          label="最長連續"
          value={streak.max}
          suffix="天"
          accent="#facc15"
        />
        <StatCard
          icon="📖"
          label="讀過概念"
          value={stats.conceptsRead}
          suffix={`/ ${stats.totalConcepts}`}
          accent="#4ade80"
        />
        <StatCard
          icon="✓"
          label="答對率"
          value={stats.accuracy}
          suffix="%"
          accent="#60a5fa"
        />
      </div>

      <h2 style={styles.sectionTitle}>按方向</h2>
      <div style={styles.tracksList}>
        {trackProgress.map(({ track, done, total, pct }) => (
          <div key={track} style={styles.trackRow}>
            <div style={styles.trackHead}>
              <span style={styles.trackName}>{TRACK_LABELS[track].zh}</span>
              <span style={styles.trackCount}>
                {done} / {total}
              </span>
            </div>
            <div style={styles.barWrap}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${pct}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p style={styles.footnote}>
        ★ 完成 quiz 才算當天的活動。寬限 1 天 — 今天還沒做不會立刻斷。
      </p>
    </div>
  );
}

function StatCard({ icon, label, value, suffix, accent, big }) {
  return (
    <div style={big ? { ...styles.card, ...styles.cardBig } : styles.card}>
      <div style={styles.cardHead}>
        <span style={styles.cardIcon}>{icon}</span>
        <span style={styles.cardLabel}>{label}</span>
      </div>
      <div style={styles.cardValueRow}>
        <span style={{ ...styles.cardValue, color: accent }}>{value}</span>
        {suffix ? <span style={styles.cardSuffix}>{suffix}</span> : null}
      </div>
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
  header: {
    marginBottom: 24,
  },
  backLink: {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "#7a766c",
    textDecoration: "none",
    letterSpacing: 1,
    display: "inline-block",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#f5efdc",
    margin: 0,
    letterSpacing: -0.3,
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
    marginBottom: 32,
  },
  card: {
    background: "#16161a",
    border: "1px solid #1e1e22",
    borderRadius: 12,
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minHeight: 96,
  },
  cardBig: {
    background:
      "linear-gradient(135deg, rgba(248, 113, 113, 0.1) 0%, rgba(248, 113, 113, 0.03) 100%)",
    border: "1px solid rgba(248, 113, 113, 0.35)",
    borderLeft: "3px solid #f87171",
  },
  cardHead: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  cardIcon: {
    fontSize: 13,
  },
  cardLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "#7a766c",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  cardValueRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 6,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 800,
    fontFamily: "var(--font-sans)",
    lineHeight: 1,
    fontFeatureSettings: '"tnum"',
    letterSpacing: -1,
  },
  cardSuffix: {
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    color: "#7a766c",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#dcd8cc",
    margin: "0 0 14px",
  },
  tracksList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginBottom: 28,
  },
  trackRow: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  trackHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  trackName: {
    fontSize: 14,
    color: "#dcd8cc",
    fontWeight: 600,
  },
  trackCount: {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "#7a766c",
    letterSpacing: 0.5,
  },
  barWrap: {
    height: 8,
    background: "#1e1e22",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #4ade80 0%, #facc15 100%)",
    transition: "width 0.3s ease",
  },
  footnote: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "#5a574e",
    letterSpacing: 0.3,
    lineHeight: 1.6,
    textAlign: "center",
    marginTop: 16,
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
    marginBottom: 12,
  },
};
