import Link from "next/link";
import { KIND_LABELS, getExcerpt, type WallPost } from "@/app/lib/wall/mock-posts";

type MagazinePostCardProps = {
  post: WallPost;
  isLiked: boolean;
  onLike: (postId: string) => void;
};

// 共學牆右欄 carousel 專用的雜誌風格卡片。跟 PostCard（子頁面網格用）是
// 兩個獨立元件，故意不共用，這樣調整這裡的排版不會動到子頁面的卡片樣式。
//
// 版型由上到下：日期＋分類膠囊 → 4:3 封面圖（直角）→ 標題（byline
// 在標題正下方）→ 摘要 → 讚數（弱化）→「閱讀更多」底線連結。整張卡片改用
// 細邊框 + 直角，不用陰影／圓角，呼應雜誌排版的線條感；主色仍是
// #2563EB，只有分類膠囊改成不填色的細邊框樣式。
//
// 圖片：文字比例微調記錄——原本 1:1 正方形圖片太佔卡片高度，改成 4:3
// 讓下方文字內容不會被擠壓；標題字級跟著加大（text-xl），變成僅次於封面圖
// 的第二視覺焦點，卡片寬度也在 WallCarouselSection 同步加寬，確保加大字級
// 後標題仍能維持 1-2 行。
export default function MagazinePostCard({
  post,
  isLiked,
  onLike,
}: MagazinePostCardProps) {
  const formattedDate = post.createdAt.replace(/-/g, ".");
  const excerpt = getExcerpt(post.bodyMd);
  const detailHref = `/commuity-wall/${post.id}`;

  return (
    <div className="border border-gray-200 flex flex-col h-full">
      {/* 頂部：日期 + 分類膠囊（細邊框、不填色） */}
      <div className="flex items-center justify-between px-5 pt-5 mb-4">
        <span className="text-[11px] text-gray-400 tracking-wide">
          {formattedDate}
        </span>
        <span className="text-[11px] font-semibold text-[#2563EB] border border-[#2563EB] rounded-full px-2.5 py-0.5">
          {KIND_LABELS[post.kind]}
        </span>
      </div>

      {/* 封面圖：4:3（原本 1:1 太佔卡片高度），直角，無圖時維持提示文字（一樣直角） */}
      {post.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverUrl}
          alt={post.title}
          className="w-full aspect-[4/3] object-cover object-center block"
        />
      ) : (
        <div className="w-full aspect-[4/3] border-y border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">
          尚無封面圖
        </div>
      )}

      <div className="px-5 pt-5 pb-5 flex flex-col flex-1">
        <Link
          href={detailHref}
          className="text-xl font-extrabold leading-snug text-gray-900 hover:text-[#2563EB] transition-colors mb-3"
        >
          {post.title}
        </Link>

        {/* 作者：整合成一行 byline，放在標題正下方，不再獨立一整行 */}
        <div className="flex items-center gap-2 mb-4">
          {post.authorAvatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.authorAvatarUrl}
              alt={post.authorName}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <div className="w-5 h-5 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-[8px] text-gray-400">
              無
            </div>
          )}
          <span className="text-xs text-gray-500">{post.authorName}</span>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed mb-4">{excerpt}</p>

        <div className="mt-auto">
          {/* 讚數／按讚：弱化視覺權重，放在摘要與閱讀更多之間 */}
          <button
            type="button"
            onClick={() => onLike(post.id)}
            disabled={isLiked}
            className="text-[11px] text-gray-400 hover:text-[#2563EB] disabled:text-gray-300 flex items-center gap-1 mb-3 transition-colors"
          >
            <span>{isLiked ? "已讚" : "👍"}</span>
            <span>{post.likeCount}</span>
          </button>

          <Link
            href={detailHref}
            className="text-xs font-semibold text-[#2563EB] underline underline-offset-2 hover:text-blue-700"
          >
            閱讀更多
          </Link>
        </div>
      </div>
    </div>
  );
}
