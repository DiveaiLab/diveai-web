"use client";

import Link from "next/link";
import WallHeader from "./WallHeader";
import WallFooter from "./WallFooter";
import PostGrid from "./PostGrid";
import { useWallState } from "../lib/wall-state-context";
import { getPublishedPostsByTag } from "../lib/mock-posts";

type TagOverviewClientProps = {
  tagName: string;
};

// 點擊 Hero 標籤動畫任一標籤會進到這裡：網格顯示帶有該標籤的全部已發布
// 文章，沒有的話顯示「目前還沒有這個標籤的文章」，樣式比照 project/agent/
// note 三個分類總覽子頁面（共用同一份 PostGrid + Header/Footer）。
export default function TagOverviewClient({ tagName }: TagOverviewClientProps) {
  const { posts, hasLiked, likePost } = useWallState();
  const tagPosts = getPublishedPostsByTag(posts, tagName);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      <WallHeader />

      <main className="max-w-5xl mx-auto px-4 pt-12 pb-24">
        <Link
          href="/commuity-wall"
          className="text-[#2563EB] font-semibold text-sm hover:underline mb-8 inline-block"
        >
          ← 返回共學牆
        </Link>

        <span className="text-[#2563EB] font-semibold text-xs tracking-[0.25em] uppercase block mb-3">
          T A G
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-10">
          {tagName}
        </h1>

        <PostGrid
          posts={tagPosts}
          hasLiked={hasLiked}
          onLike={likePost}
          emptyText="目前還沒有這個標籤的文章"
        />
      </main>

      <WallFooter />
    </div>
  );
}
