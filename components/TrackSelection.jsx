"use client";

import { useState } from "react";
import { ALL_TRACKS, TRACK_LABELS } from "@/lib/track-prefs";

export default function TrackSelection({
  initial = [],
  onConfirm,
  onCancel,
  title = "你主要做哪些方向？",
  subtitle = "可複選。決定每天解鎖什麼概念。之後可以調整。",
  confirmLabel = "開始學習",
}) {
  const [selected, setSelected] = useState(initial);

  function toggle(t) {
    setSelected((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  const canConfirm = selected.length > 0;

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>

        <div style={styles.options}>
          {ALL_TRACKS.map((t) => {
            const active = selected.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggle(t)}
                style={{
                  ...styles.option,
                  ...(active ? styles.optionActive : null),
                }}
              >
                <span
                  style={{
                    ...styles.checkbox,
                    ...(active ? styles.checkboxActive : null),
                  }}
                  aria-hidden="true"
                >
                  {active ? "✓" : ""}
                </span>
                <span style={styles.optionTextWrap}>
                  <span style={styles.optionZh}>{TRACK_LABELS[t].zh}</span>
                  <span style={styles.optionEn}>{TRACK_LABELS[t].en}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div style={styles.actions}>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelBtn}
            >
              取消
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => canConfirm && onConfirm(selected)}
            disabled={!canConfirm}
            style={{
              ...styles.confirmBtn,
              ...(canConfirm ? null : styles.confirmBtnDisabled),
            }}
          >
            {confirmLabel}
          </button>
        </div>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  card: {
    maxWidth: 480,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#f5efdc",
    margin: "0 0 8px",
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: 14,
    color: "#7a766c",
    margin: "0 0 28px",
    lineHeight: 1.5,
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 28,
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 18px",
    background: "#16161a",
    border: "1px solid #1c1c20",
    borderRadius: 10,
    color: "#dcd8cc",
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    transition: "all 0.15s ease",
  },
  optionActive: {
    background: "rgba(250, 204, 21, 0.06)",
    border: "1px solid #facc15",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    border: "1.5px solid #3a3832",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    color: "#0a0a0a",
    fontWeight: 700,
    flexShrink: 0,
  },
  checkboxActive: {
    background: "#facc15",
    border: "1.5px solid #facc15",
  },
  optionTextWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  optionZh: {
    fontSize: 16,
    fontWeight: 600,
    color: "#f5efdc",
  },
  optionEn: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#6b6960",
    letterSpacing: 0.5,
  },
  actions: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    padding: "12px 20px",
    background: "transparent",
    border: "1px solid #2a2a30",
    borderRadius: 8,
    color: "#9a968a",
    fontFamily: "inherit",
    fontSize: 14,
    cursor: "pointer",
  },
  confirmBtn: {
    padding: "12px 24px",
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
};
