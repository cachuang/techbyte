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
          // currentDay null = SSR/初次渲染，先當作全部解鎖避免 layout flicker
          const beforeFirstVisit = currentDay == null;
          const isToday = !beforeFirstVisit && c.day === currentDay;
          const isFuture = !beforeFirstVisit && c.day > currentDay;
          const daysUntil = isFuture ? c.day - currentDay : 0;
          const isUnlocked = isReady && !isFuture;

          let statusLabel;
          if (!isReady) statusLabel = "soon";
          else if (isFuture) statusLabel = daysUntil === 1 ? "明天" : `${daysUntil} 天後`;
          else if (isToday) statusLabel = "今天";
          else statusLabel = "→";

          const statusColor = isToday
            ? "#facc15"
            : isFuture
            ? "#555"
            : "#444";

          const inner = (
            <div
              style={{
                ...styles.row,
                opacity: isUnlocked ? 1 : isFuture ? 0.45 : 0.4,
                borderLeft: isToday ? "3px solid #facc15" : "3px solid transparent",
                paddingLeft: isToday ? 25 : 28,
              }}
              className="tb-day-row"
            >
              <span style={styles.day}>Day {String(c.day).padStart(2, "0")}</span>
              <span style={styles.tag} className="tb-day-tag-inline">
                {c.tag}
              </span>
              <span style={styles.titleWrap}>
                <span style={styles.title} className="tb-day-title">
                  {c.title}
                </span>
                <span className="tb-day-tag-mobile" style={{ display: "none" }}>
                  {c.tag}
                </span>
              </span>
              <span style={{ ...styles.status, color: statusColor }}>
                {isFuture && <span style={styles.lockIcon}>⏳ </span>}
                {statusLabel}
              </span>
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
    background: "#0a0a0a",
    color: "#e8e8e0",
    fontFamily: "'Georgia', 'Noto Serif TC', serif",
    maxWidth: 680,
    margin: "0 auto",
    padding: "0 0 80px",
  },
  tagline: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    padding: "24px 28px 12px",
  },
  list: { listStyle: "none", padding: "16px 0", margin: 0 },
  item: { borderBottom: "1px solid #161616" },
  link: { textDecoration: "none", color: "inherit", display: "block" },
  row: {
    display: "grid",
    gridTemplateColumns: "70px 90px 1fr 64px",
    alignItems: "center",
    gap: 16,
    padding: "16px 28px",
    transition: "background 0.15s",
  },
  day: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#666",
    letterSpacing: 1,
  },
  tag: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    color: "#facc15",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  titleWrap: { display: "flex", flexDirection: "column", minWidth: 0, gap: 2 },
  title: {
    fontSize: 16,
    color: "#f0f0e8",
    lineHeight: 1.35,
    wordBreak: "break-word",
  },
  status: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#444",
    textAlign: "right",
    letterSpacing: 0.5,
  },
  lockIcon: { marginRight: 2 },
};
