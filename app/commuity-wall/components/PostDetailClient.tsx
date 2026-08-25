"use client";

import Link from "next/link";
import WallHeader from "./WallHeader";
import WallFooter from "./WallFooter";
import CommentSection from "./CommentSection";
import MarkdownBody from "./MarkdownBody";
import { useWallState } from "@/app/lib/wall/wall-state-context";
import { KIND_LABELS, getCommentsForPost } from "@/app/lib/wall/mock-posts";

type PostDetailClientProps = {
  id: string;
};

export default function PostDetailClient({ id }: PostDetailClientProps) {
  const { posts, isLoggedIn, hasLiked, likePost } = useWallState();

  // 找不到文章（id 不存在或不是 published）：畫面顯示文字提示，不用 alert，
  // 並保留返回列表的連結
  const post = posts.find((p) => p.id === id && p.status === "published");

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-700">
        <WallHeader />
        <main className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-600 text-sm md:text-base mb-8">
            找不到這篇文章，可能已被下架或連結有誤
          </p>
          <Link
            href="/commuity-wall"
            className="text-[#2563EB] font-semibold text-sm hover:underline"
          >
            ← 返回列表
          </Link>
        </main>
        <WallFooter />
      </div>
    );
  }

  const liked = hasLiked(post.id);
  const formattedDate = post.createdAt.replace(/-/g, ".");

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      <WallHeader />

      <main className="max-w-5xl mx-auto px-4 pt-12 pb-24">
        <Link
          href="/commuity-wall"
          className="text-[#2563EB] font-semibold text-sm hover:underline mb-8 inline-block"
        >
          ← 返回列表
        </Link>

        <span className="text-[#2563EB] font-semibold text-xs tracking-[0.25em] uppercase block mb-4">
          {KIND_LABELS[post.kind]}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-[1.25] mb-6">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 mb-6">
          {post.authorAvatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.authorAvatarUrl}
              alt={post.authorName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400">
              無
            </div>
          )}
          <span className="text-sm text-gray-700 font-medium">
            {post.authorName}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-400">{formattedDate}</span>
        </div>

        {/* 情境標籤：值域與文章共用（課業/實習/職涯/日常） */}
        <div className="flex flex-wrap gap-2 mb-10">
          {post.scene.map((scene) => (
            <span
              key={scene}
              className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1"
            >
              {scene}
            </span>
          ))}
        </div>

        <div className="mb-12">
          <MarkdownBody content={post.bodyMd} />
        </div>

        {/* 相關連結：外部連結加 target="_blank" rel="noopener noreferrer" */}
        <div className="mb-12">
          <h2 className="text-gray-900 font-bold text-sm mb-3">相關連結</h2>
          {post.links.length > 0 ? (
            <ul className="space-y-2">
              {post.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563EB] text-sm hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">（無相關連結）</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => likePost(post.id)}
          disabled={liked}
          className={
            liked
              ? "bg-gray-100 text-gray-400 text-sm font-medium px-6 py-2.5 rounded-full cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-full shadow-sm transition-all"
          }
        >
          {liked ? `已讚（${post.likeCount} 個讚）` : `👍 按讚（${post.likeCount} 個讚）`}
        </button>

        {/* 留言／回饋：只在「讀書會筆記」（kind = 'note'）單篇頁顯示 */}
        {post.kind === "note" && (
          <div className="mt-12">
            <CommentSection
              postId={post.id}
              comments={getCommentsForPost(post.id)}
              isLoggedIn={isLoggedIn}
            />
          </div>
        )}
      </main>

      <WallFooter />
    </div>
  );
}
