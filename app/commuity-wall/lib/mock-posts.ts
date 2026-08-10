// 共學牆假資料。之後會換成真實 Supabase 查詢結果，
// 欄位命名與型別請盡量對齊未來的 wall_posts 資料表，方便之後直接替換資料來源。

export type WallPostKind = "project" | "note" | "agent";

// scene 欄位保留在資料結構裡（單篇頁還是會顯示情境標籤），
// 但列表頁已不再用它做篩選，所以沒有對應的篩選用 SCENE_OPTIONS / isWallPostScene 了。
export type WallPostScene = "課業" | "實習" | "職涯" | "日常";

export type WallPostStatus = "draft" | "published";

export type WallPost = {
  id: string;
  kind: WallPostKind;
  title: string;
  bodyMd: string;
  coverUrl: string;
  links: { label: string; url: string }[];
  startingPoint: string; // 必填：我原本的程度
  timeSpent: string; // 必填：花了多久
  obstacle: string; // 必填：卡在哪、怎麼解決
  scene: WallPostScene[];
  authorName: string;
  authorAvatarUrl: string;
  likeCount: number;
  status: WallPostStatus;
  createdAt: string; // 假日期字串（YYYY-MM-DD），用來排序「最新」文章
};

export const KIND_LABELS: Record<WallPostKind, string> = {
  project: "專案",
  note: "筆記",
  agent: "Agent",
};

// 雜誌風格卡片用的摘要：直接從 bodyMd 擷取前 N 字，不另外新增摘要欄位。
export function getExcerpt(text: string, maxLength = 45): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// 依 createdAt 由新到舊排序後，取出某個 kind 底下所有已發布的文章。
// 卡片牆的 carousel、三個分類總覽子頁面都共用這個函式。
export function getPublishedPostsByKind(
  posts: WallPost[],
  kind: WallPostKind
): WallPost[] {
  return posts
    .filter((post) => post.status === "published" && post.kind === kind)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
}

// 留言／回饋假資料。之後會換成真實留言系統的資料表，目前只用來在
// 「讀書會筆記」（kind = 'note'）單篇頁純展示，還不能真的送出新留言。
export type Comment = {
  id: string;
  postId: string; // 對應哪篇文章（WallPost.id）
  authorName: string;
  content: string;
  createdAt: string; // 先用假的日期字串即可
};

export const mockComments: Comment[] = [
  {
    id: "c1",
    postId: "8",
    authorName: "小凱",
    content:
      "聽完你分享的「畫圖追蹤呼叫堆疊」方法，我終於搞懂之前寫的遞迴函式為什麼會爆 stack，謝謝！",
    createdAt: "2026-05-03",
  },
  {
    id: "c2",
    postId: "8",
    authorName: "小雨",
    content: "我原本也卡在遞迴的終止條件，看完這篇筆記後回去重寫，作業終於過了。",
    createdAt: "2026-05-04",
  },
  {
    id: "c3",
    postId: "8",
    authorName: "小婷",
    content: "推薦大家搭配課本第五章一起看，這篇筆記把抽象的概念講得很具體。",
    createdAt: "2026-05-05",
  },
  {
    id: "c4",
    postId: "9",
    authorName: "阿仁",
    content:
      "這週聽完你分享 fine-tuning 跟 RAG 的比較表，解決了我專題一直在糾結要選哪個技術路線的問題。",
    createdAt: "2026-07-02",
  },
  {
    id: "c5",
    postId: "9",
    authorName: "小華",
    content:
      "之前做 agent 專題誤用 fine-tuning 處理原本該用 RAG 解的問題，看完筆記才發現方向錯了，週末來調整。",
    createdAt: "2026-07-03",
  },
];

export function getCommentsForPost(postId: string): Comment[] {
  return mockComments.filter((comment) => comment.postId === postId);
}

export const mockWallPosts: WallPost[] = [
  {
    id: "1",
    kind: "project",
    title: "從零打造一個個人記帳網站",
    bodyMd:
      "第一次嘗試獨立完成一個全端專案，用 HTML/CSS/JS 加上簡單的後端 API，記錄每天的收支並畫出圖表。",
    coverUrl: "https://picsum.photos/seed/wall1/400/240",
    links: [
      { label: "GitHub Repo", url: "https://github.com/example/budget-app" },
      { label: "線上 Demo", url: "https://example.com/budget-demo" },
    ],
    startingPoint: "只會寫基本的 HTML 和 CSS，沒寫過任何 JavaScript 邏輯，也沒碰過後端。",
    timeSpent: "大約花了 3 週，每天下班後投入 1-2 小時。",
    obstacle: "卡在前後端資料串接一直失敗，後來發現是 CORS 設定沒開，查了官方文件加上一行設定就解決了。",
    scene: ["職涯", "日常"],
    authorName: "小美",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=1",
    likeCount: 12,
    status: "published",
    createdAt: "2026-06-10",
  },
  {
    id: "2",
    kind: "project",
    title: "校內黑客松：從發想到上台簡報",
    bodyMd:
      "紀錄一次校內黑客松三天內從零做出一個 MVP 的完整過程，包含分工、踩雷與最後的簡報準備。",
    coverUrl: "https://picsum.photos/seed/wall2/400/240",
    links: [{ label: "簡報投影片", url: "https://example.com/hackathon-slides" }],
    startingPoint: "有寫過幾個小專案，但沒有團隊協作跟時間壓力下開發的經驗。",
    timeSpent: "三天兩夜，幾乎全程投入。",
    obstacle: "卡在團隊分工混亂導致進度落後，後來改用每 4 小時一次的站立會議同步進度才追上。",
    scene: ["課業", "職涯"],
    authorName: "小凱",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=5",
    likeCount: 20,
    status: "published",
    createdAt: "2026-07-01",
  },
  {
    id: "3",
    kind: "project",
    title: "用 Notion API 做課程進度儀表板",
    bodyMd:
      "串接 Notion API，把散落在各科作業清單自動整理成一個每週進度儀表板，不用再手動更新表格。",
    coverUrl: "https://picsum.photos/seed/wall3/400/240",
    links: [{ label: "專案介紹", url: "https://example.com/notion-dashboard" }],
    startingPoint: "會寫基本的 JavaScript，但沒串接過任何第三方 API。",
    timeSpent: "斷斷續續花了 10 天左右。",
    obstacle: "卡在 Notion API 的分頁機制一直漏抓資料，後來照著官方文件把 pagination 邏輯補齊才修好。",
    scene: ["課業"],
    authorName: "阿仁",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=7",
    likeCount: 6,
    status: "published",
    createdAt: "2026-06-20",
  },
  {
    id: "4",
    kind: "project",
    title: "打造社團官網並串接報名表單",
    bodyMd:
      "幫系學會做了一個簡單的官網，串接 Google Form 當作活動報名表單，並自動同步到試算表。",
    coverUrl: "https://picsum.photos/seed/wall4/400/240",
    links: [
      { label: "官網連結", url: "https://example.com/club-site" },
      { label: "開發筆記", url: "https://example.com/club-site-notes" },
    ],
    startingPoint: "會用網頁模板工具，但沒自己寫過完整的網站。",
    timeSpent: "大約 2 週，主要是社課空檔時間。",
    obstacle: "卡在手機版排版一直跑掉，後來改用 Flexbox 重寫版面才解決。",
    scene: ["實習", "日常"],
    authorName: "小雨",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=9",
    likeCount: 15,
    status: "published",
    createdAt: "2026-07-10",
  },
  {
    id: "5",
    kind: "project",
    title: "重現一個經典小遊戲練手感",
    bodyMd: "純粹想練習遊戲迴圈跟碰撞判斷的邏輯，用 Canvas 重現了一款經典小遊戲。",
    coverUrl: "", // 故意留空，測試「無封面圖時顯示提示文字」
    links: [],
    startingPoint: "上過一學期程式入門課，沒寫過需要處理動畫與碰撞的邏輯。",
    timeSpent: "一個週末，大約 8 小時。",
    obstacle: "卡在畫面會閃爍，後來才知道要用 requestAnimationFrame 取代 setInterval 才順。",
    scene: ["日常"],
    authorName: "阿凱",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=11",
    likeCount: 3,
    status: "published",
    createdAt: "2026-05-15",
  },
  {
    id: "6",
    kind: "agent",
    title: "用 AI Agent 自動整理讀書筆記",
    bodyMd:
      "串接筆記軟體與 LLM API，自動幫每天讀的文章整理成摘要，省下手動整理的時間。",
    coverUrl: "https://picsum.photos/seed/wall6/400/240",
    links: [{ label: "專案筆記", url: "https://example.com/note-agent" }],
    startingPoint: "有基本的 Python 能力，但沒寫過 agent 相關的程式。",
    timeSpent: "大約 2 週，主要是晚上的零碎時間。",
    obstacle: "卡在 API 呼叫額度限制，後來改成先分段摘要、再彙整總結才解決。",
    scene: ["實習"],
    authorName: "小華",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=3",
    likeCount: 9,
    status: "published",
    createdAt: "2026-07-20",
  },
  {
    id: "7",
    kind: "agent",
    title: "打造一個自動整理讀書會逐字稿的 Agent",
    bodyMd:
      "用 LLM API 串接語音轉文字結果，自動幫讀書會產出重點摘要與待辦事項。",
    coverUrl: "https://picsum.photos/seed/wall7/400/240",
    links: [{ label: "使用心得", url: "https://example.com/agent-notes" }],
    startingPoint: "會寫基本的 Python，但沒接過任何 LLM API，也不知道 prompt 要怎麼設計。",
    timeSpent: "大約 2 週，主要是晚上跟週末的零碎時間。",
    obstacle: "卡在逐字稿太長會超過 token 上限，後來改成先分段摘要、再彙整成總結才解決。",
    scene: ["實習", "日常"],
    authorName: "小葉",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=8",
    likeCount: 8,
    status: "published",
    createdAt: "2026-07-15",
  },
  {
    id: "11",
    kind: "agent",
    title: "用 Agent 自動生成每週讀書會摘要信件",
    bodyMd:
      "把讀書會逐字稿摘要串接成每週固定寄出的信件，省下手動整理跟轉寄的時間。",
    coverUrl: "https://picsum.photos/seed/wall11/400/240",
    links: [{ label: "使用心得", url: "https://example.com/agent-mail-notes" }],
    startingPoint: "會寫基本的 Python，串過一次簡單的 API，但沒寄過信件自動化。",
    timeSpent: "大約 1 週。",
    obstacle: "卡在寄信服務的每日額度限制，後來改成分批寄送才解決。",
    scene: ["日常"],
    authorName: "阿廷",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=15",
    likeCount: 4,
    status: "published",
    createdAt: "2026-06-05",
  },
  {
    id: "12",
    kind: "agent",
    title: "打造一個自動偵測作業截止日的提醒 Agent",
    bodyMd: "串接課程平台的作業列表，自動在截止前一天提醒，避免忘記交作業。",
    coverUrl: "https://picsum.photos/seed/wall12/400/240",
    links: [],
    startingPoint: "會寫基本的 JavaScript，但沒寫過排程相關的程式。",
    timeSpent: "大約 1.5 週。",
    obstacle: "卡在時區換算一直算錯提醒時間，後來統一改用 UTC 儲存才解決。",
    scene: ["課業"],
    authorName: "阿哲",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=17",
    likeCount: 7,
    status: "published",
    createdAt: "2026-06-18",
  },
  {
    id: "13",
    kind: "agent",
    title: "用 Agent 幫忙整理課堂錄音逐字稿重點",
    bodyMd: "把課堂錄音轉成逐字稿後，用 LLM 抓出重點跟待辦事項，複習更有效率。",
    coverUrl: "",
    links: [{ label: "專案筆記", url: "https://example.com/lecture-agent-notes" }],
    startingPoint: "有基本的 Python 能力，沒處理過語音轉文字的資料。",
    timeSpent: "大約 2 週，主要是週末時間。",
    obstacle: "卡在逐字稿有很多口語贅字影響摘要品質，後來加了一個前處理步驟過濾掉才改善。",
    scene: ["課業", "日常"],
    authorName: "小庭",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=19",
    likeCount: 3,
    status: "published",
    createdAt: "2026-05-20",
  },
  {
    id: "8",
    kind: "note",
    title: "學習筆記：理解遞迴的三個階段",
    bodyMd: "整理自己學習遞迴時的心得，從看不懂、硬背、到真正理解的過程。",
    coverUrl: "", // 故意留空，測試「無封面圖時顯示提示文字」
    links: [{ label: "參考文章", url: "https://example.com/recursion-guide" }],
    startingPoint: "完全不懂遞迴，看到程式碼會頭暈。",
    timeSpent: "斷斷續續花了 2 個月才真正理解。",
    obstacle: "一直卡在不知道遞迴什麼時候會結束，後來用畫圖追蹤呼叫堆疊的方式，才終於想通。",
    scene: ["課業"],
    authorName: "阿強",
    authorAvatarUrl: "", // 故意留空，測試「無頭像時不顯示空 img」
    likeCount: 5,
    status: "published",
    createdAt: "2026-05-02",
  },
  {
    id: "9",
    kind: "note",
    title: "讀書會筆記：LLM 微調的核心概念",
    bodyMd:
      "這週讀書會討論 LLM fine-tuning 的基本概念，整理成筆記給沒來的夥伴補課用。",
    coverUrl: "https://picsum.photos/seed/wall9/400/240",
    links: [{ label: "投影片", url: "https://example.com/finetune-slides" }],
    startingPoint: "知道 LLM 是什麼，但完全不懂 fine-tuning 跟 prompt engineering 的差別。",
    timeSpent: "讀書會 2 小時 + 自己整理筆記 1 小時。",
    obstacle: "卡在分不清 fine-tuning 跟 RAG 的使用時機，後來畫了一張比較表才釐清。",
    scene: ["課業", "職涯"],
    authorName: "小婷",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=13",
    likeCount: 11,
    status: "published",
    createdAt: "2026-07-02",
  },
  {
    id: "14",
    kind: "note",
    title: "讀書會筆記：Prompt Engineering 常見誤區",
    bodyMd: "整理這週讀書會討論的幾個常見 prompt 設計誤區，附上修正前後的對照範例。",
    coverUrl: "https://picsum.photos/seed/wall14/400/240",
    links: [{ label: "對照範例文件", url: "https://example.com/prompt-pitfalls" }],
    startingPoint: "會用 ChatGPT，但沒有系統性想過 prompt 設計的原則。",
    timeSpent: "讀書會 2 小時 + 整理筆記 1 小時。",
    obstacle: "卡在不知道怎麼判斷 prompt 是不是「太模糊」，後來用「拆解成步驟」的方式練習才有感。",
    scene: ["課業"],
    authorName: "阿廷",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=21",
    likeCount: 6,
    status: "published",
    createdAt: "2026-04-10",
  },
  {
    id: "15",
    kind: "note",
    title: "讀書會筆記：RAG 系統的資料前處理眉角",
    bodyMd: "這週讀書會聚焦在 RAG 的資料前處理環節，整理常見的切塊策略跟踩雷點。",
    coverUrl: "https://picsum.photos/seed/wall15/400/240",
    links: [{ label: "投影片", url: "https://example.com/rag-preprocess-slides" }],
    startingPoint: "知道 RAG 的基本流程，但沒實際處理過真實文件的切塊。",
    timeSpent: "讀書會 2 小時 + 自己再讀相關文章 1 小時。",
    obstacle: "卡在切塊大小抓不準，太大檢索不準、太小失去上下文，後來抓中間值搭配重疊視窗才改善。",
    scene: ["職涯"],
    authorName: "阿哲",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=23",
    likeCount: 9,
    status: "published",
    createdAt: "2026-06-25",
  },
  {
    id: "16",
    kind: "note",
    title: "讀書會筆記：如何評估 LLM 輸出品質",
    bodyMd: "整理讀書會討論的幾種 LLM 輸出評估方法，從人工評分到自動化指標都有涵蓋。",
    coverUrl: "https://picsum.photos/seed/wall16/400/240",
    links: [],
    startingPoint: "知道要評估輸出品質，但不知道有哪些具體的做法可以參考。",
    timeSpent: "讀書會 2 小時。",
    obstacle: "卡在自動化指標跟實際體感常常對不上，後來理解要搭配少量人工抽樣才踏實。",
    scene: ["課業", "職涯"],
    authorName: "小凱",
    authorAvatarUrl: "https://i.pravatar.cc/64?img=25",
    likeCount: 5,
    status: "published",
    createdAt: "2026-07-20",
  },
  {
    id: "10",
    kind: "note",
    title: "（草稿）還沒寫完的實習心得",
    bodyMd: "這篇故意設成草稿狀態，用來測試前台列表是否正確排除未發布的文章。",
    coverUrl: "",
    links: [],
    startingPoint: "隨便填的內容，測試用。",
    timeSpent: "隨便填的內容，測試用。",
    obstacle: "隨便填的內容，測試用。",
    scene: ["實習"],
    authorName: "測試用作者",
    authorAvatarUrl: "",
    likeCount: 0,
    status: "draft",
    createdAt: "2026-08-04",
  },
];
