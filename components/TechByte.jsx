"use client";

import { useState, useEffect } from "react";
import { getNextConcept } from "@/data/concepts";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const STAGES = { READ: "read", QUIZ: "quiz", RESULT: "result" };
const UNSURE_ID = "unsure";

export default function TechByte({ concept }) {
  const { user } = useAuth();
  const [stage, setStage] = useState(STAGES.READ);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [readProgress, setReadProgress] = useState(0);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error

  useEffect(() => {
    if (stage !== STAGES.READ) return;
    const timer = setInterval(() => {
      setReadProgress((p) => (p >= 100 ? 100 : p + 0.8));
    }, 80);
    return () => clearInterval(timer);
  }, [stage]);

  const q = concept.questions[currentQ];
  const score = answers.filter((a) => a.correct).length;
  const nextConcept = getNextConcept(concept.day);

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
      day: concept.day,
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

  return (
    <div style={styles.root}>
      <style>{css}</style>

      <div style={styles.dayMeta}>
        <span style={styles.dayBadge}>Day {concept.day}</span>
        <span style={styles.streak}>🔥 3 天連續</span>
      </div>

      {stage === STAGES.READ && (
        <div style={styles.page} className="fade-in">
          <div style={styles.tagRow}>
            <span style={styles.tag}>{concept.tag}</span>
            <span style={styles.readTime}>⏱ 約 4 分鐘</span>
          </div>

          <h1 style={styles.title}>{concept.title}</h1>
          <p style={styles.hook}>{concept.hook}</p>

          <div style={styles.divider} />

          {concept.body.split("\n\n").map((paragraph, i) => (
            <p key={i} style={styles.body}>
              {paragraph}
            </p>
          ))}

          <div style={styles.analogyCard}>
            <div style={styles.analogyIcon}>{concept.analogy.icon}</div>
            <div>
              <div style={styles.analogyTitle}>{concept.analogy.title}</div>
              <div style={styles.analogyText}>{concept.analogy.text}</div>
            </div>
          </div>

          <div style={styles.tradeoffGrid}>
            {concept.tradeoffs.map((t, i) => (
              <div key={i} style={styles.tradeoffItem}>
                <div style={styles.tradeoffLabel}>{t.label}</div>
                <div style={styles.tradeoffText}>{t.text}</div>
              </div>
            ))}
          </div>

          <div style={styles.ctaArea}>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${readProgress}%` }} />
            </div>
            <p style={styles.progressHint}>閱讀進度 {Math.round(readProgress)}%</p>
            <button
              style={{ ...styles.btn, opacity: readProgress > 60 ? 1 : 0.4 }}
              onClick={() => readProgress > 60 && setStage(STAGES.QUIZ)}
              className="btn-hover"
            >
              開始驗證理解 →
            </button>
          </div>
        </div>
      )}

      {stage === STAGES.QUIZ && (
        <div style={styles.page} className="fade-in">
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
                <div
                  key={opt.id}
                  style={{ ...styles.option, borderColor, background: bg }}
                  onClick={() => !confirmed && setSelected(opt.id)}
                  className={!confirmed ? "option-hover" : ""}
                >
                  <span style={styles.optionLetter}>{opt.id.toUpperCase()}</span>
                  <span style={styles.optionText}>{opt.text}</span>
                  {confirmed && opt.correct && <span style={styles.badge}>✅</span>}
                  {confirmed && selected === opt.id && !opt.correct && (
                    <span style={styles.badge}>❌</span>
                  )}
                </div>
              );
            })}

            {/* 我不確定答案 — 獨立樣式區隔 */}
            <div
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
              onClick={() => !confirmed && setSelected(UNSURE_ID)}
            >
              <span style={styles.unsureIcon}>🤔</span>
              <span style={styles.unsureText}>我不確定答案</span>
              {confirmed && isUnsureSelected && (
                <span style={styles.badge}>👀</span>
              )}
            </div>
          </div>

          {confirmed && (
            <div style={styles.explanation} className="fade-in">
              <div style={styles.explainHeader}>{explainHeader}</div>
              <p style={styles.explainText}>{q.explanation}</p>
              <div style={styles.misconception}>
                <span style={styles.miscLabel}>💡 常見誤解</span>
                <span>{q.misconception}</span>
              </div>
            </div>
          )}

          <div style={styles.quizActions}>
            {!confirmed ? (
              <button
                style={{ ...styles.btn, opacity: selected ? 1 : 0.3 }}
                onClick={handleConfirm}
                className={selected ? "btn-hover" : ""}
              >
                確認答案
              </button>
            ) : (
              <button style={styles.btn} onClick={handleNext} className="btn-hover">
                {currentQ + 1 < concept.questions.length ? "下一題 →" : "查看結果 →"}
              </button>
            )}
          </div>
        </div>
      )}

      {stage === STAGES.RESULT && (
        <div style={styles.page} className="fade-in">
          <div style={styles.resultIcon}>
            {score === concept.questions.length ? "🏆" : score >= 2 ? "💪" : "📖"}
          </div>
          <h2 style={styles.resultTitle}>
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

          {nextConcept && (
            <div style={styles.resultNextBox}>
              <div style={styles.resultNextLabel}>明天學什麼</div>
              <div style={styles.resultNextTitle}>{nextConcept.title}</div>
              <div style={styles.resultNextSub}>
                {nextConcept.analogyHint}——{nextConcept.hook}
              </div>
            </div>
          )}

          <button
            style={{ ...styles.btn, marginTop: 24 }}
            onClick={handleRestart}
            className="btn-hover"
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
    fontFamily: "'Georgia', 'Noto Serif TC', serif",
    maxWidth: 680,
    margin: "0 auto",
    padding: "0 0 80px",
  },
  dayMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 28px 0",
    fontFamily: "'Courier New', monospace",
  },
  dayBadge: { fontSize: 12, color: "#666", letterSpacing: 1 },
  streak: { fontSize: 12, color: "#999" },
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
    fontFamily: "'Courier New', monospace",
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
    fontFamily: "'Courier New', monospace",
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
    fontFamily: "'Courier New', monospace",
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
};

const css = `
  .fade-in { animation: fadeIn 0.35s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(250,204,21,0.25); }
  .option-hover:hover { border-color: #facc15 !important; cursor: pointer; }
`;
