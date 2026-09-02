// 共學牆文章相關的型別與輔助函式。實際資料存在 Cloudflare D1
// （wall_articles 表，跟 feat-cms 分支共用同一個 web-prod 資料庫），透過
// app/api/wall/articles 這組 API route 讀寫（見
// app/lib/wall/wall-state-context.tsx），這個檔案不再放假資料陣列。
//
// 這個檔案原本放在 app/commuity-wall/lib/ 底下，後台（app/admin/wall/）
// 上線後搬來這裡（app/lib/wall/），因為前台共學牆跟後台是兩個不同的路由樹，
// 兩邊都要讀寫同一份文章資料，所以型別／輔助函式要放在兩邊共同的上層目錄，
// 不能再算是「共學牆前台專屬」的東西了。

export type WallPostKind = "project" | "note" | "agent";

export type WallPostScene = "課業" | "實習" | "職涯" | "日常";

export const SCENE_OPTIONS: WallPostScene[] = ["課業", "實習", "職涯", "日常"];

export type WallPostStatus = "draft" | "published";

export type WallPost = {
  id: string;
  kind: WallPostKind;
  title: string;
  bodyMd: string; // 文章內文，Markdown 格式（支援 ## 小標、**粗體**、行內 HTML 顏色標記等）
  coverUrl: string;
  links: { label: string; url: string }[];
  scene: WallPostScene[];
  techTags: string[]; // Hero 標籤動畫、/tag/[tagName] 用；依每篇實際內容填 2-4 個
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

// 雜誌風格卡片用的摘要：從 bodyMd 擷取文字。bodyMd 現在是完整 Markdown
// 內文，摘要只取「第一個 ## 小標之前」的部分（通常是開場白），避免截斷
// 時把 `## ` 這類 Markdown 語法原封不動露在卡片上；再簡單移除常見的行內
// 語法符號（**粗體**、行內 HTML）後依字數截斷。
export function getExcerpt(text: string, maxLength = 45): string {
  const beforeFirstHeading = text.split(/\n#{1,6}\s/)[0];
  const plain = beforeFirstHeading
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`>#]/g, "")
    .trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength)}...`;
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

// 取出某個技術標籤底下所有已發布的文章，/tag/[tagName] 頁面用。
export function getPublishedPostsByTag(posts: WallPost[], tagName: string): WallPost[] {
  return posts
    .filter((post) => post.status === "published" && post.techTags.includes(tagName))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
}

// Hero 標籤動畫用：只收集「已發布」文章的標籤，草稿不會影響前台顯示的標籤池，
// 依字母／筆畫原始出現順序去重（不用特別排序，滾動動畫本來就不需要排序）。
export function getAllPublishedTags(posts: WallPost[]): string[] {
  const seen = new Set<string>();
  for (const post of posts) {
    if (post.status !== "published") continue;
    for (const tag of post.techTags) {
      seen.add(tag);
    }
  }
  return Array.from(seen);
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

