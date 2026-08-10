import Link from "next/link";
import { KIND_LABELS, type WallPost } from "../lib/mock-posts";

type PostCardProps = {
  post: WallPost;
  isLiked: boolean;
  onLike: (postId: string) => void;
  // 封面圖長寬比可由呼叫端覆寫：預設 4:3（子頁面網格用），carousel 卡片
  // 改用更寬扁的 16:9，讓圖片只佔卡片的一部分，不是卡片的視覺主體。
  coverAspectClass?: string;
};

// FR：卡片只保留類型 chip、封面圖、標題、作者姓名與頭像、讚數與按讚按鈕。
// startingPoint / timeSpent 只在單篇頁顯示，這裡刻意不放。
//
// 封面圖版面說明：圖片是「full-bleed」貼齊卡片內部邊界（不是卡片內距裡的一個
// 元素），本身不套用 border-radius、也不留 padding／margin。卡片外層用
// overflow-hidden 把圖片的直角上緣裁到跟卡片的 rounded-2xl 一致的圓角——
// 圓角效果來自外層裁切，不是圖片自己的樣式，兩者疊加才不會有雙重圓角或
// 圖片被內距擠小的問題。其餘內容（chip、標題、作者、按讚）維持在卡片的
// p-8 內距區塊裡。
export default function PostCard({
  post,
  isLiked,
  onLike,
  coverAspectClass = "aspect-[4/3]",
}: PostCardProps) {
  return (
    <div className="bg-white border border-gray-100/80 rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex flex-col">
      {/* 封面圖用 aspect-ratio 而非固定高度，圖片框會跟著卡片寬度等比例縮放，
          不會被拉成細長直式。object-cover + object-center 確保裁切時以正中央為準。
          圖片本身沒有 rounded／padding／margin，直角、滿版貼齊卡片邊界。 */}
      {post.coverUrl ? (
        // 使用一般 img 而非 next/image：封面圖來源是 mock 用的外部圖床，
        // 之後接上 Supabase Storage 的真實圖檔網址時，再評估要不要換成 next/image。
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverUrl}
          alt={post.title}
          className={`w-full ${coverAspectClass} object-cover object-center block`}
        />
      ) : (
        <div
          className={`w-full ${coverAspectClass} border-b border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400`}
        >
          尚無封面圖
        </div>
      )}

      <div className="p-8 flex flex-col flex-1">
        <span className="inline-block text-xs font-semibold text-[#2563EB] border border-blue-100 bg-blue-50 rounded-full px-3 py-1 mb-4 self-start">
          {KIND_LABELS[post.kind]}
        </span>

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
    </div>
  );
}
