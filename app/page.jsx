"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { concepts } from "@/data/concepts";
import { getCurrentDay } from "@/lib/day-progress";

export default function Home() {
  const [currentDay, setCurrentDay] = useState(null);

  useEffect(() => {
    setCurrentDay(getCurrentDay());
  }, []);

  return (
    <div style={styles.root}>
      <p style={styles.tagline} className="tb-tagline">
        A byte a day, keeps the layoff away
      </p>

      <ul style={styles.list}>
        {concepts.map((c) => {
          const isReady = !!c.questions;
          const beforeFirstVisit = currentDay == null;
          const isToday = !beforeFirstVisit && c.day === currentDay;
          const isFuture = !beforeFirstVisit && c.day > currentDay;
          const daysUntil = isFuture ? c.day - currentDay : 0;
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
                  {String(c.day).padStart(2, "0")}
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
            <li key={c.day} style={styles.item}>
              {isUnlocked ? (
                <Link href={`/day/${c.day}`} style={styles.link}>
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
    fontFamily: "'Georgia', 'Noto Serif TC', serif",
    maxWidth: 680,
    margin: "0 auto",
    padding: "0 0 80px",
  },
  tagline: {
    fontSize: 13,
    color: "#7a766c",
    fontStyle: "italic",
    padding: "28px 28px 16px",
    letterSpacing: 0.3,
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
      "linear-gradient(90deg, rgba(212, 184, 122, 0.08) 0%, rgba(212, 184, 122, 0.02) 60%, transparent 100%)",
    borderLeft: "3px solid #d4b87a",
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
    fontFamily: "'Georgia', serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#9a968a",
    letterSpacing: -1.2,
    lineHeight: 1,
    fontFeatureSettings: '"tnum"',
  },
  dayNumToday: {
    fontFamily: "'Georgia', serif",
    fontSize: 28,
    fontWeight: 700,
    color: "#d4b87a",
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
    fontFamily: "'Georgia', 'Noto Serif TC', serif",
    fontSize: 12,
    color: "#b89968",
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
    fontFamily: "'Georgia', serif",
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
    background: "#d4b87a",
    color: "#0a0a0a",
    padding: "4px 10px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 10.5,
    letterSpacing: 1.2,
    fontFamily: "'Courier New', monospace",
    boxShadow: "0 0 16px rgba(212, 184, 122, 0.25)",
  },
};
