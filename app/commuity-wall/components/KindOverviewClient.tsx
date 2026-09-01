"use client";

import Link from "next/link";
import WallHeader from "./WallHeader";
import WallFooter from "./WallFooter";
import PostGrid from "./PostGrid";
import { useWallState } from "@/app/lib/wall/wall-state-context";
import { getPublishedPostsByKind, type WallPostKind } from "@/app/lib/wall/mock-posts";

type KindOverviewClientProps = {
  kind: WallPostKind;
  title: string;
};

// 三個分類總覽子頁面（project / agent / note）共用的內容元件：
// 網格顯示該分類全部已發布文章（不限最新 4 篇，也沒有 carousel），
// 不含情境標籤篩選（配合列表頁移除篩選的決定）。
export default function KindOverviewClient({ kind, title }: KindOverviewClientProps) {
  const { posts, hasLiked, likePost } = useWallState();
  const kindPosts = getPublishedPostsByKind(posts, kind);

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

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-10">
          {title}
        </h1>

        <PostGrid posts={kindPosts} hasLiked={hasLiked} onLike={likePost} />
      </main>

      <WallFooter />
    </div>
  );
}
