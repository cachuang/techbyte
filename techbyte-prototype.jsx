import { useState, useEffect } from "react";

const concept = {
  day: 1,
  tag: "API 設計",
  title: "JWT vs Session",
  hook: "你知道為什麼現代 API 幾乎不用 Session 了嗎？",
  body: `當使用者登入，伺服器需要「記住」你是誰。傳統方式是在伺服器儲存一份 Session 紀錄，再給瀏覽器一個 Session ID。但當你有 100 台伺服器時，問題來了——每台都要共享那份紀錄。

JWT 的解法是：把身份資訊直接「編碼」進一個 Token，交給客戶端保管。伺服器只需驗證 Token 的簽章是否合法，不需要查任何資料庫。`,
  analogy: {
    icon: "🎪",
    title: "入場手環 vs 接待員記名冊",
    text: "Session 像活動接待員拿著名冊，每次入場都要查你的名字。JWT 像手環——上面印著你的資訊，任何工作人員掃一下就知道你有沒有資格進去，不需要問總部。",
  },
  tradeoffs: [
    { label: "✅ 適合用 JWT 當", text: "微服務、多台伺服器、行動裝置 API" },
    { label: "⚠️ 注意", text: "JWT 無法即時撤銷，登出只能靠黑名單或短效期" },
    { label: "❌ 不適合", text: "需要即時踢除用戶（如強制下線）的場景" },
  ],
  questions: [
    {
      id: 1,
      type: "概念辨識",
      question: "JWT 的 Payload（內容區）是加密的嗎？",
      options: [
        { id: "a", text: "不是，只是 Base64 編碼，任何人都能解碼", correct: true },
        { id: "b", text: "是，所以可以安全地存放密碼", correct: false },
        { id: "c", text: "視伺服器設定而定", correct: false },
      ],
      explanation: "JWT 的 Payload 只是 Base64 編碼，不是加密。任何人拿到 Token 都能解碼看到內容。所以絕對不能把密碼、信用卡等敏感資訊放進去。真正保護安全的是「簽章」——確保 Token 沒被竄改。",
      misconception: "很多人以為 JWT 是加密的，其實不是。加密≠編碼。",
    },
    {
      id: 2,
      type: "情境判斷",
      question: "你的團隊要做一個需要支援 iOS、Android、Web 三端的服務，登入機制你會選哪個？",
      options: [
        { id: "a", text: "Session，因為比較傳統、穩定", correct: false },
        { id: "b", text: "JWT，因為客戶端自己保管 Token，不依賴 Cookie", correct: true },
        { id: "c", text: "兩個都用，Web 用 Session、App 用 JWT", correct: false },
      ],
      explanation: "行動裝置不像瀏覽器有原生 Cookie 支援，JWT 以 HTTP Header 傳遞，天然適合跨平台。統一用 JWT 也讓後端邏輯更一致。",
      misconception: "兩套機制並行會讓後端邏輯複雜兩倍，維護成本高。",
    },
    {
      id: 3,
      type: "錯誤假設",
      question: "同事說：「用 JWT 就不需要資料庫查詢，效能一定比 Session 好很多」。這說法正確嗎？",
      options: [
        { id: "a", text: "完全正確，JWT 就是為了省掉資料庫查詢", correct: false },
        { id: "b", text: "不完全對，如果需要撤銷 Token 還是要查黑名單資料庫", correct: true },
        { id: "c", text: "完全錯誤，JWT 其實更慢", correct: false },
      ],
      explanation: "JWT 在「驗證」這步確實不需要查資料庫。但一旦你需要實作登出、封鎖帳號等功能，就要維護一個 Token 黑名單，又回到查資料庫了。沒有銀彈，只有取捨。",
      misconception: "技術選型要看場景，不是所有情況 JWT 都更快。",
    },
  ],
};

const STAGES = { READ: "read", QUIZ: "quiz", RESULT: "result" };

export default function TechByte() {
  const [stage, setStage] = useState(STAGES.READ);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    if (stage !== STAGES.READ) return;
    const timer = setInterval(() => {
      setReadProgress((p) => (p >= 100 ? 100 : p + 0.8));
    }, 80);
    return () => clearInterval(timer);
  }, [stage]);

  const q = concept.questions[currentQ];
  const score = answers.filter((a) => a.correct).length;

  const handleConfirm = () => {
    if (!selected) return;
    const isUnsure = selected === "unsure";
    const isCorrect = isUnsure ? false : q.options.find((o) => o.id === selected)?.correct;
    setConfirmed(true);
    setAnswers((prev) => [...prev, { qId: q.id, correct: isCorrect, unsure: isUnsure }]);
  };

  const handleNext = () => {
    if (currentQ + 1 < concept.questions.length) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setStage(STAGES.RESULT);
    }
  };

  const selectedOption = q?.options.find((o) => o.id === selected);

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>techbyte</span>
          <span style={styles.dot}>·</span>
          <span style={styles.dayBadge}>Day {concept.day}</span>
        </div>
        <div style={styles.streak}>🔥 3 天連續</div>
      </header>

      {/* Stage: READ */}
      {stage === STAGES.READ && (
        <div style={styles.page} className="fade-in">
          <div style={styles.tagRow}>
            <span style={styles.tag}>{concept.tag}</span>
            <span style={styles.readTime}>⏱ 約 4 分鐘</span>
          </div>

          <h1 style={styles.title}>{concept.title}</h1>
          <p style={styles.hook}>{concept.hook}</p>

          <div style={styles.divider} />

          <p style={styles.body}>{concept.body.split("\n\n")[0]}</p>
          <p style={styles.body}>{concept.body.split("\n\n")[1]}</p>

          {/* Analogy Card */}
          <div style={styles.analogyCard}>
            <div style={styles.analogyIcon}>{concept.analogy.icon}</div>
            <div>
              <div style={styles.analogyTitle}>{concept.analogy.title}</div>
              <div style={styles.analogyText}>{concept.analogy.text}</div>
            </div>
          </div>

          {/* Tradeoffs */}
          <div style={styles.tradeoffGrid}>
            {concept.tradeoffs.map((t, i) => (
              <div key={i} style={styles.tradeoffItem}>
                <div style={styles.tradeoffLabel}>{t.label}</div>
                <div style={styles.tradeoffText}>{t.text}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
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

      {/* Stage: QUIZ */}
      {stage === STAGES.QUIZ && (
        <div style={styles.page} className="fade-in">
          <div style={styles.quizHeader}>
            <div style={styles.qProgress}>
              {concept.questions.map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.qDot,
                    background: i < currentQ
                      ? "#4ade80"
                      : i === currentQ
                      ? "#facc15"
                      : "#2a2a2a",
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
              if (selected === opt.id && !confirmed) { borderColor = "#facc15"; bg = "#1a1800"; }
              if (confirmed && opt.correct) { borderColor = "#4ade80"; bg = "#0a1f0f"; }
              if (confirmed && selected === opt.id && !opt.correct) { borderColor = "#f87171"; bg = "#1f0a0a"; }

              return (
                <div
                  key={opt.id}
                  style={{ ...styles.option, borderColor, background: bg }}
                  onClick={() => !confirmed && setSelected(opt.id)}
                  className={!confirmed ? "option-hover" : ""}
                >
                  <span style={styles.optionLetter}>{opt.id.toUpperCase()}</span>
                  <span style={styles.optionText}>{opt.text}</span>
                  {confirmed && opt.correct && <span style={styles.badge("✅")}></span>}
                  {confirmed && selected === opt.id && !opt.correct && <span style={styles.badge("❌")}></span>}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {confirmed && (
            <div style={styles.explanation} className="fade-in">
              <div style={styles.explainHeader}>
                {selectedOption?.correct ? "✅ 答對了！" : "❌ 再想想"}
              </div>
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

      {/* Stage: RESULT */}
      {stage === STAGES.RESULT && (
        <div style={styles.page} className="fade-in">
          <div style={styles.resultIcon}>
            {score === 3 ? "🏆" : score === 2 ? "💪" : "📖"}
          </div>
          <h2 style={styles.resultTitle}>
            {score === 3 ? "完全掌握！" : score === 2 ? "理解得不錯" : "繼續加油"}
          </h2>
          <p style={styles.resultScore}>{score} / {concept.questions.length} 題正確</p>

          <div style={styles.resultCards}>
            {concept.questions.map((q, i) => (
              <div key={i} style={styles.resultCard}>
                <span style={{ fontSize: 18 }}>{answers[i]?.correct ? "✅" : "❌"}</span>
                <span style={styles.resultCardText}>{q.type}</span>
              </div>
            ))}
          </div>

          <div style={styles.resultNextBox}>
            <div style={styles.resultNextLabel}>明天學什麼</div>
            <div style={styles.resultNextTitle}>REST vs GraphQL</div>
            <div style={styles.resultNextSub}>套餐 vs 點單——什麼時候 GraphQL 才值得用？</div>
          </div>

          <button
            style={{ ...styles.btn, marginTop: 24 }}
            onClick={() => { setStage(STAGES.READ); setCurrentQ(0); setAnswers([]); setSelected(null); setConfirmed(false); setReadProgress(0); }}
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 28px",
    borderBottom: "1px solid #1e1e1e",
    position: "sticky",
    top: 0,
    background: "#0a0a0a",
    zIndex: 10,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  logo: { fontFamily: "'Courier New', monospace", fontSize: 15, color: "#facc15", letterSpacing: 2, fontWeight: 700 },
  dot: { color: "#333", fontSize: 20 },
  dayBadge: { fontSize: 12, color: "#666", letterSpacing: 1 },
  streak: { fontSize: 13, color: "#999" },
  page: { padding: "32px 28px" },
  tagRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  tag: { fontSize: 11, letterSpacing: 2, color: "#facc15", fontFamily: "'Courier New', monospace", textTransform: "uppercase" },
  readTime: { fontSize: 12, color: "#444" },
  title: { fontSize: 36, fontWeight: 700, lineHeight: 1.2, marginBottom: 16, color: "#f0f0e8", letterSpacing: -1 },
  hook: { fontSize: 17, color: "#888", lineHeight: 1.6, marginBottom: 24, fontStyle: "italic" },
  divider: { height: 1, background: "#1e1e1e", margin: "24px 0" },
  body: { fontSize: 16, lineHeight: 1.85, color: "#c8c8c0", marginBottom: 20 },
  analogyCard: {
    display: "flex", gap: 16, alignItems: "flex-start",
    background: "#111", border: "1px solid #222",
    borderLeft: "3px solid #facc15",
    borderRadius: 8, padding: "16px 20px", margin: "28px 0",
  },
  analogyIcon: { fontSize: 28, flexShrink: 0 },
  analogyTitle: { fontSize: 13, color: "#facc15", letterSpacing: 1, fontFamily: "monospace", marginBottom: 6 },
  analogyText: { fontSize: 14, color: "#aaa", lineHeight: 1.7 },
  tradeoffGrid: { display: "flex", flexDirection: "column", gap: 10, margin: "24px 0" },
  tradeoffItem: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 6, padding: "12px 16px" },
  tradeoffLabel: { fontSize: 12, color: "#888", marginBottom: 4, fontFamily: "monospace" },
  tradeoffText: { fontSize: 14, color: "#ccc", lineHeight: 1.5 },
  ctaArea: { marginTop: 40 },
  progressBar: { height: 3, background: "#1e1e1e", borderRadius: 2, marginBottom: 8, overflow: "hidden" },
  progressFill: { height: "100%", background: "#facc15", borderRadius: 2, transition: "width 0.1s linear" },
  progressHint: { fontSize: 12, color: "#444", marginBottom: 16 },
  btn: {
    width: "100%", padding: "16px", background: "#facc15",
    color: "#0a0a0a", border: "none", borderRadius: 8,
    fontFamily: "'Courier New', monospace", fontSize: 14,
    letterSpacing: 1, fontWeight: 700, cursor: "pointer",
    transition: "all 0.2s",
  },
  quizHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 },
  qProgress: { display: "flex", gap: 8, alignItems: "center" },
  qDot: { width: 10, height: 10, borderRadius: "50%", transition: "all 0.3s" },
  qType: { fontSize: 11, color: "#555", letterSpacing: 2, fontFamily: "monospace" },
  question: { fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 28, color: "#f0f0e8" },
  options: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 },
  option: {
    display: "flex", alignItems: "center", gap: 14,
    border: "1px solid", borderRadius: 8,
    padding: "14px 18px", cursor: "pointer", transition: "all 0.15s",
  },
  optionLetter: {
    width: 26, height: 26, borderRadius: "50%",
    background: "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontFamily: "monospace", color: "#888", flexShrink: 0,
  },
  optionText: { fontSize: 14, color: "#ccc", lineHeight: 1.5, flex: 1 },
  badge: (icon) => ({ fontSize: 16, flexShrink: 0 }),
  explanation: {
    background: "#111", border: "1px solid #2a2a2a",
    borderRadius: 10, padding: "20px", marginBottom: 20,
  },
  explainHeader: { fontSize: 15, fontWeight: 700, marginBottom: 10, color: "#f0f0e8" },
  explainText: { fontSize: 14, color: "#aaa", lineHeight: 1.75, marginBottom: 14 },
  misconception: {
    background: "#0f0f0f", borderRadius: 6, padding: "10px 14px",
    fontSize: 13, color: "#777", lineHeight: 1.5,
  },
  miscLabel: { color: "#facc15", fontFamily: "monospace", fontSize: 11, marginRight: 8, letterSpacing: 1 },
  quizActions: { marginTop: 8 },
  resultIcon: { textAlign: "center", fontSize: 64, marginBottom: 16, marginTop: 24 },
  resultTitle: { textAlign: "center", fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#f0f0e8" },
  resultScore: { textAlign: "center", fontSize: 15, color: "#888", marginBottom: 32, fontFamily: "monospace" },
  resultCards: { display: "flex", gap: 12, justifyContent: "center", marginBottom: 36 },
  resultCard: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    background: "#111", border: "1px solid #1e1e1e", borderRadius: 8, padding: "16px 20px",
  },
  resultCardText: { fontSize: 11, color: "#555", fontFamily: "monospace", letterSpacing: 1 },
  resultNextBox: {
    background: "#111", border: "1px solid #222",
    borderLeft: "3px solid #4ade80",
    borderRadius: 8, padding: "20px 24px",
  },
  resultNextLabel: { fontSize: 11, color: "#4ade80", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 },
  resultNextTitle: { fontSize: 20, fontWeight: 700, color: "#f0f0e8", marginBottom: 6 },
  resultNextSub: { fontSize: 13, color: "#666", lineHeight: 1.5 },
};

const css = `
  .fade-in { animation: fadeIn 0.35s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(250,204,21,0.25); }
  .option-hover:hover { border-color: #facc15 !important; cursor: pointer; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
`;
