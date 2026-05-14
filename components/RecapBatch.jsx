"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getDoneBatches, markBatchDone } from "@/lib/recap-prefs";
import { getTracks, matchesTracks } from "@/lib/track-prefs";
import { upsertProfile } from "@/lib/profile-sync";
import { useAuth } from "@/lib/auth-context";

export default function RecapBatch({ batch, concepts: allBatchConcepts }) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [userTracks, setUserTracks] = useState(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setUserTracks(getTracks());
    setMounted(true);
  }, []);

  const list = useMemo(
    () => allBatchConcepts.filter((c) => matchesTracks(c.tracks, userTracks)),
    [allBatchConcepts, userTracks],
  );

  if (!mounted) return <div style={styles.root} />;

  if (list.length === 0) {
    return (
      <div style={styles.root}>
        <p style={styles.emptyText}>這一段範圍沒有符合你方向的 recap 題。</p>
        <Link href="/" style={styles.primaryCta}>
          回首頁
        </Link>
      </div>
    );
  }

  const total = list.length;

  if (finished) {
    const correctCount = answers.filter((a) => a.correct).length;
    return (
      <div style={styles.root}>
        <div style={styles.header}>
          <span style={styles.recapBadge}>↺ Day {batch.startDay}-{batch.endDay} 回想完成</span>
        </div>
        <div style={styles.summaryScore}>
          <span style={styles.summaryScoreNum}>{correctCount}</span>
          <span style={styles.summaryScoreSep}>/</span>
          <span style={styles.summaryScoreTotal}>{total}</span>
          <span style={styles.summaryScoreLabel}>答對</span>
        </div>
        <ul style={styles.summaryList}>
          {answers.map((a, i) => {
            const c = list[i];
            return (
              <li key={c.slug} style={styles.summaryItem}>
                <span style={styles.summaryIcon}>
                  {a.correct ? "✅" : "❌"}
                </span>
                <span style={styles.summaryDay}>
                  Day {String(c.releaseDay).padStart(2, "0")}
                </span>
                <span style={styles.summaryTitle}>{c.title}</span>
                {!a.correct ? (
                  <Link
                    href={`/concept/${c.slug}`}
                    style={styles.summaryRelink}
                  >
                    再讀 →
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
        <div style={styles.ctaRow}>
          <Link href="/" style={styles.primaryCta}>
            回首頁
          </Link>
        </div>
      </div>
    );
  }

  const current = list[idx];
  const q = current.recapQuestion;
  const selectedOpt = q.options.find((o) => o.id === selected);
  const isCorrect = !!selectedOpt?.correct;
  const isLast = idx === total - 1;

  function handleConfirm() {
    if (!selected || confirmed) return;
    setConfirmed(true);
    setAnswers((prev) => [...prev, { slug: current.slug, correct: isCorrect }]);
  }

  function handleNext() {
    if (isLast) {
      markBatchDone(batch.key);
      if (user) upsertProfile(user.id, { recap_done: getDoneBatches() });
      setFinished(true);
      return;
    }
    setIdx((i) => i + 1);
    setSelected(null);
    setConfirmed(false);
  }

  return (
    <div style={styles.root}>
      <div style={styles.topRow}>
        <Link href="/" style={styles.exitLink}>
          ← 離開
        </Link>
        <span style={styles.progress}>
          {idx + 1} / {total}
        </span>
      </div>

      <div style={styles.header}>
        <span style={styles.recapBadge}>↺ Day {batch.startDay}-{batch.endDay} 回想</span>
      </div>

      <div style={styles.dots}>
        {list.map((_, i) => {
          let bg = "#2a2a30";
          if (i < idx) bg = answers[i]?.correct ? "#4ade80" : "#f87171";
          if (i === idx) bg = "#facc15";
          return (
            <span
              key={i}
              style={{
                ...styles.dot,
                background: bg,
                transform: i === idx ? "scale(1.3)" : "scale(1)",
              }}
            />
          );
        })}
      </div>

      <div style={styles.card}>
        <div style={styles.miniHead}>
          <span style={styles.miniDay}>
            Day {String(current.releaseDay).padStart(2, "0")}
          </span>
          <span style={styles.miniTitle}>{current.title}</span>
        </div>
        <div style={styles.qTypeRow}>
          <span style={styles.qType}>{q.type}</span>
        </div>

        <h2 style={styles.question}>{q.question}</h2>

        <div style={styles.options}>
          {q.options.map((opt) => {
            let borderColor = "#2a2a2a";
            let bg = "#111";
            if (selected === opt.id && !confirmed) {
              borderColor = "#facc15";
              bg = "#1a1800";
            }
            if (confirmed && opt.correct) {
              borderColor = "#4ade80";
              bg = "#0a1f0f";
            }
            if (confirmed && selected === opt.id && !opt.correct) {
              borderColor = "#f87171";
              bg = "#1f0a0a";
            }

            return (
              <button
                key={opt.id}
                type="button"
                style={{ ...styles.option, borderColor, background: bg }}
                onClick={() => !confirmed && setSelected(opt.id)}
                disabled={confirmed}
              >
                <span style={styles.optionLetter}>{opt.id.toUpperCase()}</span>
                <span style={styles.optionText}>{opt.text}</span>
                {confirmed && opt.correct && (
                  <span style={styles.badge}>✅</span>
                )}
                {confirmed && selected === opt.id && !opt.correct && (
                  <span style={styles.badge}>❌</span>
                )}
              </button>
            );
          })}
        </div>

        {!confirmed ? (
          <button
            type="button"
            style={{
              ...styles.confirmBtn,
              ...(selected ? null : styles.confirmBtnDisabled),
            }}
            onClick={handleConfirm}
            disabled={!selected}
          >
            確認答案
          </button>
        ) : (
          <div style={styles.explainBlock}>
            <div style={styles.explainTitle}>
              {isCorrect ? "✓ 答對" : "✗ 答錯"}
            </div>
            <p style={styles.explainText}>{q.explanation}</p>
            <div style={styles.misconception}>
              <span style={styles.misconceptionLabel}>常見誤解</span>
              <span style={styles.misconceptionText}>{q.misconception}</span>
            </div>
            <button
              type="button"
              style={styles.confirmBtn}
              onClick={handleNext}
            >
              {isLast ? "完成回想 →" : "下一題 →"}
            </button>
          </div>
        )}
      </div>
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
    padding: "20px 28px 80px",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  exitLink: {
    color: "#9a968a",
    fontSize: 13,
    textDecoration: "none",
    fontFamily: "inherit",
  },
  progress: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#6b6960",
    letterSpacing: 1,
  },
  header: {
    marginBottom: 14,
  },
  recapBadge: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#60a5fa",
    background: "rgba(96, 165, 250, 0.1)",
    border: "1px solid rgba(96, 165, 250, 0.3)",
    padding: "4px 10px",
    borderRadius: 12,
    letterSpacing: 0.5,
  },
  dots: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "all 0.2s ease",
  },
  card: {
    background: "#16161a",
    border: "1px solid #1c1c20",
    borderRadius: 12,
    padding: "20px 22px",
  },
  miniHead: {
    display: "flex",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  miniDay: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    color: "#6b6960",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  miniTitle: {
    fontSize: 13,
    color: "#fbbf24",
    fontWeight: 500,
  },
  qTypeRow: {
    marginBottom: 12,
  },
  qType: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    color: "#6b6960",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  question: {
    fontSize: 18,
    fontWeight: 600,
    color: "#f5efdc",
    margin: "0 0 18px",
    lineHeight: 1.5,
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 18,
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "13px 16px",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    color: "#dcd8cc",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: 15,
    transition: "all 0.15s ease",
  },
  optionLetter: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#9a968a",
    fontWeight: 700,
    minWidth: 16,
  },
  optionText: {
    flex: 1,
    lineHeight: 1.5,
  },
  badge: {
    fontSize: 16,
  },
  confirmBtn: {
    width: "100%",
    padding: "13px 20px",
    background: "#facc15",
    border: "1px solid #facc15",
    borderRadius: 8,
    color: "#0a0a0a",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.5,
    cursor: "pointer",
  },
  confirmBtnDisabled: {
    background: "#2a2a30",
    border: "1px solid #2a2a30",
    color: "#5a574e",
    cursor: "not-allowed",
  },
  explainBlock: {
    paddingTop: 18,
    borderTop: "1px solid #1c1c20",
  },
  explainTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#facc15",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  explainText: {
    fontSize: 15,
    color: "#dcd8cc",
    lineHeight: 1.7,
    margin: "0 0 16px",
  },
  misconception: {
    background: "rgba(96, 165, 250, 0.06)",
    border: "1px solid rgba(96, 165, 250, 0.2)",
    borderRadius: 8,
    padding: "12px 14px",
    marginBottom: 18,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  misconceptionLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    color: "#60a5fa",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  misconceptionText: {
    fontSize: 14,
    color: "#dcd8cc",
    lineHeight: 1.6,
  },
  summaryScore: {
    display: "flex",
    alignItems: "baseline",
    gap: 4,
    margin: "20px 0 24px",
  },
  summaryScoreNum: {
    fontSize: 56,
    fontWeight: 700,
    color: "#facc15",
    fontFamily: "'Georgia', var(--font-noto-serif-tc), serif",
    lineHeight: 1,
    fontFeatureSettings: '"tnum"',
  },
  summaryScoreSep: {
    fontSize: 32,
    color: "#5a574e",
    fontFamily: "inherit",
  },
  summaryScoreTotal: {
    fontSize: 32,
    color: "#9a968a",
    fontWeight: 700,
    fontFamily: "'Georgia', var(--font-noto-serif-tc), serif",
    fontFeatureSettings: '"tnum"',
  },
  summaryScoreLabel: {
    marginLeft: 10,
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#6b6960",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  summaryList: {
    listStyle: "none",
    margin: "0 0 28px",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  summaryItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    background: "#16161a",
    border: "1px solid #1c1c20",
    borderRadius: 10,
  },
  summaryIcon: {
    fontSize: 16,
  },
  summaryDay: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    color: "#6b6960",
    letterSpacing: 1.2,
    fontWeight: 700,
  },
  summaryTitle: {
    fontSize: 14,
    color: "#dcd8cc",
    flex: 1,
    wordBreak: "break-word",
  },
  summaryRelink: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#60a5fa",
    textDecoration: "none",
    flexShrink: 0,
  },
  ctaRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  primaryCta: {
    padding: "12px 22px",
    background: "#facc15",
    color: "#0a0a0a",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 0.5,
    textDecoration: "none",
    fontFamily: "'Courier New', monospace",
  },
  emptyText: {
    fontSize: 14,
    color: "#9a968a",
    marginBottom: 20,
  },
};
