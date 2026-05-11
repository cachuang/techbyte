"use client";

import Link from "next/link";
import { useState } from "react";
import { markRecapDone, RECAP_DELAY } from "@/lib/recap-prefs";

export default function RecapQuiz({ concept }) {
  const q = concept.recapQuestion;
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const selectedOpt = q.options.find((o) => o.id === selected);
  const isCorrect = !!selectedOpt?.correct;

  function handleConfirm() {
    if (!selected || confirmed) return;
    setConfirmed(true);
    markRecapDone(concept.slug);
  }

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <span style={styles.recapBadge}>↺ {RECAP_DELAY} 天前回想</span>
        <span style={styles.tag}>{concept.tag}</span>
      </div>

      <h1 style={styles.title}>{concept.title}</h1>

      <div style={styles.card}>
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

            <div style={styles.ctaRow}>
              {!isCorrect ? (
                <Link
                  href={`/concept/${concept.slug}`}
                  style={styles.secondaryCta}
                >
                  再讀一次原概念
                </Link>
              ) : null}
              <Link href="/" style={styles.primaryCta}>
                回首頁
              </Link>
            </div>
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
    padding: "24px 28px 80px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  recapBadge: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#facc15",
    background: "rgba(250, 204, 21, 0.1)",
    border: "1px solid rgba(250, 204, 21, 0.3)",
    padding: "4px 10px",
    borderRadius: 12,
    letterSpacing: 0.5,
  },
  tag: {
    fontSize: 12,
    color: "#fbbf24",
    fontWeight: 500,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#f5efdc",
    margin: "0 0 24px",
    lineHeight: 1.3,
  },
  card: {
    background: "#16161a",
    border: "1px solid #1c1c20",
    borderRadius: 12,
    padding: "24px 22px",
  },
  qTypeRow: {
    marginBottom: 14,
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
    margin: "0 0 20px",
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
    padding: "14px 16px",
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
    margin: "0 0 18px",
  },
  misconception: {
    background: "rgba(96, 165, 250, 0.06)",
    border: "1px solid rgba(96, 165, 250, 0.2)",
    borderRadius: 8,
    padding: "12px 14px",
    marginBottom: 20,
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
  ctaRow: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
  },
  primaryCta: {
    padding: "11px 20px",
    background: "#facc15",
    color: "#0a0a0a",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 0.5,
    textDecoration: "none",
    fontFamily: "'Courier New', monospace",
  },
  secondaryCta: {
    padding: "11px 18px",
    background: "transparent",
    border: "1px solid #2a2a30",
    color: "#9a968a",
    borderRadius: 8,
    fontSize: 13,
    textDecoration: "none",
    fontFamily: "inherit",
  },
};
