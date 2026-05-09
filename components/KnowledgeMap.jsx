"use client";

import { useMemo } from "react";
import Link from "next/link";
import { concepts } from "@/data/concepts";

const STATUS = {
  mastered: {
    dot: "#facc15",
    border: "rgba(250, 204, 21, 0.35)",
    label: "已掌握",
    rank: 0,
  },
  attempted: {
    dot: "#f59e0b",
    border: "rgba(245, 158, 11, 0.3)",
    label: "嘗試中",
    rank: 1,
  },
  untouched: {
    dot: "#3a3a3a",
    border: "#1c1c20",
    label: "未做",
    rank: 2,
  },
};

function classify(score) {
  if (score == null) return "untouched";
  if (score >= 2) return "mastered";
  return "attempted";
}

const LEVEL_COLOR = {
  1: "#7dd3fc", // 基礎 — cool blue
  2: "#fbbf24", // 取捨 — amber（跟主色系一致）
  3: "#f472b6", // 細節 — magenta，跳出來提醒進階
};

const LEVEL_TITLE = {
  1: "基礎概念",
  2: "場景取捨",
  3: "進階細節",
};

export default function KnowledgeMap({ attempts }) {
  const bestScoreBySlug = useMemo(() => {
    const map = {};
    for (const a of attempts ?? []) {
      const prev = map[a.concept_slug];
      if (prev == null || a.score > prev) map[a.concept_slug] = a.score;
    }
    return map;
  }, [attempts]);

  const ready = useMemo(
    () => concepts.filter((c) => c.questions),
    [],
  );

  const stats = useMemo(() => {
    let mastered = 0;
    let attempted = 0;
    for (const c of ready) {
      const status = classify(bestScoreBySlug[c.slug]);
      if (status === "mastered") mastered++;
      else if (status === "attempted") attempted++;
    }
    return {
      total: ready.length,
      mastered,
      attempted,
      untouched: ready.length - mastered - attempted,
    };
  }, [bestScoreBySlug, ready]);

  const grouped = useMemo(() => {
    const byTag = new Map();
    for (const c of ready) {
      if (!byTag.has(c.tag)) byTag.set(c.tag, []);
      byTag.get(c.tag).push(c);
    }
    return Array.from(byTag, ([tag, list]) => ({
      tag,
      list: list.slice().sort((a, b) => {
        // 由淺入深：先 level，同 level 按 releaseDay
        if ((a.level ?? 99) !== (b.level ?? 99)) {
          return (a.level ?? 99) - (b.level ?? 99);
        }
        return a.releaseDay - b.releaseDay;
      }),
      mastered: list.filter(
        (c) => classify(bestScoreBySlug[c.slug]) === "mastered",
      ).length,
    }));
  }, [bestScoreBySlug, ready]);

  const masteredPct =
    stats.total === 0 ? 0 : Math.round((stats.mastered / stats.total) * 100);

  return (
    <div style={styles.wrap}>
      {/* 數據總覽卡 */}
      <div style={styles.statsCard}>
        <div style={styles.statsRow}>
          <Stat value={stats.mastered} label="已掌握" color="#facc15" />
          <Stat value={stats.attempted} label="嘗試中" color="#f59e0b" />
          <Stat value={stats.untouched} label="未做" color="#888" />
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${masteredPct}%`,
            }}
          />
        </div>
        <div style={styles.progressLabel}>
          掌握進度 {masteredPct}%（{stats.mastered} / {stats.total}）
        </div>
        <div style={styles.legend}>
          <span style={{ ...styles.legendItem, color: LEVEL_COLOR[1] }}>
            L1 基礎
          </span>
          <span style={{ ...styles.legendItem, color: LEVEL_COLOR[2] }}>
            L2 取捨
          </span>
          <span style={{ ...styles.legendItem, color: LEVEL_COLOR[3] }}>
            L3 細節
          </span>
        </div>
      </div>

      {/* 依領域分組的列表 */}
      <div style={styles.groups}>
        {grouped.map(({ tag, list, mastered }) => (
          <section key={tag} style={styles.group}>
            <header style={styles.groupHeader}>
              <span style={styles.groupTag}>{tag}</span>
              <span style={styles.groupCount}>
                {mastered} / {list.length}
              </span>
            </header>
            <ul style={styles.list}>
              {list.map((c) => {
                const score = bestScoreBySlug[c.slug];
                const status = classify(score);
                const s = STATUS[status];
                return (
                  <li key={c.slug} style={styles.itemWrap}>
                    <Link href={`/concept/${c.slug}`} style={styles.item}>
                      <span
                        style={{
                          ...styles.dot,
                          background: s.dot,
                          boxShadow:
                            status === "mastered"
                              ? `0 0 8px ${s.dot}88`
                              : "none",
                        }}
                      />
                      <span style={styles.day}>
                        {String(c.releaseDay).padStart(2, "0")}
                      </span>
                      <span
                        style={{
                          ...styles.level,
                          color: LEVEL_COLOR[c.level] ?? "#555",
                        }}
                        title={LEVEL_TITLE[c.level] ?? ""}
                      >
                        L{c.level ?? "?"}
                      </span>
                      <span style={styles.title}>{c.title}</span>
                      <span
                        style={{
                          ...styles.score,
                          color:
                            status === "untouched" ? "#444" : s.dot,
                        }}
                      >
                        {score != null ? `${score}/3` : "—"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label, color }) {
  return (
    <div style={styles.statBox}>
      <span style={{ ...styles.statValue, color }}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  statsCard: {
    background: "#141418",
    border: "1px solid #1c1c20",
    borderRadius: 12,
    padding: "20px 22px",
  },
  statsRow: {
    display: "flex",
    justifyContent: "space-around",
    gap: 12,
    marginBottom: 18,
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  statValue: {
    fontFamily: "'Georgia', var(--font-noto-serif-tc), serif",
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1,
    fontFeatureSettings: '"tnum"',
  },
  statLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#888",
    letterSpacing: 1,
  },
  progressBar: {
    height: 6,
    background: "#1c1c20",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #facc15 0%, #fbbf24 100%)",
    borderRadius: 3,
    transition: "width 0.4s ease",
  },
  progressLabel: {
    fontSize: 12,
    color: "#7a766c",
    fontFamily: "'Courier New', monospace",
    letterSpacing: 0.3,
  },
  legend: {
    display: "flex",
    gap: 14,
    marginTop: 12,
    paddingTop: 10,
    borderTop: "1px solid #1c1c20",
  },
  legendItem: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 0.5,
  },

  groups: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  group: {},
  groupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "0 4px 10px",
    borderBottom: "1px solid #1c1c20",
    marginBottom: 4,
  },
  groupTag: {
    fontFamily: "'Georgia', var(--font-noto-serif-tc), 'Noto Serif TC', serif",
    fontSize: 15,
    fontWeight: 700,
    color: "#fbbf24",
    letterSpacing: 0.3,
  },
  groupCount: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#7a766c",
    letterSpacing: 0.5,
  },

  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  itemWrap: {
    borderBottom: "1px solid #15151a",
  },
  item: {
    display: "grid",
    gridTemplateColumns: "16px 32px 22px 1fr auto",
    alignItems: "center",
    gap: 10,
    padding: "14px 6px",
    textDecoration: "none",
    color: "inherit",
    transition: "background 0.15s",
  },
  level: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 0.3,
    textAlign: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
    transition: "all 0.2s",
  },
  day: {
    fontFamily: "'Georgia', var(--font-noto-serif-tc), serif",
    fontSize: 14,
    fontWeight: 700,
    color: "#888",
    letterSpacing: -0.3,
    fontFeatureSettings: '"tnum"',
  },
  title: {
    fontSize: 14.5,
    color: "#dcd8cc",
    lineHeight: 1.4,
    minWidth: 0,
    wordBreak: "break-word",
    fontWeight: 500,
  },
  score: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
    minWidth: 28,
    textAlign: "right",
  },
};
