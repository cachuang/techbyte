// 完整 10 個概念。每個都用 Day 1 / Day 2 的結構與 voice 撰寫。

export const concepts = [
  {
    slug: "jwt-vs-session",
    releaseDay: 6,
    level: 2,
    tracks: ["backend","frontend","ai"],
    prerequisites: ["http-basics"],
    assumedKnowledge: ["Cookie / session 概念"],
    tag: "API 設計",
    title: "JWT vs Session",
    hook: "你知道為什麼現代 API 幾乎不用 Session 了嗎？",
    body: `當使用者登入，伺服器需要「記住」你是誰。傳統方式是在伺服器儲存一份 Session 紀錄，再給瀏覽器一個 Session ID。但當你有 100 台伺服器時，問題來了——每台都要共享那份紀錄。

JWT 的解法是:把身份資訊直接「編碼」進一個 Token，交給客戶端保管。伺服器只需驗證 Token 的簽章是否合法，不需要查任何資料庫。`,
    analogy: {
      icon: "🎪",
      title: "入場手環 vs 接待員記名冊",
      text: "Session 像活動接待員拿著名冊，每次入場都要查你的名字。JWT 像手環——上面印著你的資訊，任何工作人員掃一下就知道你有沒有資格進去，不需要問總部。",
    },
    analogyHint: "身分證 vs 入場手環",
    originStory: "JWT 來自 2010 年 RFC 草案、2015 年 RFC 7519 正式定稿。在它之前，跨多伺服器的「我登入過」要嘛靠 sticky session（同一使用者鎖在同一台機器），要嘛把 session 存共享 DB（Redis 等），都有複雜性。Auth0、AWS、Google 推 JWT 後成為現代 SPA / 行動 app 的事實標準。但 2016 年 Sven Slootweg〈Stop using JWT for sessions〉點出 JWT 在 session 場景的多個 anti-pattern，圈內爭議至今未停。",
    example: {
      code: `const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiYWxpY2UifQ.signature";
const [, payload] = token.split(".");
JSON.parse(atob(payload));
// → { sub: "123", name: "alice" }`,
      note: "任何人都能 decode payload，看見裡面的內容。所以絕對不要把密碼、信用卡、個資放 JWT 裡——簽章保護的是「沒被竄改」，不是「看不見」。",
    },
    tradeoffs: [
      { label: "✅ 適合用 JWT 當", text: "微服務、多台伺服器、行動裝置 API" },
      { label: "⚠️ 注意", text: "JWT 無法即時撤銷，登出只能靠黑名單或短效期" },
      { label: "❌ 不適合", text: "需要即時踢除用戶（如強制下線）的場景" },
    ],
    oneLiner: "JWT 是讓伺服器不用記得你是誰——把資訊寫在你身上自己帶著走。",
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
    furtherReading: [
      {
        title: "Stop using JWT for sessions (Sven Slootweg)",
        url: "http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/",
        why: "圈內最有名的 JWT 反思文，看完才知道為什麼很多大公司不用 JWT 當 session",
      },
      {
        title: "jwt.io",
        url: "https://jwt.io/",
        why: "線上 decode JWT 工具，下方有 RFC 7519 規格與各語言函式庫列表",
      },
    ],
  },
  {
    slug: "rest-vs-graphql",
    releaseDay: 1,
    level: 2,
    tracks: ["backend","frontend","ai"],
    prerequisites: ["http-basics"],
    assumedKnowledge: [],
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
    originStory: "GraphQL 從 2012 年起在 Facebook 內部解決行動端 News Feed 載入問題：單一 user profile 要打 6 個 REST endpoint。2015 年公開、2018 年 Facebook 移交給 GraphQL Foundation。REST 則是 Roy Fielding 2000 年博士論文提出的設計哲學，本質是「定義 HTTP 該怎麼用」，不是另一個協定——所以「REST vs GraphQL」其實是「兩種使用 HTTP 的方式」之爭。",
    example: {
      code: `# REST：拿 user + 最近 5 篇貼文 = 兩次請求
GET /users/123
GET /users/123/posts?limit=5

# GraphQL：一次搞定，欄位你自己挑
query {
  user(id: 123) {
    name
    avatar
    recentPosts(limit: 5) {
      title
      createdAt
    }
  }
}`,
      note: "客戶端拿到的 JSON 結構跟 query 完全對應。後端要用 resolver 一個個 resolve 欄位——沒處理好 N+1 就變成「前端省了一次，後端打了 100 次」。",
    },
    tradeoffs: [
      { label: "✅ 適合用 GraphQL", text: "多裝置 + 多版本 App、深度關聯的資料、前端團隊想獨立迭代欄位" },
      { label: "⚠️ 注意", text: "後端要處理 N+1 查詢；HTTP CDN 快取幾乎失效，得靠 client side cache (Apollo / Relay)" },
      { label: "❌ 不適合", text: "簡單 CRUD、檔案上傳、需要強 HTTP 快取的公開內容" },
    ],
    oneLiner: "REST 是「預先打包好的菜單」，GraphQL 是「你點什麼伺服器就給什麼」。",
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
    recapQuestion: {
      type: "情境判斷",
      question: "API 給 mobile 跟 web 共用，mobile 只要 user.name + user.avatar，web 要全部 user 欄位。選 REST 還是 GraphQL？",
      options: [
        { id: "a", text: "REST，做兩個 endpoint 各回不同 shape", correct: false },
        { id: "b", text: "GraphQL — client 自己 query 要的欄位，一個 endpoint 兩種 shape", correct: true },
        { id: "c", text: "都不好，自己另設計", correct: false },
      ],
      explanation:
        "這是 GraphQL 經典甜蜜點：多個 client 需要不同形狀的同一份資料。REST 做兩套 endpoint 維護成本高，single endpoint 又會 over-fetch。GraphQL 一個 endpoint + query selection 各取所需。但「資料形狀對所有 client 一致」時 REST 比較簡單。",
      misconception: "「REST 永遠夠用」是錯的——client 需求差異大時 GraphQL 真的省事。",
    },
    furtherReading: [
      {
        title: "graphql.org — Learn",
        url: "https://graphql.org/learn/",
        why: "官方教學，從 query 語法到 schema 設計都有",
      },
      {
        title: "How to GraphQL",
        url: "https://www.howtographql.com/",
        why: "免費的 GraphQL fullstack tutorial，含 N+1、authorization 等實務題",
      },
    ],
  },
  {
    slug: "cdn",
    releaseDay: 9,
    level: 2,
    tracks: ["backend","frontend","devops"],
    prerequisites: ["http-basics"],
    assumedKnowledge: ["Cache 概念"],
    tag: "效能",
    title: "CDN 是什麼",
    hook: "同一個網頁，為什麼從台灣打開比從美國打開快？",
    body: `你的網站伺服器在某個機房（比如美西）。每個訪客的請求都要跨太平洋抵達伺服器、再傳資料回去——光速雖快，但繞地球半圈仍會有 100-200ms 延遲。內容越大（圖、影片）等越久。

CDN（Content Delivery Network）的解法：把靜態資源（圖、CSS、JS、影片）複製到全球幾百個邊緣節點。台灣的訪客就近從台灣節點拿，美國訪客從美國節點拿。代價是 cache invalidation——當你更新檔案時，要怎麼讓所有節點都同步？這是 CDN 永遠的難題。`,
    analogy: {
      icon: "🏪",
      title: "全國便利商店 vs 總部直送",
      text: "沒 CDN 像物流中心只設在台北，南部下單也從台北送，慢。有 CDN 像每個城市都有便利商店——客戶就近取貨，快。但商品上架要同步到所有店——更新一個價格要跑遍全國。",
    },
    analogyHint: "全國倉庫 vs 總部直送",
    originStory: "Akamai 1998 年由 MIT 數學教授 Tom Leighton 與學生 Daniel Lewin 創立。觸發點是 1996 年 NASA Pathfinder 火星任務直播把 Web 伺服器打爆，人們意識到「集中式 server 撐不住爆發流量」。第一個客戶是 ESPN 1999 年體育賽事直播。今天 Cloudflare、Fastly、AWS CloudFront 都是 Akamai 模式的演進。",
    tradeoffs: [
      { label: "✅ 適合", text: "大量靜態資源、跨國使用者、影音串流、突發流量" },
      { label: "⚠️ 注意", text: "Cache invalidation 麻煩；熱門檔案可能還在舊版本一陣子" },
      { label: "❌ 不適合", text: "高度動態、個人化的內容（每人看到不同）" },
    ],
    oneLiner: "CDN 不是讓你的伺服器變快——是給你一堆放在世界各地的副本。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "CDN 主要快在哪裡？",
        options: [
          { id: "a", text: "它把你的伺服器升級到更好的硬體", correct: false },
          { id: "b", text: "把內容複製到離使用者近的邊緣節點，縮短傳輸距離", correct: true },
          { id: "c", text: "它有更快的網路線", correct: false },
        ],
        explanation:
          "CDN 不會升級你的源伺服器，也不是「特殊網路線」。本質是「就近供應」——把同樣的檔案放在全球幾百個節點，使用者拿到最近的副本。距離縮短，延遲就降低；同時源伺服器負擔也減輕，不用每次都自己出貨。",
        misconception: "CDN 不是讓你的伺服器變快，是給了你一堆「分身」。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你的服務 80% 流量是個人化儀表板（每人看到的數字不同），20% 是首頁圖片和 logo。要不要上 CDN？",
        options: [
          { id: "a", text: "動態太多，CDN 沒用，整個跳過", correct: false },
          { id: "b", text: "CDN 對那 20% 的靜態資源仍有意義，混合使用", correct: true },
          { id: "c", text: "要嘛全用要嘛全不用", correct: false },
        ],
        explanation:
          "CDN 的價值在「能被快取的內容」。不需要全站走 CDN——靜態資源（圖片、JS、CSS、字型）走 CDN，動態 API 直接打源伺服器。混合架構是業界常態，幾乎所有大型網站都這樣設計。",
        misconception: "CDN 不是 all or nothing 的決定，可以只放靜態資源。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "同事說：「上了 CDN 我們就不用管伺服器規模了，反正都從 CDN 出」。對嗎？",
        options: [
          { id: "a", text: "對，CDN 會處理所有流量", correct: false },
          { id: "b", text: "不對，動態請求和 cache miss 仍會回到源伺服器", correct: true },
          { id: "c", text: "看 CDN 廠商等級", correct: false },
        ],
        explanation:
          "CDN 只快取「可快取」的東西。第一次有人請求某張圖片時，CDN 還沒有，會回去源拿（cache miss）。所有 API 請求、登入、購物車也都打源。CDN 減壓但不消除源伺服器壓力——大型促銷時，源仍然會被打爆。",
        misconception: "CDN 是減壓器，不是替身。源伺服器仍要扛得住基準流量。",
      },
    ],
    furtherReading: [
      {
        title: "Cloudflare Learning Center — What is a CDN?",
        url: "https://www.cloudflare.com/learning/cdn/what-is-a-cdn/",
        why: "結構好、圖解清楚的入門，含快取策略與 Origin shield 等概念",
      },
      {
        title: "High Performance Browser Networking — Ch. 11 HTTP Caching",
        url: "https://hpbn.co/optimizing-application-delivery/",
        why: "Ilya Grigorik 經典書免費看，CDN 與瀏覽器快取怎麼配合",
      },
    ],
  },
  {
    slug: "rag",
    releaseDay: 19,
    level: 2,
    tracks: ["ai"],
    prerequisites: ["vector-database"],
    assumedKnowledge: ["LLM 概念"],
    tag: "AI",
    title: "RAG（檢索增強生成）",
    hook: "ChatGPT 知識停在某個時間點，為什麼還能回答今年的新聞？",
    body: `LLM 的「知識」是訓練資料的快照——訓練到某個時間點，之後發生的事它都不知道。同樣，公司內部文件、私有資料、最新產品規格，也都不在它的訓練集裡。直接問會得到「我不知道」或更糟，幻覺亂編。

RAG（Retrieval-Augmented Generation）把問題拆兩步：先去外部資料庫「檢索」相關文件，再把這些文件當作 context 塞給 LLM 生成答案。LLM 變成「開卷考」——不靠記憶、看著資料說話。代價是：檢索品質決定答案品質。檢索到爛文件，LLM 也只能基於爛文件回答。`,
    analogy: {
      icon: "📚",
      title: "開卷考 vs 閉卷考",
      text: "閉卷（純 LLM）：腦袋裡記什麼就答什麼，沒記就掰。開卷（RAG）：考前發給你一疊資料，邊翻邊答。資料齊不齊、查得快不快，決定了你考得多好。",
    },
    analogyHint: "開卷考 vs 閉卷考",
    originStory: "RAG 一詞來自 2020 年 Facebook AI Research 論文〈Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks〉。但讓它從學術跳到企業必備的是 ChatGPT 2022 年底爆紅後——所有想做「LLM 回答自家 PDF」的公司都會撞上 context 太長與訓練資料過時兩個問題。LangChain（2022 年底）、LlamaIndex 把 RAG 工程化，2024 年 Anthropic 又提出 Contextual Retrieval 把檢索失誤率再降一截。",
    example: {
      code: `# RAG 三步走（pseudo code）
def rag(question):
    # 1. 把問題向量化
    q_vec = embedding_model.encode(question)
    # 2. 從向量資料庫找最相近的 5 段文件
    docs = vector_db.search(q_vec, top_k=5)
    # 3. 把文件當 context 餵給 LLM
    return llm.generate(
        f"根據以下資料回答：\\n{docs}\\n\\n問題：{question}"
    )`,
      note: "80% 的工程量在「2. 怎麼找得準」——chunking 策略、embedding model 選擇、re-ranking。LLM 的部分反而最簡單。",
    },
    tradeoffs: [
      { label: "✅ 適合", text: "知識頻繁更新、私有/特定領域資料、需要可追溯來源" },
      { label: "⚠️ 注意", text: "檢索品質決定一切，垃圾進垃圾出；chunking 與 re-ranking 是 80% 的工程量" },
      { label: "❌ 不適合", text: "純創意/推理任務（不需外部知識），或資料量小到能直接放進 prompt" },
    ],
    oneLiner: "LLM 不是變聰明——是讓它「開卷考」看到外部資料。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "RAG 中的「R」是？",
        options: [
          { id: "a", text: "Reasoning，加強模型的推理能力", correct: false },
          { id: "b", text: "Retrieval，從外部資料庫檢索相關內容", correct: true },
          { id: "c", text: "Reinforcement，強化學習", correct: false },
        ],
        explanation:
          "RAG = Retrieval-Augmented Generation。「Retrieval」指的是「先檢索後生成」——拿問題去資料庫（通常是向量資料庫）找相關文件，再把文件當作補充資料給 LLM。LLM 本身的推理能力沒變，變的是它能看到的資料。",
        misconception: "RAG 不會讓模型「變聰明」，只是讓它「看得到更多」。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你要做內部客服 bot 回答產品問題，產品文件 50 萬字，每月會更新。最務實的做法？",
        options: [
          { id: "a", text: "拿這 50 萬字 fine-tune 一個自己的模型", correct: false },
          { id: "b", text: "用 RAG：文件存進向量資料庫，每次依問題檢索相關段落餵給 LLM", correct: true },
          { id: "c", text: "把全部 50 萬字塞進 prompt 裡", correct: false },
        ],
        explanation:
          "50 萬字超過大多數 LLM 的 context 限制。Fine-tune 每次更新都要重訓，成本和工程量都高。RAG 是業界標準解法：文件異動只需要 re-index 向量資料庫，模型本身不動。彈性和成本都贏。",
        misconception: "大部分企業 LLM 應用不需要 fine-tune，先試 RAG。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "「我用了 RAG，幻覺問題就解決了」。對嗎？",
        options: [
          { id: "a", text: "對，有了真實資料就不會亂編", correct: false },
          { id: "b", text: "不對，檢索錯了還是會基於錯資料生成錯答案", correct: true },
          { id: "c", text: "看你用的 LLM 多新", correct: false },
        ],
        explanation:
          "RAG 緩解幻覺，但不消除。如果檢索到不相關或錯誤的文件，LLM 會自信地基於它們回答——錯得更有說服力。RAG 系統 80% 工程精力在「怎麼讓檢索檢得準」：chunking 策略、向量模型選擇、re-ranking、混合檢索。檢索糟，整個 RAG 就糟。",
        misconception: "RAG 把問題從「LLM 記憶」轉移到「檢索系統」，沒有真正消除錯誤可能。",
      },
    ],
    furtherReading: [
      {
        title: "Pinecone — Vector Databases & RAG",
        url: "https://www.pinecone.io/learn/",
        why: "從 embedding 到 vector DB 的系列教學，業界寫得最完整的免費資源",
      },
      {
        title: "Anthropic — Contextual Retrieval",
        url: "https://www.anthropic.com/news/contextual-retrieval",
        why: "2024 進階 RAG 技巧，把檢索準確率再提升一截",
      },
    ],
  },
  {
    slug: "tcp-vs-udp",
    releaseDay: 12,
    level: 2,
    tracks: ["backend","devops"],
    prerequisites: ["network-layers"],
    assumedKnowledge: [],
    tag: "網路",
    title: "TCP vs UDP",
    hook: "為什麼直播平台寧可畫面卡一下，也不要等所有資料都到齊？",
    body: `TCP 像「掛號信」——保證每個封包都送達、按順序、不重複；中途丟了，重傳。代價是慢，每個封包都要確認、要等、要排隊。

UDP 像「明信片」——丟出去就算，不確認、不重傳、不保證順序。代價是有些封包會丟，但對某些場景反而是優點：直播、視訊通話、遊戲——晚到的封包已經沒用了（你想看 10 秒前的畫面嗎？），寧可丟掉繼續往前。可靠性和延遲在這裡是矛盾的，TCP 選可靠，UDP 選即時。`,
    analogy: {
      icon: "📬",
      title: "掛號信 vs 傳單",
      text: "掛號信（TCP）：要簽收，沒收到要追、要重寄。安全但慢。傳單（UDP）：丟進信箱就算數，丟一張無所謂，重點是時效。",
    },
    analogyHint: "掛號信 vs 傳單",
    originStory: "TCP 與 UDP 都在 1980 年的 RFC 793 / 768 定稿，作者 Vint Cerf（後來被稱為「網際網路之父」之一）。當年的設計取捨 40 多年沒變過。2018 年 Google 推出 QUIC（後成 HTTP/3），用 UDP 重做了「可靠 + 加密 + 多工」這幾件事——不是因為 TCP 壞，而是 TCP 演進太慢、middlebox 卡住創新，Google 寧可在 application 層自己重做。",
    tradeoffs: [
      { label: "✅ 適合用 TCP", text: "HTTP、Email、檔案傳輸、銀行交易（資料正確性 > 速度）" },
      { label: "⚠️ 注意", text: "TCP 的擁塞控制在不穩定網路會「越來越慢」" },
      { label: "❌ 不適合用 TCP", text: "視訊串流、線上遊戲、DNS 查詢（即時性 > 完美性）" },
    ],
    oneLiner: "TCP 是掛號信（每封都送達），UDP 是丟傳單（快但會丟）。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "下列哪一項是 TCP 提供但 UDP 沒有的？",
        options: [
          { id: "a", text: "IP 位址定址", correct: false },
          { id: "b", text: "重傳、按序到達、去重", correct: true },
          { id: "c", text: "加密", correct: false },
        ],
        explanation:
          "兩者都建在 IP 之上，所以 IP 定址都有；加密兩者都不負責（要加密用 TLS）。TCP 比 UDP 多的核心保證是：1) 沒收到會重傳（reliability）；2) 封包按順序給應用層（ordering）；3) 重複封包丟掉（deduplication）。這三個合稱 TCP 的「可靠傳輸」。",
        misconception: "TCP 不是「進階版的 UDP」，是不同的取捨。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你要做一個多人連線即時射擊遊戲，玩家位置每秒同步 30 次。用 TCP 還是 UDP？",
        options: [
          { id: "a", text: "TCP，這樣不會丟資料", correct: false },
          { id: "b", text: "UDP，丟個一兩個座標沒關係，下個包馬上就有新的", correct: true },
          { id: "c", text: "HTTP（用 long polling）", correct: false },
        ],
        explanation:
          "即時遊戲的關鍵是「最新狀態」，不是「歷史完整」。如果用 TCP，丟一個封包就要等重傳，整條線會塞住——玩家會看到「卡一下又瞬移」。UDP 丟一個就丟，下一個 33ms 後就有新的位置，反而流暢。所有主流即時遊戲（FPS、MOBA）都用 UDP。",
        misconception: "TCP 在「即時 + 容錯」場景下是劣勢，不是優勢。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "「UDP 比 TCP 快，所以效能要求高的場景都該用 UDP」。對嗎？",
        options: [
          { id: "a", text: "對，UDP 一定比 TCP 快", correct: false },
          { id: "b", text: "不對，要看「快」指什麼——UDP 延遲低，但 TCP 在大檔案傳輸的吞吐可能更穩", correct: true },
          { id: "c", text: "完全錯，TCP 永遠比 UDP 快", correct: false },
        ],
        explanation:
          "「快」要分清是「低延遲」還是「高吞吐」。UDP 沒有握手、沒有重傳等待，所以單包延遲低。但傳大檔案時，TCP 的擁塞控制會穩定佔用頻寬，UDP 還要應用層自己處理丟包（不是真的省了，只是換個地方寫）。HTTP/3 用 UDP 也不是因為「UDP 比較快」，是要繞過 TCP 的某些限制。",
        misconception: "協定選擇是「適合 vs 不適合」，不是「快 vs 慢」的單一維度。",
      },
    ],
    furtherReading: [
      {
        title: "Beej's Guide to Network Programming",
        url: "https://beej.us/guide/bgnet/",
        why: "1990 年代寫的免費網路程式設計經典，讀完 socket 程式就會了",
      },
      {
        title: "High Performance Browser Networking — Ch. 2 TCP, Ch. 3 UDP",
        url: "https://hpbn.co/building-blocks-of-tcp/",
        why: "深入兩個協定的核心機制（congestion control、3-way handshake 等）",
      },
    ],
  },
  {
    slug: "docker",
    releaseDay: 14,
    level: 2,
    tracks: ["backend","devops","ai"],
    prerequisites: ["memory-model"],
    assumedKnowledge: ["OS process"],
    tag: "工程",
    title: "Docker 的核心價值",
    hook: "「在我電腦上明明能跑」這句經典台詞，Docker 為什麼能讓它消失？",
    body: `軟體要跑起來不只是 code。它需要特定版本的作業系統、特定版本的 Python/Node、特定的 system library、特定的環境變數。每個團隊成員的本機環境都不一樣，每個 production 主機也不一樣。「能跑」其實意味著「環境配對成功」——這件事很脆弱。

Docker 把「應用 + 它需要的整個環境」打包成一個 image，像一個自帶生態系的盒子。不管在誰的機器上、什麼 OS（只要有 Docker），跑出來的環境完全一樣。它不是虛擬機（不模擬硬體），而是用 Linux namespace + cgroup 把行程關進「看起來像獨立 OS」的盒子裡，輕量到可以幾百個一起跑。`,
    analogy: {
      icon: "📦",
      title: "貨櫃 vs 散裝搬家",
      text: "散裝：搬家公司要為每件家具想怎麼包、怎麼放卡車、怎麼搬進新家。每次都重來。貨櫃（Docker）：所有東西塞進規格化的箱子，車子、船、起重機都按貨櫃規格設計。在哪都搬得動。",
    },
    analogyHint: "貨櫃 vs 搬家打包",
    originStory: "Solomon Hykes 2013 年在 PyCon 公開展示 Docker（原本是 dotCloud 內部工具）。底層 Linux containers（LXC、cgroups、namespace）2008 已存在——Docker 真正的貢獻是把「打包 + 分發」變得 trivial：Dockerfile 一行 build、`docker push` 一行就推到 registry、`docker run` 一行就在任何機器上跑。三年內顛覆了部署模式，2014 年 Microsoft / Google / AWS 都加入支援。",
    example: {
      code: `# 三行 Dockerfile 就讓 Node.js app 在任何機器上跑得一模一樣
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]`,
      note: "build 出來的 image 包含 OS、Node、依賴、code、執行命令——完整一份「環境快照」。同一個 image 在你筆電跟生產環境跑出來的東西一模一樣。",
    },
    tradeoffs: [
      { label: "✅ 適合", text: "微服務部署、開發/測試/生產環境一致、CI/CD pipeline" },
      { label: "⚠️ 注意", text: "Image 容易變胖；有狀態的服務（資料庫）要額外處理 volume" },
      { label: "❌ 不適合", text: "對啟動延遲敏感到 ms 級的場景、需要直接操作硬體的應用" },
    ],
    oneLiner: "Docker 把「環境配置」變成程式碼，跟著應用一起 ship。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "Docker 容器和虛擬機（VM）的本質差別是？",
        options: [
          { id: "a", text: "Docker 比較新", correct: false },
          { id: "b", text: "Docker 共享 host 的 kernel，VM 模擬完整作業系統", correct: true },
          { id: "c", text: "Docker 只能跑 Linux，VM 什麼都能跑", correct: false },
        ],
        explanation:
          "VM 在 hypervisor 之上跑一個完整的 OS（含 kernel），所以開機慢、佔資源多。Docker 容器共享 host 的 Linux kernel，只隔離行程、檔案系統、網路等——本質是「特殊化的行程」。容器幾秒就啟動、佔幾 MB 記憶體；VM 要幾十秒、佔幾百 MB。在 Mac/Windows 跑 Docker，底層其實還是有一層輕量 Linux VM。",
        misconception: "容器不是「輕量 VM」，是「打包好的行程」。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你的團隊每次部署都遇到「線上環境少了 ImageMagick library」這種問題。最直接的解決方式？",
        options: [
          { id: "a", text: "寫詳細的部署文件，要求 SRE 照著裝", correct: false },
          { id: "b", text: "把應用裝進 Docker image，部署的就是「跟開發時一模一樣的環境」", correct: true },
          { id: "c", text: "換一個 PaaS", correct: false },
        ],
        explanation:
          "文件會過時、會被忽略、會有人犯錯。Docker image 把「環境配置」變成程式碼（Dockerfile），跟著應用走。Production 部署的就是開發/測試時跑過的同一個 image，差異從「文件能不能跟上」變成「version tag 對不對」——後者明確得多。",
        misconception: "Docker 不只是部署工具，是把環境配置「程式碼化」的方法論。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "「我的應用不用 Docker，跑在原生 OS 上應該效能比較好」。對嗎？",
        options: [
          { id: "a", text: "對，少了一層一定快", correct: false },
          { id: "b", text: "不完全對，Docker 容器幾乎沒額外開銷，效能差距通常 < 5%", correct: true },
          { id: "c", text: "錯，Docker 反而比較快", correct: false },
        ],
        explanation:
          "Docker 容器不是 VM，沒有額外的 kernel、沒有硬體模擬。CPU、記憶體存取都是直接走 host kernel，效能差距通常在統計誤差範圍內。例外是密集 I/O 或網路，因為過 Docker 的虛擬網路橋接會有些 overhead。對 99% 的應用，「容器 vs 原生」效能差不是該優化的點。",
        misconception: "抽象層 ≠ 性能損失。容器幾乎是免費的。",
      },
    ],
    furtherReading: [
      {
        title: "Docker Get Started",
        url: "https://docs.docker.com/get-started/",
        why: "官方教學，4 小時學完 image / container / compose",
      },
      {
        title: "The Twelve-Factor App",
        url: "https://12factor.net/",
        why: "容器時代的應用設計原則，Heroku 寫的但變成業界共識",
      },
    ],
  },
  {
    slug: "database-index",
    releaseDay: 16,
    level: 2,
    tracks: ["backend","ai"],
    prerequisites: ["data-structures"],
    assumedKnowledge: ["SQL"],
    tag: "資料庫",
    title: "資料庫 Index",
    hook: "為什麼工程師都說「加 index 會變快」，但又說「不要每個欄位都加 index」？",
    body: `沒 index 時，資料庫要找一筆資料只能 full table scan——從第一行掃到最後一行，每行都看。100 萬筆資料就 100 萬次比對。Index 是「另外維護的排序結構」（通常是 B+ tree），透過它可以幾步就跳到目標位置——把查詢從 O(n) 降到 O(log n)。

但 index 不是免費的。每次 INSERT/UPDATE/DELETE，所有相關 index 都要同步更新——寫入越多 index 越慢。Index 也佔磁碟空間，更新頻繁的欄位 index 會碎片化、需要重建。所以「加 index」是讀寫之間的取捨，不是無腦動作。`,
    analogy: {
      icon: "📖",
      title: "書的目錄 vs 全書翻頁",
      text: "沒 index：找某個關鍵字要從第一頁翻到最後一頁。有 index：去最後的索引找到關鍵字，直接翻到頁碼。但每次新增段落，索引也要更新。",
    },
    analogyHint: "書的目錄 vs 全書翻頁",
    originStory: "B-tree 是 Rudolf Bayer 與 Edward McCreight 在 1970 年波音公司寫的論文〈Organization and Maintenance of Large Ordered Indexes〉提出的。50 多年了，所有主流關聯資料庫（MySQL InnoDB、PostgreSQL、Oracle）都用 B+ tree（B-tree 變體）。為什麼是樹而不是 hash？因為 B+ tree 同時支援「等值」(=) 與「範圍」(<, BETWEEN) 查詢，且樹深度淺，磁碟 I/O 少。",
    example: {
      code: `-- 沒 index：full table scan，100 萬筆都掃
SELECT * FROM users WHERE email = 'alice@example.com';
-- EXPLAIN: type=ALL, rows=1000000

CREATE INDEX idx_email ON users(email);

-- 有 index：B+ tree 幾步就跳到目標
SELECT * FROM users WHERE email = 'alice@example.com';
-- EXPLAIN: type=ref, rows=1`,
      note: "EXPLAIN 是你在生產環境的 X 光機——沒看 EXPLAIN 就加 / 不加 index 都是猜測。",
    },
    tradeoffs: [
      { label: "✅ 適合加 index", text: "常用於 WHERE / JOIN / ORDER BY 的欄位、唯一性高的欄位" },
      { label: "⚠️ 注意", text: "區分度低的欄位（如 boolean、性別）加 index 幫助有限" },
      { label: "❌ 不適合加 index", text: "寫入頻繁但鮮少查詢的欄位、表本身很小（< 幾千筆）" },
    ],
    oneLiner: "Index 加速「讀」但拖慢「寫」——加之前先看你的查詢模式，不是每個欄位都該加。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "關聯式資料庫 index 最常見的底層資料結構是？",
        options: [
          { id: "a", text: "Linked list", correct: false },
          { id: "b", text: "B+ tree", correct: true },
          { id: "c", text: "Hash table（一般而言）", correct: false },
        ],
        explanation:
          "大多數關聯式資料庫（MySQL InnoDB、PostgreSQL）的 index 預設用 B+ tree。它支援範圍查詢（>、<、BETWEEN）、按序遍歷，而且樹的深度淺，磁碟 I/O 少。Hash index 雖然點查找 O(1)，但不支援範圍——只在特定場景（如 PostgreSQL 的 hash index）才用。",
        misconception: "Hash index 適合單值查詢，但不能取代 B+ tree 的全功能。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "users 表的 gender 欄位只有兩個值（M、F）。為它加 index 值得嗎？",
        options: [
          { id: "a", text: "值得，所有 WHERE 用到的欄位都該加 index", correct: false },
          { id: "b", text: "通常不值得，重複值太多、區分度（cardinality）低", correct: true },
          { id: "c", text: "看資料庫廠商", correct: false },
        ],
        explanation:
          "Index 的價值來自「能快速縮小搜尋範圍」。gender = 'M' 仍然命中半張表，跟 full scan 差不多。資料庫的查詢優化器看到這種低區分度的 index，常常直接忽略它走 full scan。Index 只對「能大幅縮小結果集」的欄位有意義，例如 user_id、email 這種接近唯一的。",
        misconception: "不是「WHERE 用到就加」，是「能有效篩出少數結果就加」。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "同事說「我們表越來越慢，所以幫每個欄位都加了 index」。會發生什麼？",
        options: [
          { id: "a", text: "變更快，因為查詢都有 index", correct: false },
          { id: "b", text: "反而可能更慢，因為每次寫入都要更新所有 index", correct: true },
          { id: "c", text: "沒差，index 只影響讀", correct: false },
        ],
        explanation:
          "Index 加速「讀」但拖慢「寫」。每個 INSERT/UPDATE/DELETE 都要同步更新所有相關 index，n 個 index 就是 n 倍寫入成本。如果你的表寫入頻繁、查詢模式只用幾個欄位，每個欄位加 index 反而把寫入變慢、磁碟空間爆增、cache 命中率下降。Index 設計要看「實際查詢模式」，不是「以防萬一」。",
        misconception: "Index 不是越多越好，是越「對症」越好。",
      },
    ],
    furtherReading: [
      {
        title: "Use The Index, Luke! (Markus Winand)",
        url: "https://use-the-index-luke.com/",
        why: "免費全本書，SQL index 從入門到精通，所有 RDBMS 通用",
      },
      {
        title: "PostgreSQL Indexes Documentation",
        url: "https://www.postgresql.org/docs/current/indexes.html",
        why: "官方文件講得比 MySQL 文件清楚多了，B-tree、Hash、GiST、GIN 都有",
      },
    ],
  },
  {
    slug: "oauth2",
    releaseDay: 7,
    level: 2,
    tracks: ["backend","frontend","devops","ai"],
    prerequisites: ["http-basics"],
    assumedKnowledge: ["Token / web auth"],
    tag: "安全",
    title: "OAuth 2.0",
    hook: "點「用 Google 登入」之後，那個服務真的拿到你的 Google 密碼嗎？",
    body: `早期的「第三方登入」很可怕——你要把 Google 密碼直接給那個服務，他幫你登入。問題：那服務從此能做你 Google 帳號的所有事，包括改密碼把你踢出來。OAuth 2.0 解決的就是「我要授權你做某些事，但不給你我的密碼」這件事。

流程是：你點「用 Google 登入」→ 跳轉到 Google → 在 Google 上登入並確認「我同意 X 服務存取我的 email」→ Google 給 X 服務一個 token（不是你的密碼）→ X 用 token 呼叫 Google API。你隨時可以在 Google 撤銷這個 token，密碼從沒離開過你和 Google 之間。OAuth 是「授權書」，不是「鑰匙複製」。`,
    analogy: {
      icon: "🔑",
      title: "代客泊車鑰匙",
      text: "一般鑰匙：給別人就什麼都能開，包括後車廂保險箱。代客泊車鑰匙：只能發動車、不能開後車廂；用完還能停用這把。OAuth token 就是這種限制版鑰匙。",
    },
    analogyHint: "代理授權書",
    originStory: "OAuth 1.0 來自 2007 年 Twitter 工程師 Blaine Cook 主導的草案——為了讓第三方 app 接 Twitter API 時不用拿密碼。但 1.0 太複雜（簽章麻煩），2012 年 OAuth 2.0（RFC 6749）簡化成「token-based」。OpenID Connect 2014 加在 OAuth 上面解決身分驗證（OAuth 只解授權）。「用 Google 登入」實際是 OAuth 2.0 + OpenID Connect 組合。",
    example: {
      code: `# OAuth flow URL（瀏覽器跳轉到 Google）
https://accounts.google.com/o/oauth2/v2/auth?
  client_id=YOUR_APP_ID
  &redirect_uri=https://your-app.com/callback
  &response_type=code
  &scope=email%20profile
  &state=RANDOM_CSRF_TOKEN`,
      note: "scope 很重要——寫 `email profile` 就只能拿 email + profile，寫 calendar scope 才能讀行事曆。「最小權限原則」就是這層守住的。",
    },
    tradeoffs: [
      { label: "✅ 適合", text: "跨服務授權、第三方應用整合、行動 App 登入" },
      { label: "⚠️ 注意", text: "Token 設計、refresh token 管理是常見漏洞點；scope 要設小" },
      { label: "❌ 不適合", text: "只有自家服務的內部驗證（殺雞用牛刀）" },
    ],
    oneLiner: "OAuth 是「授權書」（我可以做什麼），不是「身分證」（我是誰）。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "OAuth 2.0 的核心目的是？",
        options: [
          { id: "a", text: "加密使用者密碼", correct: false },
          { id: "b", text: "讓使用者授權第三方存取資源，不需要交出密碼", correct: true },
          { id: "c", text: "取代 HTTPS", correct: false },
        ],
        explanation:
          "OAuth 2.0 是「授權框架」（authorization framework），解決「使用者怎麼讓 A 服務代理存取 B 服務的資料，但不交出 B 的密碼」。它不負責加密（HTTPS 才是），不負責驗證使用者身份本身（那是 OpenID Connect 在 OAuth 上的擴展）。重點字是「授權」（authorize），不是「驗證」（authenticate）。",
        misconception: "OAuth 是授權框架，不是登入協定。「OAuth 登入」其實是 OpenID Connect。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你做的 App 想讓使用者「分享他的 Google 行事曆」。最正確的流程？",
        options: [
          { id: "a", text: "請使用者直接輸入 Google 帳密在你的 App", correct: false },
          { id: "b", text: "走 OAuth flow，跳轉到 Google，使用者授權後拿 access token", correct: true },
          { id: "c", text: "用 web scraping 模擬登入", correct: false },
        ],
        explanation:
          "直接收 Google 帳密違反 Google ToS、有極大資安風險（你的服務被攻破等於洩漏使用者所有 Google 資料），而且第三方密碼登入會被 Google 偵測為異常。OAuth 是 Google 官方授權方式：使用者自己在 Google 上同意、token 範圍限定（只給行事曆權限）、可隨時撤銷。",
        misconception: "永遠不要直接收使用者第三方平台密碼，沒有例外。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "「OAuth token 等同於登入」。對嗎？",
        options: [
          { id: "a", text: "對，有 token 就是登入", correct: false },
          { id: "b", text: "不一定，OAuth 是授權；身份驗證要用 OpenID Connect（OAuth 的擴展）", correct: true },
          { id: "c", text: "完全錯，OAuth 跟登入無關", correct: false },
        ],
        explanation:
          "OAuth 給你的是「授權做某事的 token」，不是「這是誰」的身份證明。同一個 access token 拿來呼叫 API 可以拿到 email，但 token 本身不告訴你「使用者是誰」。OpenID Connect 在 OAuth 上多加了 ID token（含使用者身份資訊），才是真正的「登入」協定。「用 Google 登入」實際上是 OAuth + OpenID Connect 組合。",
        misconception: "授權（你能做什麼）≠ 驗證（你是誰）。OAuth 只負責前者。",
      },
    ],
    furtherReading: [
      {
        title: "OAuth 2.0 Simplified (Aaron Parecki)",
        url: "https://www.oauth.com/",
        why: "免費全本，圖解 4 種 grant type 跟踩坑點",
      },
      {
        title: "oauth.net",
        url: "https://oauth.net/2/",
        why: "官方規格與實作清單，PKCE、refresh token 等細節都在這",
      },
    ],
  },
  {
    slug: "webhook-vs-polling",
    releaseDay: 2,
    level: 2,
    tracks: ["backend","frontend","ai"],
    prerequisites: ["http-basics"],
    assumedKnowledge: [],
    tag: "API 設計",
    title: "Webhook vs Polling",
    hook: "為什麼現代支付系統都「等通知」，不是自己一直問？",
    body: `你的服務需要知道「金流的狀態什麼時候從 pending 變 success」。傳統做法 polling：每幾秒去問一次「好了沒？好了沒？」。簡單但浪費——99% 的請求都是「還沒」，浪費頻寬、增加對方伺服器負擔。即時性也差，狀態變化和你發現之間總有延遲。

Webhook 反過來：你給對方一個 URL，狀態變了它主動 POST 通知你。瞬時、不浪費。代價是：你要有一個公開可被 callback 的 endpoint、要處理 webhook 失敗重試、要驗證來源真的是合法服務（簽章驗證）。Webhook 把「主動權」反轉了，但也把「網路可達性」的責任丟給接收端。`,
    analogy: {
      icon: "🔔",
      title: "叫號機 vs 一直問櫃台",
      text: "Polling：你在診所每 30 秒走到櫃台問「我好了嗎」。煩人。Webhook：拿一個叫號機，輪到你它震動。你可以去做別的事。",
    },
    analogyHint: "叫號機 vs 一直問說好了嗎",
    originStory: "\"Webhook\" 一詞 2007 年由 Jeff Lindsay 在 blog post 創造。Stripe（2011）、GitHub（2008）、Slack（2014）把 webhook 變成業界標準。在那之前，「IFTTT 級別的整合」要嘛靠 polling，要嘛靠專門的 message queue，沒有像 webhook 這種「一個 HTTP endpoint 就搞定」的機制。",
    example: {
      code: `// Express 收 Stripe webhook 的最簡版本
app.post("/webhook/stripe", (req, res) => {
  // 1. 必做：驗簽章，確認真的是 Stripe 發的
  const sig = req.headers["stripe-signature"];
  const event = stripe.webhooks.constructEvent(
    req.body, sig, process.env.STRIPE_WEBHOOK_SECRET
  );

  // 2. 處理事件（記得冪等，避免重複觸發）
  if (event.type === "checkout.session.completed") {
    fulfillOrder(event.data.object.id);
  }

  // 3. 200 給對方，否則 Stripe 會 retry
  res.json({ received: true });
});`,
      note: "沒驗簽章 = 任何人可以偽造 webhook 觸發訂單。沒做冪等 = 同一筆 webhook 重試會扣款兩次。兩個都常踩。",
    },
    tradeoffs: [
      { label: "✅ 適合 Webhook", text: "低頻但即時的事件（金流、CI 完成、訂閱變動）" },
      { label: "⚠️ 注意", text: "你的 endpoint 要可靠、要驗簽、要冪等處理（避免重複觸發）" },
      { label: "❌ 不適合 Webhook", text: "接收端在防火牆內無法被外部 callback、需要保證每筆都收到的場景" },
    ],
    oneLiner: "Polling 是一直敲門問「好了嗎」，Webhook 是叫號機——輪到你它震動。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "Webhook 和 polling 的方向相反，誰主動？",
        options: [
          { id: "a", text: "Polling：客戶端主動問；Webhook：伺服器主動推", correct: true },
          { id: "b", text: "都是客戶端主動", correct: false },
          { id: "c", text: "都是伺服器主動", correct: false },
        ],
        explanation:
          "Polling 的主動方是查詢方——A 服務每幾秒去問 B 服務「狀態有變嗎」。Webhook 倒過來——B 服務狀態變了，主動去 POST 給 A 服務預先註冊的 URL。所以 Webhook 又叫「reverse API」或「HTTP callback」。差別不是「誰先發 request」這種表面，而是「事件發生時誰負責讓另一方知道」。",
        misconception: "Webhook 沒有取代 API，是加上一個「事件通知通道」。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你做的服務要監測 Stripe 金流狀態。下面哪個做法正確？",
        options: [
          { id: "a", text: "每 5 秒呼叫 Stripe API 查詢所有訂單狀態", correct: false },
          { id: "b", text: "在 Stripe 註冊 webhook，狀態變動時讓 Stripe 推送給你", correct: true },
          { id: "c", text: "自己寫 cron job 每分鐘掃一次", correct: false },
        ],
        explanation:
          "Stripe（和大部分支付服務）都提供 webhook，這是官方建議做法。每 5 秒輪詢一個有幾百萬筆訂單的 API：浪費你的 quota、浪費 Stripe 的負載、即時性還比 webhook 差。Cron 1 分鐘輪詢稍好但仍然有最壞 60 秒延遲——對金流體驗不可接受。",
        misconception: "對方有提供 webhook 就用 webhook，自己 polling 是 anti-pattern。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "同事說「我們收 webhook 了，所以一定不會漏訊息」。對嗎？",
        options: [
          { id: "a", text: "對，webhook 比 polling 可靠", correct: false },
          { id: "b", text: "不對，webhook 可能因網路或你 endpoint 失敗而漏；通常要搭配 retry + reconciliation", correct: true },
          { id: "c", text: "Webhook 永遠不會漏", correct: false },
        ],
        explanation:
          "Webhook 是 push，但 push 不保證送達。對方伺服器發 POST 的瞬間你 endpoint 剛好掛了？這個事件就丟了。生產級實踐通常是「webhook 為主 + 定期對帳」：webhook 處理 99% 的即時更新，每天/每小時跑一次 reconciliation 從對方 API 拉一次完整狀態，補漏。Stripe 等服務也會 retry 失敗的 webhook，但你不能假設零漏失。",
        misconception: "Webhook 是「最佳努力傳送」，不是「保證送達」。生產系統需要對帳。",
      },
    ],
    furtherReading: [
      {
        title: "Stripe — Webhooks Documentation",
        url: "https://docs.stripe.com/webhooks",
        why: "業界 webhook 設計典範，看完就知道你自己寫的有沒有缺東西",
      },
      {
        title: "Webhooks: The Definitive Guide (svix)",
        url: "https://www.svix.com/resources/guides/webhook-architecture-design/",
        why: "深入失敗重試、簽章、冪等等所有踩坑",
      },
    ],
  },
  {
    slug: "vector-database",
    releaseDay: 18,
    level: 2,
    tracks: ["backend","ai"],
    prerequisites: ["embedding"],
    assumedKnowledge: ["相似度搜尋"],
    tag: "AI",
    title: "向量資料庫",
    hook: "為什麼 ChatGPT 能找到「跟某句話意思最像」的內容，傳統資料庫做不到？",
    body: `傳統資料庫的搜尋是「字面比對」。SELECT * WHERE content LIKE '%蘋果%' 只能找到字面有「蘋果」的，找不到「Apple」「水果」「紅紅圓圓的東西」。但語意上它們相關。

向量資料庫換個維度：把每段文字（或圖、聲音）用 AI 模型轉成一個高維座標（embedding，通常 1000+ 維），意思相近的座標就靠近。搜尋時把問句也轉成向量，找「歐式距離最近」的 N 個——這就是「語意搜尋」。它不能取代關聯式資料庫，是新加的一個維度。`,
    analogy: {
      icon: "📍",
      title: "座標距離 vs 關鍵字比對",
      text: "關鍵字（傳統 DB）：地址要一字不差才認得，「台北市信義區」跟「101 大樓」搜不到對方。座標（向量 DB）：每個地點轉成經緯度，問「離這個位置最近的 5 個地標」就找得到，不管它們叫什麼名字。",
    },
    analogyHint: "座標距離 vs 關鍵字比對",
    originStory: "向量搜尋（nearest neighbor）是電腦科學老問題，1970s 就有研究。突破點是 Facebook 2017 年 open source 的 FAISS（Facebook AI Similarity Search），讓「百萬級高維向量秒級搜尋」成為現實。2022-2023 年 LLM RAG 爆發，專門的向量資料庫（Pinecone、Weaviate、Chroma、Qdrant）如雨後春筍——因為光有 FAISS library 還不夠，還要 metadata 過濾、即時更新、多租戶等資料庫特性。",
    example: {
      code: `# 把產品描述向量化、搜「不會痛的牙刷」
from openai import OpenAI
client = OpenAI()

# 1. 把使用者問題向量化
q = client.embeddings.create(
    model="text-embedding-3-small",
    input="不會痛的牙刷"
).data[0].embedding

# 2. 在向量資料庫找最相近的 5 個產品
results = vector_db.query(vector=q, top_k=5)
# → 命中「敏感牙適用、軟毛、減壓刷柄」這類產品`,
      note: "「不會痛」與「敏感牙」字面完全沒交集，但向量空間中很近。這就是語意搜尋勝過 LIKE '%痛%' 的地方。",
    },
    tradeoffs: [
      { label: "✅ 適合", text: "語意搜尋、推薦系統、RAG 的檢索層、相似圖/影片找回" },
      { label: "⚠️ 注意", text: "向量是 embedding 模型生成的，模型差就全部都差；維度大時要用 HNSW、IVF 等近似演算法" },
      { label: "❌ 不適合", text: "精確比對、結構化查詢、事務一致性要求高的場景" },
    ],
    oneLiner: "向量資料庫存的是「語意指紋」，搜的是「最像的指紋」——不是字面比對。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "向量資料庫存的「向量」本質是？",
        options: [
          { id: "a", text: "資料的雜湊值（hash）", correct: false },
          { id: "b", text: "AI 模型把資料轉換成的高維數值座標", correct: true },
          { id: "c", text: "資料的二進位編碼", correct: false },
        ],
        explanation:
          "「向量」就是一串浮點數陣列，例如 [0.123, -0.456, 0.789, ...]，通常 768 維、1536 維、3072 維。它是 embedding 模型（如 OpenAI text-embedding-3、BGE、Sentence-BERT）對輸入內容生成的「語意座標」——同模型下，意思相近的內容向量也相近。雜湊或二進位編碼沒有「相近」概念，向量有「距離」。",
        misconception: "向量不是資料的壓縮或加密，是資料的「語意指紋」。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你要做產品內搜尋，使用者輸入「不會痛的牙刷」，要找到電動牙刷裡標榜「軟毛、敏感牙適用」的那些。傳統還是向量資料庫？",
        options: [
          { id: "a", text: "傳統 DB，用 LIKE '%敏感%'", correct: false },
          { id: "b", text: "向量資料庫，把產品描述和使用者查詢都向量化，找最相近的", correct: true },
          { id: "c", text: "Elasticsearch 全文檢索就夠了", correct: false },
        ],
        explanation:
          "「不會痛」和「敏感牙適用」字面完全不同，傳統 LIKE 找不到。Elasticsearch 全文檢索靠 token 重疊好一點但仍然抓不到語意。向量資料庫把兩段話都轉向量，AI 模型「知道」這兩個概念相近——找出產品的成功率最高。這正是 embedding-based search 興起的原因。實務上常常是 hybrid search：關鍵字 + 向量併用。",
        misconception: "字面搜尋 vs 語意搜尋是兩種思路，不是同一條軸上的好壞。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "「有了向量資料庫，就不需要 PostgreSQL/MySQL 了」。對嗎？",
        options: [
          { id: "a", text: "對，向量資料庫更先進", correct: false },
          { id: "b", text: "不對，兩者解決不同問題，通常並存", correct: true },
          { id: "c", text: "看資料量大小", correct: false },
        ],
        explanation:
          "向量資料庫擅長「最近鄰搜尋」，但不適合存訂單、使用者帳戶、交易紀錄——那需要 ACID、JOIN、聚合、事務一致性，這些是關聯式資料庫的領域。生產系統通常是：關聯式 DB 存「結構化狀態」，向量 DB 存「embedding 索引」（甚至 PostgreSQL 用 pgvector 擴展直接內建向量能力）。沒人會用向量 DB 存訂單。",
        misconception: "向量資料庫是新工具，不是舊工具的替代品。",
      },
    ],
    furtherReading: [
      {
        title: "Pinecone — Vector Databases",
        url: "https://www.pinecone.io/learn/vector-database/",
        why: "從 embedding 到 ANN 演算法（HNSW、IVF）的入門全圖",
      },
      {
        title: "pgvector — Postgres extension",
        url: "https://github.com/pgvector/pgvector",
        why: "不想引新工具？Postgres 直接加向量能力，多數場景夠用",
      },
    ],
  },
  {
    slug: "kubernetes",
    releaseDay: 15,
    level: 2,
    tracks: ["backend","devops","ai"],
    prerequisites: ["docker"],
    assumedKnowledge: [],
    tag: "工程",
    title: "Kubernetes 的核心價值",
    hook: "我都用 Docker 了，為什麼 5 個服務上線之後還是亂成一團？",
    body: `Docker 解決「應用怎麼打包」，但生產環境真正難的問題在後面：100 個容器要分配到 10 台機器哪台跑哪個？某個容器掛了誰負責重啟？流量暴增要自動加機器嗎？要更新版本又不停機怎麼搞？這些是「容器編排」（orchestration）的範疇，Docker 本身不管。

Kubernetes 就是一個 declarative 的編排引擎——你寫「我要 3 份這個服務、用某個 image、CPU 超過 70% 自動擴」，K8s 自己決定放哪、誰當備援、怎麼滾動更新。代價是它本身就是個分散式系統：control plane、etcd、networking、ingress、RBAC……要學要顧的東西非常多。小團隊只跑 1-2 個 monolith 用 K8s，是「請保鑣保護一隻倉鼠」。`,
    analogy: {
      icon: "🏭",
      title: "貨櫃 vs 工廠調度系統",
      text: "Docker 把貨打包進貨櫃。K8s 是整座工廠：哪條產線跑什麼貨、機器壞了自動切換、訂單變多開新產線、舊版下線時無縫切到新版。貨櫃讓「打包」標準化，調度系統讓「運作」標準化。",
    },
    analogyHint: "包裝工人 vs 工廠總調度",
    originStory: "K8s 來自 Google 內部 Borg 系統（2003 起運行，管 Google 全球資料中心）。2014 年 Google 把 Borg 的「公共版」開源為 Kubernetes，捐給新成立的 CNCF（Cloud Native Computing Foundation）。當時微服務興起、Docker 爆發，業界正缺答案。三大雲（AWS / GCP / Azure）都跟進 managed K8s 服務（EKS / GKE / AKS），變成現代雲原生標配。",
    example: {
      code: `# 最簡單的 Deployment：跑 3 份 nginx
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
spec:
  replicas: 3
  selector:
    matchLabels: { app: nginx }
  template:
    metadata:
      labels: { app: nginx }
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports: [{ containerPort: 80 }]`,
      note: "這 15 行就是 K8s 的精神——你「宣告」想要什麼狀態（我要 3 份 nginx），K8s 自己想辦法達到。某個 pod 掛了，它自動補一個。這就是 declarative orchestration。",
    },
    tradeoffs: [
      { label: "✅ 適合", text: "微服務 10+ 個、需要自動擴縮、跨環境一致部署、有 SRE 能維護" },
      { label: "⚠️ 注意", text: "K8s 自身是分散式系統；網路、儲存、權限、監控全套都要懂；學習曲線陡" },
      { label: "❌ 不適合", text: "1-3 個服務的小團隊、無 SRE、單體應用——用 PaaS（Vercel/Render/Fly.io）省心 10 倍" },
    ],
    oneLiner: "Docker 把「打包」標準化，K8s 把「運作」標準化。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "Kubernetes 在技術堆疊裡是什麼角色？",
        options: [
          { id: "a", text: "Docker 的進階版，取代 Docker", correct: false },
          { id: "b", text: "容器編排平台——管理多容器在多機器上的調度、擴縮、自我修復", correct: true },
          { id: "c", text: "一種雲端 PaaS 服務", correct: false },
        ],
        explanation:
          "K8s 不取代 Docker，是搭在容器之上的「調度層」。Docker 負責把應用變成可移植的容器，K8s 負責決定「這些容器要在哪些機器上跑、跑幾份、怎麼互通、誰掛了補誰」。它本身可以裝在任何雲（AWS/GCP/Azure）或自建機房，雲廠商提供的 EKS/GKE/AKS 是「託管的 K8s」，不是 K8s 本身。",
        misconception: "K8s 是 Docker 的「上一層」，不是替代品。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你 5 人團隊在做一個 Next.js + PostgreSQL 的 SaaS，1 個 service，要部署上線。要不要上 K8s？",
        options: [
          { id: "a", text: "要，這樣未來才好擴展", correct: false },
          { id: "b", text: "不用，PaaS（Vercel/Render/Fly.io）+ 託管 DB 才是務實選擇", correct: true },
          { id: "c", text: "上 K8s 才算現代化", correct: false },
        ],
        explanation:
          "K8s 的價值在「服務數量多、流量複雜、需要 SRE 級操作」。1 個 service 上 K8s = 多花 10 倍時間管基礎設施、零業務價值。PaaS 把 K8s 的好處（自動擴縮、版本切換、健康檢查）封裝起來給你 5% 複雜度。等服務真的長到 10+、團隊有人專責 infra 再考慮自管 K8s。「未來會用到」是過早優化的經典藉口。",
        misconception: "K8s 是工具不是身分認同——選複雜度匹配你的實際規模。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "「我們上了 K8s，所以不用擔心服務會掛」。對嗎？",
        options: [
          { id: "a", text: "對，K8s 會自動處理掛掉的容器", correct: false },
          { id: "b", text: "不對，K8s 只重啟容器；應用本身的 bug、DB 連線洩漏、資源沒設好 limit 都會反覆掛", correct: true },
          { id: "c", text: "完全錯，K8s 不管掛掉的事", correct: false },
        ],
        explanation:
          "K8s 確實會在容器 crash 時自動重啟（liveness probe），但這只是「症狀處理」。根本原因（記憶體洩漏、死鎖、外部依賴掛了）K8s 看不見。沒設 resource limits，一個 pod 吃光記憶體把整台機器拖垮；readiness probe 沒設好，流量打到還沒啟動完的 pod 就 502。K8s 給你「自我修復」的工具，但要你正確配置才有效——預設值常常是錯的。",
        misconception: "K8s 是平台不是保姆。錯誤配置 = 自動把火災規模化。",
      },
    ],
    furtherReading: [
      {
        title: "Kubernetes — Concepts",
        url: "https://kubernetes.io/docs/concepts/",
        why: "官方文件，Pod / Service / Deployment 三大概念先抓緊",
      },
      {
        title: "Kubernetes the Hard Way (Kelsey Hightower)",
        url: "https://github.com/kelsey-hightower/kubernetes-the-hard-way",
        why: "從零搭 K8s 集群，深入理解每個元件，作者本身也是 K8s 早期貢獻者",
      },
    ],
  },
  {
    slug: "grpc-vs-rest",
    releaseDay: 13,
    level: 2,
    tracks: ["backend","ai"],
    prerequisites: ["rest-vs-graphql"],
    assumedKnowledge: ["RPC 概念", "Protobuf"],
    tag: "API 設計",
    title: "gRPC vs REST",
    hook: "為什麼 Google、Netflix 內部服務間都用 gRPC，對外 API 卻還是 REST？",
    body: `REST 走 HTTP/1.1 + JSON：人類可讀、瀏覽器原生支援、curl 可以直接打、CDN 認得 HTTP method。代價是 verbose（每個欄位名重複傳）、序列化慢、schema 全靠文件約定（容易對不上）、雙向 streaming 彆扭（要 SSE 或 WebSocket）。

gRPC 走 HTTP/2 + Protocol Buffers：二進位 schema 強型別、序列化快好幾倍、原生雙向 streaming、code generation 自動生 client/server stub。代價是瀏覽器不能直接打（要 gRPC-Web 透過 proxy 轉換）、debugging 沒辦法 curl（要 grpcurl）、跨防火牆/Layer7 LB 比較麻煩。所以「內部高頻、強型別」用 gRPC，「對外開放、要相容性」用 REST——選哪個看「呼叫者是誰」。`,
    analogy: {
      icon: "📞",
      title: "公文 vs 內線電話",
      text: "REST 像寫公文：每次都附完整抬頭、署名、欄位說明，誰都看得懂但寫得久。gRPC 像公司內線電話：事先約好分機和暗號，講話直接快，但外人撥不進來、聽不懂。對外溝通走公文，內部協作打電話。",
    },
    analogyHint: "公文 vs 內線電話",
    originStory: "gRPC 2015 年 Google 開源，前身是 Google 內部的 Stubby 系統（2001 起）。Google 內部有上萬個微服務互打 RPC，REST + JSON 太慢、schema 對不上、雙向 streaming 卡。所以 gRPC = HTTP/2 + Protocol Buffers + 自動產 client/server stub。Netflix、Square、Cloudflare 內部都用 gRPC，但對外 API 仍 REST——這是有意識的取捨。",
    example: {
      code: `// .proto 檔：schema 一份兩邊用
service UserService {
  rpc GetUser(UserRequest) returns (User);
}

message UserRequest {
  string id = 1;
}

message User {
  string id = 1;
  string name = 2;
  int32 age = 3;
}`,
      note: "這份 .proto 同時生成 Go server stub、TS client stub、Python client...所有語言用同一個 schema。對比 REST 要寫 OpenAPI、寫 doc、各端自驗——至少省 80% 的「對齊」工作。",
    },
    tradeoffs: [
      { label: "✅ 適合 gRPC", text: "微服務間高頻通訊、需要強 schema、雙向 streaming、效能敏感" },
      { label: "⚠️ 注意", text: "瀏覽器要 gRPC-Web proxy；debugging 工具鏈比 REST 弱；protobuf 學習成本" },
      { label: "❌ 不適合 gRPC", text: "公開 API、需要瀏覽器直連、簡單 CRUD、團隊對 protobuf 不熟" },
    ],
    oneLiner: "公司內部用內線電話（gRPC），對外用公文（REST）——場景不同。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "gRPC 預設用什麼序列化資料？",
        options: [
          { id: "a", text: "JSON，跟 REST 一樣只是傳輸協定不同", correct: false },
          { id: "b", text: "Protocol Buffers（protobuf），二進位、強型別 schema", correct: true },
          { id: "c", text: "XML", correct: false },
        ],
        explanation:
          "gRPC = HTTP/2 + protobuf。Protobuf 用 .proto 檔定義 schema，編譯後產出各語言的 client/server stub。傳輸時是二進位（不是 JSON 文字），所以體積小、parsing 快、欄位順序由 schema 保證。「強型別 schema」是 gRPC 比 REST 多出來的核心優勢——對方傳錯欄位編譯期就知道，不用等 production 才爆。",
        misconception: "gRPC 不只是「快版 REST」，是 schema-first 的完全不同典範。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你在做一個有 30 個微服務的後端系統，互相打 API 一秒幾千次。選 REST 還是 gRPC？",
        options: [
          { id: "a", text: "REST，工具鏈成熟", correct: false },
          { id: "b", text: "gRPC，內部服務間追求效能與型別安全", correct: true },
          { id: "c", text: "GraphQL，前端後端統一", correct: false },
        ],
        explanation:
          "30 個微服務內部打 API：每秒幾千次請求 × JSON parsing 開銷 × HTTP/1.1 連線管理 = 真的會看到效能差距。gRPC 的 binary serialization + HTTP/2 multiplexing + 自動 code gen 是為這種場景設計的。GraphQL 解決前端「我要什麼欄位」的問題，但內部服務間欄位需求穩定，反而 schema-first 的 gRPC 更適合。對外 API 再開一層 REST/GraphQL Gateway 即可。",
        misconception: "「內部 API」和「對外 API」可以選不同協定，不必統一。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "「gRPC 比 REST 快很多，所以對外 API 也該換成 gRPC」。對嗎？",
        options: [
          { id: "a", text: "對，效能優先永遠是對的", correct: false },
          { id: "b", text: "不對，對外 API 的瓶頸是「呼叫者能不能用」，不是序列化速度", correct: true },
          { id: "c", text: "看雲廠商支援度", correct: false },
        ],
        explanation:
          "對外 API 的價值在「廣泛相容」。瀏覽器不能直接打 gRPC（要 gRPC-Web 加 proxy）、第三方開發者要學 protobuf、debug 不能用 curl/Postman——這些是真實成本，遠大於序列化省下的幾毫秒。Google/Netflix 內部用 gRPC，但對外開放的 API（YouTube Data API、Netflix Open Connect）依然 REST，原因就是「使用者體驗 > 效能微優化」。技術選型要考慮「誰用」，不只是「跑多快」。",
        misconception: "效能不是決策的唯一變數，「誰會呼叫」常常更重要。",
      },
    ],
    furtherReading: [
      {
        title: "grpc.io — Introduction",
        url: "https://grpc.io/docs/what-is-grpc/introduction/",
        why: "官方，從 Quick Start 到 advanced（streaming, deadlines, interceptors）",
      },
      {
        title: "gRPC vs REST: 6 比較面向",
        url: "https://www.wallarm.com/what/the-concept-of-grpc",
        why: "系統性比較兩者在效能、語言、debug、CDN 等面向的差異",
      },
    ],
  },
  {
    slug: "eventual-consistency",
    releaseDay: 27,
    level: 3,
    tracks: ["backend","devops"],
    prerequisites: [],
    assumedKnowledge: ["分散式系統概念", "資料複製 / replication"],
    tag: "分散式系統",
    title: "Eventual Consistency",
    hook: "為什麼你 IG 發完文朋友 30 秒才看到，但 ATM 提款餘額卻是即時的？",
    body: `分散式資料庫有個沒法繞過的限制叫 CAP 定理：Consistency（每個節點看到一致最新值）、Availability（節點總是能讀寫）、Partition tolerance（節點之間斷線仍能運作）三個只能選兩個。網路分割（partition）是物理現實，不選就是不能跨機房，所以實務上 P 必選——剩下 C 和 A 你只能挑一個。

選 C（強一致性）：銀行系統。網路斷時寧可拒絕交易（你沒法跨行轉帳），也不允許餘額對不上。選 A（高可用）：社群網站、CDN、購物車。網路斷時各節點繼續寫，「最終」會收斂——這就是 eventual consistency。代價是同一時間不同人看到不同狀態（朋友剛發的文你刷新好幾次才出來）。沒對錯，看你能容忍哪種失敗：金融容忍不了「餘額不一致」，社群容忍不了「服務全掛」。`,
    analogy: {
      icon: "📨",
      title: "銀行轉帳 vs LINE 已讀",
      text: "銀行跨行轉帳：兩邊餘額必須同步減加，網路有問題寧可中止，否則錢憑空多/少。LINE 已讀：你看到「已讀」可能對方手機還沒同步，但 30 秒後會收斂，沒人會因此打官司。場景決定能不能接受短暫不一致。",
    },
    analogyHint: "銀行轉帳 vs LINE 已讀",
    originStory: "CAP 定理 2000 年由 Eric Brewer 在 PODC conference 提出（當時是 conjecture），2002 年 Gilbert & Lynch 形式證明。但讓 eventual consistency 從學術跳到主流的是 Amazon 2007 年〈Dynamo: Amazon's Highly Available Key-Value Store〉論文——它直接觸發了 Cassandra（2008, Facebook）、DynamoDB（2012, AWS）、Riak 等一整代分散式資料庫。CAP 三選二講了 25 年，但「實務上的 PACELC」現在更常用——多了一層「沒 Partition 時還要選 Latency 還是 Consistency」。",
    tradeoffs: [
      { label: "✅ 適合 EC", text: "社群動態、按讚數、CDN、DNS、購物車、推薦系統——容忍秒級不一致" },
      { label: "⚠️ 注意", text: "衝突解決邏輯複雜（last-write-wins 不總是對；用 CRDT 或 vector clock 取捨）" },
      { label: "❌ 不適合 EC", text: "金融餘額、庫存扣減、唯一性檢查、ID 生成——必須強一致" },
    ],
    oneLiner: "沒有完美——你只能選「斷線時拒絕服務」還是「斷線時允許不一致」。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "CAP 定理在說什麼？",
        options: [
          { id: "a", text: "分散式系統可以同時達成一致性、可用性、分割容忍", correct: false },
          { id: "b", text: "分割發生時，只能在「強一致」與「高可用」之間二選一", correct: true },
          { id: "c", text: "SQL 資料庫永遠是 CAP 全有", correct: false },
        ],
        explanation:
          "CAP 講的不是「平時三選二」，而是「網路 partition 發生時，只能選 C 或 A」。沒 partition 時兩個都能要。Partition 是分散式系統的物理現實（網路一定會斷），所以 P 必選，剩下的選擇是「斷線時要拒絕請求保一致（CP）還是繼續服務允許不一致（AP）」。CAP 不是「SQL 全都 CP、NoSQL 全都 AP」這種粗暴二分——同一個系統不同 endpoint 可以做不同選擇。",
        misconception: "CAP 是「partition 時的取捨」，不是「常態三選二」。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你要做全球性社群網站的「按讚數」。要選哪種一致性？",
        options: [
          { id: "a", text: "強一致，每次都顯示最精確數字", correct: false },
          { id: "b", text: "Eventual consistency，可以容忍跨區短暫不一致", correct: true },
          { id: "c", text: "完全不允許分散式，只用一台主機", correct: false },
        ],
        explanation:
          "全球按讚每秒幾萬次寫入。強一致要求每次寫入都全球節點同步確認——延遲爆炸、只要一個節點掛全系統不能寫讚。實務做法是 eventual consistency：每個區域節點各自累加，背景非同步合併。使用者看到「24,891 讚」vs「24,889 讚」差兩個沒人在意——可用性（按讚當下立刻有反應）比精確性更重要。Twitter/IG/FB 全是這樣做。",
        misconception: "「精確」不總是必要的——使用者體驗常常更重視「即時」。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "「Eventual consistency 就是『資料會錯』，所以絕對不能用在重要系統」。對嗎？",
        options: [
          { id: "a", text: "對，重要系統都該強一致", correct: false },
          { id: "b", text: "不對，EC 是「最終會對」不是「會錯」；很多核心系統（DNS、Git、購物車）都靠 EC", correct: true },
          { id: "c", text: "看廠商實作", correct: false },
        ],
        explanation:
          "Eventual consistency 不等於 inconsistency。它保證「沒新寫入後一段時間內所有節點會收斂到同一值」。DNS 是 EC（你改 DNS 全球幾小時收斂），Git 是 EC（每個 clone 都是當下快照），Amazon 購物車是 EC——這些都是核心、重要、賺錢的系統。重點是「設計時知道一致性窗口有多長、衝突怎麼解」。盲目追求強一致會讓系統在 partition 時整個不可用，那才是真的不重要。",
        misconception: "強一致 ≠ 重要系統的標配；EC 是有意識的設計選擇。",
      },
    ],
    furtherReading: [
      {
        title: "Dynamo: Amazon's Highly Available Key-Value Store (2007 paper)",
        url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
        why: "業界經典，看完整個 NoSQL 浪潮的起源都懂",
      },
      {
        title: "Designing Data-Intensive Applications (Martin Kleppmann)",
        url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/",
        why: "分散式系統聖經，Ch. 5 Replication 與 Ch. 9 Consistency 必讀",
      },
    ],
  },
  {
    slug: "cache-strategies",
    releaseDay: 10,
    level: 2,
    tracks: ["backend","frontend","devops","ai"],
    prerequisites: ["cdn"],
    assumedKnowledge: [],
    tag: "效能",
    title: "Cache 策略",
    hook: "同樣是用 Redis 當 cache，為什麼有的團隊省了一堆 DB 流量，有的卻常常出 stale data？",
    body: `「加 cache」不是單一動作，背後有四種主流策略，每種一致性、複雜度、效能特性都不同。Cache-aside（最常見）：應用先查 cache，沒中再查 DB 並寫回 cache——彈性高、應用要自己管，缺點是第一次永遠 miss、cache 和 DB 短暫可能不一致。Read-through / Write-through：應用只跟 cache 講話，cache 自己當 DB 的代理層——一致性好但 cache 層複雜。Write-behind：寫先進 cache，背景非同步寫 DB——寫入超快，但 cache 掛掉資料會掉。

選錯策略不是「沒效果」，是「資料對不上」。寫入頻繁 + 用 cache-aside 沒設好失效，使用者會看到舊資料；讀少寫多用 write-through 反而拖慢寫入；用 write-behind 卻不能容忍掉資料，金流就出大事。每種策略各有適用場景，「加了 Redis」只是第一步，怎麼加才是工程。`,
    analogy: {
      icon: "📚",
      title: "圖書館預借系統",
      text: "Cache-aside：你自己決定「先查櫃台有沒有書，沒有再去庫房拿」。Write-through：你要還書直接給管理員，他保證同時更新櫃台和庫房。Write-behind：櫃台先收書登記，庫房資料晚點再對——快但偶爾資料對不上。",
    },
    analogyHint: "圖書館預借 vs 直接借閱",
    originStory: "Cache 概念是電腦科學最古老的話題之一，Belady 1966 年論文〈A study of replacement algorithms for a virtual-storage computer〉（出名的「Belady's anomaly」就在裡面）。但「分散式 cache」要等到 Memcached 2003（LiveJournal 寫的）與 Redis 2009（Salvatore Sanfilippo）才走進主流 web stack。Phil Karlton 名言:「電腦科學只有兩件難事:cache invalidation 跟命名」——30 年沒過時。",
    example: {
      code: `// Cache-aside（最常見的模式）
async function getUser(id) {
  // 1. 先查 cache
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  // 2. miss → 查 DB
  const user = await db.users.findById(id);

  // 3. 寫回 cache，5 分鐘後過期
  await redis.set(
    \`user:\${id}\`, JSON.stringify(user), "EX", 300
  );
  return user;
}`,
      note: "失效邏輯散在應用各處（每個 update user 的地方都要 redis.del），容易漏。Read-through 把這層藏進 cache 層，但需要更聰明的 cache（不只 KV store）。",
    },
    tradeoffs: [
      { label: "✅ 適合 cache-aside", text: "通用 read-heavy 場景；應用想完全控制 cache 邏輯" },
      { label: "⚠️ 注意", text: "Cache invalidation 是兩大難題之一；TTL 太長會 stale，太短就失去 cache 意義" },
      { label: "❌ 不適合", text: "強一致需求（金融餘額）、寫遠多於讀、資料隨時都不同（個人化計算結果）" },
    ],
    oneLiner: "Cache 不是萬能加速器——命中率太低反而比沒 cache 還慢。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "Cache-aside 模式的核心特徵是？",
        options: [
          { id: "a", text: "Cache 自動同步 DB，應用不用管", correct: false },
          { id: "b", text: "應用主動管理：查 cache → 沒中查 DB → 寫回 cache", correct: true },
          { id: "c", text: "一種特殊的資料庫", correct: false },
        ],
        explanation:
          "Cache-aside（也叫 lazy-loading）是最常見的策略：應用程式碼自己決定何時讀 cache、何時 fallback 到 DB、何時更新或失效 cache。優點是彈性極高、cache 層只要一個 KV store（Redis/Memcached）即可。缺點是 cache 失效邏輯散在應用各處，容易出錯。Read-through / Write-through 把這層邏輯封裝在 cache 層，但需要 cache 真的能「主動拉 DB」（不是純 KV store）。",
        misconception: "大多數人說「加 cache」其實意思是 cache-aside，但業界有四種策略。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你的服務寫入超頻繁、讀取也多，但短暫資料不一致可以接受。最適合？",
        options: [
          { id: "a", text: "Cache-aside + 短 TTL", correct: false },
          { id: "b", text: "Write-behind：寫先進 cache，背景非同步寫 DB", correct: true },
          { id: "c", text: "完全不用 cache", correct: false },
        ],
        explanation:
          "Write-behind 的優勢就是「寫入只等 cache 的速度，DB 寫入背景慢慢做」。Twitter 早期 timeline、計數器類場景（按讚數、瀏覽數）常用這招——寫超快、讀也快、偶爾掉幾個讚使用者不會發現。代價是 cache 服務掛掉時，那批還沒寫到 DB 的資料就掉了。所以不能用在金流、訂單。可容忍丟資料 + 高吞吐 = write-behind。",
        misconception: "Cache 策略要看「能不能掉資料」和「讀寫比」一起決定。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "「加了 cache 一定變快」。對嗎？",
        options: [
          { id: "a", text: "對，cache 永遠加快", correct: false },
          { id: "b", text: "不對，命中率太低時，多查一次 cache 反而比直接打 DB 慢", correct: true },
          { id: "c", text: "看 cache 大小", correct: false },
        ],
        explanation:
          "Cache 的價值來自「命中率」。10% 命中率時，90% 的請求是「先查 cache（多花 1ms）→ miss → 再查 DB」——比直接打 DB 還慢。Cache 適合熱點資料（80/20 分佈），不適合「每個 user 都不一樣」的長尾資料。設 cache 前要先問：「我的查詢 pattern 真的有重複嗎？」沒重複的查詢 cache 純粹是負擔。Cache 不是萬靈丹，是針對「熱點資料」的優化。",
        misconception: "Cache 命中率 < 50% 通常代表「不該 cache」而非「該換 cache 廠商」。",
      },
    ],
    furtherReading: [
      {
        title: "Redis — Caching Patterns",
        url: "https://redis.io/learn/howtos/solutions/microservices/caching",
        why: "4 種模式詳解 + code 範例，含 TTL、stampede 等實務題",
      },
      {
        title: "Caching at scale with Redis",
        url: "https://stackoverflow.blog/2022/04/06/why-do-we-cache/",
        why: "Stack Overflow case study，看真實高流量怎麼用",
      },
    ],
  },
  {
    slug: "rate-limiting",
    releaseDay: 8,
    level: 2,
    tracks: ["backend","devops","ai"],
    prerequisites: ["http-basics"],
    assumedKnowledge: [],
    tag: "安全",
    title: "Rate Limiting",
    hook: "為什麼你打 OpenAI API 一不小心就會收到 429 錯誤，但有時又能短時間連發好幾發？",
    body: `沒有 rate limit 的 API 等於開門讓人 DDoS 你、或讓自家昂貴下游服務（OpenAI、付費 API）帳單一夜爆衝。但「一秒最多幾次」實作起來有幾種主流演算法，行為差很多。Token bucket：每秒倒入 N 個 token 進桶子，每次請求扣一個，桶滿了會溢出——所以平均守住 N/s，但允許短時 burst（桶有存量時）。Leaky bucket：請求進入定速漏出的桶子，超過上限直接溢出丟棄——流量被「平滑化」，沒有 burst。Sliding window：精確記錄過去 N 秒內每筆請求，最準但耗記憶體。

選 token bucket：大多數 web API（OpenAI 就是），允許突發很重要。選 leaky bucket：要保護下游脆弱服務時。選 sliding window：高安全要求、計費精確場景。實作位置也是學問：放在 nginx/API Gateway 是「邊界防護」，放在 Redis 是「跨實例同步」，放在應用層是「業務邏輯級」——多 instance 沒共享計數會放大 N 倍。`,
    analogy: {
      icon: "🚦",
      title: "ETC 收費站 vs 銀行叫號",
      text: "Token bucket 像 ETC：閘道有預發的點數，車流密集時還能連續通過；點數用完才開始等。Leaky bucket 像銀行叫號：不管你來多急，櫃台一個一個慢慢叫，超過大廳容量就請你下次再來。",
    },
    analogyHint: "ETC 收費站 vs 銀行叫號",
    originStory: "Token bucket 演算法 1990 年代被 Cisco 用在路由器上控制網路流量（traffic shaping）。Twitter API（2008）、GitHub API（2012）把它從網路層帶到應用層，變成 API rate limit 的事實標準。今天 OpenAI、Stripe、AWS API Gateway 全用 token bucket 變體——因為它同時支援「平均速率」和「短時 burst」這兩個矛盾需求。",
    example: {
      code: `// 用 Redis 做分散式 token bucket（簡化版 pseudo-code）
async function consume(userId) {
  const key = \`rl:\${userId}\`;
  const now = Date.now() / 1000;
  // 拿目前 token 數與上次 refill 時間
  const [tokens, lastRefill] = await redis.hmget(key, 't', 'r');
  const elapsed = now - (lastRefill ?? now);
  // 補滿 token：每秒 +5 個，上限 100
  const newTokens = Math.min(100, (tokens ?? 100) + elapsed * 5);
  if (newTokens < 1) return false; // rate limited
  await redis.hmset(key, 't', newTokens - 1, 'r', now);
  return true;
}`,
      note: "多實例情境必須用 Redis 等中心化儲存——每台 nginx 各自 in-memory 計數的話，N 台機器 = 限額放大 N 倍。攻擊者連到不同實例就突破了。",
    },
    tradeoffs: [
      { label: "✅ 適合 token bucket", text: "Web API、允許突發流量、保護自家容量（OpenAI、Twitter API、GitHub API）" },
      { label: "⚠️ 注意", text: "多實例部署要用 Redis 集中計數，否則 N 個 server 各算各的，實際限額放大 N 倍" },
      { label: "❌ 不適合 token bucket", text: "下游極脆弱完全不能 burst（用 leaky bucket）；計費精確到秒（用 sliding window）" },
    ],
    oneLiner: "Rate limit 是 API 的免疫系統——別人保護的是他自己，不是你。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "Token bucket 演算法的核心特性是？",
        options: [
          { id: "a", text: "完全平滑流量，每秒嚴格固定 N 個請求", correct: false },
          { id: "b", text: "平均守住 N/s，但桶有存量時允許短時 burst", correct: true },
          { id: "c", text: "把所有請求排成一個 queue", correct: false },
        ],
        explanation:
          "Token bucket 的關鍵是「桶子可以累積」。固定速率倒入 token，請求要扣 token 才能通過。空桶時退化成精確限速；桶滿時可以瞬間放行整桶（burst）。這個特性對 web API 很重要——使用者突然連點 5 次按鈕應該被允許（不是體驗很差），但平均速率守住即可。Leaky bucket 才是「嚴格平滑」，請求進來一個就漏一個，沒有累積概念。",
        misconception: "Token bucket 允許 burst 是 feature 不是 bug，是它常被選用的原因。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你後端會打 OpenAI API（一次幾分錢），怕被惡意使用者刷帳單。最務實的做法？",
        options: [
          { id: "a", text: "靠 OpenAI 自己有 rate limit 就好", correct: false },
          { id: "b", text: "在自家 API gateway 加每使用者 rate limit + 每日 quota", correct: true },
          { id: "c", text: "完全擋掉所有自動化請求", correct: false },
        ],
        explanation:
          "OpenAI 的 rate limit 是保護它自己，不是保護你的帳單——一個惡意使用者刷你 100 萬次都在你的 quota 內，每次 0.05 美元 = 5 萬美元。要在你自己這層加：每使用者每分鐘最多 N 次（防爬）、每天最多 M 次（防刷帳單）、超量 alert 通知你。這是「縱深防禦」——別人的限制只是備援，自己的限制才是主防線。完全擋自動化請求會誤殺正常使用者（mobile app、SPA 重試）。",
        misconception: "上游的 rate limit 不能取代你自己的——上游保護自己，不是保護你。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "「我已經在 nginx 設了每秒 100 次的 rate limit，後端就安全了」。對嗎？",
        options: [
          { id: "a", text: "對，nginx 是邊界，擋住就好", correct: false },
          { id: "b", text: "不對，多台 nginx 各自計數的話，實際限額會放大 N 倍", correct: true },
          { id: "c", text: "完全錯，nginx 不能做 rate limit", correct: false },
        ],
        explanation:
          "Rate limit 的計數器在哪裡決定一切。每台 nginx 自己用 in-memory counter，5 台 nginx 就是 5 × 100 = 500/秒實際通過——攻擊者連到不同實例就突破了。要嘛用 nginx 共享記憶體（單機）、要嘛用 Redis 做集中計數（多機標準做法）、要嘛靠前面的 LB 做。這個「多實例 counter 同步」問題是 rate limiting 在生產環境最常踩到的坑。寫了不等於有效。",
        misconception: "分散式系統的計數器需要中心化儲存，本地計數會被攻擊者繞開。",
      },
    ],
    furtherReading: [
      {
        title: "Stripe — Scaling your API with rate limiters",
        url: "https://stripe.com/blog/rate-limiters",
        why: "業界範本，Stripe 怎麼設計多層 rate limit（token bucket + load shedder）",
      },
      {
        title: "System Design — Rate Limiting algorithms",
        url: "https://en.wikipedia.org/wiki/Token_bucket",
        why: "4 種演算法（token bucket / leaky bucket / fixed window / sliding window）數學定義",
      },
    ],
  },
  {
    slug: "closure",
    releaseDay: 0,
    level: 1,
    tracks: ["backend","frontend","ai"],
    prerequisites: [],
    assumedKnowledge: [],
    tag: "程式設計",
    title: "Closure（閉包）",
    hook: "setTimeout 裡用外面的變數，為什麼那個變數還「記得」？",
    body: `你寫過這樣的 code：函式裡面用了一個 outer scope 的變數，過了好久 callback 才執行——那個變數還是讀得到。理論上 outer 函式早就跑完、stack frame 該被清掉，怎麼還活著？這就是 closure：函式不只是程式碼，它「綁住」了出生時可以看到的變數環境。

語言層面 closure 是「函式 + 詞法環境（lexical environment）」這對組合：JS engine 在你建立函式時，把它能看到的整個 scope chain 釘在這個函式物件上。所以那些變數不會被 GC，跟著函式一起活。代價是：你以為一個小 callback 沒什麼，但它可能 hold 住整個外層的 scope（含大物件、DOM 引用），是 React effect / setInterval / cache 裡常見的記憶體洩漏與「stale closure」根因。`,
    analogy: {
      icon: "🎫",
      title: "員工辭職但 ID 卡還能進公司",
      text: "函式像員工，定義它的那個函式像公司。員工離職後拿回家的 ID 卡（closure）還能刷開門禁——系統不知道他不在了，卡片一直有效。所以變數也跟著被「ID 卡」hold 住，不被釋放。",
    },
    analogyHint: "員工辭職但 ID 卡還能用",
    originStory:
      "Closure 不是 JS 發明的——1960 年代 Lisp 與 Scheme 就有了。JS 之所以把它變成全民日常工具，是 1995 年 Brendan Eich 在 10 天內設計 JS 時，直接把 Scheme 的 closure 模型搬進來，又剛好遇上瀏覽器的 callback 風潮（事件、setTimeout、AJAX）。沒有 closure，所有非同步 code 都得手動把 context 透過參數一路往下傳——你每天用的東西，背後是 35 年前的 paper。",
    example: {
      code: `function makeCounter() {
  let n = 0;
  return () => ++n;
}

const a = makeCounter();
const b = makeCounter();
a(); // 1
a(); // 2
b(); // 1  ← b 有自己的 n，不共享`,
      note: "兩個 a()、b() 各自記住自己的 n —— 這就是「函式記得自己的環境」最直接的例子。每次呼叫 makeCounter() 都建立新的 lexical environment，回傳的 closure 把它釘住。",
    },
    tradeoffs: [
      { label: "✅ 適合", text: "封裝私有狀態（不用 class 也能模擬）、callback 帶上下文、function factory" },
      { label: "⚠️ 注意", text: "Closure 會 hold 住整個 outer scope 的綁定；React effect / setInterval / cache 內常踩 stale closure 與 memory leak" },
      { label: "❌ 不適合", text: "高效能熱迴圈內每輪建立新 closure（allocation 成本不為零）" },
    ],
    oneLiner:
      "函式不只是程式碼，還包著它出生時的環境；就算離開那個環境，它還記得。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "下面哪個說法最準確描述 closure？",
        options: [
          { id: "a", text: "一種記憶體最佳化技巧", correct: false },
          { id: "b", text: "函式加上它定義時所在的變數環境", correct: true },
          { id: "c", text: "JavaScript 獨有的特性", correct: false },
        ],
        explanation:
          "Closure = 函式 + 它定義時能看到的變數環境（lexical environment）。不是優化也不是 JS 獨有——Lisp 1960 年代就有，多數現代語言（Python、Ruby、Swift、Rust、Kotlin）都支援。把它當成 JS 特有，會錯失它在函式式程式設計中的核心地位。",
        misconception: "Closure 是函式式語言的基本工具，不是 JS 的「酷功能」。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "React 裡寫 useEffect(() => setInterval(() => console.log(count), 1000), [])，count 一直印初始值。為什麼？",
        options: [
          { id: "a", text: "setInterval 在 React 裡壞了", correct: false },
          {
            id: "b",
            text: "closure 抓到的是 effect 那次執行時的 count，之後 state 更新不會反映進這個函式",
            correct: true,
          },
          { id: "c", text: "React 不允許在 effect 裡用 setInterval", correct: false },
        ],
        explanation:
          "useEffect 的 callback 第一次 run 時建立 closure，當時的 count 是初始值；後續 count 更新只是「新的 React render」拿到新值，但 interval 裡那個函式還是 hold 住第一次執行時的 closure。修法：deps 改成 [count]（每次重設 interval）、或用 ref / functional setState 拿最新值。",
        misconception:
          "「我看到 count 變了」≠「我寫的 closure 也看到 count 變了」——closure 記的是它建立當下的 scope。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "同事說「closure 會 copy 變數進去，所以 outer 變了 closure 內看到的不會跟著變」。對嗎？",
        options: [
          { id: "a", text: "正確，closure 是 by-value 複製", correct: false },
          {
            id: "b",
            text: "不對，closure 抓的是「對變數的參照」，outer 改了 closure 內也會看到新值",
            correct: true,
          },
          { id: "c", text: "看是 const 還是 let", correct: false },
        ],
        explanation:
          "Closure 不複製值，它「綁住變數本身」。所以 outer 改了 let 變數，closure 內讀到的會是新值。但這跟上一題不衝突——上一題的關鍵不是 by-value 還是 by-ref，而是「effect 那次執行建立的 closure」與「下一次 render 中的 count 變數」是不同綁定。一個 closure 永遠看到自己 scope 的新值；不同 closure 看不見彼此的 scope。",
        misconception:
          "Closure 的記憶機制是「綁住變數綁定」不是「拍一個值的快照」；但每次函式執行都會建立新的綁定。",
      },
    ],
    furtherReading: [
      {
        title: "MDN — Closures",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
        why: "範例完整、官方權威，含 IIFE 與 module pattern 等實務案例",
      },
      {
        title: "You Don't Know JS — Scope & Closures (Kyle Simpson)",
        url: "https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-%26-closures",
        why: "免費全本、深入 lexical vs dynamic scope，看完就完全沒疑問",
      },
    ],
  },
  {
    slug: "mutability-vs-immutability",
    releaseDay: 20,
    level: 2,
    tracks: ["frontend","backend"],
    prerequisites: ["memory-model"],
    assumedKnowledge: ["Reference vs value"],
    tag: "程式設計",
    title: "Mutability vs Immutability",
    hook: "React state 為什麼不能直接 array.push，一定要用 setState？",
    body: `你寫 React 時，最常犯的錯之一：拿到一個 state array，直接 push 一個元素進去，結果畫面沒更新。不是 bug，是設計——React 靠「這個 reference 有沒有換」來決定要不要重新 render。你改了裡面的值但 reference 沒換，React 根本不知道你動過它。

Immutability 的核心概念不是「不能改資料」，而是「要改，就建立一份新的」。不改原本那份——你 spread 一個新陣列，回傳新的物件，讓原本那份留著當歷史紀錄。這樣才能做時光回溯（undo）、才能高效 diff、才能避免一堆「我改了這個但那邊怎麼也跑掉了」的神奇 bug。代價是每次操作都多一次記憶體 allocation，資料量大時要搭配 structural sharing（Immer 背後就是這個）才不爆。`,
    analogy: {
      icon: "📄",
      title: "影印一份再改 vs 直接改原稿",
      text: "Mutable 像直接在原稿上塗改——快，但改完沒有「上一版」了，旁邊拿同一份文件的人也會被你影響。Immutable 像影印一份再在新稿上改——多花一秒，但原稿永遠在，任何人任何時間都能對照舊版。",
    },
    analogyHint: "影印一份再改 vs 直接改原稿",
    originStory:
      "Immutability 的學術根源是 1950-60 年代的函式式語言（Lisp、Haskell），但在主流程式圈沉寂很久。2013 年 React 推出後，把「不要直接改 state」變成日常守則；2015 年 Redux 更把 immutable reducer 推成標準模式。同年 Facebook 釋出 Immutable.js，提供 persistent data structure，讓 JS 也能「改了卻不需要複製整個 array」。現代工具 Immer 用 Proxy 讓你寫起來像 mutable，背後自動幫你建新的 immutable 版本——最終演化成「你不需要寫 spread，但不可變的規則還是要遵守」。",
    example: {
      code: `// ❌ Mutable：直接改，React 不知道你動了
const arr = state.items;
arr.push(newItem);
setState(arr); // 同一個 reference，沒效

// ✅ Immutable：建新陣列，reference 換了
setState([...state.items, newItem]);

// ✅ Immer：寫起來像 mutable，實際不可變
setState(produce(state, draft => {
  draft.items.push(newItem); // 安全
}));`,
      note: "三種寫法都能加元素；差別在 React 有沒有感知到「你改了」。spread 和 produce 都會建立新 reference，React 才會 re-render。",
    },
    tradeoffs: [
      { label: "✅ 適合", text: "React / Redux state、需要 undo/redo、跨多處共享的資料結構" },
      { label: "⚠️ 注意", text: "每次操作都建新物件，資料量大時要用 structural sharing（Immer / Immutable.js）而不是暴力 spread" },
      { label: "❌ 不適合", text: "純演算法的熱迴圈（如 in-place sort）、大量數值計算——這裡 mutable 就是對的選擇" },
    ],
    oneLiner:
      "要改 state，就建一份新的——不改原本那份，讓 React 看見「reference 換了」才知道要 re-render。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "React 為什麼檢測到 state 沒變就不 re-render？",
        options: [
          { id: "a", text: "因為 React 會深度比對每個 property 的值", correct: false },
          { id: "b", text: "因為 React 只比較 object reference（===），reference 沒換就視為沒變", correct: true },
          { id: "c", text: "因為 React 有 dirty flag 系統追蹤哪些欄位被改", correct: false },
        ],
        explanation:
          "React 的 state 比較是 shallow equality（Object.is / ===）——它只看「你給我的這個物件跟上次是不是同一個」。深度比對每個 property 太貴，1000 個 component 同時比的話 UI 會卡死。所以才需要 immutability：你 spread 一個新陣列，reference 換了，React 就知道要 re-render。",
        misconception: "React 不會幫你深比對——它只比 reference，效能才跟得上。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你要在 Redux reducer 裡刪除一個 item。下面哪個做法正確？",
        options: [
          { id: "a", text: "state.items.splice(index, 1); return state;", correct: false },
          { id: "b", text: "return { ...state, items: state.items.filter(i => i.id !== id) };", correct: true },
          { id: "c", text: "delete state.items[index]; return state;", correct: false },
        ],
        explanation:
          "splice 和 delete 都是 mutable 操作，改的是原本的 state array，Redux 的 reference 不變，UI 不更新、time-travel 也會壞掉。filter 回傳新陣列，spread 一個新 state 物件，新 reference 進來，Redux 才能偵測到 state 變了。",
        misconception: "splice 是 in-place 操作，在 reducer 裡用是常見錯誤，偶爾 work 只是湊巧 re-render 被其他更新觸發了。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "同事說：「Immutability 就是用 const，宣告了就不能改。」這說法對嗎？",
        options: [
          { id: "a", text: "對，const 宣告的物件不能修改", correct: false },
          { id: "b", text: "不對，const 只防止 re-assign，物件內部的 property 還是可以改", correct: true },
          { id: "c", text: "對，所以要用 let 才能改 state", correct: false },
        ],
        explanation:
          "const 只保護「binding」不被重新指向，不保護「物件的內容」。const arr = [1,2,3]; arr.push(4) 完全合法。真正的 immutability 是一種「操作習慣」：不改原本的，要改就建新的。Object.freeze() 可以淺層凍結，但深層結構還是得靠自律或工具。",
        misconception: "const ≠ immutable。這是 JS 初學者最常踩的語義陷阱。",
      },
    ],
    furtherReading: [
      {
        title: "Immer 官方文件",
        url: "https://immerjs.github.io/immer/",
        why: "讓你用 mutable 語法寫出 immutable 結果，是 React / Zustand / Redux Toolkit 的幕後功臣",
      },
      {
        title: "Redux 風格指南 — Do Not Mutate State",
        url: "https://redux.js.org/style-guide/#do-not-mutate-state",
        why: "官方解釋為什麼 mutation 會讓 Redux 壞掉，搭配 devtools time-travel 範例說明",
      },
    ],
  },
  {
    slug: "race-condition",
    releaseDay: 25,
    level: 3,
    tracks: ["backend","frontend","ai"],
    prerequisites: ["mutability-vs-immutability"],
    assumedKnowledge: ["並發 / 多執行緒"],
    tag: "並發",
    title: "Race Condition",
    hook: "兩個非同步請求，為什麼後發的竟然會蓋掉先發的結果？",
    body: `你做了一個搜尋欄位：使用者打「a」發一次 API，打「ab」再發一次。API 是網路的，回來的順序不保證——「a」的結果可能比「ab」晚到，最後畫面停在「a」的舊結果。這就是 race condition：兩段 code 同時跑、最後誰的結果生效取決於誰先完成，而這件事你控制不了。

Race condition 之所以讓人頭痛，是因為它幾乎不可複現——本機跑很快、QA 環境也沒問題，但使用者網路一卡就出現。解法不是讓請求變快，而是讓「後來的請求」知道自己已經過時。最乾淨的方式是 abort 機制：每次新請求前，取消舊的那個（AbortController in Fetch / Axios cancellation）。或者用 flag 追蹤「這個 closure 是不是還有效」——update 前先檢查，舊的直接丟棄。`,
    analogy: {
      icon: "🍾",
      title: "兩人同時拿冰箱最後一瓶啤酒",
      text: "你和室友同時打開冰箱，看到最後一瓶，都伸手去拿——誰先抓到誰的。Race condition 就是這種「兩個操作都以為自己能成功，卻沒想到另一個也在跑」的衝突。單執行緒的 JS 表面上沒這問題，但非同步 callback 回來的時間不確定，效果一樣。",
    },
    analogyHint: "兩人同時拿冰箱最後一瓶",
    originStory:
      "Race condition 是 1965 年就有名字的問題，最早出現在作業系統教科書的多執行緒章節。前端長期不怎麼在意——JS 是單執行緒、沒有「真正的」並發。但 2010 年代後，SPA + AJAX 讓大量非同步請求變成常態，前端的 race condition 才從「後端問題」變成每個 React 開發者的日常噩夢。React 18 的 Suspense + Concurrent Mode 部分解法就是讓 React 自己管理「這個 render 是不是還有效」，減少使用者自己處理的 race。",
    example: {
      code: `// ❌ 有 race condition 的搜尋
useEffect(() => {
  fetchResults(query).then(data => setResults(data));
}, [query]);

// ✅ 用 AbortController 取消舊請求
useEffect(() => {
  const controller = new AbortController();
  fetchResults(query, { signal: controller.signal })
    .then(data => setResults(data))
    .catch(err => { if (err.name !== 'AbortError') throw err; });
  return () => controller.abort(); // cleanup：組件 unmount 或 query 變了就取消
}, [query]);`,
      note: "cleanup function 是 useEffect 的回傳值，在下次 effect 執行前自動呼叫。每次 query 變，舊的 fetch 被 abort，只有最新那個能寫入 state。",
    },
    tradeoffs: [
      { label: "✅ 正確解法", text: "AbortController（Fetch）、axios cancelToken、或 flag 檢查（let cancelled = false）——讓舊 closure 知道自己過時" },
      { label: "⚠️ 注意", text: "debounce 可以減少請求次數，但不是 race condition 的根治——網路慢時還是會發生" },
      { label: "❌ 常見錯誤", text: "以為「加 loading 狀態」就解決了——loading 只是 UI 效果，不阻止舊請求蓋掉新的" },
    ],
    oneLiner:
      "Race condition 是「兩個非同步操作的完成順序你控制不了」——解法是讓過時的那個知道自己已經沒用了。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "為什麼 JavaScript 是單執行緒，還會有 race condition？",
        options: [
          { id: "a", text: "因為 JS 其實有多執行緒，只是隱藏起來", correct: false },
          { id: "b", text: "因為非同步操作（fetch、setTimeout）的 callback 回來的時間不確定，順序由外部決定", correct: true },
          { id: "c", text: "因為 React 的 useState 有 bug", correct: false },
        ],
        explanation:
          "JS 的 event loop 讓它一次只跑一段同步 code，但非同步操作的「完成」是由網路、timer、OS 決定的——你無法控制兩個 fetch 誰先回來。這種不確定性就夠製造 race condition，不需要真的多執行緒。",
        misconception: "單執行緒 ≠ 沒有並發問題。非同步就夠了。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你加了 debounce（等使用者停止打字 300ms 才發 API），race condition 解掉了嗎？",
        options: [
          { id: "a", text: "是，debounce 讓請求變少，不會再有衝突", correct: false },
          { id: "b", text: "不完全，debounce 只減少請求數，但那 300ms 後發出的請求仍可能比前一個更早回來", correct: true },
          { id: "c", text: "是，debounce 讓請求序列化，後一個等前一個完成才發", correct: false },
        ],
        explanation:
          "Debounce 減少「多少個請求」的問題，不解決「哪個先回來」的問題。如果使用者在 debounce 期間改了兩次 query，你只發一個請求——但如果網路慢，先前因為使用者快速打字漏網的請求還在飛，一樣會 race。Debounce 是優化，不是解法。",
        misconception: "Debounce 和 abort 是不同層次的工具，搭配用最穩。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "同事說：「這個 bug 本機從來不出現，一定不是 race condition。」這說法可信嗎？",
        options: [
          { id: "a", text: "可信，本機能穩定重現才算真正的 bug", correct: false },
          { id: "b", text: "不可信，race condition 依賴網路延遲，本機 localhost 幾乎沒延遲所以幾乎不出現", correct: true },
          { id: "c", text: "可信，現代瀏覽器已經保證 fetch 的回傳順序", correct: false },
        ],
        explanation:
          "Race condition 在本機不出現是正常的——localhost 延遲 < 1ms，幾乎所有請求都照發出順序回來。生產環境加上真實網路延遲、CDN、慢速裝置，才會翻車。「本機沒問題」反而是 race condition 的典型特徵，不是排除依據。",
        misconception: "Race condition 是機率問題，不是「有沒有」的問題——本機不出現不代表不存在。",
      },
    ],
    furtherReading: [
      {
        title: "React 官方文件 — Fetching Data（useEffect）",
        url: "https://react.dev/learn/synchronizing-with-effects#fetching-data",
        why: "官方直接示範 cleanup + AbortController 的正確寫法，是學 race condition 最短路徑",
      },
      {
        title: "JavaScript Event Loop 視覺化（Jake Archibald: In The Loop）",
        url: "https://www.youtube.com/watch?v=cCOL7MC4Pl0",
        why: "看完才真正理解 JS 為什麼「單執行緒卻能非同步」，是 event loop 最好的解說",
      },
    ],
  },
  {
    slug: "big-o",
    releaseDay: 0,
    level: 1,
    tracks: ["backend","frontend","devops","ai"],
    prerequisites: [],
    assumedKnowledge: [],
    tag: "演算法",
    title: "Big-O 複雜度",
    hook: "100 萬筆資料，for 迴圈跑完要幾秒？換個寫法，瞬間完成。",
    body: `Big-O 是在問：「資料量變大，這段 code 會慢多少？」不是精確計時，而是描述「增長的形狀」。O(n) 代表資料量翻倍、時間翻倍；O(n²) 代表資料量翻倍、時間變四倍。100 萬筆資料，O(n) 跑 1 秒，O(n²) 要跑 11 天。

你不需要會推導數學，但你得認識幾個常見的形狀。O(1) 是 hash map 查值——不管 1 筆還是 10 億筆都一樣快。O(log n) 是 binary search——每次把問題砍半，100 萬筆只需要 20 步。O(n log n) 是大部分排序演算法。O(n²) 是兩層 for loop，資料量一大就凍結。日常 code review 時，看到兩層 for loop 就要問：「這 n 有多大？」`,
    analogy: {
      icon: "📖",
      title: "字典查字 vs 一頁一頁翻",
      text: "O(log n) 像查字典——你知道字母順序，每次翻到中間判斷要往前還是往後，幾步就找到。O(n) 像從頭一頁一頁翻——最壞要翻完全部。O(n²) 像每翻一頁都要再從頭比對一次——資料越多越不可能用。",
    },
    analogyHint: "字典查字 vs 一頁一頁翻",
    originStory:
      "Big-O notation 來自 1894 年數學家 Paul Bachmann，不是電腦科學的發明。1960-70 年代 Donald Knuth 在《The Art of Computer Programming》把它系統化為分析演算法的語言，才成為 CS 標準工具。現代面試大量考 Big-O 是 Google 2000 年代擴張工程師規模後帶起的風氣——他們需要快速篩出能想清楚演算法的人，Big-O 成了共同語言。批評者說「LeetCode 刷題式的 Big-O 面試跟實際工作脫節」，但作為粗估「這個解法能不能用在生產資料量上」的工具，它還是最快的思維框架。",
    example: {
      code: `// O(n²)：找重複——對每個元素都掃一遍陣列
function hasDuplicateSlow(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] === arr[j]) return true;
  return false;
}

// O(n)：用 Set，查詢是 O(1)
function hasDuplicateFast(arr) {
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}
// 10 萬筆：慢的 ~100 億次操作，快的 ~10 萬次`,
      note: "把 O(n²) 換成 O(n) 的關鍵常常是「用空間換時間」——多用一個 hash set / map，查詢從線性變常數。",
    },
    tradeoffs: [
      { label: "✅ Big-O 的用途", text: "快速估算「這個資料量下，這個解法 hold 得住嗎」——不是精確計時，是在寫 code 前就能預測的思維工具" },
      { label: "⚠️ 注意", text: "Big-O 忽略常數，O(n) 的實際時間可能比 O(log n) 快——n 夠小時演算法複雜度不是瓶頸，常數係數才是" },
      { label: "❌ 不要過度套用", text: "5 筆資料的 UI 設定、每次只跑一次的 init 邏輯——不需要為了 Big-O 把簡單的 code 改得很複雜" },
    ],
    oneLiner:
      "Big-O 是問「資料量大十倍，時間變多少」——它不量絕對速度，它量增長的形狀。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "下面哪個操作是 O(1)（常數時間）？",
        options: [
          { id: "a", text: "在排序好的陣列裡用 binary search 找一個值", correct: false },
          { id: "b", text: "用 JavaScript 的 Map.get(key) 查值", correct: true },
          { id: "c", text: "在陣列頭部 unshift 插入一個元素", correct: false },
        ],
        explanation:
          "Map.get() 是 hash table 查詢，平均 O(1)——不管 map 有 10 個還是 1000 萬個 entry，查詢時間基本固定。Binary search 是 O(log n)，比線性快但不是常數。Array.unshift 要把所有元素往後移，是 O(n)。",
        misconception: "Hash map 的 O(1) 是平均值，最壞情況（hash collision 極端場景）可退化到 O(n)，但實務上幾乎不會發生。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你要在一個有 100 萬個用戶的 list 裡，檢查某個 email 有沒有被用過。最適合的資料結構？",
        options: [
          { id: "a", text: "陣列，用 Array.includes() 掃一遍", correct: false },
          { id: "b", text: "Set 或 Map，查詢是 O(1)", correct: true },
          { id: "c", text: "先排序再 binary search，O(log n) 夠快了", correct: false },
        ],
        explanation:
          "Array.includes 是 O(n)，100 萬個每次查詢要掃 100 萬次；如果每個新用戶都要查一次，就是 O(n²)。Set 的 has() 平均 O(1)。Binary search 雖然是 O(log n)，但維護排序本身是 O(n log n)，且動態插入維持排序不容易。資料庫的做法是加 index——背後也是類似的 hash / B-tree 結構。",
        misconception: "陣列「裝得下」不代表「查得快」——容量和查詢複雜度是兩回事。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "同事說：「我的函式是 O(n log n)，比你的 O(n) 還差，要換掉。」這判斷一定對嗎？",
        options: [
          { id: "a", text: "對，O(n) 永遠比 O(n log n) 快", correct: false },
          { id: "b", text: "不一定，Big-O 忽略常數係數，n 小的情況下 O(n log n) 可能反而更快", correct: true },
          { id: "c", text: "對，應該永遠追求最低的 Big-O", correct: false },
        ],
        explanation:
          "Big-O 忽略常數：O(1000n) 還是 O(n)，但比 O(0.001 n log n) 慢很多。如果 n 只有 100、1000，兩個演算法的實際時間差幾乎感覺不到——這時候 code 的清晰度、cache locality、常數係數才是重點。Big-O 是在 n 趨近無限大時的漸近行為，不是小資料量的金科玉律。",
        misconception: "Big-O 只告訴你「n 很大時的趨勢」，不告訴你「n = 100 時哪個快」。",
      },
    ],
    recapQuestion: {
      type: "概念辨識",
      question: "一段 code 先 sort（O(n log n)）再 binary search（O(log n)）。整段的 Big-O 是？",
      options: [
        { id: "a", text: "O(log n) — 取最小的", correct: false },
        { id: "b", text: "O(n log n) — 多步驟「依序」取最大那個", correct: true },
        { id: "c", text: "O(n log n × log n) — 兩個複雜度相乘", correct: false },
      ],
      explanation:
        "多步驟「依序」執行時，Big-O 取主導項（最慢那個）。sort 是 O(n log n)、search 是 O(log n)，n 一大 sort 遠遠主導，加總時間 ≈ sort 時間，所以整段是 O(n log n)。「相乘」適用於「巢狀」（一個操作放在 loop 裡反覆做），不是「依序」。算法：sequential 取 max、nested 取 product、常數丟掉。",
      misconception: "多步驟的 Big-O 是 max 不是 sum；nested 才是 product。",
    },
    furtherReading: [
      {
        title: "Big-O Cheat Sheet",
        url: "https://www.bigocheatsheet.com/",
        why: "一頁總覽常見資料結構和演算法的時間/空間複雜度，面試前貼在牆上",
      },
      {
        title: "CS50 Lecture 3 — Algorithms（Harvard）",
        url: "https://cs50.harvard.edu/x/2024/weeks/3/",
        why: "David Malan 用生活比喻把 search / sort 的複雜度講得讓非CS背景也懂，免費觀看",
      },
    ],
  },
  {
    slug: "composition-vs-inheritance",
    releaseDay: 21,
    level: 2,
    tracks: ["frontend","backend"],
    prerequisites: ["oop-basics"],
    assumedKnowledge: ["Class / instance"],
    tag: "程式設計",
    title: "Composition vs Inheritance",
    hook: "為什麼前輩都說「不要繼承，用組合」，但課本都在教繼承？",
    body: `Inheritance（繼承）的直覺是：狗是動物，所以 Dog extends Animal——複用程式碼、建立階層。問題出在你的系統長大之後：你想要一隻「會游泳但不會飛的狗」、「會飛但不是鳥的機器人」，繼承鏈一定得設計幾層才能包住所有組合？繼承是樹狀的，現實是網狀的——需求一變，整棵樹都要重構。

Composition 的思路不一樣：不問「它是什麼」，問「它能做什麼」。一個物件的能力是「組裝」進去的，不是「繼承」來的。一隻可以游泳的狗 = Dog + canSwim。一個可以飛的機器人 = Robot + canFly。每個能力是獨立的模組，可以任意組合、單獨測試、隨時換掉。這就是 Go 的 interface、Rust 的 trait、React hooks 的設計哲學——「組合行為，不建繼承樹」。`,
    analogy: {
      icon: "🏠",
      title: "繼承一棟舊房子 vs 自己選裝潢",
      text: "繼承像從爸媽那繼承一棟房子——帶著所有裝修、所有缺陷、所有隔間，你沒選擇過。想改一面牆可能得動整棟。組合像自己租一個毛坯空間，沙發、燈具、書架一件一件自己選——每樣東西都可以換，不影響其他的。",
    },
    analogyHint: "繼承一棟舊房子 vs 自選裝潢",
    originStory:
      "Inheritance 是 1960 年代 Simula 語言的核心概念，1980-90 年代 C++、Java 把 OOP 帶入主流時成為「設計正確性」的象徵。但 1994 年《Design Patterns》（四人幫）就已經寫下：「Favor object composition over class inheritance」，只是沒被主流教科書重視。直到 2010 年代後——Go 不提供 class inheritance、React 16 hooks 取代 HOC/class component、Rust 以 trait 代替繼承——「少用繼承」才從圈內觀念變成主流語言的設計選擇。",
    example: {
      code: `// ❌ 繼承：想要「會游泳的機器人」時繼承鏈爆炸
class Animal { }
class Dog extends Animal { swim() {} }
class Robot { }
// 機器人也想 swim？沒辦法繼承兩個...

// ✅ 組合：把「能力」做成 mixin / hook
const canSwim = { swim() { console.log('splash'); } };
const canFly  = { fly()  { console.log('whoosh'); } };

const dog   = Object.assign({}, canSwim);
const drone = Object.assign({}, canFly, canSwim); // 隨意組合`,
      note: "能力拆成獨立模組後，可以單獨測試每個模組、自由組合，不需要管繼承層級。React hooks（useSwim、useFly）是同一個思路的現代版。",
    },
    tradeoffs: [
      { label: "✅ 用組合", text: "功能跨越多個概念、需要靈活組合、各能力要獨立測試——這是大多數業務邏輯的場景" },
      { label: "⚠️ 繼承也有用", text: "真正的 is-a 關係（UIButton extends UIView）、框架設計的 lifecycle hook 擴充——繼承在這裡語意清楚" },
      { label: "❌ 避免", text: "為了複用程式碼而繼承（沒有 is-a 語意）、繼承超過兩層、多重繼承——這是技術債的常見起源" },
    ],
    oneLiner:
      "繼承問「它是什麼」；組合問「它能做什麼」——能力拆開組裝，比繼承樹更容易擴充。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "「Favor composition over inheritance」這句話，主要是在解決什麼問題？",
        options: [
          { id: "a", text: "效能問題，組合比繼承快", correct: false },
          { id: "b", text: "彈性問題，繼承樹在需求變化時難以重構，組合的能力模組可以自由替換", correct: true },
          { id: "c", text: "語法問題，extends 語法太複雜", correct: false },
        ],
        explanation:
          "效能不是重點——兩者在大部分場景差異微乎其微。核心問題是彈性：繼承建立剛性的 is-a 關係，一旦需求變了（「機器人也要會游泳」）就得重設計整棵樹。組合讓你在不動既有程式碼的情況下新增能力，也更容易寫單元測試。",
        misconception: "「用組合」不代表「不能用 class」——class 內部組合其他物件，是很常見的正確寫法。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你在寫 React，想讓三個不同 component 共享「取得使用者資料 + loading 狀態」的邏輯，你選哪個？",
        options: [
          { id: "a", text: "建一個 BaseComponent class，三個都 extends 它", correct: false },
          { id: "b", text: "寫一個 custom hook useUserData()，三個 component 各自呼叫", correct: true },
          { id: "c", text: "把邏輯複製三份，每個 component 各自維護", correct: false },
        ],
        explanation:
          "Custom hook 是 React 的組合機制：邏輯抽成 hook，誰要用就呼叫，各自獨立、可測試、不共享 state。Class 繼承在 React 已是過時模式，hooks 出現就是為了取代它；邏輯複製三份是維護噩夢。",
        misconception: "React hooks 的核心設計就是「組合邏輯」而非「繼承元件」。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "同事說：「我用組合，所以我把所有功能都放進一個有 50 個方法的 class 裡，每個實例只用到其中幾個。」這是正確的組合嗎？",
        options: [
          { id: "a", text: "是，這樣所有功能都在一個地方，很方便", correct: false },
          { id: "b", text: "不是，組合是把功能拆成小模組再組裝，不是把所有功能堆在同一個 class", correct: true },
          { id: "c", text: "是，只要不用 extends 就算組合", correct: false },
        ],
        explanation:
          "「50 個方法塞一個 class」是上帝物件（God Object）——它違反的不是繼承原則，而是單一職責原則（SRP）。正確的組合是：把「游泳」「飛行」「說話」各自做成小模組，誰需要哪個能力就把那個模組組進去，而不是一個大 class 什麼都會。",
        misconception: "組合 ≠ 大雜燴。小模組組裝才是組合；堆在一起叫上帝物件。",
      },
    ],
    furtherReading: [
      {
        title: "Gang of Four — Design Patterns（Favor composition 章節）",
        url: "https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612",
        why: "1994 年就寫下這句話的原始來源，序言就值得讀",
      },
      {
        title: "Composition vs Inheritance（Dan Abramov, React 官方）",
        url: "https://legacy.reactjs.org/docs/composition-vs-inheritance.html",
        why: "React 作者直接解釋為什麼 React 不推薦 class 繼承，用前端視角說得很清楚",
      },
    ],
  },
  {
    slug: "static-vs-dynamic-typing",
    releaseDay: 22,
    level: 2,
    tracks: ["frontend","backend","ai"],
    prerequisites: [],
    assumedKnowledge: ["變數 / 型別概念"],
    tag: "型別系統",
    title: "Static vs Dynamic Typing",
    hook: "TypeScript 在 runtime 根本不存在，但它為什麼能讓大型專案不崩潰？",
    body: `Static typing（靜態型別）在寫 code 的時候就檢查型別；dynamic typing（動態型別）在執行的時候才檢查。TypeScript 是前者——你的所有型別標記、interface、generic，在 tsc 編譯後全部消失，runtime 還是跑原本的 JavaScript。那它的價值在哪？它把「型別錯誤」從「上線後 user 遇到的 runtime crash」變成「開發時 IDE 立刻標紅的 compile error」。早發現早解決，省的是除錯成本。

但靜態型別不是銀彈。Python 動態型別跑了幾十年、在 AI/資料科學界主導，因為快速原型比型別正確性更重要。動態型別讓你少寫很多 boilerplate，探索性 code 更快。真正的分水嶺是「這個 codebase 會活多久、多少人維護」——幾個人的小工具 dynamic 就好；幾百人的大型系統沒有型別等於沒有文件、沒有重構保障。`,
    analogy: {
      icon: "🏗️",
      title: "蓋房前看藍圖 vs 邊蓋邊改",
      text: "Static typing 像施工前審查藍圖——電線走哪、牆在哪，建之前就確認好，開蓋後才不用拆牆補線。Dynamic typing 像創意工作坊——先快速蓋出一個雛型，哪裡不對改哪裡，快速迭代。問題是，蓋到三層樓後才發現一樓的結構不對，代價就很大了。",
    },
    analogyHint: "蓋房前看藍圖 vs 邊蓋邊改",
    originStory:
      "靜態 vs 動態的爭論貫穿整個程式語言史。Fortran（1957）靜態型別；Lisp（1958）動態。1980-90 年代 C/C++/Java 靜態陣營主導企業軟體；2000 年代 Python、Ruby、JavaScript 動態陣營主導網路快速開發。2012 年 Microsoft 推出 TypeScript，讓 JS 開發者第一次在「動態語言」上加靜態層，開創了 gradual typing 路線。同期 Python 推出 type hints（PEP 484, 2015）——兩個最主流的動態語言都在補靜態型別，說明在大型系統上動態型別的維護成本已被業界廣泛認知。",
    example: {
      code: `// Dynamic（JavaScript）：執行時才知道型別錯了
function getUser(id) {
  return fetch('/users/' + id).then(r => r.json());
}
getUser(undefined); // 編譯不報錯，runtime 才爆

// Static（TypeScript）：寫的時候就報錯
function getUser(id: number): Promise<User> {
  return fetch('/users/' + id).then(r => r.json());
}
getUser(undefined); // ❌ IDE 立刻紅線：Argument of type 'undefined' is not assignable`,
      note: "TypeScript 編譯成 JS 後，那個 : number 就消失了。但它在「你寫 code 的那一刻」抓到了一個 runtime 才會爆的 bug。這就是 static typing 的核心價值。",
    },
    tradeoffs: [
      { label: "✅ 靜態型別適合", text: "多人維護的大型 codebase、長期存活的系統、需要大膽重構時的安全網" },
      { label: "⚠️ 動態型別的優勢", text: "快速原型、探索性 script、資料科學 / ML pipeline——靈活度換來開發速度" },
      { label: "❌ 靜態型別的陷阱", text: "過度設計型別體操（complex generic hell）讓 code 比 bug 還難讀；any 滿天飛等於沒有型別" },
    ],
    oneLiner:
      "靜態型別把「runtime 才發現的錯誤」變成「寫 code 時就知道」——代價是多寫型別標記，換來的是重構時的安全感。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "TypeScript 的型別標記在什麼時候存在？",
        options: [
          { id: "a", text: "全程都存在，包含 runtime，所以能防止 runtime 型別錯誤", correct: false },
          { id: "b", text: "只在編譯階段（tsc）存在；編譯後的 JavaScript 沒有任何型別資訊", correct: true },
          { id: "c", text: "只在 IDE 裡顯示，tsc 不會真的檢查", correct: false },
        ],
        explanation:
          "TypeScript 是「compile-time type checker」，不是 runtime type system。tsc 把 TypeScript 轉成 JavaScript 時，所有型別標記都被抹掉。所以 TypeScript 無法防止你在 runtime 傳入錯誤型別的外部資料（例如 API response）——那要靠 zod / io-ts 等 runtime validation 工具。",
        misconception: "TypeScript 不是 JavaScript 的超集 runtime——它是靜態分析工具，runtime 還是跑 JS 規則。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你要寫一個一次性的爬蟲腳本，執行 3 分鐘後就沒用了。你會選 TypeScript 還是 Python？",
        options: [
          { id: "a", text: "TypeScript，型別安全比較重要", correct: false },
          { id: "b", text: "Python，一次性腳本不需要型別安全帶來的長期收益，快速寫完才重要", correct: true },
          { id: "c", text: "都不行，應該用 Go 確保型別安全又夠快", correct: false },
        ],
        explanation:
          "靜態型別的收益是「維護期間節省的除錯成本」。一個用完就丟的腳本沒有維護期，型別標記只是多餘的 overhead。Python 的生態（requests、BeautifulSoup、pandas）也比 TypeScript 更適合爬蟲場景。工具選型要看場景，不是越嚴格越好。",
        misconception: "靜態型別是長期維護的投資，不是每個場景都划算。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "同事說：「我們加了 TypeScript，所以 runtime 不會再有型別相關的 bug 了。」這說法對嗎？",
        options: [
          { id: "a", text: "對，TypeScript 會在 runtime 攔截型別錯誤", correct: false },
          { id: "b", text: "不對，TypeScript 只在編譯時檢查；外部資料（API、用戶輸入）在 runtime 仍可能是錯誤型別", correct: true },
          { id: "c", text: "對，只要型別標記夠完整就沒問題", correct: false },
        ],
        explanation:
          "TypeScript 的型別在 runtime 不存在。最常見的漏洞：你標記 API response 是 User 型別，但 API 回來的 JSON 裡某個欄位是 null——TypeScript 信任你寫的型別，不會在 runtime 驗證。解法是搭配 runtime schema validation（zod.parse()、io-ts.decode()）在資料進入系統邊界時確認型別正確。",
        misconception: "TypeScript 不能防禦系統邊界的外部資料——那是 runtime validation 的工作。",
      },
    ],
    furtherReading: [
      {
        title: "TypeScript Handbook — The Basics",
        url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html",
        why: "官方文件，第一節就解釋「型別只在編譯期存在」，是最快建立正確心智模型的起點",
      },
      {
        title: "Zod 官方文件",
        url: "https://zod.dev/",
        why: "TypeScript 最流行的 runtime validation 函式庫，解決「TypeScript 管不到的那層」",
      },
    ],
  },
  {
    slug: "mock-stub-spy",
    releaseDay: 24,
    level: 2,
    tracks: ["frontend","backend","ai"],
    prerequisites: [],
    assumedKnowledge: ["單元測試概念"],
    tag: "測試",
    title: "Mock / Stub / Spy",
    hook: "三個都叫「假的測試替代品」，但用錯了測試根本沒意義。",
    body: `寫單元測試時，你的 code 常常依賴外部的東西——資料庫、API、email 服務、時間。這些東西不能真的在測試裡跑，所以要用「假的」替代。但假的有三種，用途完全不同：Stub 是「給固定答案的假物件」——你問它 getUser(1)，它永遠回 { id: 1, name: 'Alice' }，不管你問什麼。Mock 是「有預期的假物件」——你設定它預計被呼叫幾次、帶什麼參數，測試結束時它會驗證這些預期有沒有實現。Spy 是「監視真實物件的工具」——真實的函式還是會跑，但 spy 記錄了它被呼叫的過程。

混淆這三者最大的問題：你可能以為在測試「邏輯」，其實只是在測試「假資料有沒有被正確傳回來」。Mock 驗的是「互動」；Stub 提供的是「狀態」；Spy 觀察的是「行為」。用錯工具，測試綠燈但 bug 還在。`,
    analogy: {
      icon: "🎭",
      title: "模特兒 / 道具 / 監視器",
      text: "Stub 像道具槍——拿起來像真的、會響，但不傷人，提供你需要的「結果」。Mock 像一個挑剔的導演，事先寫好劇本說「這場戲你必須在第 2 分鐘走左邊、說這句台詞」，拍完對劇本，不照做就 NG。Spy 像片場監視器——演員真的在演，你只是偷偷記錄他們做了什麼、說了什麼，事後回放。",
    },
    analogyHint: "道具 / 挑剔導演 / 監視器",
    originStory:
      "Mock 的正式定義來自 2000 年 Tim Mackinnon 等人發表的論文「Endo-Testing: Unit Testing with Mock Objects」。在此之前，「假物件」是個模糊概念；這篇論文把 test double 分類化，後來 Gerard Meszaros 的《xUnit Test Patterns》（2007）進一步系統化為 Dummy、Stub、Fake、Spy、Mock 五種。但業界對名詞用法一直很混亂——大多數框架（Sinon.js、Jest、Mockito）把這三種功能都叫做某種「mock」，讓分類變得更模糊。理解背後的意圖比記名詞更重要。",
    example: {
      code: `// Stub：給固定答案，測試自己的邏輯
const db = { getUser: () => ({ id: 1, name: 'Alice' }) }; // 永遠回 Alice

// Mock（Jest）：驗證是否被呼叫
const sendEmail = jest.fn();
sendEmail('hi');
expect(sendEmail).toHaveBeenCalledWith('hi'); // 驗互動

// Spy（Jest）：真實函式 + 觀察
const spy = jest.spyOn(console, 'log');
someFunction(); // 真的跑，console.log 也真的印
expect(spy).toHaveBeenCalled(); // 只是記錄
spy.mockRestore();`,
      note: "Jest 的 jest.fn() 同時是 stub（可設回傳值）也是 mock（可驗呼叫）。jest.spyOn 是 spy，預設不攔截真實行為。",
    },
    tradeoffs: [
      { label: "✅ Stub", text: "隔離外部依賴、讓測試可預測——測你的邏輯，不測第三方行為" },
      { label: "✅ Mock", text: "驗證「互動是否發生」——email 有沒有被發送、API 有沒有被呼叫對的次數" },
      { label: "⚠️ 過度 mock 的陷阱", text: "把所有東西都 mock 掉，測試就只在測 mock 本身，跟真實行為完全脫節——這叫 over-mocking，是常見反模式" },
    ],
    oneLiner:
      "Stub 給假答案、Mock 驗互動、Spy 觀察真實行為——選錯工具，綠燈可能只代表你在測假的。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "你在測試一個「發送訂單確認信」的函式。你要驗的是「email service 有沒有被呼叫」，應該用哪個？",
        options: [
          { id: "a", text: "Stub，回傳一個假的 email 成功訊息", correct: false },
          { id: "b", text: "Mock，設定預期「sendEmail 必須被呼叫一次，帶特定 subject」，結束時驗證", correct: true },
          { id: "c", text: "Spy，讓真實 email service 跑，只是記錄呼叫", correct: false },
        ],
        explanation:
          "你想驗的是「互動」——email 有沒有被呼叫、參數對不對。這是 Mock 的用途。Stub 只給假答案，不驗呼叫；Spy 讓真實 email service 跑（測試環境不能真的寄信）。Mock 讓你定義預期並在 assertion 階段確認。",
        misconception: "Mock 是「有預期的假物件」，不是所有假物件都叫 mock。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你在測試一段業務邏輯，它呼叫資料庫查詢，你只關心「查到資料後業務邏輯處理對不對」，應該用哪個？",
        options: [
          { id: "a", text: "Mock，驗資料庫有沒有被呼叫", correct: false },
          { id: "b", text: "Stub，給資料庫查詢一個固定的假回傳值，然後測業務邏輯的結果", correct: true },
          { id: "c", text: "Spy，讓真實資料庫跑，觀察業務邏輯怎麼用資料", correct: false },
        ],
        explanation:
          "你關心的是「給定資料後，邏輯跑對嗎」。Stub 給固定資料，讓你專心測邏輯，不管資料庫。Mock 會讓你浪費時間驗「資料庫被呼叫了幾次」——這不是這個測試的重點。真實資料庫在單元測試裡跑太慢也不可靠。",
        misconception: "單元測試的核心是隔離，Stub 的價值就是提供可控的輸入讓你專心測邏輯。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "同事說：「我把所有依賴都 mock 掉了，所以我的單元測試一定沒問題。」這樣對嗎？",
        options: [
          { id: "a", text: "對，mock 掉依賴才是正確的單元測試", correct: false },
          { id: "b", text: "不完全，過度 mock 讓測試只測假物件的互動，跟真實行為脫節；整合測試也是必要的", correct: true },
          { id: "c", text: "對，外部依賴不 mock 就會讓測試不穩定", correct: false },
        ],
        explanation:
          "Over-mocking 是真實問題：你把所有東西都 mock 掉，測試通過只代表「你的假物件設定是對的」，不代表真實系統能跑。正確做法是：用 stub/mock 做快速的單元測試，同時有整合測試驗證真實元件之間的互動（真實 DB、真實 HTTP call）。兩層都要，不能只靠其中一種。",
        misconception: "100% mock 的測試套件不能告訴你系統「整合後」是否正確——那是整合測試的職責。",
      },
    ],
    furtherReading: [
      {
        title: "Mocks Aren't Stubs（Martin Fowler）",
        url: "https://martinfowler.com/articles/mocksArentStubs.html",
        why: "最清楚解釋這三者差別的文章，Fowler 的說明是業界最常被引用的來源",
      },
      {
        title: "Jest 官方文件 — Mock Functions",
        url: "https://jestjs.io/docs/mock-functions",
        why: "直接看 API，jest.fn() / spyOn / mockReturnValue 怎麼用，一個小時就能上手",
      },
    ],
  },
  {
    slug: "garbage-collection",
    releaseDay: 23,
    level: 2,
    tracks: ["frontend","backend","ai"],
    prerequisites: ["memory-model"],
    assumedKnowledge: ["Pointer / 指標"],
    tag: "工程",
    title: "Garbage Collection",
    hook: "有 GC 的語言，為什麼程式還是會 memory leak？",
    body: `Garbage Collection（GC）是語言 runtime 自動幫你回收「沒人在用的記憶體」。你不需要手動 malloc/free，聽起來很完美。但 GC 的判斷標準是「這塊記憶體還有沒有人 reference 它」——不是「這塊記憶體你還需要嗎」。這兩件事有時候不一樣。

最常見的場景：你把一個 DOM element 的引用存進一個全域的 Map，後來 DOM 移掉了——但 Map 還 hold 著那個引用，GC 就沒辦法回收那個 element。你「不需要了」，但 GC 看到的是「還有人 reference 它」。Event listener 沒有 removeEventListener、定時器沒有 clearInterval、React component unmount 但 subscription 沒清除——都是同樣的模式：你忘了告訴 runtime「我不需要了」，GC 就繼續幫你保留。`,
    analogy: {
      icon: "🤖",
      title: "自動掃地機器人掃不到沙發底下",
      text: "GC 像自動掃地機器人——能打掃到的地方都打掃了，非常認真。但沙發底下塞滿了東西，機器人進不去。那些東西（記憶體）還是在那裡佔空間，你忘了它們——但機器人無法確定「你真的不需要它」，所以不敢動。Memory leak 就是一堆機器人永遠到不了的角落。",
    },
    analogyHint: "自動掃地機器人掃不到沙發底下",
    originStory:
      "GC 最早在 1959 年由 John McCarthy 為 Lisp 設計——mark-and-sweep 演算法沿用至今。Java 1995 年把 GC 帶入商業主流語言。Go（2009）的 GC 是低延遲設計，目標是把 stop-the-world pause 壓到 < 1ms。2015 年 V8（Node.js / Chrome 的 JS engine）從 full GC 轉向 incremental / concurrent GC，大幅降低了 JS app 的 GC 卡頓。但 GC 永遠解決不了「ref 還在但你不需要了」的問題——WeakMap 和 WeakRef（ES2021）就是為了處理這個邊界情況而生。",
    example: {
      code: `// ❌ Memory leak：Map 一直 hold 著 DOM 引用
const cache = new Map();
function addWidget(el) {
  cache.set(el, { data: 'heavy object' });
  document.body.append(el);
}
el.remove(); // DOM 移掉了，但 cache 還有 ref → GC 無法回收

// ✅ WeakMap：key 是弱引用，DOM 被移掉後 GC 可以回收
const cache = new WeakMap();
function addWidget(el) {
  cache.set(el, { data: 'heavy object' }); // GC 可以回收 el`,
      note: "WeakMap 的 key 是弱引用（weak reference）——當 key 物件沒有其他強引用時，GC 可以回收它，WeakMap 的 entry 也自動消失。但 WeakMap 不可 iterate（就是因為這個），所以不是所有 Map 都能換成 WeakMap。",
    },
    tradeoffs: [
      { label: "✅ GC 解決的", text: "忘記 free 記憶體的問題——大部分「用完就不需要了」的物件會被自動回收" },
      { label: "⚠️ GC 解決不了的", text: "「ref 還在但你不需要了」的 logical leak——event listener、global cache、setInterval、closure hold 住大物件都是常見場景" },
      { label: "❌ GC 的代價", text: "Stop-the-world pause（GC 跑時 app 短暫暫停）；記憶體用量通常比手動管理高——GC 語言不適合即時系統或超低記憶體嵌入式環境" },
    ],
    oneLiner:
      "GC 回收「沒有 reference 的記憶體」，不回收「你忘了清掉 reference 的記憶體」——這中間的差距就是 memory leak。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "GC 決定回收一塊記憶體的判斷標準是什麼？",
        options: [
          { id: "a", text: "這塊記憶體上次被存取是多久以前", correct: false },
          { id: "b", text: "這塊記憶體已經沒有任何 reference 指向它", correct: true },
          { id: "c", text: "這塊記憶體是否超過某個大小閾值", correct: false },
        ],
        explanation:
          "主流 GC（包含 JS 的 V8）的核心是 reachability——從 root（全域變數、執行中的函式）出發，能 reach 到的物件就不回收。一旦沒有任何路徑能 reach 到某個物件，它就是垃圾，可以被回收。時間和大小都不是判斷標準。",
        misconception: "GC 不管「你上次用它多久了」，只管「還有沒有 reference 能到達它」。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "React 的 useEffect 裡，你訂閱了一個 WebSocket 的 message 事件。Component unmount 時如果不取消訂閱，會發生什麼？",
        options: [
          { id: "a", text: "沒問題，React 會自動清除 event listener", correct: false },
          { id: "b", text: "Memory leak：WebSocket 的 listener 還 hold 著 component 的 closure，GC 無法回收 component", correct: true },
          { id: "c", text: "App 會立刻 crash", correct: false },
        ],
        explanation:
          "Event listener 是 WebSocket 物件的一部分，它 hold 著你的 callback closure，closure 又 hold 著 component 的 state 和 props。Component unmount 後理論上應該被 GC，但 WebSocket 還在、listener 還掛著，整條 reference chain 還活著——memory leak。解法是在 useEffect 的 cleanup 函式裡 removeEventListener / unsubscribe。",
        misconception: "React 只幫你管 DOM，不幫你管 WebSocket、EventEmitter、setInterval 等外部訂閱。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "同事說：「我們用 Go，有 GC，不可能有 memory leak。」這說法對嗎？",
        options: [
          { id: "a", text: "對，GC 語言不可能有 memory leak", correct: false },
          { id: "b", text: "不對，Go 也會有 GC 回收不到的 logical leak，例如往 channel 或 global slice 無限 append", correct: true },
          { id: "c", text: "對，Go 的 GC 特別強，其他語言才有問題", correct: false },
        ],
        explanation:
          "任何有 GC 的語言都可能 memory leak。Go 常見的場景：goroutine 因為 channel 阻塞沒有結束（goroutine leak）、全域 map 無限長大、往 slice append 但從不 clear。GC 能回收「沒人 reference 的記憶體」，但如果你永遠 hold 著 reference（即使邏輯上不需要），GC 就無能為力。",
        misconception: "GC 防的是「忘記 free」，不防「永遠不 free」——後者是程式設計師的邏輯錯誤，不是語言的責任。",
      },
    ],
    furtherReading: [
      {
        title: "MDN — Memory management in JavaScript",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management",
        why: "從 allocation 到 GC 演算法（mark-and-sweep）到常見 leak 模式，是 JS GC 最完整的入門",
      },
      {
        title: "Chrome DevTools — Memory 面板教學",
        url: "https://developer.chrome.com/docs/devtools/memory-problems/",
        why: "直接在瀏覽器裡抓 memory leak 的 heap snapshot 和 allocation timeline，是最快驗證問題的方式",
      },
    ],
  },
  {
    slug: "idempotency",
    releaseDay: 26,
    level: 3,
    tracks: ["backend","ai"],
    prerequisites: ["http-basics"],
    assumedKnowledge: ["重試 / 失敗處理場景"],
    tag: "API 設計",
    title: "Idempotency",
    hook: "支付按了兩次，為什麼有時候扣兩次錢、有時候只扣一次？",
    body: `Idempotency（冪等性）說的是：同一個請求執行一次和執行多次，結果一樣。GET 是冪等的——你 GET 一個資源一百次，它不會因此多建 100 個資源。DELETE 也是冪等的——刪已經刪掉的東西，還是「刪掉的狀態」。POST 不是——你 POST 一筆訂單三次，會建三筆。

這為什麼重要？網路是不可靠的——你按下「付款」，request 在路上丟掉了、伺服器超時了、使用者以為沒成功就重按。這個重複的 request 有沒有被正確處理，決定了使用者是不是被扣了兩次錢。正確的做法是 idempotency key：客戶端帶一個 UUID，伺服器記錄「這個 UUID 的請求我已經處理過了，結果是 X」，重複來就直接回 X，不重新執行。Stripe 的 API 就是用這個模式——他們把這個保障暴露給所有開發者用。`,
    analogy: {
      icon: "🛗",
      title: "電梯按鈕 vs 投幣機",
      text: "電梯「關門」按鈕是冪等的——按一次是關門、按十次還是關門，按到爛它也不會多關幾次。投幣機不是冪等的——投一枚出一罐、投十枚出十罐。支付就像投幣機：POST 一次收一次錢，POST 兩次就可能收兩次——除非你額外設計冪等機制。",
    },
    analogyHint: "電梯按鈕 vs 投幣機",
    originStory:
      "Idempotency 的數學定義來自 19 世紀代數——一個操作套用多次跟套用一次結果相同。進入電腦科學是在 HTTP/1.1 規格（RFC 7231, 1999）把它明文寫進方法語義裡。但在 API 設計的主流討論要到 2010 年代支付系統大規模上線後——Stripe 大約在 2013 年公開他們的 idempotency key 設計，成為業界的標準範本。分散式系統的 at-least-once delivery 語義讓 idempotency 從「最好有」變成「必須有」——消息可能重複送達，你得確保重複處理不造成重複效果。",
    example: {
      code: `// 客戶端：每次支付請求帶一個唯一 key
const idempotencyKey = crypto.randomUUID(); // 新一筆交易就產生新的
await fetch('/payments', {
  method: 'POST',
  headers: { 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ amount: 1000 }),
});

// 伺服器：記錄已處理的 key
const existing = await db.query(
  'SELECT result FROM payments WHERE idempotency_key = $1', [key]
);
if (existing) return existing.result; // 重複請求，直接回舊結果
// 否則執行付款 + 儲存 key + 結果`,
      note: "Idempotency key 要由客戶端產生（不是伺服器），這樣網路重試時帶的是同一個 key。超時後重試 = 同一個 key，伺服器認出來直接回舊結果，不重複扣款。",
    },
    tradeoffs: [
      { label: "✅ 必須有", text: "任何「寫入操作 + 可能重試」的場景：支付、訂單建立、email 發送——分散式系統的基本安全護欄" },
      { label: "⚠️ 注意", text: "Idempotency key 要存在資料庫並有 TTL（過期時間）——永久存會無限增長，通常設 24-72 小時" },
      { label: "❌ 不適用", text: "純查詢操作（GET 天然冪等）、每次都應該產生新結果的操作（如「每秒記一筆 log」）——這裡不需要 idempotency key" },
    ],
    oneLiner:
      "Idempotency 讓同一個請求無論發幾次結果都一樣——解決的是「網路重試造成重複扣款」這個核心問題。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "以下哪個 HTTP method 在 HTTP 規格裡被定義為冪等（idempotent）？",
        options: [
          { id: "a", text: "POST", correct: false },
          { id: "b", text: "DELETE", correct: true },
          { id: "c", text: "PATCH", correct: false },
        ],
        explanation:
          "HTTP/1.1 規格（RFC 7231）明文規定 GET、HEAD、PUT、DELETE 是 idempotent。POST 和 PATCH 不是（POST 每次建新資源、PATCH 部分更新可能不冪等）。DELETE 的冪等語義是「刪一個已刪掉的資源」仍應回 200 或 404，而不是報錯——這在 REST API 設計裡常被忽略。",
        misconception: "Idempotent ≠ safe（不修改狀態）。DELETE 是 idempotent 但不是 safe，因為它確實修改了狀態（刪東西）。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你的 API 在處理付款時，因伺服器超時，客戶端不確定有沒有成功，又送了一次相同請求。最正確的處理方式？",
        options: [
          { id: "a", text: "讓兩次請求都執行，重複收費是使用者的責任", correct: false },
          { id: "b", text: "用 idempotency key，伺服器識別重複請求並回傳第一次的結果", correct: true },
          { id: "c", text: "讓前端在收到 timeout 後不重試，告訴使用者重新整理再試", correct: false },
        ],
        explanation:
          "網路 timeout 不代表請求沒到達——可能是「到了但回應在路上丟掉」。讓使用者「重新整理再試」也只是把重複請求延後，問題還在。Idempotency key 讓伺服器能識別重複請求並安全地回同樣結果，才是根本解法。",
        misconception: "「不讓前端重試」不是 idempotency——你只是把問題丟給使用者，他還是會再按一次。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "同事說：「我們的 PUT /orders/{id} 更新訂單，PUT 是冪等的，所以不需要 idempotency key。」這說法一定對嗎？",
        options: [
          { id: "a", text: "對，PUT 天然冪等，規格保證了", correct: false },
          { id: "b", text: "不一定，取決於你的實作——如果 PUT 內部有「increment 數量」等非冪等操作，HTTP 語義和實際行為就不一致", correct: true },
          { id: "c", text: "不對，PUT 從來不冪等", correct: false },
        ],
        explanation:
          "HTTP 規格說 PUT 應該是冪等的，但這只是「語義契約」，不是技術強制。如果你的 PUT handler 裡面做了 UPDATE quantity = quantity + 1，重複執行就會 +1 +1 +1……——這破壞了 PUT 的冪等語義。冪等性最終靠的是你的實作邏輯，不是 HTTP method 的標籤。",
        misconception: "HTTP method 的冪等語義是設計約定，不是語言層的強制保證——你的實作可以輕易打破它。",
      },
    ],
    furtherReading: [
      {
        title: "Stripe 官方文件 — Idempotent requests",
        url: "https://stripe.com/docs/api/idempotent_requests",
        why: "業界最標準的 idempotency key 實作範本，直接看 Stripe 怎麼設計的比看理論快十倍",
      },
      {
        title: "AWS 建築師部落格 — Making retries safe with idempotent APIs",
        url: "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/",
        why: "AWS 內部工程師寫的，從分散式系統角度說明為什麼 idempotency 是生產系統的必備能力",
      },
    ],
  },
  {
    slug: "hashing-vs-encryption",
    releaseDay: 17,
    level: 2,
    tracks: ["backend","devops"],
    prerequisites: [],
    assumedKnowledge: ["Bit operation", "Key / 金鑰概念"],
    tag: "安全",
    title: "Hashing vs Encryption",
    hook: "密碼資料庫被偷，公司為什麼還能說「你的密碼是安全的」？",
    body: `Hash 和 Encryption 都是把資料「變形」，但方向完全不同。Encryption 是可逆的——你有金鑰，就能把密文解回原文（否則 HTTPS 就沒辦法讓你看網頁了）。Hash 是不可逆的——給你 bcrypt 的 hash 輸出，數學上沒辦法推回原始密碼。所以密碼要 hash，不要 encrypt。如果你 encrypt 密碼，代表你有金鑰、能解出原始密碼——資料庫和金鑰一起被偷，等於明文洩漏。

但「不可逆」不代表「安全」。簡單的 hash（MD5、SHA-256）很快，快到攻擊者可以用 rainbow table 或暴力枚舉——先建一張「常見密碼 → hash」的對照表，看到你的 hash 就查表反推。密碼 hash 要用慢 hash（bcrypt、Argon2），刻意讓每次計算很費時，就算拿到 hash 也很難暴力破解。再加上 salt（每個密碼用隨機字串混合再 hash），讓相同密碼 hash 出不同值，讓 rainbow table 直接失效。`,
    analogy: {
      icon: "🔐",
      title: "絞肉機 vs 保險箱",
      text: "Hash 像絞肉機——把肉絞進去，出來的是碎肉。你拿著碎肉，反推不回完整的肉。Encryption 像保險箱——東西鎖進去，你有鑰匙就能打開取出。密碼要用絞肉機，不要用保險箱——你不需要（也不應該）知道使用者的原始密碼，你只需要問「這個密碼絞出來的碎肉，跟我存的一樣嗎」。",
    },
    analogyHint: "絞肉機（不可逆）vs 保險箱（可還原）",
    originStory:
      "Hash function 的數學根源很古老（Shannon 的 information theory 1948），但密碼學 hash 的現代實作是 Ron Rivest 1992 年設計 MD5。MD5 在 2004 年被找到碰撞漏洞（兩個不同輸入有相同 hash），SHA-1 在 2017 年被 Google 用 SHAttered 攻擊擊破。現在密碼 hash 的推薦是 bcrypt（1999）、scrypt（2009）、Argon2（2015，密碼 hash 競賽冠軍）——它們設計上就是「故意很慢」，讓暴力破解的時間成本高到不可行。LinkedIn 2012 年洩漏了 600 萬個 SHA-1 hash 沒加 salt，幾天內大部分都被破解。這個事件讓業界正式停用快速 hash 做密碼儲存。",
    example: {
      code: `// ❌ 不要這樣存密碼（SHA-256 太快、無 salt）
const hash = crypto.createHash('sha256').update(password).digest('hex');

// ✅ 正確：bcrypt（自帶 salt、慢 hash）
import bcrypt from 'bcrypt';
const ROUNDS = 12; // 越高越慢（每+1 約 2x 時間），推薦 10-14

// 存密碼
const hashed = await bcrypt.hash(password, ROUNDS);

// 驗證密碼（不能自己比 hash，因為每次 salt 不同）
const ok = await bcrypt.compare(inputPassword, hashed); // true / false`,
      note: "bcrypt.compare 不是比兩個字串是否相等，是重新 hash 並用常數時間比對——防 timing attack。千萬不要自己 hash 後比較字串。",
    },
    tradeoffs: [
      { label: "✅ Hash 用於", text: "密碼儲存（bcrypt/Argon2）、資料完整性驗證（SHA-256）、git commit ID——任何「只需驗證、不需還原」的場景" },
      { label: "✅ Encryption 用於", text: "HTTPS、加密檔案、加密 DB 欄位（信用卡號、身份證）——任何「需要解回原始資料」的場景" },
      { label: "❌ 常見錯誤", text: "用 MD5/SHA1 存密碼（已破解）、用 Encryption 存密碼（金鑰被偷就洩漏）、不加 salt（rainbow table 直接查表）" },
    ],
    oneLiner:
      "Hash 是絞肉機（不可逆）；Encryption 是保險箱（可還原）——密碼用絞肉機，且要用刻意很慢的那種。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "為什麼存密碼要用 bcrypt 而不是 SHA-256？",
        options: [
          { id: "a", text: "因為 SHA-256 是可逆的，bcrypt 不是", correct: false },
          { id: "b", text: "因為 SHA-256 計算太快，攻擊者能暴力枚舉；bcrypt 刻意設計得很慢", correct: true },
          { id: "c", text: "因為 bcrypt 的 hash 長度更長，更安全", correct: false },
        ],
        explanation:
          "SHA-256 也是不可逆的 hash，問題不在可逆性，而在速度。現代 GPU 每秒能跑幾十億次 SHA-256，暴力枚舉常見密碼幾分鐘就搞定。bcrypt 的 cost factor 讓每次 hash 需要幾十到幾百毫秒，攻擊者要跑幾億次就需要幾年——這才是密碼 hash 的核心設計目標。",
        misconception: "「不可逆」是密碼 hash 的必要條件，但不夠——還要「夠慢」才能抵抗暴力破解。",
      },
      {
        id: 2,
        type: "情境判斷",
        question:
          "你要儲存使用者的信用卡號，方便他們結帳時帶入。你應該用 hash 還是 encryption？",
        options: [
          { id: "a", text: "Hash，因為 hash 更安全", correct: false },
          { id: "b", text: "Encryption，因為你結帳時需要拿回原始號碼", correct: true },
          { id: "c", text: "兩個都用，hash 存一份、encryption 存一份", correct: false },
        ],
        explanation:
          "信用卡號需要被讀出來（打 API 給支付處理商），所以必須能還原——這是 encryption 的場景。Hash 是不可逆的，hash 之後永遠拿不回原始號碼。實務上信用卡儲存有 PCI DSS 規範，通常是 tokenization（把號碼換成 token 存在自己系統，真實號碼存在 PCI 合規的第三方）。",
        misconception: "「更安全」不代表「更合適」——需要還原的資料不能用 hash。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question:
          "公司說：「我們的密碼是用 MD5 加密的，非常安全。」這句話有幾個問題？",
        options: [
          { id: "a", text: "沒問題，MD5 是業界標準", correct: false },
          { id: "b", text: "兩個問題：MD5 是 hash 不是加密；且 MD5 已被破解不應用於密碼", correct: true },
          { id: "c", text: "只有一個問題：應該說「hash」不是「加密」，但 MD5 本身還是安全的", correct: false },
        ],
        explanation:
          "「MD5 加密」有兩個錯誤：(1) MD5 是 hash function，不是 encryption，這兩個詞不一樣——雖然聽起來像吹毛求疵，但概念錯誤代表設計者可能不了解這兩者的差異；(2) MD5 在 2004 年就被找到碰撞，rainbow table 覆蓋率極高，大量常見密碼的 MD5 幾秒內就能查表反推。2012 年 LinkedIn 的 hash 洩漏大部分是 SHA-1 而非 MD5，但同樣快速被破解。",
        misconception: "名詞正確性不是雞蛋裡挑骨頭——「加密」和「hash」的混用常常反映設計者對兩者的用途和安全性有根本性的誤解。",
      },
    ],
    furtherReading: [
      {
        title: "Have I Been Pwned — Passwords",
        url: "https://haveibeenpwned.com/Passwords",
        why: "直接查你的密碼有沒有出現在已知洩漏資料庫，體驗「弱密碼有多脆弱」比看文章有感",
      },
      {
        title: "OWASP — Password Storage Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
        why: "安全界標準的密碼儲存指南，直接給推薦演算法（Argon2id / bcrypt）和參數設定",
      },
    ],
  },

  // ============================================================
  // L1 Foundations — Phase 2 stubs（待 gen-concept 補完內容）
  // ------------------------------------------------------------
  // releaseDay 是暫時的 placeholder，Phase 3 會把這 6 篇連同既有 25 篇
  // 重排成「L1 → L2 → L3」的閱讀順序。
  // ============================================================

  {
    slug: "http-basics",
    releaseDay: 0,
    level: 1,
    tracks: ["backend","frontend","devops","ai"],
    prerequisites: [],
    assumedKnowledge: [],
    tag: "網路",
    title: "HTTP 基礎",
    hook: "為什麼瀏覽器跟伺服器要用一套這麼囉唆的對話協議？",
    body: `當你在瀏覽器打 google.com，背後到底發生什麼事？瀏覽器送一個 HTTP request 給 Google 伺服器，伺服器回一個 response。看起來簡單，但這個對話的格式從 1991 年的 HTTP/0.9 一直被釘成標準，讓全世界的瀏覽器都能跟全世界的伺服器溝通。每一個 request 都是獨立的——伺服器不會自動記得你上次問過什麼，這叫做「stateless」。

HTTP 的核心三件事：method 講「你想做什麼」(GET 拿、POST 送、PUT 換、DELETE 刪)，header 講「附加資訊」(我是誰、我要什麼格式、我有什麼 cookie)，status code 講「結果如何」(200 成功、404 找不到、500 我壞了)。狀態管理因為 stateless 是個難題，cookie 是常見解法——伺服器讓你帶著一張「你是誰」的小紙條，每次 request 都自動附上。`,
    analogy: {
      icon: "🍔",
      title: "速食店點餐窗口 vs 餐桌服務",
      text: "HTTP 像速食店窗口——你過去說「我要一個漢堡」（request）、店員給你漢堡（response），交易結束、店員不認得你。Cookie 像會員卡——你出示卡片、店員看一眼就知道你是誰，但你每次都得記得帶著。沒卡片時，店員每次都把你當新客人。",
    },
    analogyHint: "速食點餐窗口（stateless）vs 會員卡（cookie）",
    originStory: "Tim Berners-Lee 1989 年在 CERN 提出 World Wide Web 計畫，1991 年發布的 HTTP/0.9 只有一個 method (GET)、沒有 header、沒有 status code，純粹「拿一份文件回來」。HTTP/1.0 (1996) 加進 method、header、status code，奠定今天的形式。HTTP/1.1 (1999) 加 keep-alive 重用連線，當了二十年的工作牛馬。HTTP/2 (2015) 引入 binary protocol 跟 multiplexing 解決 head-of-line blocking。HTTP/3 (2022) 改用 QUIC 跑在 UDP 上，徹底放棄 TCP。但底層怎麼變，「method + header + status code」這三件事的概念從 1996 年到現在沒變過。",
    example: {
      code: `GET /api/users/42 HTTP/1.1
Host: api.example.com
Accept: application/json
Cookie: session=abc123

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=300

{"id": 42, "name": "alice"}`,
      note: "上面是 request、下面是 response。GET 表示「拿資料」。Cookie header 帶 session ID 讓伺服器認得你。200 表示成功。Cache-Control 告訴瀏覽器這份資料 5 分鐘內可重複使用，不用再問伺服器。",
    },
    tradeoffs: [
      { label: "✅ Stateless 帶來的好處", text: "任何一台伺服器都能處理任何一個 request，方便水平擴展" },
      { label: "⚠️ 注意", text: "GET 應該無副作用——把寫入塞進 GET 會被爬蟲、prefetch、預覽功能意外觸發" },
      { label: "❌ 不適合", text: "需要伺服器主動推訊息給客戶端的場景（這是 WebSocket / SSE 的工作）" },
    ],
    oneLiner: "HTTP 的精神是「每次對話都從頭來過」——所有 state 要嘛你自己帶（cookie），要嘛伺服器自己存。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "HTTP 是 stateless 的，這句話的意思是？",
        options: [
          { id: "a", text: "HTTP 不能傳遞資料，只能傳訊號", correct: false },
          { id: "b", text: "伺服器不會自動記住你之前的 request，每個 request 都當作新的處理", correct: true },
          { id: "c", text: "HTTP 沒有版本，所有實作都一樣", correct: false },
        ],
        explanation:
          "Stateless 指「協定本身不維護對話狀態」——不是沒有資料、也不是沒版本。每個 request 進來，伺服器都當第一次見面。要記得你是誰、要靠 cookie、JWT、session ID 等機制把狀態「帶」過來。這個設計讓任何一台伺服器都能處理任何一個 request，是水平擴展的基礎。",
        misconception: "Stateless 不代表沒有 state——只是 state 不放在協定裡。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你的 API 設計一個「使用者按讚」的端點，要選哪個 method？",
        options: [
          { id: "a", text: "GET /like?post=42（簡單、直接呼叫就好）", correct: false },
          { id: "b", text: "POST /likes（按讚是寫入操作，不能用 GET）", correct: true },
          { id: "c", text: "都行，反正最後送到伺服器處理結果一樣", correct: false },
        ],
        explanation:
          "用 GET 來做寫入會出大事——爬蟲、瀏覽器 prefetch、Slack/iMessage 的連結預覽功能都會自動發 GET。如果你的 GET endpoint 會「按讚」，這些自動行為會無意間幫使用者按讚一堆東西。HTTP method 不是純粹的標籤——基礎設施會根據 method 做行為決策（cache、prefetch、retry），用錯就會被打臉。",
        misconception: "method 不是 cosmetic——基礎設施會根據 method 做行為決策。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "同事說：「狀態碼 200 = 成功，所以只要 response 是 200 就代表 API 沒問題」。對嗎？",
        options: [
          { id: "a", text: "完全正確", correct: false },
          { id: "b", text: "不一定，業務邏輯錯誤可能仍回 200，要看 response body 才知道", correct: true },
          { id: "c", text: "200 其實常常代表失敗", correct: false },
        ],
        explanation:
          "HTTP 狀態碼描述的是「協定層」的成功失敗——request 抵達伺服器、伺服器有回應，就是 200。但業務邏輯成不成功是另一件事。GraphQL API 永遠回 200，錯誤放在 response body 的 errors 欄位。某些 REST API 也會把「使用者輸入錯誤」包成 200 + body 標 error。寫客戶端時不能只信 status code，要看 body。",
        misconception: "200 是「協定成功」，不是「我做的事成功」。",
      },
    ],
    furtherReading: [
      {
        title: "MDN — HTTP overview",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
        why: "HTTP 入門最佳起點，圖示清楚 + method/status 完整列表",
      },
      {
        title: "High Performance Browser Networking — Brief History of HTTP",
        url: "https://hpbn.co/brief-history-of-http/",
        why: "Ilya Grigorik 經典書免費看，從 HTTP/0.9 到 HTTP/2 的演進與性能優化",
      },
    ],
  },
  {
    slug: "network-layers",
    releaseDay: 0,
    level: 1,
    tracks: ["backend","frontend","devops","ai"],
    prerequisites: [],
    assumedKnowledge: [],
    tag: "網路",
    title: "Network Layers（網路分層）",
    hook: "為什麼工程師講網路要分四層、五層、七層？多此一舉嗎？",
    body: `當你打開一個網頁，封包從你的電腦到伺服器要經過幾道處理？實際上至少四層：應用層（HTTP 知道「我要拿什麼網頁」）、傳輸層（TCP/UDP 負責「資料完整送到」）、網路層（IP 負責「找到對方的地址」）、連結層（Ethernet/Wi-Fi 負責「把 0/1 訊號送出去」）。每一層只管自己的事，不管其他層怎麼做。

這個分層的價值是**抽換性**——HTTP 不在乎底層是 Wi-Fi 還是光纖、是 IPv4 還是 IPv6，只要 TCP 能可靠送字串。Wi-Fi 也不在乎你傳的是 HTTP 還是視訊串流，只要把 bytes 送到下一站。OSI 模型有 7 層（多了 session、presentation 兩層中介），TCP/IP 模型有 4 層（合併了那些抽象），實際工程裡 4 層比較常用。`,
    analogy: {
      icon: "📮",
      title: "郵局分工：寫信、地址、運送、配發",
      text: "你寄信時：你寫信內容（應用層）、信封寫地址（網路層）、郵局決定走快遞還是平信（傳輸層）、貨車或飛機運（連結層）。每一層只做自己的事——你寫信不需要知道貨車怎麼開、貨車司機不需要看信件內容。換成電子郵件、傳真、簡訊也是同套流程，只是上層協定變了，下層運送方式不變。",
    },
    analogyHint: "信件、信封、運送方式、貨車各管一段",
    originStory: "OSI 模型 1984 年由 ISO 制定，目標是「全世界統一標準」，定義了 7 層。但 OSI 太理想、太理論——當時 ARPANET 已經跑了十多年的 TCP/IP（4 層），實作簡單、能跑就好。網際網路用 TCP/IP 而不是 OSI 是個歷史轉折——「能用」打敗「完美設計」。今天工程師上課還是學 OSI 7 層（因為 model 漂亮），但寫 code 時看到的多半是 TCP/IP 4 層。Vint Cerf 跟 Bob Kahn 1974 年發表的〈A Protocol for Packet Network Intercommunication〉是 TCP/IP 的起源論文。",
    oneLiner: "分層 = 每一層只做一件事，互不干擾，讓 Wi-Fi 能載 HTTP 也能載視訊。",
    tradeoffs: [
      { label: "✅ 分層的好處", text: "可以單獨升級任何一層（HTTP/1 → HTTP/2 不影響 TCP；IPv4 → IPv6 不影響 HTTP）" },
      { label: "⚠️ 注意", text: "嚴格遵守「每層只看自己」會犧牲性能；現代加速（QUIC、TCP Fast Open）會跨層做優化" },
      { label: "❌ 不適合當聖經", text: "model 是抽象，真實 OS 實作不一定真的有 4 個獨立層；用來看技術書就好" },
    ],
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "在 TCP/IP 模型中，HTTP 屬於哪一層？",
        options: [
          { id: "a", text: "應用層", correct: true },
          { id: "b", text: "傳輸層", correct: false },
          { id: "c", text: "網路層", correct: false },
        ],
        explanation:
          "應用層處理「你想做什麼」的協定 — HTTP（拿網頁）、SMTP（寄信）、SSH（遠端登入）都在這層。傳輸層是 TCP/UDP，處理「可靠傳送 vs 速度優先」。網路層是 IP，處理「找路徑」。應用層的 HTTP 把訊息丟給傳輸層的 TCP 包成可靠連線、TCP 再丟給 IP 路由——每層往下走一層、每層只負責一件事。",
        misconception: "「層級」不是技術層級高低，是抽象責任的分工。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "設計即時遊戲的多人連線，要選 TCP 還是 UDP？",
        options: [
          { id: "a", text: "TCP，因為更可靠、現代網路都用 TCP", correct: false },
          { id: "b", text: "UDP 為主，遊戲狀態可以丟封包但不能等慢；交易、登入這種關鍵動作才用 TCP", correct: true },
          { id: "c", text: "都不對，應該用 HTTP", correct: false },
        ],
        explanation:
          "遊戲的需求是「位置更新要快」——晚到的位置封包不如丟掉、用最新的覆蓋。TCP 為了可靠會重傳丟失的封包，但對遊戲而言這個重傳已經沒用了（玩家已經走到別的地方）。所以即時部分用 UDP，傳輸層自己決定取捨；交易、登入這種「不能弄丟」的部分才用 TCP。這是分層的價值——同一個 app 不同流量可以挑不同傳輸層協定。",
        misconception: "「可靠」不總是好事——要看你的應用對「晚到」跟「丟失」的容忍度。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "同事說：「OSI 7 層比 TCP/IP 4 層更詳細，所以教科書應該以 OSI 為準」。對嗎？",
        options: [
          { id: "a", text: "對，OSI 是國際標準", correct: false },
          { id: "b", text: "不對，實作世界用 TCP/IP，OSI 只是 mental model 對照表", correct: true },
          { id: "c", text: "OSI 跟 TCP/IP 是不相容的", correct: false },
        ],
        explanation:
          "OSI 的 7 層是 1984 年由 ISO 制定的「應該」標準，但實際網路從沒用 OSI 跑——TCP/IP 在 OSI 出現之前已經跑了十多年。今天 OSI 主要是教學用的對照表（「presentation 層大概對應 TLS/壓縮」），但真實 OS、protocol stack、書架上的網路書，講的都是 TCP/IP 4 層。OSI 跟 TCP/IP 不是不相容——是 OSI 是理想設計、TCP/IP 是實際用的。",
        misconception: "「標準」不總是事實上的標準——網際網路的事實標準是 RFC，不是 ISO。",
      },
    ],
    recapQuestion: {
      type: "情境判斷",
      question: "公司網路全面從 IPv4 換成 IPv6，網頁前端的 JavaScript 需要改嗎？",
      options: [
        { id: "a", text: "需要，IP 改了所有網路 call 都會壞", correct: false },
        { id: "b", text: "不需要，分層讓上層協定（HTTP）不感知底層位址格式", correct: true },
        { id: "c", text: "需要，因為 IPv6 的封包格式不一樣", correct: false },
      ],
      explanation:
        "這正是分層設計的核心價值──抽換性。HTTP 跑在 TCP 上、TCP 跑在 IP 上。IP 從 v4 換成 v6，TCP 跟 HTTP 都不用知道：它們收到的還是「可靠送字串」跟「拿網頁」這兩個服務。底層怎麼變上層 code 不感知。如果分層做得不好（層之間 leak），這種升級就要全棧改 code——但 internet 跑了 30 年沒這個問題，正是分層發揮作用。",
      misconception: "分層的價值在「未來改一層不會炸到另一層」。",
    },
    furtherReading: [
      {
        title: "Cloudflare Learning — What is the OSI model?",
        url: "https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/",
        why: "圖示清楚的 7 層解釋，附 OSI vs TCP/IP 對照",
      },
      {
        title: "Beej's Guide to Network Programming",
        url: "https://beej.us/guide/bgnet/",
        why: "C/socket 層級的網路寫實，看完真正知道分層在底層怎麼運作",
      },
    ],
  },
  {
    slug: "data-structures",
    releaseDay: 0,
    level: 1,
    tracks: ["backend","frontend","devops","ai"],
    prerequisites: [],
    assumedKnowledge: [],
    tag: "演算法",
    title: "資料結構基礎",
    hook: "同樣是「存一堆東西」，為什麼要分 array、hash、tree？",
    body: `每個資料結構**對某些操作快、對另一些操作慢**——選錯結構，效能差幾百倍。Array 用連續記憶體，按 index 拿東西超快（O(1)），但插入到中間要把後面所有元素往後推（O(n)）。Hash table 用 hash 函數把 key 對到 slot，按 key 查找超快（O(1) 平均），但要付出記憶體（slot 通常比實際元素多）跟「順序不可控」的代價。

Tree（特別是平衡樹如 B-tree、紅黑樹）的查找比 array 慢（O(log n)），但保留順序、支援範圍查詢——「找出所有 18-25 歲的使用者」hash 做不到、B-tree 三秒搞定。沒有最好的結構，只有最適合當下操作的結構。資料庫 index 用 B-tree、JS 的 Map 用 hash table、字串 join 暫存用 array——每個選擇背後都有「我最常做什麼操作」的判斷。`,
    analogy: {
      icon: "📚",
      title: "排隊（array）vs 字典（hash）vs 家譜（tree）",
      text: "Array 像排隊——按位置找人很快（「第 5 位」），但中間插隊全部要後退一格。Hash 像字典——查「狗」直接翻 D，但你不能問「介於 D 跟 G 之間的字」（沒有順序）。Tree 像家譜——查特定人要走幾層（不像字典直翻），但能輕鬆問「這個人的後代有誰」、「這個年齡層的所有人」。",
    },
    analogyHint: "排隊、字典、家譜各擅長不同事",
    originStory: "資料結構的學術根源在 1960-70 年代，Knuth 的《The Art of Computer Programming》Vol 1 (1968) 是奠基之作。Hash table 由 Hans Peter Luhn 1953 年在 IBM 提出。B-tree 由 Bayer 跟 McCreight 1970 年發明，目標是讓資料庫高效讀寫磁碟。AVL tree (1962)、紅黑樹 (1972) 解決「插入不會讓樹變很歪」的問題。今天的工程師多半不需要從零實作這些——但理解「array vs hash vs tree」的取捨，是看懂資料庫 index 為什麼用 B-tree、redis 為什麼用 hash、git 為什麼用 Merkle tree 的基礎。",
    oneLiner: "資料結構是「對某些操作快、對另一些操作慢」的取捨；選錯結構，效能差幾百倍。",
    tradeoffs: [
      { label: "✅ Array 適合", text: "已知大小、常按 index 拿東西、順序很重要的場景（如 timeline、log）" },
      { label: "⚠️ Hash 注意", text: "沒有順序、且 key 必須能 hash；最壞情況下衝突會退化到 O(n)" },
      { label: "❌ Tree 不適合", text: "只想 O(1) 查找、不需要順序的場景（用 hash 比較划算）" },
    ],
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "「array 的查找是 O(1)」這句話描述的是？",
        options: [
          { id: "a", text: "用 index 拿元素的時間複雜度（如 arr[5]）", correct: true },
          { id: "b", text: "找出 array 裡是否包含某個值的時間複雜度", correct: false },
          { id: "c", text: "array 裡所有操作都是 O(1)", correct: false },
        ],
        explanation:
          "Array 的 O(1) 是指「按 index 拿東西」——因為 array 用連續記憶體，arr[5] 就是「開始位置 + 5×單元大小」，一次運算搞定。但「array 裡有沒有值 X」這種搜尋是 O(n)，要逐一看過。「找最大值」也是 O(n)。混淆「按 index 拿」跟「按值找」是常見誤解。Hash table 的 O(1) 才是「按 key 找值」。",
        misconception: "O(1) 描述的是特定操作，不是整個資料結構的所有操作。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "設計一個「最近 10000 個 log entries」的儲存，要選哪個結構？",
        options: [
          { id: "a", text: "Array (FIFO ring buffer)，按時間順序排列，舊的擠掉", correct: true },
          { id: "b", text: "Hash table，key 是 log id", correct: false },
          { id: "c", text: "Tree，按時間排序", correct: false },
        ],
        explanation:
          "Log 的特性：(1) 大量寫入（append 到尾巴）、(2) 按時間順序、(3) 滿了要丟最舊的。Array 的 ring buffer 完美對應——append 是 O(1)、按 index 也是 O(1)、丟最舊的就是覆寫位置 0。Hash table 沒有順序，「最近 10000 個」這種範圍查詢做不到。Tree 雖然支援順序，但 append 是 O(log n)、記憶體開銷高。Log 的最佳結構是 array。",
        misconception: "選資料結構要看「我會做哪些操作」，不是憑感覺哪個「先進」。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "同事說：「現在記憶體那麼便宜，所有東西都用 hash table，O(1) 最快」。對嗎？",
        options: [
          { id: "a", text: "對，O(1) 永遠是最快的", correct: false },
          { id: "b", text: "不對，hash 不支援範圍查詢、有衝突最壞 O(n)、且喪失順序", correct: true },
          { id: "c", text: "對，但 hash table 比較難實作", correct: false },
        ],
        explanation:
          "Hash table 的 O(1) 是「平均」，最壞情況（所有 key 都 hash 到同一個 slot）會退化到 O(n)。它也犧牲了順序——「給我介於 X 跟 Y 之間的所有 key」hash table 完全做不到，要全表掃。資料庫 index 用 B-tree 不用 hash 就是因為要支援 `WHERE age BETWEEN 18 AND 25`、`ORDER BY` 這種查詢。「速度」要拆解成「哪種操作快」。",
        misconception: "Hash 的 O(1) 是針對「按 key 找值」這一種操作，不是萬用銀彈。",
      },
    ],
    recapQuestion: {
      type: "情境判斷",
      question: "你要實作「最近瀏覽過的 10 個商品」（按時間倒序、不可重複），最適合什麼結構？",
      options: [
        { id: "a", text: "Hash set（O(1) 去重）", correct: false },
        { id: "b", text: "Array（簡單，反正才 10 個）", correct: false },
        { id: "c", text: "保留插入順序的 set／map（同時去重 + 順序）", correct: true },
      ],
      explanation:
        "這題有兩個約束：(1) 去重、(2) 保留順序。純 hash 沒順序、純 array 沒去重。JS 的 Map 本身保留插入順序、Java 的 LinkedHashSet 也是這類「兩個 cover 一次」的結構。看到「同時要 X 跟 Y」的需求，要先問：有沒有單一資料結構同時做到？不要硬把兩個結構黏起來維護一致性。",
      misconception: "選資料結構時要列出「所有」約束再挑，不是看主要約束就拍板。",
    },
    furtherReading: [
      {
        title: "VisuAlgo",
        url: "https://visualgo.net/",
        why: "資料結構動畫網站，按按看就懂 array vs hash vs tree 的差異",
      },
      {
        title: "Big-O Cheat Sheet",
        url: "https://www.bigocheatsheet.com/",
        why: "各種資料結構操作的時間複雜度對照表，一張在桌上很有用",
      },
    ],
  },
  {
    slug: "memory-model",
    releaseDay: 0,
    level: 1,
    tracks: ["backend","frontend","devops","ai"],
    prerequisites: [],
    assumedKnowledge: [],
    tag: "程式設計",
    title: "記憶體模型（Stack vs Heap）",
    hook: "你宣告的變數最後到底放在哪裡？",
    body: `\`let x = 5;\` 跟 \`let arr = [1, 2, 3];\` 這兩個變數放在記憶體哪裡？答案是不同地方——簡單值（數字、布林）放在 stack，物件、陣列放在 heap。Stack 是函式的「便利貼桌面」，函式進入時開一塊空間放區域變數，函式結束就整塊回收，速度快、自動清理但空間有限。Heap 是「倉庫貨架」，動態大小、生命週期不綁函式，但不會自動清理。

這個分工為什麼重要？因為當你寫 \`let b = a;\`，如果 a 是基本型別 stack 直接 copy，b 是新的 5，改 b 不影響 a。但 a 是物件時，stack 上 a 跟 b 都只是「指向 heap 上同一個物件」的 reference——改 b 等於改 a。這就是「pass by value vs pass by reference」混淆的源頭，也是為什麼 immutability 在某些語言這麼重要。`,
    analogy: {
      icon: "📒",
      title: "便利貼桌面 vs 倉庫貨架",
      text: "Stack 像桌上的便利貼——函式來了貼一張，函式走了撕掉，桌面總是乾淨。但便利貼很小，只能寫名字、數字。Heap 像倉庫——大型物件（家具、機台）放這裡，桌上只貼一張寫著「貨架 B-7」的便利貼指過去。你把便利貼遞給別人，兩人都指到同一個貨架上的東西——一個改它，另一個也看到改了。",
    },
    analogyHint: "便利貼桌面（小、快、自動清）vs 倉庫貨架（大、共享、要管理）",
    originStory: "Stack/heap 的記憶體分配概念在 ALGOL 60 (1960) 已經奠定。Stack 設計用來支援函式呼叫的巢狀結構（後進先出），heap 用來放「大小編譯時不知道」的動態物件。這個分工延續到今天的所有現代語言——C/C++、Java、Python、JavaScript 都有 stack/heap 區分，差別只在「誰負責清 heap」：C/C++ 你自己 malloc/free、Java/JS 用 GC 自動清。理解這層分工是看懂 race condition、memory leak、reference 行為等進階主題的基礎。",
    example: {
      code: `let a = 5;
let b = a;          // stack: 兩個獨立的 5
b = 10;
console.log(a);     // → 5（a 沒被改）

let arr1 = [1, 2, 3];
let arr2 = arr1;    // stack: 兩個 ref，都指向 heap 上同一個 array
arr2.push(4);
console.log(arr1);  // → [1, 2, 3, 4]（arr1 也改了！）`,
      note: "第一段 a 跟 b 是獨立的數字（stack 上）。第二段 arr1 跟 arr2 是兩個 reference 指向同一個 array（heap 上的同一塊記憶體）。改 arr2 等於改 arr1——這是無數 JS bug 的源頭。",
    },
    tradeoffs: [
      { label: "✅ Stack 的好處", text: "速度快（連續記憶體、CPU cache 友善）、自動清理（函式結束就回收）" },
      { label: "⚠️ Heap 注意", text: "動態分配比較慢、需要管理生命週期（手動 free 或仰賴 GC）" },
      { label: "❌ Stack 不適合", text: "大型或大小未知的資料、需要在函式間共享的物件" },
    ],
    oneLiner: "Stack 放「值」、heap 放「物件」；變數 = 值（stack）或 reference（heap）。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "JavaScript 裡 `let arr = [1, 2, 3]; let copy = arr;`，`copy.push(4)` 之後 `arr` 變成什麼？",
        options: [
          { id: "a", text: "[1, 2, 3]（arr 不會被影響）", correct: false },
          { id: "b", text: "[1, 2, 3, 4]（arr 跟 copy 是同一個 array 的兩個 reference）", correct: true },
          { id: "c", text: "Error（不能對複製過的 array push）", correct: false },
        ],
        explanation:
          "在 JS 裡 array 是物件、放在 heap。`let copy = arr` 複製的是 reference（指標），不是 array 本身。所以 arr 跟 copy 都指向 heap 上同一塊記憶體——透過任何一個改它，另一個也看到改變。要做真正的「複製」要用 `[...arr]`、`arr.slice()`、`structuredClone(arr)` 等明確產生新物件的方法。",
        misconception: "「複製變數」對基本型別跟物件意義不一樣——前者複製值，後者複製 reference。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "函式裡宣告了一個很大的 array (10 萬個元素)，函式結束之後這個 array 會怎樣？",
        options: [
          { id: "a", text: "留在 heap 上，要等 GC 才回收", correct: true },
          { id: "b", text: "立刻消失，因為函式結束 stack 就清空", correct: false },
          { id: "c", text: "永遠不會回收，造成 memory leak", correct: false },
        ],
        explanation:
          "Array 本身放在 heap（不在 stack）。stack 上只有那個指向 array 的 reference 變數——函式結束時 stack 上的 reference 確實消失。但 heap 上的 array 不會立刻消失，它要等 GC 發現「沒有任何 reference 指著我了」才會清掉。在現代 JS/Java 等 GC 語言裡這通常很快發生，但不是「立刻」。如果有其他地方還持有 reference（如全域變數、closure），array 就不會被清——這是 memory leak 的常見來源。",
        misconception: "Heap 上的東西不是被「函式結束」清掉，是被「沒人指它了」清掉。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "同事說：「我把 array 從函式裡 return 出來，但 array 是 heap 上的，所以 return 之後就沒了」。對嗎？",
        options: [
          { id: "a", text: "對，函式結束 heap 也會清", correct: false },
          { id: "b", text: "不對，return 出去之後外面持有 reference，GC 不會清掉", correct: true },
          { id: "c", text: "對，要用全域變數才不會被清", correct: false },
        ],
        explanation:
          "把 heap 上的物件 return 出去，外面的變數會接住那個 reference。GC 看到「外面還有 reference 指著我」就不會清。所以 array 完全可以 return、可以塞到 callback、可以放到 array 裡——只要還有任何路徑能到達它，它就活著。「函式結束 heap 也清」混淆了 stack 跟 heap：stack 上的東西函式結束就清（local 變數的 box 消失），heap 上的物件由 reference 計數決定生死。",
        misconception: "Heap 的清理由「reachability」決定，不是「scope」決定。",
      },
    ],
    recapQuestion: {
      type: "錯誤假設",
      question: "同事說：「我用 const 宣告陣列就不會被改了，不用做 immutable」。對嗎？",
      options: [
        { id: "a", text: "對，const 鎖住的就是內容", correct: false },
        { id: "b", text: "不對，const 只鎖 stack 上的 reference，heap 上的內容仍可改", correct: true },
        { id: "c", text: "對，但只在 strict mode 才生效", correct: false },
      ],
      explanation:
        "const 跟 immutability 是兩件事。const 鎖住的是 stack 上「這個變數」指向的 reference 不能換——你不能把 const arr 重新指到另一個陣列。但 reference 指向的 heap 上的陣列「內容」完全可以改：arr.push(...)、arr[0] = ... 都合法。要真正 immutable 要靠 Object.freeze、Immer 或語言層的 immutable type（Rust）。誤以為 const = immutable 是 JS bug 常見來源。",
      misconception: "const 鎖的是 reference 本身，不是 reference 指向的內容。",
    },
    furtherReading: [
      {
        title: "MDN — Memory Management",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management",
        why: "JS 的記憶體管理 + GC 入門，含 mark-and-sweep 圖示",
      },
      {
        title: "Computer Science from the Bottom Up — Memory",
        url: "https://www.bottomupcs.com/csbu/memory.html",
        why: "從 OS 層級看 stack/heap 怎麼分配，看完比讀十篇 medium 還清楚",
      },
    ],
  },
  {
    slug: "oop-basics",
    releaseDay: 0,
    level: 1,
    tracks: ["backend","frontend","devops","ai"],
    prerequisites: [],
    assumedKnowledge: [],
    tag: "程式設計",
    title: "OOP 基礎",
    hook: "為什麼一段資料 + 一段函式要綁在一個叫做「物件」的東西裡？",
    body: `OOP 的核心觀察是：**資料跟操作那個資料的程式碼很常一起變動**。一個「銀行帳戶」物件包含「餘額」（資料）跟「存款、提款」（方法）——把它們綁在一起，外人只能透過方法操作餘額，不能直接改數字。這叫做 encapsulation（封裝），是 OOP 的第一個價值。

OOP 的三大組成：encapsulation（資料 + 方法綁一起、隱藏內部細節）、inheritance（子類繼承父類，但會帶來緊耦合的問題，後面會講）、polymorphism（同一個方法名在不同類別有不同行為，例：所有 \`Animal\` 都有 \`speak()\`，但 \`Dog.speak()\` 是「汪」、\`Cat.speak()\` 是「喵」）。實作上 class（類別）是「藍圖」、instance（實例）是「按藍圖蓋出來的房子」——\`new Account()\` 就是按 Account 藍圖蓋一個帳戶物件。`,
    analogy: {
      icon: "🧰",
      title: "工具箱：螺絲起子知道自己怎麼轉",
      text: "螺絲起子是「螺絲頭 + 旋轉動作」綁在一起的物件——你只要說「轉」，它自己處理力的方向、軸心位置。OOP 之前的程式像散落工具：「螺絲頭」（資料）擺一邊、「旋轉動作」（程式碼）另一邊，你要用就要自己組裝。OOP 後物件自帶說明書——`account.deposit(100)` 不需要你知道內部怎麼運算，物件自己懂。",
    },
    analogyHint: "工具自帶使用說明書（封裝）",
    originStory: "OOP 的根源在 Simula 67 (1967)——挪威設計的模擬語言，第一次有「class」的概念。Alan Kay 在 1970 年代發明 Smalltalk 把 OOP 系統化，他原本的設想是「物件之間互傳訊息」（不是函式呼叫）。1980-90 年代 C++、Java 把 OOP 推向主流，今天大部分商業軟體都是 OOP 風格。但 OOP 也有反思——Joe Armstrong（Erlang 作者）批評「你想要一根香蕉、結果拿到一隻拿著香蕉的猩猩跟整個叢林」（諷刺繼承層級太深）。Composition over inheritance 跟函數式程式設計就是對 OOP 過度繼承的反應。",
    example: {
      code: `class Account {
  #balance = 0;          // private 餘額（內部細節）

  deposit(amount) {       // 方法：存款
    if (amount > 0) this.#balance += amount;
  }

  getBalance() {          // 方法：查餘額（不讓人直接改）
    return this.#balance;
  }
}

const a = new Account();  // 從 class 藍圖蓋出實例
a.deposit(100);
console.log(a.getBalance()); // → 100
// a.#balance = 999;       // ❌ 外面摸不到 private`,
      note: "`#balance` 是 private 欄位，外面摸不到——這就是封裝。要存款只能透過 deposit() 方法，方法裡能驗證金額是否合法。換成不用 OOP，餘額就是裸露的變數，任何地方都能 `account.balance = -999`。",
    },
    tradeoffs: [
      { label: "✅ OOP 適合", text: "業務領域有清楚的「實體」（使用者、訂單、付款），且每個實體有自己的行為跟狀態" },
      { label: "⚠️ 注意", text: "繼承層級超過 2-3 層通常會痛苦——父類動一行子類全部受影響；考慮用 composition 替代" },
      { label: "❌ OOP 不適合", text: "純資料流的場景（如資料 pipeline、批次運算）；函數式風格更直接" },
    ],
    oneLiner: "OOP 是「資料 + 操作那資料的程式碼」綁在一起，讓外人不能繞過驗證直接亂動內部。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "「encapsulation（封裝）」在 OOP 裡的意思是？",
        options: [
          { id: "a", text: "把多個 class 包成一個 module", correct: false },
          { id: "b", text: "把資料跟操作那資料的方法綁在一起，並隱藏內部細節", correct: true },
          { id: "c", text: "用繼承重用程式碼", correct: false },
        ],
        explanation:
          "封裝是 OOP 第一個價值——把「資料」（如餘額）跟「合法操作」（如存款、提款）綁在物件內，並把資料藏起來。外面只能透過方法操作，不能直接改。這帶來兩個好處：(1) 驗證在方法裡做（不能存負數），外面繞不過去；(2) 內部實作改了不影響外面（你把餘額從 number 改成 BigDecimal，外面還是用 deposit() 不用改）。option a 是 module；option c 是繼承。",
        misconception: "封裝不是「打包」，是「把資料藏進物件裡，只能透過方法觸碰」。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你要設計一個「使用者」實體，下面四個欄位 (name, password, lastLoginAt, isActive) 怎麼設計？",
        options: [
          { id: "a", text: "全部 public（OOP 沒這麼龜毛）", correct: false },
          { id: "b", text: "password 一定 private；其他依需求決定，但通常 isActive 透過方法（如 deactivate()）操作", correct: true },
          { id: "c", text: "全部 private，永遠不能直接讀", correct: false },
        ],
        explanation:
          "password 一定要 private——任何能直接讀 password 的程式都是漏洞。name 通常 public（讀取多）。lastLoginAt 多半 readonly（外面讀但不該寫）。isActive 通常透過方法改，因為「停用」可能要連動觸發其他事（清 session、發通知）。OOP 不是「全 private」，是「該保護的保護、該開放的開放」。",
        misconception: "封裝是「該藏什麼藏什麼」，不是「全藏」也不是「全露」。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "同事說：「OOP 就是用 class，凡事 class 化就是 OOP」。對嗎？",
        options: [
          { id: "a", text: "對，有 class 就是 OOP", correct: false },
          { id: "b", text: "不對，OOP 的核心是 encapsulation/inheritance/polymorphism 三件事，光寫 class 不算", correct: true },
          { id: "c", text: "對，class 是 OOP 唯一定義", correct: false },
        ],
        explanation:
          "Class 是 OOP 的「載體」，但不是 OOP 本身。如果你寫了 class 但所有欄位都 public、沒有方法、只是當資料容器用，那就只是 struct 換個名字。Alan Kay 原本的 OOP 設想甚至更激進——「物件之間傳訊息」是核心，class 是次要的。Erlang/Smalltalk 風格的 OOP 跟 Java 風格差很大。判斷一段 code 是不是 OOP 看「行為跟資料是否綁在一起、內部細節是否隱藏」，不是看有沒有 `class` 關鍵字。",
        misconception: "Class 是工具，OOP 是設計理念——可以用 class 寫非 OOP 的 code。",
      },
    ],
    furtherReading: [
      {
        title: "MDN — Object-oriented programming",
        url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Object-oriented_programming",
        why: "MDN 的 OOP 入門，圖示清楚 + JS 角度的實作",
      },
      {
        title: "Sandi Metz — Practical Object-Oriented Design (POODR)",
        url: "https://sandimetz.com/poodr",
        why: "Ruby 社群最有名的 OOP 設計書，講 OOP 該怎麼用、不該怎麼用",
      },
    ],
  },
  {
    slug: "embedding",
    releaseDay: 0,
    level: 1,
    tracks: ["backend","ai"],
    prerequisites: [],
    assumedKnowledge: [],
    tag: "AI",
    title: "Embedding（向量表示）",
    hook: "怎麼讓電腦判斷「貓」跟「狗」比「貓」跟「微積分」更接近？",
    body: `答案是把每個詞、每個句子、甚至每張圖**轉成一串數字**——通常是 1536 維或 768 維的向量。這個轉換過程叫 embedding，神奇之處在於：意思相近的東西，向量距離也近。「貓」可能是 [0.21, -0.05, 0.73, ...]，「狗」是 [0.19, -0.08, 0.71, ...]，兩者餘弦相似度很高；但「微積分」是 [0.92, 0.34, -0.41, ...]，跟「貓」差很遠。

Embedding 的價值在於把「意思相近」這件事**從文字比對升級成數學運算**。傳統文字搜尋只能匹配「狗」這個字，找不到「犬類」、「汪星人」。Embedding 之後可以做語意搜尋——「我家的喵喵生病了」找得到「貓飼主應該注意的健康徵兆」這篇文章，即使兩篇沒有任何共同字。RAG、向量資料庫、推薦系統、語意搜尋的底層都是 embedding。`,
    analogy: {
      icon: "🗺",
      title: "把每個詞放在地圖上的座標",
      text: "想像一張很大的地圖（不是 2D，是 1536 維），每個詞都被擺在某個座標。「貓」「狗」「兔子」聚在「寵物」區、「微積分」「線性代數」聚在「數學」區、「悲傷」「難過」聚在「負面情緒」區。「我家的喵喵」這個句子也有一個座標，落在「寵物」區附近——這就是為什麼搜尋「我家的喵喵」會找到「貓的健康」相關文章，雖然字不同但座標近。",
    },
    analogyHint: "把意義放進地圖座標",
    originStory: "Embedding 的概念在 NLP 領域早就存在（如 1990 年代的 LSA），但真正引爆是 2013 年 Tomas Mikolov 在 Google 發表的 word2vec——首次大規模證明「word embedding 學到語意」（著名的 `king - man + woman ≈ queen`）。2018 年 BERT 把 embedding 從詞推到句子層級。今天的 LLM（GPT、Claude）內部每個 token 都是 embedding。OpenAI 的 text-embedding-3 系列、Cohere 的 embed v3 等 API 把 embedding 變成商品——你給文字、我回 1536 維向量，剩下的搜尋、相似度比較交給你。RAG 的興起讓 embedding 從研究走進每個 AI 應用的工具箱。",
    tradeoffs: [
      { label: "✅ Embedding 適合", text: "語意搜尋、推薦系統、RAG、文字分群、找相似圖片" },
      { label: "⚠️ 注意", text: "embedding 是「黑箱對映」——同樣的字在不同 model 上向量完全不同，model 升級就要重新 embed 全部資料" },
      { label: "❌ 不適合", text: "精確匹配（找 SKU、特定 ID）反而 SQL 更快；對「不在訓練分布裡」的詞效果差" },
    ],
    oneLiner: "Embedding 把意義變成座標，讓「相近」從字面比對升級成數學距離。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "「embedding」這個詞在 AI 裡的意思是？",
        options: [
          { id: "a", text: "把資料壓縮成更小的檔案", correct: false },
          { id: "b", text: "把文字、圖片等內容轉成固定長度的向量，使語意相近的內容向量距離也近", correct: true },
          { id: "c", text: "一種神經網路架構", correct: false },
        ],
        explanation:
          "Embedding 是「映射到向量空間」的概念——把任何輸入（文字、圖片、聲音）轉成固定長度的數字陣列（如 1536 維），且這個映射有個關鍵性質：相似的輸入產生相似的向量。這跟「壓縮」不同——壓縮是把資料變小可逆還原；embedding 是抽取「意義」、不可逆。也不是一種網路架構——它是「網路的某層輸出」，可以從不同架構（word2vec、BERT、CLIP）取得。",
        misconception: "Embedding 不壓縮資料、不還原資料——它把資料映射到「意義空間」。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你要做一個「找相似商品」的功能，使用者搜尋「無線藍牙耳機」。下列哪個方案最適合？",
        options: [
          { id: "a", text: "用 SQL `LIKE '%無線藍牙耳機%'`", correct: false },
          { id: "b", text: "把所有商品名字 + 描述 embed 成向量，用搜尋字的向量找最近的幾個", correct: true },
          { id: "c", text: "用全文搜尋（full-text search），比 LIKE 快但概念一樣", correct: false },
        ],
        explanation:
          "LIKE 跟 full-text search 都是「字面匹配」——找到「無線藍牙耳機」找不到「TWS 耳塞」、「無線耳塞式」、「bluetooth headphone」。Embedding + 向量搜尋能抓到語意相似——TWS、無線耳塞、bluetooth 都會落在「耳機類」附近。這是電商搜尋體驗的一大升級。但純精確匹配（找 SKU、找特定型號）embedding 反而不準，那種還是 SQL 強。混合架構是業界常態。",
        misconception: "字面匹配跟語意匹配是不同問題——「找相似」不是「字一樣」。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "同事說：「我用了 OpenAI embedding，所以我的搜尋很準」。對嗎？",
        options: [
          { id: "a", text: "對，OpenAI 是最強的", correct: false },
          { id: "b", text: "不一定，embedding 品質受文字長度、領域、語言、預處理等影響大", correct: true },
          { id: "c", text: "對，只要有 embedding 就一定準", correct: false },
        ],
        explanation:
          "Embedding 不是黑魔法——它的品質取決於：(1) 你 embed 的文字是不是訓練 model 的領域（醫學、法律、特殊行業可能要 fine-tune）、(2) 文字長度（embedding 通常對短句子準、長文章要切 chunk）、(3) 語言（多數 model 對英文最好、中日韓略遜）、(4) 預處理（清掉 HTML、保留專有名詞）。直接呼叫 API 不保證準確——常見的失敗模式是「embedding 看起來都很相近」（向量空間塌縮）。要看 retrieval 在實際資料上的 hit rate 才知道行不行。",
        misconception: "Embedding 不是即插即用，要看領域跟資料品質。",
      },
    ],
    furtherReading: [
      {
        title: "OpenAI — Embeddings Guide",
        url: "https://platform.openai.com/docs/guides/embeddings",
        why: "官方文件含 use case 範例 + 實作 cookbook",
      },
      {
        title: "Word2Vec Tutorial — The Skip-Gram Model",
        url: "http://mccormickml.com/2016/04/19/word2vec-tutorial-the-skip-gram-model/",
        why: "從 word2vec 講起，看完真正知道 embedding 怎麼從訓練學到語意",
      },
    ],
  },

  {
    slug: "websocket",
    releaseDay: 5,
    level: 2,
    tracks: ["backend","frontend"],
    prerequisites: ["http-basics"],
    assumedKnowledge: ["TCP 連線概念"],
    tag: "API 設計",
    title: "WebSocket",
    hook: "為什麼 chat、即時遊戲、即時報價要用 WebSocket，不能直接用 HTTP？",
    body: `HTTP 是「你問一句、我回一句」的對話模式——即使連續多次 request 都是獨立的，伺服器無法主動跟你說話。如果你要做 chat、即時報價、多人協作編輯，這個限制就麻煩了：別人送出訊息後，怎麼讓你的瀏覽器立刻收到？最爛的解法是 polling（每秒問一次「有沒有新的」），效能差且延遲高。

WebSocket 用一次 HTTP 升級換一條**長連的雙向通道**。客戶端跟伺服器透過一個 TCP 連線維持「永遠開著」的對話——任何一方想說話就直接送，不用每次重新建連線。代價是「stateful」連線：每個 WebSocket 連線都會綁在某台伺服器上（不像 HTTP 可以隨機 load balance），讓水平擴展、autoscaling、deploy 都複雜一級。`,
    analogy: {
      icon: "📞",
      title: "電話 vs 寫信",
      text: "HTTP 像寫信——你寄一封、對方回一封，每次都要開信封、寫地址。WebSocket 像電話——接通之後雙方都能說話，誰要講就直接講，掛斷前不用重新撥號。寫信簡單但慢，電話即時但要佔線。電話線一斷，整通對話都得從頭。",
    },
    analogyHint: "寫信（HTTP）vs 電話（WebSocket）",
    originStory:
      "WebSocket 在 2008 年由 Ian Hickson（Google）在 HTML5 規格裡提出，2011 年 IETF 訂為 RFC 6455。它解決了 2000 年代瀏覽器依賴 long-polling、Comet 等 hack 模擬 server push 的痛苦。第一個大規模商業使用是 Trello、Slack（2013-）的即時協作。今天的 chat、即時報價、多人遊戲、Google Docs 協作都跑在 WebSocket 上。但對 deploy 不友善的特性（連線跟伺服器綁定）也催生了 SSE（Server-Sent Events）跟 long-polling 的回歸——不是誰取代誰，是不同情境的取捨。",
    example: {
      code: `// HTTP polling: 每 2 秒問一次
setInterval(() => fetch("/messages").then(...), 2000);

// WebSocket: 開一條連線之後雙向訊息
const ws = new WebSocket("wss://api.example.com/chat");
ws.onmessage = (e) => addMessage(JSON.parse(e.data));
ws.send(JSON.stringify({ text: "hello" }));`,
      note: "polling 每 2 秒打一次伺服器、即使沒新訊息；WebSocket 連線開著、有訊息就送、雙方都能 send。延遲從「平均 1 秒」降到「網路 RTT」。",
    },
    tradeoffs: [
      { label: "✅ 適合", text: "chat、即時遊戲、即時報價、多人協作——任何需要伺服器主動 push 的場景" },
      { label: "⚠️ 注意", text: "stateful 連線讓水平擴展複雜（要考慮 sticky session 或 message broker）；deploy 時得處理進行中的連線" },
      { label: "❌ 不適合", text: "大部分 RESTful API、簡單請求-回應模式——用 HTTP 就好，不要過度工程" },
    ],
    oneLiner: "WebSocket 是「打電話」級的協定——一次升級、雙方即時互通，但連線要綁伺服器。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "WebSocket 跟 HTTP 最大的差別是？",
        options: [
          { id: "a", text: "WebSocket 比 HTTP 快 10 倍", correct: false },
          { id: "b", text: "WebSocket 開了一條雙向通道，伺服器可以主動傳訊息給客戶端", correct: true },
          { id: "c", text: "WebSocket 是加密的、HTTP 不是", correct: false },
        ],
        explanation:
          "WebSocket 不是「比 HTTP 快」，是「通信模式不同」。HTTP 是 request-response（客戶端問、伺服器回），伺服器無法主動發起對話。WebSocket 升級後變成持久連線，雙方任何一方想說就說——這叫「全雙工」。加密問題不分 HTTP/WebSocket——`https://` / `wss://` 才表示加密，`http://` / `ws://` 都不是。",
        misconception: "WebSocket 不是「更快的 HTTP」，是「不同模式的協定」。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你的服務需要每 5 分鐘抓股價更新給使用者，要選 WebSocket 還是 HTTP？",
        options: [
          { id: "a", text: "WebSocket，因為更先進", correct: false },
          { id: "b", text: "HTTP polling 或 SSE，5 分鐘一次的低頻率不需要長連線的開銷", correct: true },
          { id: "c", text: "都可以、隨意", correct: false },
        ],
        explanation:
          "WebSocket 適合「高頻率、雙向」的場景。5 分鐘抓一次股價不僅頻率低、而且只需要伺服器→客戶端單向。維持 WebSocket 連線（每個使用者一條 TCP 連線）耗伺服器資源，這個成本對 5 分鐘 polling 是浪費。HTTP polling 或 Server-Sent Events 比較合適。協定選擇要看「頻率 + 方向 + 連線成本」三個維度，不是「越即時越好」。",
        misconception: "WebSocket 不是「即時 = 用它」，是「真的需要雙向高頻率才用」。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "同事說：「我們的 chat 上 WebSocket，autoscaling 應該跟 HTTP 一樣容易吧？」對嗎？",
        options: [
          { id: "a", text: "對，WebSocket 也是 HTTP 升級的，沒差別", correct: false },
          { id: "b", text: "不對，WebSocket 連線跟特定伺服器綁定，scale 時要處理 sticky session 跟訊息廣播", correct: true },
          { id: "c", text: "對，現代 cloud provider 都自動處理", correct: false },
        ],
        explanation:
          "WebSocket 連線是 stateful 的——連在 server A 的 user，他的訊息要送到 server B 上的 user 時，server A 不知道 server B 有那個人。autoscaling 加減 server 時現有連線會中斷。解決需要 message broker（Redis pub/sub、Kafka）讓 servers 互相廣播訊息，加上 sticky session 讓使用者持續綁同一台 server，或在 deploy 時做 graceful shutdown 等待現有連線結束。complexity 比 HTTP 高一個量級。",
        misconception: "WebSocket 的 deploy / scale 複雜度比 HTTP 高很多，是它最大的隱形成本。",
      },
    ],
    recapQuestion: {
      type: "情境判斷",
      question: "要做股票報價即時 push 給網頁前端，伺服器單向送資料就好。WebSocket vs SSE 哪個更合適？",
      options: [
        { id: "a", text: "WebSocket，因為比較先進", correct: false },
        { id: "b", text: "SSE — 單向 push 是它甜蜜點、HTTP 相容、瀏覽器自動重連", correct: true },
        { id: "c", text: "都可以、隨意", correct: false },
      ],
      explanation:
        "SSE 是 server → client 單向 push 的標準方案。WebSocket 雙向但你只用一個方向 = 過度工程。SSE 還內建自動重連（Last-Event-ID 續斷點），WebSocket 要自己寫 reconnection。LLM token streaming、股票報價都用 SSE。「即時 = WebSocket」是常見誤解。",
      misconception: "「即時」≠「WebSocket」——單向場景 SSE 更輕量、相容性也更好。",
    },
    furtherReading: [
      {
        title: "MDN — WebSockets API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
        why: "MDN 入門 + 完整 API 參考，含 ws/wss、frame、close code 等細節",
      },
      {
        title: "The Genius and Folly of WebSockets — High Scalability",
        url: "https://highscalability.com/the-genius-and-folly-of-websockets/",
        why: "深入討論 WebSocket 在大規模系統的取捨，特別是 scale / deploy 痛點",
      },
    ],
  },

  {
    slug: "long-polling",
    releaseDay: 3,
    level: 2,
    tracks: ["backend", "frontend"],
    prerequisites: ["http-basics"],
    assumedKnowledge: ["HTTP request-response 模式"],
    tag: "網路",
    title: "Long-polling（長輪詢）",
    hook: "你想做即時通知，但又不想動用 WebSocket，還有別的辦法嗎？",
    body: `普通 polling 是每幾秒打一次伺服器問「有沒有新東西」——多數時候沒新東西，浪費請求、又延遲到下次 poll 才知道。Long-polling 是它的進化：客戶端送一個 HTTP request，**伺服器收到後不立刻回**，而是「先掛在那」直到真的有新訊息或 timeout，再一次回給客戶端。客戶端收到後立刻再發下一個 request，形成連續的「等待 → 回覆 → 再等待」循環。

對伺服器來說，一個請求可能被掛 30 秒，這段時間連線開著但不在做事。對客戶端來說，一旦有事件就**馬上**收到，延遲降到接近即時。代價是每次事件後仍要重建一次 HTTP request（比 WebSocket 多 round-trip），伺服器要養很多「掛起來」的請求（吃 socket 跟記憶體）。Long-polling 是 WebSocket 出現前最主流的「假即時」方案，現在還活著是因為它對 proxy / firewall 友善——純 HTTP，到處跑得動。`,
    analogy: {
      icon: "⏳",
      title: "排隊等叫號 vs 一直跑去問",
      text: "普通 polling 像每 5 分鐘跑去櫃台問「我的號到了嗎」——多半被擋回來、又錯過剛叫完的當下。Long-polling 是抽完號就站在櫃台前面等：員工有結果才叫你、沒結果就叫你繼續等。你不用一直跑、員工也不用一直應付詢問。代價是櫃台前面站一堆人，門面比較難看。",
    },
    analogyHint: "站在櫃台前等叫號（long-polling）vs 一直跑去問（普通 polling）",
    originStory:
      "Long-polling 是 2000 年代瀏覽器要做「即時」的妥協方案。當年沒有 WebSocket、只有 HTTP，但網頁要做 chat、stock ticker、線上協作，工程師發明了 long-polling 這套 hack：把一個 HTTP request 掛 30 秒當「準雙向通道」。Comet 是當時的代名詞，背後幾乎都是 long-polling 或 forever-frame。Facebook 早期 chat、GTalk 在 Gmail 裡的 widget、Trello 通知都是 long-polling。WebSocket（2011）跟 SSE 出現後它退居二線，但今天 socket.io 預設仍會 fallback 到 long-polling，因為某些企業 proxy 還是不支援 WebSocket。",
    example: {
      code: `// 普通 polling
setInterval(async () => {
  const r = await fetch("/messages?since=" + lastId);
  // 多半 r.empty === true，浪費請求
}, 2000);

// Long-polling: 伺服器掛住到有事才回
async function loop() {
  while (true) {
    const r = await fetch("/messages?since=" + lastId);
    // 伺服器 hold 到有 message 或 25s timeout 才回
    handleMessages(await r.json());
  }
}
loop();`,
      note: "普通 polling 平均延遲 = 間隔 / 2。Long-polling 延遲 ≈ 0，但伺服器要養 N 條掛住的連線。Loop 自然形成：回來立刻發下一個。",
    },
    tradeoffs: [
      { label: "✅ 適合", text: "需要近即時但 client 是純 HTTP 環境（怕 proxy 擋 WebSocket、走得通 HTTPS 就可以）" },
      { label: "⚠️ 注意", text: "每個事件多一次 round-trip（reconnect 成本）；伺服器要 hold 大量閒置連線，連線數 ≈ 線上用戶數" },
      { label: "❌ 不適合", text: "高頻雙向通訊（chat 暴量、即時遊戲）——WebSocket 才能持續壓榨 throughput" },
    ],
    oneLiner:
      "Long-polling 是把 HTTP 請求掛起來當通道——即時性接近 WebSocket、相容性完美，代價是每個事件一次 reconnect。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "Long-polling 跟普通 polling 最大的差別是？",
        options: [
          { id: "a", text: "Long-polling 用更長的 polling 間隔", correct: false },
          { id: "b", text: "Long-polling 由伺服器決定何時回覆——沒事件就 hold 住 connection", correct: true },
          { id: "c", text: "Long-polling 是雙向通訊、普通 polling 是單向", correct: false },
        ],
        explanation:
          "「Long」不是指 polling 間隔長，是指**伺服器把 request 掛住的時間長**。普通 polling 是客戶端固定頻率問、伺服器立刻回（多半「沒有」）。Long-polling 是客戶端問了之後伺服器先不回，等到有事件或 timeout 才回。兩者都是客戶端 → 伺服器發起，不是雙向；雙向是 WebSocket 的事。差別在於「誰決定回覆時機」。",
        misconception: "Long-polling 的「long」是伺服器掛住請求的時間，不是 client 端 poll 的間隔。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你要做網頁 chat，客戶端在大公司網路、多數 proxy 不允許 WebSocket。應該選什麼？",
        options: [
          { id: "a", text: "強制用 WebSocket、要求公司開白名單", correct: false },
          { id: "b", text: "Long-polling 或 SSE——純 HTTP 流量幾乎所有 proxy 都通", correct: true },
          { id: "c", text: "用普通 polling、每秒 1 次就好", correct: false },
        ],
        explanation:
          "WebSocket 用 HTTP Upgrade，部分企業 proxy 會拒絕或斷線。Long-polling 跟 SSE 都是純 HTTP request——proxy 看到就是普通「慢一點才回」的請求，相容性最好。普通 polling 每秒 1 次延遲是 0~1 秒、流量是 long-polling 的 N 倍，沒理由選它。socket.io 等 library 預設就是 WebSocket → 失敗時自動 fallback long-polling，這個策略就是這道題的標準答案。",
        misconception: "「WebSocket 才能做即時」是錯的——long-polling / SSE 都能做，差在 throughput 跟 connection 模型。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "工程師說：「long-polling 比普通 polling 少打很多次 server，效能一定比較好」對嗎？",
        options: [
          { id: "a", text: "對，request 次數少當然好", correct: false },
          { id: "b", text: "不對，long-polling 雖然請求次數少，但伺服器要 hold 大量開啟的 connection，記憶體跟 fd 都是成本", correct: true },
          { id: "c", text: "對，伺服器 hold connection 不耗資源", correct: false },
        ],
        explanation:
          "long-polling 的隱形成本是 connection。如果有 10 萬個使用者線上，伺服器就要同時 hold 10 萬條開啟的 TCP connection（每條都吃 file descriptor、TCP buffer、應用層的 thread 或 event loop slot）。普通 polling 則是同一時間只有少量 active request、連線開了就關。哪個比較好取決於使用者數 vs 事件頻率：低使用者 + 高事件頻率時 long-polling 贏；高使用者 + 稀有事件時普通 polling 可能還比較省。沒有絕對的「比較好」。",
        misconception: "減少 request 次數 ≠ 省資源——hold 住的 idle connection 一樣是成本。",
      },
    ],
    recapQuestion: {
      type: "錯誤假設",
      question: "工程師說：「我們上 long-polling 就跟 WebSocket 一樣 real-time 了」對嗎？",
      options: [
        { id: "a", text: "對，使用者體驗差不多", correct: false },
        { id: "b", text: "不對，long-polling 每個事件後要重建 HTTP request，有 reconnect 成本；WebSocket 是一條持續開的 TCP connection", correct: true },
        { id: "c", text: "對，且 long-polling 更省 server 資源", correct: false },
      ],
      explanation:
        "long-polling 是「掛起 HTTP request 等事件」——一旦伺服器回 response，connection 就結束、client 要再發新 request。每個事件附帶一次 round-trip 跟新 TCP / TLS handshake 成本。WebSocket 是一條持續開的 socket，事件直接 push 過去，沒 reconnect。在高頻率訊息場景兩者差距更明顯。但對 proxy / firewall 相容性 long-polling 又比 WebSocket 友善——這是取捨。",
      misconception: "long-polling 看似即時，但 throughput 跟 reconnect cost 跟 WebSocket 還是有量級差異。",
    },
    furtherReading: [
      {
        title: "MDN — Concept of long-polling",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Long_polling",
        why: "MDN 一頁講完原理、code 範例與 timeout 處理",
      },
      {
        title: "Flannel — Slack's edge cache for WebSocket / long-polling",
        url: "https://slack.engineering/flannel-an-application-level-edge-cache-to-make-slack-scale/",
        why: "看 Slack 怎麼用兩種方案 fallback、邊緣 cache 怎麼設計",
      },
    ],
  },

  {
    slug: "sse",
    releaseDay: 4,
    level: 2,
    tracks: ["backend", "frontend", "ai"],
    prerequisites: ["http-basics"],
    assumedKnowledge: ["HTTP response stream / chunked encoding"],
    tag: "網路",
    title: "SSE（Server-Sent Events）",
    hook: "如果只需要伺服器單向 push 訊息給客戶端，為什麼要動用 WebSocket？",
    body: `SSE（Server-Sent Events）是「半 WebSocket」——伺服器可以主動 push 訊息給瀏覽器，但**只有一個方向**（server → client）。底層仍是一條 HTTP response，伺服器不關閉、持續寫資料下去，client 用瀏覽器內建的 EventSource API 監聽。每筆訊息是一段簡單文字格式：\`data: hello\\n\\n\`。

SSE 跟 WebSocket 的關鍵差異：(1) 單向：client 想送資料要另外開 HTTP request，(2) 純 HTTP：proxy / firewall 不會擋，(3) 內建自動重連：連線斷掉時瀏覽器自動重連，並用 \`Last-Event-ID\` header 告訴伺服器斷在哪、繼續從那送，(4) 文字格式：不像 WebSocket 可以傳 binary。它最適合「伺服器持續推送」的場景：股票報價、即時通知、AI chat 的 token streaming、log tailing。GPT、Claude 的 streaming response 大多用 SSE。`,
    analogy: {
      icon: "📻",
      title: "電台廣播 vs 對講機",
      text: "WebSocket 像對講機——雙方都能按下 talk。SSE 像電台廣播——電台一直在播、你只能聽不能說。Long-polling 是不斷打電話進 call-in 節目——每次只能問一個問題。要單向接收訊息、廣播又便宜可靠，選電台就對了。",
    },
    analogyHint: "電台廣播（SSE）：伺服器一直播、你只能聽",
    originStory:
      "SSE 在 2004 年由 Opera 提出、2009 年進 HTML5 規格、2015 年成為 W3C 標準。早期沒紅，因為 WebSocket 比較全能。轉折點是 2022 年 ChatGPT 上線——OpenAI 的 streaming response 用 SSE（每個 token 一筆 data），讓全世界的 AI 應用突然發現「我們不需要 WebSocket、只要 server push token 就好」。Anthropic、Cohere、Mistral 全部跟進。今天 SSE 在 LLM streaming 場景幾乎是默認協定——比起 WebSocket 簡單太多。",
    example: {
      code: `// Server (Node/Express)
app.get("/stream", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });
  const timer = setInterval(() => {
    res.write(\`data: \${JSON.stringify({ time: Date.now() })}\\n\\n\`);
  }, 1000);
  req.on("close", () => clearInterval(timer));
});

// Client
const es = new EventSource("/stream");
es.onmessage = (e) => console.log(JSON.parse(e.data));
// 斷線自動重連、瀏覽器幫你處理`,
      note: "Server 把 response 保持開啟、每筆訊息以 `data: ...\\n\\n` 寫出去。Client 端 EventSource 內建重連 + Last-Event-ID 機制，工程師不用自己寫 reconnection logic。",
    },
    tradeoffs: [
      { label: "✅ 適合", text: "伺服器單向 push（LLM token streaming、通知、log tail、即時報價）；要免費的 reconnect 機制" },
      { label: "⚠️ 注意", text: "只能 text、不能 binary；client → server 要另開 HTTP request；瀏覽器對同 origin SSE 並發連線有限制（通常 6 條）" },
      { label: "❌ 不適合", text: "雙向高頻訊息（chat、即時遊戲）——選 WebSocket；二進位傳輸（檔案 / 影音串流）——HTTP 或 WebSocket binary 比較合適" },
    ],
    oneLiner: "SSE 是 HTTP 上的「伺服器廣播」——單向、純文字、內建自動重連，是 LLM streaming 的默認協定。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "SSE 跟 WebSocket 的主要差別是？",
        options: [
          { id: "a", text: "SSE 比較快", correct: false },
          { id: "b", text: "SSE 只能 server → client 單向、純 HTTP、自動重連；WebSocket 是雙向、需要 upgrade", correct: true },
          { id: "c", text: "SSE 不能用於即時應用", correct: false },
        ],
        explanation:
          "三點關鍵差異：(1) 方向：SSE 單向（server → client），WebSocket 雙向。Client 要 send data 給 server 在 SSE 場景要另開 HTTP request。(2) 協定：SSE 是普通 HTTP response chunked、WebSocket 是 HTTP upgrade 後變成自己的 frame protocol。(3) 重連：SSE 瀏覽器內建（含 Last-Event-ID 恢復），WebSocket 要自己寫。SSE 並非「不能即時」——LLM streaming 就是即時 SSE 應用。",
        misconception: "SSE 不是「弱化版 WebSocket」，是「不同場景的工具」——LLM token push 用 SSE 比 WebSocket 還合適。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "做 GPT 風格 chat UI、要把 LLM 一個一個 token 即時 push 給前端，應該選什麼？",
        options: [
          { id: "a", text: "WebSocket，因為比較先進", correct: false },
          { id: "b", text: "SSE——server 單向 push tokens、前端 EventSource 收、自動重連節省工程", correct: true },
          { id: "c", text: "HTTP polling 每 100ms 拉一次", correct: false },
        ],
        explanation:
          "LLM token streaming 是經典的 SSE 場景：(1) 單向：token 只需要 server → client，user input 已經在 request 裡送過了，沒必要動用雙向。(2) 純文字：token 就是文字，binary 沒有用。(3) 重連：SSE 自動重連讓你不用自己寫 retry 邏輯。OpenAI、Anthropic、Cohere、Google AI 的 streaming endpoint 全部用 SSE。WebSocket 在這個場景反而是過度工程——需要管理 connection lifecycle，但只有一個方向在用。polling 100ms 一次延遲又高、又浪費請求。",
        misconception: "「即時」不等於「WebSocket」——LLM streaming、伺服器通知、log tail 都更適合 SSE。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "新人問：「SSE 不能傳 binary，是不是很弱？」對嗎？",
        options: [
          { id: "a", text: "對，連 binary 都不能傳的協定很受限", correct: false },
          { id: "b", text: "不對，SSE 不傳 binary 是設計取捨——交換的是純 HTTP 相容性、proxy 友善、自動重連、實作極簡", correct: true },
          { id: "c", text: "對，所以業界都改用 WebSocket", correct: false },
        ],
        explanation:
          "工具的設計取捨不是「弱」。SSE 故意不支援 binary，因為它的目標就是「在 HTTP 上做最簡單的 server push」。換來的好處：(1) Proxy / firewall 100% 友善，(2) 瀏覽器免費實作自動重連（含斷點續傳），(3) Server 端實作極簡——一行 res.write 就送一筆訊息，不用 frame protocol。需要 binary 用 WebSocket 或 HTTP；需要簡單可靠的 server push 用 SSE。LLM streaming 是文字的，完美命中 SSE 甜蜜點。「能做更多」≠「比較好」。",
        misconception: "SSE 不傳 binary 是設計選擇、不是缺陷——減法換來簡單跟可靠。",
      },
    ],
    furtherReading: [
      {
        title: "MDN — Server-Sent Events",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events",
        why: "MDN 入門 + EventSource API + 自動重連機制",
      },
      {
        title: "OpenAI streaming API docs",
        url: "https://platform.openai.com/docs/api-reference/streaming",
        why: "看 production-grade SSE 怎麼用在 LLM token streaming",
      },
    ],
  },

  {
    slug: "load-balancer",
    releaseDay: 11,
    level: 2,
    tracks: ["backend", "devops"],
    prerequisites: ["network-layers"],
    assumedKnowledge: ["OSI 七層概念", "TCP / HTTP request 結構"],
    tag: "網路",
    title: "Load Balancer（L4 vs L7）",
    hook: "100 台 web server 後面，到底是誰決定每個 request 去哪一台？",
    body: `Load Balancer（負載均衡器）是分散流量的中間人——你有 100 台 web server，使用者發 request 進來，LB 決定每個 request 該丟給哪一台。最直覺的選擇是 round-robin（輪流），但生產環境會用更聰明的策略：least-connections（送給最不忙的）、IP hash（同 IP 永遠去同一台、做 session affinity）、weighted（強的機器多分流量）。

LB 分兩大層次：**L4（傳輸層）** 跟 **L7（應用層）**。L4 只看 TCP/UDP packet header（IP + port）就決定路由——速度極快、但不懂 HTTP 內容，沒辦法看 URL 路由、做 SSL termination、加 header。L7 解開 HTTP request，看到 URL / method / header / cookie 才路由——能做 \`/api/*\` 送 backend、\`/static/*\` 送 CDN，能做 rate limiting、A/B testing、header injection，但每筆 request 都要 parse HTTP，慢一個量級。實務上常常 L4 在外（先擋 DDoS、分發到資料中心）+ L7 在內（細粒度應用層路由）兩層串接。HAProxy、Nginx、AWS ALB（L7）/ NLB（L4）都是這套體系裡的不同位置。`,
    analogy: {
      icon: "🚦",
      title: "高速公路收費站 vs 餐廳領台",
      text: "L4 像收費站——只看你哪個車道、ETC 標籤、車牌——快速放行，不問你要去哪。L7 像餐廳領台——「兩位、不抽菸區、不要靠廁所」——根據需求安排座位。前者吞吐高、後者貼心。生產環境通常先收費站擋一波（L4 快又便宜），進來再領台（L7 細緻）。",
    },
    analogyHint: "L4 收費站只看車道；L7 領台懂需求",
    originStory:
      "硬體 LB 在 1990 年代由 F5、Cisco 主導，當時 web 流量爆炸、單台 server 不夠，工程師需要「在 server 前放一台機器分流」。早期都是 L4——當時 CPU 跑 HTTP parsing 還是很貴。2010 年代 Nginx 跟 HAProxy 普及讓軟體 L7 LB 變主流，因為 CPU 夠快、且應用層路由的需求（多 service、A/B test、canary）越來越複雜。雲端化後 AWS 把這兩種包成不同產品：ALB（Application = L7）跟 NLB（Network = L4）。Kubernetes 的 Service / Ingress 也是 LB——ClusterIP 是 L4、Ingress 是 L7。理解 L4/L7 差異，看 cloud architecture diagram 就不會再霧煞煞。",
    example: {
      code: `# L4 LB（HAProxy）：只看 TCP、按 IP/port 分流
frontend tcp_front
    bind *:5432
    mode tcp
    default_backend pg_pool
backend pg_pool
    mode tcp
    server db1 10.0.0.1:5432 check
    server db2 10.0.0.2:5432 check

# L7 LB（HAProxy）：看 HTTP、按 path 分流
frontend http_front
    bind *:80
    mode http
    acl is_api path_beg /api
    use_backend api_pool if is_api
    default_backend web_pool`,
      note: "L4 模式只能做「全部送過去、按 connection 分」；L7 模式可以解 HTTP header / path 後再決定哪個 backend。同一個 HAProxy，mode tcp vs mode http 就是兩個世界。",
    },
    tradeoffs: [
      { label: "✅ L4 適合", text: "資料庫連線、TCP-only service、超高 throughput（百萬 QPS）、入口層擋 DDoS" },
      { label: "✅ L7 適合", text: "多 service 共用一個入口（path-based routing）、SSL termination、rate limit、A/B 測試、header 改寫" },
      { label: "⚠️ 注意", text: "L7 比 L4 慢一個量級且耗 CPU；L4 看不到 HTTP 內容、debug 時沒有 access log 等應用層資訊" },
    ],
    oneLiner: "L4 LB 只看 IP/port——快但笨；L7 LB 解 HTTP——慢但靈活。大型架構通常 L4 + L7 串接。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "L4 跟 L7 Load Balancer 最關鍵的差別是？",
        options: [
          { id: "a", text: "L4 比較新、L7 比較舊", correct: false },
          { id: "b", text: "L4 只看 TCP/IP header 做路由；L7 看到 HTTP application 內容（URL、header）", correct: true },
          { id: "c", text: "L4 只能用在 web、L7 只能用在 database", correct: false },
        ],
        explanation:
          "L4 vs L7 對應 OSI 模型：L4 是傳輸層（TCP/UDP）——LB 只看 packet 的 IP + port 就決定路由、不解開 payload。L7 是應用層（HTTP/gRPC）——LB 把 packet 組合回完整 HTTP request 後再看 URL、method、header 路由。差別不在新舊（兩種都是現在主流）、也不在用途方向（database 連線常用 L4、HTTP 服務多用 L7，但都可以反過來）。差別在於「LB 看到多深的資訊才決定路由」。",
        misconception: "L4 不是「比較舊的」，是「比較淺的」——快、笨、但 throughput 高。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "API gateway 要根據 path 把 `/api/users` 送 user service、`/api/orders` 送 order service，要 L4 還是 L7？",
        options: [
          { id: "a", text: "L4，因為比較快", correct: false },
          { id: "b", text: "L7，因為要看 HTTP path 才能決定路由", correct: true },
          { id: "c", text: "都可以", correct: false },
        ],
        explanation:
          "path-based routing 是 L7 的標準場景——需要解開 HTTP request 看到 URL path 才能決定要送 user-service 還是 order-service。L4 只看 TCP packet，看不到 `/api/users` 這個資訊（它在 HTTP payload 裡），無法做到。「都可以」也不對——L4 根本沒有這個能力。AWS ALB、Nginx Ingress、Kong、Envoy 等所有 API gateway 都是 L7。",
        misconception: "「快」不是萬能藉口——做不到的事就是做不到。L7 比 L4 慢、但 path routing 只能 L7 做。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "資深工程師說：「我們在 L7 LB 前面再加一層 L4 LB 是重複設計、應該拿掉一層」對嗎？",
        options: [
          { id: "a", text: "對，兩層 LB 是浪費", correct: false },
          { id: "b", text: "不對，L4 + L7 串接是常見模式——L4 負責快速分發 / 擋 DDoS、L7 負責細粒度應用層路由", correct: true },
          { id: "c", text: "對，現代雲端只要一層 ALB 就夠", correct: false },
        ],
        explanation:
          "Production 大規模架構常常兩層串接：(1) 最外層 L4 LB（例如 AWS NLB 或 anycast IP）負責跨 region/AZ 分發、擋 SYN flood / DDoS——快、便宜、單機可處理百萬 connection。(2) 內層 L7 LB（例如 ALB / Nginx Ingress）才做 path-based routing、SSL termination、rate limit。L4 像高速公路收費站、L7 像餐廳領台——你不會在餐廳門口擺收費站、也不會在高速公路收費站問你想坐哪桌。CloudFlare → AWS NLB → AWS ALB → ECS 是常見組合。",
        misconception: "L4 跟 L7 不是「擇一」、是分工——大規模架構通常兩層串接，各做各擅長的事。",
      },
    ],
    furtherReading: [
      {
        title: "AWS — Elastic Load Balancing（ALB vs NLB）",
        url: "https://aws.amazon.com/elasticloadbalancing/features/",
        why: "看 cloud provider 怎麼把 L4 / L7 包成兩種產品、適用場景",
      },
      {
        title: "Cloudflare — What is layer 7 load balancing?",
        url: "https://www.cloudflare.com/learning/performance/what-is-layer-7-load-balancing/",
        why: "Cloudflare 的 L7 角度解釋，含 SSL termination、global anycast 等實務細節",
      },
    ],
  },

  {
    slug: "service-mesh",
    releaseDay: 28,
    level: 3,
    tracks: ["backend", "devops"],
    prerequisites: ["kubernetes", "load-balancer"],
    assumedKnowledge: ["微服務基本概念", "HTTP / gRPC inter-service 通訊"],
    tag: "工程",
    title: "Service Mesh",
    hook: "100 個微服務之間互相呼叫，要怎麼一致處理 retry / timeout / mTLS / 觀測？難道每個服務都自己寫一遍？",
    body: `微服務拆得越細，服務間呼叫就越多。每條呼叫都需要：retry policy、timeout、circuit breaker、mTLS 加密、tracing header 傳遞、metrics 上報、流量切換⋯ 如果每個服務都自己寫一份，100 個服務就有 100 個版本——升級一致性、語言差異、bug 修補都是地獄。

Service Mesh 把這些「服務間通訊的共通需求」拉到**基礎設施層**：每個服務 pod 旁邊放一個 sidecar proxy（如 Envoy），所有 inbound/outbound 流量都先經過它。Sidecar 負責 retry / mTLS / 觀測，應用程式就只寫 business logic。Control plane（如 Istio / Linkerd）統一管所有 sidecar 的設定，你改一個 YAML 就讓全部服務套用新的 retry 策略。注意 mesh 主要管 east-west（服務間）通訊；ingress / 對外加密通常還是另一層（Ingress controller / API gateway）。代價是延遲多一跳（每個請求進出 sidecar）、complexity 上升一個量級——你多了一整層 control plane + N 個 sidecar 要監控、升級、備援、debug。`,
    analogy: {
      icon: "📞",
      title: "公司總機 vs 每個人自己接電話",
      text: "沒 mesh 像每個員工自己接外線——錄音規格、轉接邏輯、加密協議 100 個版本。加 mesh 像每個員工配一個總機助理 (sidecar)——所有電話先過助理，公司一聲令下「全員改成加密通話」助理就統一切換，員工渾然不覺。代價是多一個轉手延遲。",
    },
    analogyHint: "員工自接 vs 配總機助理",
    originStory:
      "Service Mesh 概念在 2016 年由 Linkerd（Buoyant）提出，將過去散在各服務內的「communication layer」抽出來。2017 Google 跟 IBM 推出 Istio，靠 Envoy 做 data plane、加上強大的 control plane API（VirtualService、DestinationRule 等），一度成為 Kubernetes 上 mesh 的 de facto。但 Istio 的學習曲線跟營運成本太高，2020 後 Linkerd（用 Rust 寫的微 proxy）跟 Cilium Mesh（基於 eBPF）開始反撲——Cilium 跳過 user-space sidecar 額外的 process 開銷（仍有 eBPF 攔截 overhead，但延遲明顯較低）。今天的趨勢是「不要一上來就用 mesh」——先確定你的微服務數真的撐起這層複雜度再導入。",
    example: {
      code: `# Istio: 全域 retry policy，零行 application code 改動
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: orders-service
spec:
  hosts: ["orders"]
  http:
  - retries:
      attempts: 3
      perTryTimeout: 2s
      retryOn: 5xx,reset,connect-failure
    route:
    - destination:
        host: orders
        subset: v2`,
      note: "這份 YAML 套上去，所有呼叫 orders service 的流量自動有 retry。沒 mesh 的話，每個 caller 都要自己寫 retry library + 對齊版本。",
    },
    tradeoffs: [
      { label: "✅ 適合", text: "10+ 微服務、需要統一 retry / mTLS / 觀測 / 流量切換的場景；多語言架構（Go + Node + Python 混用）" },
      { label: "⚠️ 注意", text: "每跳多一個 proxy = +1-5ms 延遲；control plane 本身要監控、升級、備援；debug 變難（多一層介入點）" },
      { label: "❌ 不適合", text: "<10 個服務、單一語言、團隊小（< 20 工程師）— 直接在語言層用 library（如 Resilience4j、gRPC interceptor）解決即可，導入 mesh 反而拖累 velocity" },
    ],
    oneLiner: "Service Mesh 把服務間通訊的共通需求（retry / mTLS / 觀測）抽到 sidecar——複雜度從應用層搬到基礎設施層。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "Service Mesh 的 sidecar proxy 解決了什麼問題？",
        options: [
          { id: "a", text: "讓服務跑得更快", correct: false },
          { id: "b", text: "把 retry / mTLS / 觀測等共通通訊邏輯從應用程式抽到基礎設施層，統一管理", correct: true },
          { id: "c", text: "取代 Kubernetes Service / Ingress", correct: false },
        ],
        explanation:
          "Sidecar 攔截所有進出 pod 的流量，把過去要每個服務 caller 自己寫的 retry、timeout、circuit breaker、mTLS、metrics 上報等通用邏輯統一在 proxy 處理。應用程式只需專注 business logic。不會讓服務「跑得更快」（多一跳反而多 1-5ms 延遲），也不取代 K8s Service（後者是 service discovery + load balancing，mesh 是 application-layer 治理）。",
        misconception: "mesh 是「加法」（加治理能力），不是「替代」(取代 K8s 內建路由)，也不是「優化」（不會變快）。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你們公司 8 個微服務、全部 Go 寫的、團隊 12 人。要不要導入 Istio？",
        options: [
          { id: "a", text: "要，現代微服務架構必備", correct: false },
          { id: "b", text: "不要，規模還沒到痛點。直接用 Go 的 gRPC interceptor / resilience library 就好", correct: true },
          { id: "c", text: "要，順便把 K8s 一起導入", correct: false },
        ],
        explanation:
          "Service Mesh 的價值在「多服務 + 多語言 + 需要統一治理」的場景。8 個服務 + 單一語言 + 12 人團隊，導入 Istio 會：(1) 維護 control plane 的 operational burden（要監控、升級、備援、debug 都變難）大於它解決的問題；(2) Go 已經有 gRPC retry interceptor、resilience4j 這些 library 可在語言層解決；(3) 學習成本（Envoy filter、VirtualService、DestinationRule⋯）會吃掉 1-2 個工程師。等服務數量、團隊規模、多語言需求都到位再導入。",
        misconception: "「現代微服務必備 Service Mesh」是 over-engineering — 規模沒到的時候它就是負擔。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "工程師說：「我們上 Istio 之後系統會更穩定」對嗎？",
        options: [
          { id: "a", text: "對，retry / circuit breaker 內建", correct: false },
          { id: "b", text: "不一定。Istio 給你工具但不會自動穩定，反而引入一整層新的失敗模式（sidecar bug、control plane 中斷、proxy 設定錯誤）", correct: true },
          { id: "c", text: "對，自動 mTLS 把網路問題都解決了", correct: false },
        ],
        explanation:
          "Mesh 提供能力，不等於自動穩定。常見新失敗模式：(1) Sidecar 本身 OOM 或 crash，業務服務跟著掛；(2) Control plane (istiod) 掛掉，新 pod 啟動拿不到設定；(3) VirtualService YAML 寫錯一個欄位，全公司流量被導錯；(4) Envoy 版本升級踩 regression；(5) control plane 故障期間 cert 無法 rotate，最終導致服務間 TLS 失效。每個失敗模式都是新債。Istio 帶來「強大 + 高複雜度」，需要團隊有專門 SRE 維護才能真正穩定。",
        misconception: "「工具強大」≠「結果穩定」。新工具會帶新 failure modes，總風險是相加的。",
      },
    ],
    recapQuestion: {
      type: "情境判斷",
      question: "8 個 Go 微服務、12 人團隊，要不要導入 Service Mesh？",
      options: [
        { id: "a", text: "要，業界標配", correct: false },
        { id: "b", text: "不要 — 規模沒到痛點，用 language-level library (gRPC interceptor) 就夠", correct: true },
        { id: "c", text: "看老闆", correct: false },
      ],
      explanation:
        "Mesh 的成本（control plane 維護 / debug 複雜度 / 學習曲線）只有在多語言 + 多服務（>10）+ 大團隊（>20）才會被它的價值蓋過。小規模直接 library 解。",
      misconception: "「業界標配」往往等於「沒考慮自己情境」的標籤。",
    },
    furtherReading: [
      {
        title: "Istio docs — What is Istio?",
        url: "https://istio.io/latest/docs/concepts/what-is-istio/",
        why: "官方對 mesh + control plane 架構解釋最清楚的一份",
      },
      {
        title: "Buoyant Blog — The Service Mesh: What every software engineer needs to know",
        url: "https://buoyant.io/service-mesh-manifesto",
        why: "Linkerd 創辦人 William Morgan 講 mesh 的 value prop 跟邊界 — 比 Istio docs 更實務",
      },
      {
        title: "Cilium Mesh — Sidecar-free service mesh",
        url: "https://cilium.io/use-cases/service-mesh/",
        why: "看 eBPF-based 的下一代 mesh 怎麼跳過 sidecar 延遲開銷，理解未來趨勢",
      },
    ],
  },

  {
    slug: "5g",
    releaseDay: 29,
    level: 3,
    tracks: ["devops"],
    prerequisites: ["network-layers", "tcp-vs-udp"],
    assumedKnowledge: ["移動通訊基本概念", "latency / bandwidth 差異", "雲端基本概念（cloud region / latency)"],
    tag: "網路",
    title: "5G（不只是更快的 4G）",
    hook: "5G 看新聞天天講，但你的 backend 真的因為 5G 變了什麼嗎？速度更快只是表象。",
    body: `行銷講 5G 強調「速度比 4G 快 100 倍、下載一部電影只要 3 秒」——這是 mmWave 高頻段（如 28 GHz / 39 GHz）在最佳條件下的理論值。實際上 mmWave 訊號穿牆能力差、覆蓋範圍只有幾百公尺，你日常用的還是 sub-6 GHz 頻段，速度比 4G 快 2-5 倍而已。如果只關注「速度」，5G 對大部分後端架構沒影響。

對工程師真正重要的是三個結構性變化：(1) **網路切片（Network Slicing）**——把實體網路切成多個邏輯網路，每個 slice 給不同 SLA（自駕車要 1ms 超低延遲、IoT 感測器要海量連接、影音要高頻寬），讓「面向特定 use case 的網路」變可能。(2) **邊緣運算（MEC, Multi-access Edge Computing）**——把運算從中央 cloud 推到基地台旁邊，URLLC（Ultra-Reliable Low-Latency Communications）能做到 1ms 端到端延遲，工廠自動化、AR/VR 才用得起。(3) **海量連接**——每平方公里支援 100 萬個裝置，IoT 規模質變。對絕大多數 web app，5G 不會改變你的 backend 設計；但邊緣推論、即時遊戲、自動化系統會吃到實際好處。`,
    analogy: {
      icon: "🛣",
      title: "高速公路 vs 專用車道",
      text: "4G 像一條 6 線高速公路，所有車（影音、簡訊、IoT 感測器、自駕車控制訊號）混在一起。5G slicing 像把高速公路切成「貨車專用」「救護車優先」「自駕車封閉道」等多條獨立路網——每條都有自己的 SLA。MEC 則像在交流道旁邊蓋小型物流中心，貨不用拉到中央倉再分送。",
    },
    analogyHint: "切割車道（slicing） + 在地物流中心（MEC）",
    originStory:
      "5G 正式商用始於 2019 年（韓國、美國），但早期被當成「4G+」賣。真正的轉折點是 2021-2022 年「Standalone (SA)」架構部署——之前的 NSA（Non-Standalone）只是把 5G radio 接到 4G core network 上，沒法實現 slicing 或低延遲承諾。SA 版本才能跑完整 5G 功能。截至 2026 年，全球 SA 5G 涵蓋率約 30%，許多運營商還在過渡中。這也是為什麼很多「5G 應用」實際上跑在 NSA 上，效能跟 4G 沒太大差別。",
    example: {
      code: `// 對 backend 開發者，5G 的實際影響檢核表
// 通常答案是 (3)，少數場景才會是 (1) 或 (2)
function does5GMatterForMyApp() {
  // 1. 端到端 1ms 延遲，且使用者在 MEC 覆蓋區
  if (needsUrllc() && userInMecZone()) return "yes, redesign for edge";

  // 2. 需要 IoT 大規模連接（10K+ devices/cell）
  if (massiveIot() && perCellDensity() > 10_000) return "yes, choose mMTC slice";

  // 3. 其他通通是 marketing
  return "no, 4G is fine. 5G just adds bandwidth headroom.";
}`,
      note: "判斷 5G 對你的服務是否關鍵的三個維度：URLLC（超低延遲）、massive IoT（海量連接）、enhanced mobile broadband（高頻寬）。前兩個是真有差異，第三個對大多數 web app 來說 4G 已夠用。",
    },
    tradeoffs: [
      { label: "✅ 真的有差", text: "工業自動化（< 5ms 控制延遲）、AR/VR 即時繪製、自駕車車聯網、大規模 IoT 感測（智慧城市、農場）" },
      { label: "⚠️ 看情況", text: "雲端遊戲、即時影音串流——理論上有低延遲好處，但實際還要看 MEC 部署、終端裝置、運營商 SLA" },
      { label: "❌ 沒差別", text: "一般 web app、API、電商、社群——4G/WiFi 已夠用，5G 提供的是頻寬餘裕而非結構性改變。不要為了「5G」改架構。" },
    ],
    oneLiner: "5G 的工程價值在切片 + 邊緣運算，不在「速度」。對大多數 web app 等於 4G+，對 URLLC / massive IoT 才是質變。",
    questions: [
      {
        id: 1,
        type: "概念辨識",
        question: "「5G 比 4G 快 100 倍」這句話對工程師的意義是？",
        options: [
          { id: "a", text: "我的 backend 終於可以做即時串流了", correct: false },
          { id: "b", text: "理論最大值在最佳 mmWave 條件下成立，sub-6 GHz 實測快 2-5 倍。對大部分 web app 無結構性影響", correct: true },
          { id: "c", text: "5G 主要讓行動裝置受惠，固網（家用 / 辦公室 wired）跟它沒關係", correct: false },
        ],
        explanation:
          "「快 100 倍」是 mmWave 在無干擾、近距離、視線清晰的理論峰值——日常 sub-6 GHz 頻段實測只快 2-5 倍。對 backend 來說這個速度差大多被吸進「使用者覺得 app 開比較快」這種主觀感受，不會改變你的架構決策。Option C 也錯——5G base station 後面還是有線 backhaul（光纖回中央），固網跟 5G 在運營商網路裡是同個體系；5G 只改 last-mile radio access。真正改變後端的是 slicing + MEC，不是速度。",
        misconception: "「5G = 更快」是行銷話術；對工程師重要的是 slicing + 邊緣運算這兩個結構性能力。",
      },
      {
        id: 2,
        type: "情境判斷",
        question: "你做了一個雲端遊戲 backend，用戶在台北、server 在東京 AWS。5G 能讓你的端到端延遲變多低？",
        options: [
          { id: "a", text: "1ms — URLLC 規格寫的", correct: false },
          { id: "b", text: "看情況：5G radio 端到 base station 約 1-5ms，但東京 server 還是 30-50ms 物理距離擋著，只省 radio 那一段", correct: true },
          { id: "c", text: "10ms — 5G 標準延遲", correct: false },
        ],
        explanation:
          "URLLC 的 1ms 指「端到 base station」的 air interface 延遲——你的 server 在東京，封包還要經過運營商核心網、海纜、AWS internal routing。物理距離本身就 ~30ms 光速 RTT，5G 解決不了。要拿到 URLLC 的承諾，你的 server 必須跑在 MEC（基地台旁邊），這需要跟運營商談合約 + 重新設計部署。一般 cloud region 跑 5G 終端使用者，省下的只是 access network 那一段（從 4G 的 20-50ms 縮到 1-5ms）。",
        misconception: "5G 的低延遲承諾要 MEC 配合才能兌現——server 在傳統 cloud region 拿不到 1ms。",
      },
      {
        id: 3,
        type: "錯誤假設",
        question: "PM 說：「我們要做 5G 行動 app，backend 需要重寫嗎？」",
        options: [
          { id: "a", text: "要，5G 是全新的協議堆疊", correct: false },
          { id: "b", text: "不用。5G 動 L1-L3，application layer 完全不變。只有要利用 slicing 或部署到 MEC 才要改架構", correct: true },
          { id: "c", text: "要，HTTP/3 是 5G 必備", correct: false },
        ],
        explanation:
          "5G 在 OSI 模型只動 L1-L3（radio、傳輸、網路層）。應用層（HTTP、TCP/UDP、TLS）完全沒變——你的 backend 收到的 request 跟 4G 一模一樣，只是更快。「重寫 backend」唯二理由：(1) 要利用 slicing（要跟運營商簽 SLA、配置不同 slice ID）、(2) 部署到 MEC（要把服務搬到基地台邊緣節點）。HTTP/3 是 transport layer 改進，跟 5G 無關（4G + HTTP/3 也可以）。",
        misconception: "5G 是 radio/network layer 改變，application layer 完全不動——「5G app」這個概念多半是 marketing。",
      },
    ],
    recapQuestion: {
      type: "情境判斷",
      question: "「我要做 5G app，要重寫 backend 嗎？」對 99% 的 web app，正確答案是？",
      options: [
        { id: "a", text: "要，5G 是全新協議", correct: false },
        { id: "b", text: "不用——5G 動 L1-L3，application layer 完全不變。只有要用 slicing 或 MEC 才要改", correct: true },
        { id: "c", text: "看 PM", correct: false },
      ],
      explanation:
        "5G 改的是 radio + transport + network layer，application layer（HTTP、TCP、你的 API）完全沒動。「5G app」這個概念在 99% 的場景是 marketing，不是工程現實。",
      misconception: "新基礎設施不必然帶來新 app — 要看影響的是哪一層。",
    },
    furtherReading: [
      {
        title: "Network Slicing for 5G — Cisco",
        url: "https://www.cisco.com/c/en/us/solutions/service-provider/5g-network/network-slicing.html",
        why: "業界對 slicing 的實作面解釋，含跟 MPLS / SDN 的關係",
      },
      {
        title: "What is Multi-Access Edge Computing (MEC)? — ETSI",
        url: "https://www.etsi.org/technologies/multi-access-edge-computing",
        why: "MEC 的標準制定者，文件最權威，理解架構必看",
      },
      {
        title: "5G Standalone vs Non-Standalone — Ericsson",
        url: "https://www.ericsson.com/en/blog/2019/4/standalone-and-non-standalone-5g",
        why: "為什麼很多「5G」其實只是 NSA、跟 4G 沒太大差別 — 一定要看",
      },
    ],
  },
];

export function getConceptBySlug(slug) {
  return concepts.find((c) => c.slug === slug);
}

export function getConceptByReleaseDay(releaseDay) {
  return concepts.find((c) => c.releaseDay === releaseDay);
}

export function getNextConceptByReleaseDay(releaseDay) {
  return concepts.find((c) => c.releaseDay === releaseDay + 1);
}
