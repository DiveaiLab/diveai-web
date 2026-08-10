"use client";

import { useState } from "react";
import Link from "next/link";
import MagazinePostCard from "./MagazinePostCard";
import type { WallPost } from "../lib/mock-posts";

// 卡片改用固定寬度（不是 CSS Grid 固定欄數），一排能放幾張由容器寬度自然
// 決定——寬版卡片下通常是 2 張多、露出下一張的一小截，不強制塞滿 4 張。
// 桌機／平板寬度抓 256px，內距較窄（雜誌卡片用 px-5）也足夠讓「讀書會
// 筆記：如何評估 LLM 輸出品質」這種長度的標題在 1-2 行內顯示完整，不用縮
// 字級。手機版（<640px）兩欄式排版收成單欄後，carousel 容器本身只剩兩百
// 出頭 px，256px 卡片會比容器還寬、連第一張都顯示不全，所以窄螢幕改用
// 224px，確保至少一張完整可見、外加一小截下一張的提示。
const CARD_WIDTH_CLASS = "w-56 sm:w-64";
// 每次多渲染幾張候補：實際能看到幾張由容器寬度 + overflow-hidden 決定，
// 這裡只要確保有足夠的卡片可以往右露出、不會用完即可（含較寬螢幕的情況）。
const RENDER_BUFFER = 6;

type WallCarouselSectionProps = {
  title: string;
  viewAllHref: string;
  // 已經是該分類、status = 'published'、依 createdAt 新到舊排序好的陣列
  posts: WallPost[];
  hasLiked: (postId: string) => boolean;
  onLike: (postId: string) => void;
};

// 一開始從最新的文章開始顯示；左右箭頭一次移動一篇，可以滑到該分類全部已
// 發布文章（不限於最新幾篇）。「查看全部」則是連到獨立的分類總覽子頁面，
// 不是同頁錨點。
export default function WallCarouselSection({
  title,
  viewAllHref,
  posts,
  hasLiked,
  onLike,
}: WallCarouselSectionProps) {
  const [startIndex, setStartIndex] = useState(0);

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex < posts.length - 1;
  const visiblePosts = posts.slice(startIndex, startIndex + RENDER_BUFFER);

  const arrowBaseClass =
    "shrink-0 w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-colors";

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-[#2563EB] hover:underline"
        >
          查看全部
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-gray-400">目前沒有已發布的文章</p>
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
            disabled={!canGoPrev}
            aria-label={`${title} 上一批`}
            className={arrowBaseClass}
          >
            ←
          </button>

          {/* overflow-hidden：容器裝不下的卡片直接被裁掉，露出的那一小截
              就是「還可以繼續滑」的提示，不用額外的 UI 文字 */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex gap-6 items-stretch">
              {visiblePosts.map((post) => (
                <div key={post.id} className={`${CARD_WIDTH_CLASS} shrink-0`}>
                  <MagazinePostCard
                    post={post}
                    isLiked={hasLiked(post.id)}
                    onLike={onLike}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStartIndex((i) => Math.min(posts.length - 1, i + 1))}
            disabled={!canGoNext}
            aria-label={`${title} 下一批`}
            className={arrowBaseClass}
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
