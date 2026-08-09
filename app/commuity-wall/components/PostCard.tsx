import Link from "next/link";
import { KIND_LABELS, type WallPost } from "../lib/mock-posts";

type PostCardProps = {
  post: WallPost;
  isLiked: boolean;
  onLike: (postId: string) => void;
};

// FR：卡片只保留類型 chip、封面圖、標題、作者姓名與頭像、讚數與按讚按鈕。
// startingPoint / timeSpent 只在單篇頁顯示，這裡刻意不放。
export default function PostCard({ post, isLiked, onLike }: PostCardProps) {
  return (
    <div className="bg-white border border-gray-100/80 rounded-2xl p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex flex-col">
      <span className="inline-block text-xs font-semibold text-[#2563EB] border border-blue-100 bg-blue-50 rounded-full px-3 py-1 mb-4 self-start">
        {KIND_LABELS[post.kind]}
      </span>

      {post.coverUrl ? (
        // 使用一般 img 而非 next/image：封面圖來源是 mock 用的外部圖床，
        // 之後接上 Supabase Storage 的真實圖檔網址時，再評估要不要換成 next/image。
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverUrl}
          alt={post.title}
          className="w-full h-36 object-cover rounded-xl mb-4"
        />
      ) : (
        <div className="w-full h-36 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400 mb-4">
          尚無封面圖
        </div>
      )}

      <Link
        href={`/commuity-wall/${post.id}`}
        className="text-gray-900 font-bold text-base leading-snug mb-4 hover:text-[#2563EB] transition-colors"
      >
        {post.title}
      </Link>

      <div className="flex items-center gap-2 mb-6">
        {post.authorAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.authorAvatarUrl}
            alt={post.authorName}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-[9px] text-gray-400">
            無
          </div>
        )}
        <span className="text-xs text-gray-600">{post.authorName}</span>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-gray-400">讚數 {post.likeCount}</span>
        <button
          type="button"
          onClick={() => onLike(post.id)}
          disabled={isLiked}
          className={
            isLiked
              ? "text-xs font-semibold text-gray-400 border border-gray-200 rounded-full px-4 py-1.5 cursor-not-allowed"
              : "text-xs font-semibold text-[#2563EB] border border-[#2563EB] hover:bg-blue-50 rounded-full px-4 py-1.5 transition-all"
          }
        >
          {isLiked ? "已讚" : "👍 按讚"}
        </button>
      </div>
    </div>
  );
}
