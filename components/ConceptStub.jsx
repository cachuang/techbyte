"use client";

import Link from "next/link";
import { getConceptBySlug } from "@/data/concepts";

const LEVEL_COLOR = { 1: "#7dd3fc", 2: "#fbbf24", 3: "#f472b6" };
const LEVEL_TITLE = { 1: "基礎概念", 2: "場景取捨", 3: "進階細節" };

export default function ConceptStub({ concept }) {
  const level = concept.level;
  const prereqs = (concept.prerequisites ?? [])
    .map((s) => getConceptBySlug(s))
    .filter(Boolean);
  const assumed = concept.assumedKnowledge ?? [];

  return (
    <div style={styles.root}>
      <div style={styles.dayMeta}>
        <span style={styles.dayBadge}>Day {concept.releaseDay}</span>
        <span style={styles.metaRight}>📋 草稿</span>
      </div>

      <div style={styles.page}>
        <div style={styles.tagRow}>
          <span style={styles.tag}>{concept.tag}</span>
        </div>

        <h1 style={styles.title}>{concept.title}</h1>
        <p style={styles.hook}>{concept.hook}</p>

        {(level || prereqs.length > 0 || assumed.length > 0) && (
          <div style={styles.metaRow}>
            {level && (
              <span
                style={{
                  ...styles.levelBadge,
                  color: LEVEL_COLOR[level],
                  borderColor: LEVEL_COLOR[level] + "55",
                }}
              >
                {LEVEL_TITLE[level]}
              </span>
            )}
            {prereqs.length > 0 && (
              <span>
                <span style={styles.metaLabel}>建議先讀</span>{" "}
                {prereqs.map((p, i) => (
                  <span key={p.slug}>
                    {i > 0 && "、"}
                    <Link href={`/concept/${p.slug}`} style={styles.metaLink}>
                      《{p.title}》
                    </Link>
                  </span>
                ))}
              </span>
            )}
            {assumed.length > 0 && (
              <span>
                <span style={styles.metaLabel}>假設懂</span>{" "}
                {assumed.join("、")}
              </span>
            )}
          </div>
        )}

        <div style={styles.divider} />

        <div style={styles.stubBox}>
          <div style={styles.stubIcon}>📝</div>
          <div style={styles.stubTitle}>內容尚未發布</div>
          <div style={styles.stubBody}>
            這是一個還在規劃中的概念。預計會講{concept.analogyHint
              ? `「${concept.analogyHint}」這條類比的前提`
              : "上面那個 hook 的核心觀念"}
            ，並收進一輪驗證題。
          </div>
        </div>

        <Link href="/" style={{ textDecoration: "none" }}>
          <button style={styles.btn}>← 回到首頁</button>
        </Link>
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
    padding: "0 0 80px",
  },
  dayMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 28px 0",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "#7a766c",
    letterSpacing: 0.5,
  },
  dayBadge: { color: "#9a968a", fontWeight: 700 },
  metaRight: { color: "#7a766c" },

  page: { padding: "16px 28px" },

  tagRow: { marginTop: 4, marginBottom: 12 },
  tag: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "#fbbf24",
    fontWeight: 700,
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    color: "#f0f0e8",
    fontFamily: "var(--font-sans)",
    marginBottom: 10,
    letterSpacing: -0.5,
    lineHeight: 1.25,
  },
  hook: {
    fontSize: 15,
    color: "#a8a48a",
    lineHeight: 1.65,
    fontStyle: "italic",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px 12px",
    marginTop: 14,
    fontFamily: "var(--font-mono)",
    fontSize: 11.5,
    color: "#7a766c",
    letterSpacing: 0.3,
    lineHeight: 1.6,
  },
  levelBadge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 10,
    border: "1px solid",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  metaLabel: { color: "#5a574e" },
  metaLink: {
    color: "#a8a48a",
    textDecoration: "none",
    borderBottom: "1px dashed #3a3a3a",
  },
  divider: { height: 1, background: "#1e1e1e", margin: "24px 0" },

  stubBox: {
    background: "#141418",
    border: "1px dashed #2a2a30",
    borderRadius: 14,
    padding: "32px 24px",
    textAlign: "center",
    marginBottom: 24,
  },
  stubIcon: { fontSize: 32, marginBottom: 12 },
  stubTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#dcd8cc",
    marginBottom: 10,
  },
  stubBody: {
    fontSize: 14,
    color: "#888",
    lineHeight: 1.7,
    maxWidth: 420,
    margin: "0 auto",
  },

  btn: {
    width: "100%",
    background: "transparent",
    color: "#a8a48a",
    border: "1px solid #2a2a30",
    padding: "14px 18px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "var(--font-mono)",
    cursor: "pointer",
    letterSpacing: 0.5,
  },
};
