// 完整 10 個概念。每個都用 Day 1 / Day 2 的結構與 voice 撰寫。

export const concepts = [
  {
    day: 1,
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
    hook: "同一個網頁，為什麼從台灣打開比從美國打開快？",
    body: `你的網站伺服器在某個機房（比如美西）。每個訪客的請求都要跨太平洋抵達伺服器、再傳資料回去——光速雖快，但繞地球半圈仍會有 100-200ms 延遲。內容越大（圖、影片）等越久。

CDN（Content Delivery Network）的解法：把靜態資源（圖、CSS、JS、影片）複製到全球幾百個邊緣節點。台灣的訪客就近從台灣節點拿，美國訪客從美國節點拿。代價是 cache invalidation——當你更新檔案時，要怎麼讓所有節點都同步？這是 CDN 永遠的難題。`,
    analogy: {
      icon: "🏪",
      title: "全國便利商店 vs 總部直送",
      text: "沒 CDN 像物流中心只設在台北，南部下單也從台北送，慢。有 CDN 像每個城市都有便利商店——客戶就近取貨，快。但商品上架要同步到所有店——更新一個價格要跑遍全國。",
    },
    analogyHint: "全國倉庫 vs 總部直送",
    tradeoffs: [
      { label: "✅ 適合", text: "大量靜態資源、跨國使用者、影音串流、突發流量" },
      { label: "⚠️ 注意", text: "Cache invalidation 麻煩；熱門檔案可能還在舊版本一陣子" },
      { label: "❌ 不適合", text: "高度動態、個人化的內容（每人看到不同）" },
    ],
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
  },
  {
    day: 4,
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
    tradeoffs: [
      { label: "✅ 適合", text: "知識頻繁更新、私有/特定領域資料、需要可追溯來源" },
      { label: "⚠️ 注意", text: "檢索品質決定一切，垃圾進垃圾出；chunking 與 re-ranking 是 80% 的工程量" },
      { label: "❌ 不適合", text: "純創意/推理任務（不需外部知識），或資料量小到能直接放進 prompt" },
    ],
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
  },
  {
    day: 5,
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
    tradeoffs: [
      { label: "✅ 適合用 TCP", text: "HTTP、Email、檔案傳輸、銀行交易（資料正確性 > 速度）" },
      { label: "⚠️ 注意", text: "TCP 的擁塞控制在不穩定網路會「越來越慢」" },
      { label: "❌ 不適合用 TCP", text: "視訊串流、線上遊戲、DNS 查詢（即時性 > 完美性）" },
    ],
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
  },
  {
    day: 6,
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
    tradeoffs: [
      { label: "✅ 適合", text: "微服務部署、開發/測試/生產環境一致、CI/CD pipeline" },
      { label: "⚠️ 注意", text: "Image 容易變胖；有狀態的服務（資料庫）要額外處理 volume" },
      { label: "❌ 不適合", text: "對啟動延遲敏感到 ms 級的場景、需要直接操作硬體的應用" },
    ],
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
  },
  {
    day: 7,
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
    tradeoffs: [
      { label: "✅ 適合加 index", text: "常用於 WHERE / JOIN / ORDER BY 的欄位、唯一性高的欄位" },
      { label: "⚠️ 注意", text: "區分度低的欄位（如 boolean、性別）加 index 幫助有限" },
      { label: "❌ 不適合加 index", text: "寫入頻繁但鮮少查詢的欄位、表本身很小（< 幾千筆）" },
    ],
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
  },
  {
    day: 8,
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
    tradeoffs: [
      { label: "✅ 適合", text: "跨服務授權、第三方應用整合、行動 App 登入" },
      { label: "⚠️ 注意", text: "Token 設計、refresh token 管理是常見漏洞點；scope 要設小" },
      { label: "❌ 不適合", text: "只有自家服務的內部驗證（殺雞用牛刀）" },
    ],
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
  },
  {
    day: 9,
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
    tradeoffs: [
      { label: "✅ 適合 Webhook", text: "低頻但即時的事件（金流、CI 完成、訂閱變動）" },
      { label: "⚠️ 注意", text: "你的 endpoint 要可靠、要驗簽、要冪等處理（避免重複觸發）" },
      { label: "❌ 不適合 Webhook", text: "接收端在防火牆內無法被外部 callback、需要保證每筆都收到的場景" },
    ],
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
  },
  {
    day: 10,
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
    tradeoffs: [
      { label: "✅ 適合", text: "語意搜尋、推薦系統、RAG 的檢索層、相似圖/影片找回" },
      { label: "⚠️ 注意", text: "向量是 embedding 模型生成的，模型差就全部都差；維度大時要用 HNSW、IVF 等近似演算法" },
      { label: "❌ 不適合", text: "精確比對、結構化查詢、事務一致性要求高的場景" },
    ],
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
  },
  {
    day: 11,
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
    tradeoffs: [
      { label: "✅ 適合", text: "微服務 10+ 個、需要自動擴縮、跨環境一致部署、有 SRE 能維護" },
      { label: "⚠️ 注意", text: "K8s 自身是分散式系統；網路、儲存、權限、監控全套都要懂；學習曲線陡" },
      { label: "❌ 不適合", text: "1-3 個服務的小團隊、無 SRE、單體應用——用 PaaS（Vercel/Render/Fly.io）省心 10 倍" },
    ],
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
  },
  {
    day: 12,
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
    tradeoffs: [
      { label: "✅ 適合 gRPC", text: "微服務間高頻通訊、需要強 schema、雙向 streaming、效能敏感" },
      { label: "⚠️ 注意", text: "瀏覽器要 gRPC-Web proxy；debugging 工具鏈比 REST 弱；protobuf 學習成本" },
      { label: "❌ 不適合 gRPC", text: "公開 API、需要瀏覽器直連、簡單 CRUD、團隊對 protobuf 不熟" },
    ],
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
  },
  {
    day: 13,
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
    tradeoffs: [
      { label: "✅ 適合 EC", text: "社群動態、按讚數、CDN、DNS、購物車、推薦系統——容忍秒級不一致" },
      { label: "⚠️ 注意", text: "衝突解決邏輯複雜（last-write-wins 不總是對；用 CRDT 或 vector clock 取捨）" },
      { label: "❌ 不適合 EC", text: "金融餘額、庫存扣減、唯一性檢查、ID 生成——必須強一致" },
    ],
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
  },
  {
    day: 14,
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
    tradeoffs: [
      { label: "✅ 適合 cache-aside", text: "通用 read-heavy 場景；應用想完全控制 cache 邏輯" },
      { label: "⚠️ 注意", text: "Cache invalidation 是兩大難題之一；TTL 太長會 stale，太短就失去 cache 意義" },
      { label: "❌ 不適合", text: "強一致需求（金融餘額）、寫遠多於讀、資料隨時都不同（個人化計算結果）" },
    ],
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
  },
  {
    day: 15,
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
    tradeoffs: [
      { label: "✅ 適合 token bucket", text: "Web API、允許突發流量、保護自家容量（OpenAI、Twitter API、GitHub API）" },
      { label: "⚠️ 注意", text: "多實例部署要用 Redis 集中計數，否則 N 個 server 各算各的，實際限額放大 N 倍" },
      { label: "❌ 不適合 token bucket", text: "下游極脆弱完全不能 burst（用 leaky bucket）；計費精確到秒（用 sliding window）" },
    ],
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
  },
  {
    day: 16,
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
];

export function getConceptByDay(day) {
  return concepts.find((c) => c.day === day);
}

export function getNextConcept(day) {
  return concepts.find((c) => c.day === day + 1);
}
