"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getNextConceptByReleaseDay, getConceptBySlug } from "@/data/concepts";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { getDayStatus } from "@/lib/day-progress";

const STAGES = { READ: "read", QUIZ: "quiz", RESULT: "result" };
const UNSURE_ID = "unsure";

const LEVEL_COLOR = { 1: "#7dd3fc", 2: "#fbbf24", 3: "#f472b6" };
const LEVEL_TITLE = { 1: "基礎概念", 2: "場景取捨", 3: "進階細節" };

export default function TechByte({ concept }) {
  const { user } = useAuth();
  const [stage, setStage] = useState(STAGES.READ);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [readProgress, setReadProgress] = useState(0);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
  const [gateState, setGateState] = useState({ checked: false, locked: false, daysUntil: 0 });

  useEffect(() => {
    const status = getDayStatus(concept.releaseDay);
    setGateState({
      checked: true,
      locked: !status.unlocked,
      daysUntil: status.daysUntil,
    });
  }, [concept.releaseDay]);

  useEffect(() => {
    if (stage !== STAGES.READ) return;
    const timer = setInterval(() => {
      setReadProgress((p) => (p >= 100 ? 100 : p + 0.8));
    }, 80);
    return () => clearInterval(timer);
  }, [stage]);

  const q = concept.questions[currentQ];
  const score = answers.filter((a) => a.correct).length;
  const nextConcept = getNextConceptByReleaseDay(concept.releaseDay);

  const handleConfirm = () => {
    if (!selected) return;
    const isUnsure = selected === UNSURE_ID;
    const isCorrect = isUnsure
      ? false
      : !!q.options.find((o) => o.id === selected)?.correct;
    setConfirmed(true);
    setAnswers((prev) => [...prev, { qId: q.id, correct: isCorrect, unsure: isUnsure }]);
  };

  const persistAttempt = async (finalAnswers) => {
    if (!user) return;
    setSaveStatus("saving");
    const correctCount = finalAnswers.filter((a) => a.correct).length;
    const unsureCount = finalAnswers.filter((a) => a.unsure).length;
    const { error } = await supabase.from("attempts").insert({
      user_id: user.id,
      concept_slug: concept.slug,
      score: correctCount,
      unsure_count: unsureCount,
      answers: finalAnswers,
    });
    setSaveStatus(error ? "error" : "saved");
  };

  const handleNext = () => {
    if (currentQ + 1 < concept.questions.length) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setStage(STAGES.RESULT);
      persistAttempt(answers);
    }
  };

  const handleRestart = () => {
    setStage(STAGES.READ);
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setConfirmed(false);
    setReadProgress(0);
    setSaveStatus("idle");
  };

  const isUnsureSelected = selected === UNSURE_ID;
  const selectedOption = q?.options.find((o) => o.id === selected);
  const explainHeader = confirmed
    ? isUnsureSelected
      ? "🤔 沒關係，看看解說"
      : selectedOption?.correct
      ? "✅ 答對了！"
      : "❌ 再想想"
    : "";

  const dotColor = (i) => {
    if (i === currentQ) return "#facc15";
    if (i > currentQ) return "#2a2a2a";
    const a = answers[i];
    if (!a) return "#2a2a2a";
    if (a.unsure) return "#60a5fa";
    return a.correct ? "#4ade80" : "#f87171";
  };

  if (!gateState.checked) {
    return (
      <div style={styles.root}>
        <p style={styles.loadingNote}>載入中...</p>
      </div>
    );
  }

  if (gateState.locked) {
    const unlockLabel =
      gateState.daysUntil === 1 ? "明天" : `${gateState.daysUntil} 天後`;
    return (
      <div style={styles.root}>
        <style>{css}</style>
        <div style={styles.dayMeta} className="tb-day-meta">
          <span style={styles.dayBadge}>Day {concept.releaseDay}</span>
          <span style={styles.metaRight}>🔒 尚未解鎖</span>
        </div>
        <div style={styles.page} className="fade-in tb-page">
          <div style={styles.lockWrap}>
            <div style={styles.lockIcon}>🔒</div>
            <h1 style={styles.lockTitle} className="tb-title">
              {unlockLabel}解鎖
            </h1>
            <p style={styles.lockSub}>
              <span style={styles.lockTag}>{concept.tag}</span>
              <span style={styles.lockConceptTitle}>{concept.title}</span>
            </p>
            <p style={styles.lockHint}>
              一天一個概念，慢慢累積。{unlockLabel}本地時間 00:00 後再回來。
            </p>
            <Link href="/" style={{ textDecoration: "none" }}>
              <button style={styles.btn} className="tb-btn btn-hover">
                ← 回到今天
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <style>{css}</style>

      <div style={styles.dayMeta} className="tb-day-meta">
        <span style={styles.dayBadge}>Day {concept.releaseDay}</span>
        <span style={styles.metaRight}>
          {stage === STAGES.READ && "⏱ 約 4 分鐘"}
          {stage === STAGES.QUIZ &&
            `題目 ${currentQ + 1} / ${concept.questions.length}`}
          {stage === STAGES.RESULT && "🎯 結果"}
        </span>
      </div>

      {stage === STAGES.READ && (
        <div style={styles.page} className="fade-in tb-page">
          <div style={styles.tagRow}>
            <span style={styles.tag}>{concept.tag}</span>
          </div>

          <h1 style={styles.title} className="tb-title">
            {concept.title}
          </h1>
          <p style={styles.hook} className="tb-hook">
            {concept.hook}
          </p>

          {(() => {
            const level = concept.level;
            const prereqs = (concept.prerequisites ?? [])
              .map((s) => getConceptBySlug(s))
              .filter(Boolean);
            const assumed = concept.assumedKnowledge ?? [];
            const showMeta =
              level >= 2 || prereqs.length > 0 || assumed.length > 0;
            if (!showMeta) return null;
            return (
              <div style={styles.metaRow} className="tb-meta-row">
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
                  <span style={styles.metaItem}>
                    <span style={styles.metaLabel}>建議先讀</span>{" "}
                    {prereqs.map((p, i) => (
                      <span key={p.slug}>
                        {i > 0 && "、"}
                        <Link
                          href={`/concept/${p.slug}`}
                          style={styles.metaLink}
                        >
                          《{p.title}》
                        </Link>
                      </span>
                    ))}
                  </span>
                )}
                {assumed.length > 0 && (
                  <span style={styles.metaItem}>
                    <span style={styles.metaLabel}>假設懂</span>{" "}
                    {assumed.join("、")}
                  </span>
                )}
              </div>
            );
          })()}

          <div style={styles.divider} />

          {concept.body.split("\n\n").map((paragraph, i) => (
            <p key={i} style={styles.body} className="tb-body">
              {paragraph}
            </p>
          ))}

          {concept.example?.code && (
            <div style={styles.codeCard} className="tb-code">
              <div style={styles.codeLabel}>📝 例子</div>
              <pre style={styles.codePre}>{concept.example.code}</pre>
              {concept.example.note && (
                <div style={styles.codeNote}>{concept.example.note}</div>
              )}
            </div>
          )}

          <div style={styles.analogyCard} className="tb-analogy">
            <div style={styles.analogyIcon}>{concept.analogy.icon}</div>
            <div style={{ minWidth: 0 }}>
              <div style={styles.analogyTitle}>{concept.analogy.title}</div>
              <div style={styles.analogyText}>{concept.analogy.text}</div>
            </div>
          </div>

          {concept.originStory && (
            <div style={styles.originCard} className="tb-origin">
              <div style={styles.originLabel}>📜 ORIGIN</div>
              <div style={styles.originText}>{concept.originStory}</div>
            </div>
          )}

          <div style={styles.tradeoffGrid}>
            {concept.tradeoffs.map((t, i) => (
              <div key={i} style={styles.tradeoffItem} className="tb-tradeoff">
                <div style={styles.tradeoffLabel}>{t.label}</div>
                <div style={styles.tradeoffText}>{t.text}</div>
              </div>
            ))}
          </div>

          {concept.oneLiner && (
            <div style={styles.oneLinerCard} className="tb-oneliner">
              <div style={styles.oneLinerLabel}>💬 一句話講</div>
              <div style={styles.oneLinerText}>「{concept.oneLiner}」</div>
            </div>
          )}

          <div style={styles.ctaArea} className="tb-cta-sticky">
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${readProgress}%` }} />
            </div>
            <p style={styles.progressHint}>閱讀進度 {Math.round(readProgress)}%</p>
            <button
              style={{ ...styles.btn, opacity: readProgress > 60 ? 1 : 0.4 }}
              onClick={() => readProgress > 60 && setStage(STAGES.QUIZ)}
              className="btn-hover tb-btn"
              aria-disabled={readProgress <= 60}
            >
              開始驗證理解 →
            </button>
          </div>
        </div>
      )}

      {stage === STAGES.QUIZ && (
        <div style={styles.page} className="fade-in tb-page">
          <div style={styles.quizHeader}>
            <div style={styles.qProgress}>
              {concept.questions.map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.qDot,
                    background: dotColor(i),
                    transform: i === currentQ ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            <span style={styles.qType}>{q.type}</span>
          </div>

          <h2 style={styles.question} className="tb-question">
            {q.question}
          </h2>

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
                  className={`tb-option ${!confirmed ? "option-hover" : ""}`}
                  disabled={confirmed}
                  aria-pressed={selected === opt.id}
                >
                  <span style={styles.optionLetter} className="tb-option-letter">
                    {opt.id.toUpperCase()}
                  </span>
                  <span style={styles.optionText} className="tb-option-text">
                    {opt.text}
                  </span>
                  {confirmed && opt.correct && <span style={styles.badge}>✅</span>}
                  {confirmed && selected === opt.id && !opt.correct && (
                    <span style={styles.badge}>❌</span>
                  )}
                </button>
              );
            })}

            {/* 我不確定答案 — 獨立樣式區隔 */}
            <button
              type="button"
              style={{
                ...styles.unsureOption,
                borderColor:
                  confirmed && isUnsureSelected
                    ? "#60a5fa"
                    : selected === UNSURE_ID
                    ? "#60a5fa"
                    : "#2a3a4a",
                background:
                  selected === UNSURE_ID || (confirmed && isUnsureSelected)
                    ? "#0a1422"
                    : "transparent",
                opacity: confirmed && !isUnsureSelected ? 0.4 : 1,
                cursor: confirmed ? "default" : "pointer",
              }}
              className="tb-option"
              disabled={confirmed}
              onClick={() => !confirmed && setSelected(UNSURE_ID)}
              aria-pressed={selected === UNSURE_ID}
            >
              <span style={styles.unsureIcon}>🤔</span>
              <span style={styles.unsureText}>我不確定答案</span>
              {confirmed && isUnsureSelected && (
                <span style={styles.badge}>👀</span>
              )}
            </button>
          </div>

          {confirmed && (
            <div style={styles.explanation} className="fade-in tb-explain">
              <div style={styles.explainHeader}>{explainHeader}</div>
              <p style={styles.explainText}>{q.explanation}</p>
              <div style={styles.misconception}>
                <span style={styles.miscLabel}>💡 常見誤解</span>
                <span>{q.misconception}</span>
              </div>
            </div>
          )}

          <div style={styles.quizActions} className="tb-cta-sticky">
            {!confirmed ? (
              <button
                style={{ ...styles.btn, opacity: selected ? 1 : 0.3 }}
                onClick={handleConfirm}
                className={`tb-btn ${selected ? "btn-hover" : ""}`}
                disabled={!selected}
              >
                確認答案
              </button>
            ) : (
              <button style={styles.btn} onClick={handleNext} className="btn-hover tb-btn">
                {currentQ + 1 < concept.questions.length ? "下一題 →" : "查看結果 →"}
              </button>
            )}
          </div>
        </div>
      )}

      {stage === STAGES.RESULT && (
        <div style={styles.page} className="fade-in tb-page">
          <div style={styles.resultIcon} className="tb-result-icon">
            {score === concept.questions.length ? "🏆" : score >= 2 ? "💪" : "📖"}
          </div>
          <h2 style={styles.resultTitle} className="tb-result-title">
            {score === concept.questions.length
              ? "完全掌握！"
              : score >= 2
              ? "理解得不錯"
              : "繼續加油"}
          </h2>
          <p style={styles.resultScore}>
            {score} / {concept.questions.length} 題正確
          </p>

          <p style={styles.saveStatus}>
            {!user && "💾 登入後即可保存進度，跨裝置查看你的知識地圖"}
            {user && saveStatus === "saving" && "儲存中..."}
            {user && saveStatus === "saved" && "✓ 已儲存到你的紀錄"}
            {user && saveStatus === "error" && "⚠️ 儲存失敗，但解答已顯示"}
          </p>

          <div style={styles.resultCards}>
            {concept.questions.map((quest, i) => {
              const a = answers[i];
              const icon = a?.unsure ? "🤔" : a?.correct ? "✅" : "❌";
              return (
                <div key={i} style={styles.resultCard}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={styles.resultCardText}>{quest.type}</span>
                </div>
              );
            })}
          </div>

          {concept.furtherReading?.length > 0 && (
            <div style={styles.readingCard} className="tb-reading">
              <div style={styles.readingLabel}>📚 想再深入</div>
              <ul style={styles.readingList}>
                {concept.furtherReading.map((r, i) => (
                  <li key={i} style={styles.readingItem}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.readingLink}
                    >
                      {r.title} ↗
                    </a>
                    <div style={styles.readingWhy}>{r.why}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {nextConcept && (
            <div style={styles.resultNextBox} className="tb-next-box">
              <div style={styles.resultNextLabel}>明天學什麼</div>
              <div style={styles.resultNextTitle} className="tb-next-title">
                {nextConcept.title}
              </div>
              <div style={styles.resultNextSub}>
                {nextConcept.analogyHint}——{nextConcept.hook}
              </div>
            </div>
          )}

          <button
            style={{ ...styles.btn, marginTop: 24 }}
            onClick={handleRestart}
            className="btn-hover tb-btn"
          >
            🔁 重新閱讀概念
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#e8e8e0",
    fontFamily: "var(--font-sans)",
    maxWidth: 680,
    margin: "0 auto",
    padding: "0 0 80px",
  },
  dayMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 28px 0",
    fontFamily: "var(--font-mono)",
  },
  dayBadge: { fontSize: 12, color: "#666", letterSpacing: 1 },
  metaRight: { fontSize: 12, color: "#666", letterSpacing: 0.5 },
  page: { padding: "16px 28px 32px" },
  tagRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tag: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#facc15",
    fontFamily: "var(--font-mono)",
    textTransform: "uppercase",
  },
  readTime: { fontSize: 12, color: "#444" },
  title: {
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: 16,
    color: "#f0f0e8",
    letterSpacing: -1,
  },
  hook: {
    fontSize: 17,
    color: "#888",
    lineHeight: 1.6,
    marginBottom: 24,
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
  metaItem: {
    display: "inline",
  },
  metaLabel: {
    color: "#5a574e",
  },
  metaLink: {
    color: "#a8a48a",
    textDecoration: "none",
    borderBottom: "1px dashed #3a3a3a",
  },
  divider: { height: 1, background: "#1e1e1e", margin: "24px 0" },
  body: { fontSize: 16, lineHeight: 1.85, color: "#c8c8c0", marginBottom: 20 },
  analogyCard: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    background: "#111",
    border: "1px solid #222",
    borderLeft: "3px solid #facc15",
    borderRadius: 8,
    padding: "16px 20px",
    margin: "28px 0",
  },
  analogyIcon: { fontSize: 28, flexShrink: 0 },
  analogyTitle: {
    fontSize: 13,
    color: "#facc15",
    letterSpacing: 1,
    fontFamily: "monospace",
    marginBottom: 6,
  },
  analogyText: { fontSize: 14, color: "#aaa", lineHeight: 1.7 },
  tradeoffGrid: { display: "flex", flexDirection: "column", gap: 10, margin: "24px 0" },
  tradeoffItem: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 6,
    padding: "12px 16px",
  },
  tradeoffLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    fontFamily: "monospace",
  },
  tradeoffText: { fontSize: 14, color: "#ccc", lineHeight: 1.5 },
  ctaArea: { marginTop: 40 },
  progressBar: {
    height: 3,
    background: "#1e1e1e",
    borderRadius: 2,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#facc15",
    borderRadius: 2,
    transition: "width 0.1s linear",
  },
  progressHint: { fontSize: 12, color: "#444", marginBottom: 16 },
  btn: {
    width: "100%",
    padding: "16px",
    background: "#facc15",
    color: "#0a0a0a",
    border: "none",
    borderRadius: 8,
    fontFamily: "var(--font-mono)",
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  quizHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  qProgress: { display: "flex", gap: 8, alignItems: "center" },
  qDot: { width: 10, height: 10, borderRadius: "50%", transition: "all 0.3s" },
  qType: {
    fontSize: 11,
    color: "#555",
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  question: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.4,
    marginBottom: 28,
    color: "#f0f0e8",
  },
  options: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 },
  option: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    border: "1px solid",
    borderRadius: 8,
    padding: "14px 18px",
    cursor: "pointer",
    transition: "all 0.15s",
    width: "100%",
    textAlign: "left",
    font: "inherit",
    color: "inherit",
  },
  optionLetter: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "#1e1e1e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontFamily: "monospace",
    color: "#888",
    flexShrink: 0,
  },
  optionText: { fontSize: 14, color: "#ccc", lineHeight: 1.5, flex: 1 },
  badge: { fontSize: 16, flexShrink: 0 },
  unsureOption: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    border: "1px dashed",
    borderRadius: 8,
    padding: "14px 18px",
    marginTop: 6,
    transition: "all 0.15s",
    width: "100%",
    textAlign: "left",
    font: "inherit",
    color: "inherit",
  },
  unsureIcon: { fontSize: 18, flexShrink: 0 },
  unsureText: {
    fontSize: 13,
    color: "#60a5fa",
    fontFamily: "monospace",
    letterSpacing: 1,
    flex: 1,
  },
  explanation: {
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    padding: "20px",
    marginBottom: 20,
  },
  explainHeader: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 10,
    color: "#f0f0e8",
  },
  explainText: { fontSize: 14, color: "#aaa", lineHeight: 1.75, marginBottom: 14 },
  misconception: {
    background: "#0f0f0f",
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: 13,
    color: "#777",
    lineHeight: 1.5,
  },
  miscLabel: {
    color: "#facc15",
    fontFamily: "monospace",
    fontSize: 11,
    marginRight: 8,
    letterSpacing: 1,
  },
  quizActions: { marginTop: 8 },
  resultIcon: { textAlign: "center", fontSize: 64, marginBottom: 16, marginTop: 24 },
  resultTitle: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
    color: "#f0f0e8",
  },
  resultScore: {
    textAlign: "center",
    fontSize: 15,
    color: "#888",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  saveStatus: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    marginBottom: 24,
    fontFamily: "var(--font-mono)",
    minHeight: 16,
  },
  resultCards: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    marginBottom: 36,
    flexWrap: "wrap",
  },
  resultCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 8,
    padding: "16px 20px",
  },
  resultCardText: {
    fontSize: 11,
    color: "#555",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  resultNextBox: {
    background: "#111",
    border: "1px solid #222",
    borderLeft: "3px solid #4ade80",
    borderRadius: 8,
    padding: "20px 24px",
  },
  resultNextLabel: {
    fontSize: 11,
    color: "#4ade80",
    letterSpacing: 2,
    fontFamily: "monospace",
    marginBottom: 6,
  },
  resultNextTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#f0f0e8",
    marginBottom: 6,
  },
  resultNextSub: { fontSize: 13, color: "#666", lineHeight: 1.5 },

  // === 新增區塊：Code / Origin / OneLiner / Further reading ===
  codeCard: {
    background: "#0a0a0d",
    border: "1px solid #1c1c20",
    borderRadius: 8,
    padding: "14px 16px",
    margin: "20px 0",
    overflowX: "auto",
  },
  codeLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "#7a766c",
    letterSpacing: 1.5,
    fontWeight: 700,
    marginBottom: 10,
  },
  codePre: {
    margin: 0,
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    lineHeight: 1.7,
    color: "#dcd8cc",
    whiteSpace: "pre",
  },
  codeNote: {
    marginTop: 12,
    paddingTop: 10,
    borderTop: "1px solid #1c1c20",
    fontSize: 13,
    color: "#888",
    lineHeight: 1.7,
    fontStyle: "italic",
    fontFamily: "var(--font-sans)",
  },
  originCard: {
    background: "#13110a",
    border: "1px solid #2a261a",
    borderLeft: "3px solid #fbbf24",
    borderRadius: 8,
    padding: "14px 18px",
    margin: "20px 0",
  },
  originLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "#fbbf24",
    letterSpacing: 1.5,
    fontWeight: 700,
    marginBottom: 8,
  },
  originText: {
    fontSize: 14,
    color: "#bdb8a8",
    lineHeight: 1.75,
  },
  oneLinerCard: {
    background:
      "linear-gradient(135deg, rgba(250, 204, 21, 0.08) 0%, rgba(250, 204, 21, 0.02) 100%)",
    border: "1px solid #2a261a",
    borderRadius: 8,
    padding: "16px 20px",
    margin: "24px 0",
  },
  oneLinerLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "#facc15",
    letterSpacing: 1.5,
    fontWeight: 700,
    marginBottom: 8,
  },
  oneLinerText: {
    fontSize: 16,
    color: "#f0e6c4",
    lineHeight: 1.6,
    fontStyle: "italic",
    fontWeight: 500,
  },
  readingCard: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 10,
    padding: "16px 20px",
    marginTop: 28,
    marginBottom: 16,
  },
  readingLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "#facc15",
    letterSpacing: 1.5,
    fontWeight: 700,
    marginBottom: 14,
  },
  readingList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  readingItem: {},
  readingLink: {
    color: "#fbbf24",
    fontSize: 14,
    textDecoration: "none",
    fontWeight: 600,
    display: "inline-block",
    marginBottom: 4,
  },
  readingWhy: {
    fontSize: 12,
    color: "#888",
    lineHeight: 1.6,
  },
  loadingNote: {
    textAlign: "center",
    fontSize: 13,
    color: "#555",
    fontFamily: "monospace",
    padding: "80px 24px",
  },
  lockWrap: {
    textAlign: "center",
    padding: "60px 16px 24px",
  },
  lockIcon: {
    fontSize: 56,
    marginBottom: 18,
    opacity: 0.85,
  },
  lockTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: "#facc15",
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  lockSub: {
    fontSize: 14,
    color: "#888",
    marginBottom: 28,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    alignItems: "center",
  },
  lockTag: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "#facc15",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  lockConceptTitle: {
    fontSize: 18,
    color: "#c8c8c0",
    fontWeight: 700,
  },
  lockHint: {
    fontSize: 13,
    color: "#666",
    lineHeight: 1.7,
    marginBottom: 32,
    maxWidth: 360,
    margin: "0 auto 32px",
  },
};

const css = `
  .fade-in { animation: fadeIn 0.35s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(250,204,21,0.25); }
  .option-hover:hover { border-color: #facc15 !important; cursor: pointer; }
`;
