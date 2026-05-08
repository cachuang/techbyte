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
    hook: "為什麼 Facebook 自己發明了 GraphQL，但大部分公司還是用 REST？",
    body: `REST 的設計是「定好的資源端點」——/users/123 給你整個使用者物件，/users/123/posts 給你他的貼文。要同時拿 user 和 posts 就得打兩次 API；要拿一百個 user 的 posts 就要一百零一次。

GraphQL 換個思路：讓客戶端自己宣告「我要 user 的 name、avatar，外加他的最近 5 篇 posts 的 title」，伺服器一次組好回傳。彈性是真的，但代價是：你要設計 schema、你要在 resolver 裡防 N+1、HTTP 層的快取也幾乎用不上。`,
    analogy: {
      icon: "🍱",
      title: "套餐 vs 點單",
      text: "REST 像便當店——菜單上每個編號都是固定組合，A 餐就是漢堡 + 薯條 + 可樂。簡單、可預期，但你只想要漢堡也得整套買。GraphQL 像點菜——「漢堡一個、沙拉一份、飲料不要」，廚房現場客製。彈性高，但廚房得複雜很多。",
    },
    analogyHint: "套餐 vs 點單",
    tradeoffs: [
      { label: "✅ 適合用 GraphQL", text: "多裝置 + 多版本 App、深度關聯的資料、前端團隊想獨立迭代欄位" },
      { label: "⚠️ 注意", text: "後端要處理 N+1 查詢；HTTP CDN 快取幾乎失效，得靠 client side cache (Apollo / Relay)" },
      { label: "❌ 不適合", text: "簡單 CRUD、檔案上傳、需要強 HTTP 快取的公開內容" },
    ],
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "GraphQL 在技術堆疊裡是什麼角色？",
        options: [
          { id: "a", text: "一種新的資料庫，取代 MySQL", correct: false },
          { id: "b", text: "一個查詢語言 + 執行 runtime，跑在 API 層", correct: true },
          { id: "c", text: "一種 NoSQL 標準規範", correct: false },
        ],
        explanation:
          "GraphQL 不是資料庫，它是「API 的查詢語言」加上「在伺服器端執行那些查詢的 runtime」。後面接什麼資料庫都行——MySQL、MongoDB、甚至背後其實是呼叫舊的 REST API。它通常跑在 HTTP POST，但概念上不綁 HTTP。",
        misconception: "很多人以為 GraphQL 取代資料庫或 SQL，其實它是 API 層的東西。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你要做一個圖片上傳 + 簡單 CRUD 的後台管理介面，會選哪個？",
        options: [
          { id: "a", text: "GraphQL，比較現代", correct: false },
          { id: "b", text: "REST，檔案上傳與 HTTP 快取在 REST 更直覺", correct: true },
          { id: "c", text: "前端 GraphQL、後端 REST", correct: false },
        ],
        explanation:
          "檔案上傳走 multipart/form-data，是 REST 的原生格式；GraphQL 要包檔案得用額外規範（如 graphql-multipart-request-spec）。HTTP 快取、ETag、CDN 也是 RESTful 設計的副產品，GraphQL 全部走 POST 同一個 endpoint，CDN 幫不上忙。簡單 CRUD 上 GraphQL 是高射砲打蚊子。",
        misconception: "新 ≠ 適合。技術選型看場景，不看潮流。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "同事說：「GraphQL 一次拿完所有資料，效能一定比 REST 好」。對嗎？",
        options: [
          { id: "a", text: "對，少 round trip 就是比較快", correct: false },
          { id: "b", text: "不一定，後端容易踩到 N+1 查詢反而更慢", correct: true },
          { id: "c", text: "完全錯，GraphQL 不可能比 REST 快", correct: false },
        ],
        explanation:
          "客戶端確實少打幾次請求，但伺服器要為每個欄位逐一 resolve。如果你查 100 個 user 的 posts 沒做批次合併，就是 1 + 100 次資料庫查詢——這就是 N+1 問題。要靠 DataLoader 之類工具批次合併才能避開。前端省下的時間，常常在資料庫層加倍還回去。",
        misconception: "API 層的好處不會自動轉成整體效能，要看後端有沒有處理好 N+1。",
      },
    ],
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
