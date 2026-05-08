// Day 1 是 prototype 完整內容；Day 2–10 目前只放預覽用 metadata（title / tag / hook / analogyHint），
// 用於結果頁的「明天學什麼」預告。撰寫完整內容後再補上 body / questions 等欄位。

export const concepts = [
  {
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
    analogyHint: "身分證 vs 入場手環",
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
        explanation:
          "JWT 的 Payload 只是 Base64 編碼，不是加密。任何人拿到 Token 都能解碼看到內容。所以絕對不能把密碼、信用卡等敏感資訊放進去。真正保護安全的是「簽章」——確保 Token 沒被竄改。",
        misconception: "很多人以為 JWT 是加密的，其實不是。加密≠編碼。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你的團隊要做一個需要支援 iOS、Android、Web 三端的服務，登入機制你會選哪個？",
        options: [
          { id: "a", text: "Session，因為比較傳統、穩定", correct: false },
          { id: "b", text: "JWT，因為客戶端自己保管 Token，不依賴 Cookie", correct: true },
          { id: "c", text: "兩個都用，Web 用 Session、App 用 JWT", correct: false },
        ],
        explanation:
          "行動裝置不像瀏覽器有原生 Cookie 支援，JWT 以 HTTP Header 傳遞，天然適合跨平台。統一用 JWT 也讓後端邏輯更一致。",
        misconception: "兩套機制並行會讓後端邏輯複雜兩倍，維護成本高。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "同事說：「用 JWT 就不需要資料庫查詢，效能一定比 Session 好很多」。這說法正確嗎？",
        options: [
          { id: "a", text: "完全正確，JWT 就是為了省掉資料庫查詢", correct: false },
          { id: "b", text: "不完全對，如果需要撤銷 Token 還是要查黑名單資料庫", correct: true },
          { id: "c", text: "完全錯誤，JWT 其實更慢", correct: false },
        ],
        explanation:
          "JWT 在「驗證」這步確實不需要查資料庫。但一旦你需要實作登出、封鎖帳號等功能，就要維護一個 Token 黑名單，又回到查資料庫了。沒有銀彈，只有取捨。",
        misconception: "技術選型要看場景，不是所有情況 JWT 都更快。",
      },
    ],
  },
  {
    day: 2,
    tag: "API 設計",
    title: "REST vs GraphQL",
    hook: "什麼時候 GraphQL 才值得用？",
    analogyHint: "套餐 vs 點單",
  },
  {
    day: 3,
    tag: "效能",
    title: "CDN 是什麼",
    hook: "它如何讓網頁變快？",
    analogyHint: "全國倉庫 vs 總部直送",
  },
  {
    day: 4,
    tag: "AI",
    title: "RAG（檢索增強生成）",
    hook: "LLM 為什麼需要外掛資料？",
    analogyHint: "開卷考 vs 閉卷考",
  },
  {
    day: 5,
    tag: "網路",
    title: "TCP vs UDP",
    hook: "什麼場景你願意接受丟封包？",
    analogyHint: "掛號信 vs 傳單",
  },
  {
    day: 6,
    tag: "工程",
    title: "Docker 的核心價值",
    hook: "它解決了什麼問題？",
    analogyHint: "貨櫃 vs 搬家打包",
  },
  {
    day: 7,
    tag: "資料庫",
    title: "資料庫 Index",
    hook: "為什麼不是所有欄位都加 Index？",
    analogyHint: "書的目錄 vs 全書翻頁",
  },
  {
    day: 8,
    tag: "安全",
    title: "OAuth 2.0",
    hook: "「用 Google 登入」背後發生了什麼？",
    analogyHint: "代理授權書",
  },
  {
    day: 9,
    tag: "API 設計",
    title: "Webhook vs Polling",
    hook: "主動通知 vs 不斷詢問的取捨",
    analogyHint: "叫號機 vs 一直問說好了嗎",
  },
  {
    day: 10,
    tag: "AI",
    title: "向量資料庫",
    hook: "為什麼搜尋語意需要新的資料庫？",
    analogyHint: "座標距離 vs 關鍵字比對",
  },
];

export function getConceptByDay(day) {
  return concepts.find((c) => c.day === day);
}

export function getNextConcept(day) {
  return concepts.find((c) => c.day === day + 1);
}
