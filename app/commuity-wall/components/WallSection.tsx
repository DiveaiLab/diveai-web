import PostCard from "./PostCard";
import type { WallPost } from "../lib/mock-posts";

const VISIBLE_COUNT = 4;

type WallSectionProps = {
  title: string;
  anchorId: string;
  posts: WallPost[];
  hasLiked: (postId: string) => boolean;
  onLike: (postId: string) => void;
};

// FR：每區只顯示 status = 'published' 且通過篩選的文章（由呼叫端先篩好再傳進來），
// 只顯示前 4 篇，超過才出現「查看全部」錨點連結。
export default function WallSection({
  title,
  anchorId,
  posts,
  hasLiked,
  onLike,
}: WallSectionProps) {
  const visiblePosts = posts.slice(0, VISIBLE_COUNT);

  return (
    <section className="max-w-5xl mx-auto px-4 mb-20">
      <h2
        id={anchorId}
        className="text-xl md:text-2xl font-bold text-gray-900 mb-6 scroll-mt-24"
      >
        {title}
      </h2>

      {visiblePosts.length === 0 ? (
        <p className="text-sm text-gray-400">目前沒有符合篩選條件的文章</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isLiked={hasLiked(post.id)}
              onLike={onLike}
            />
          ))}
        </div>
      )}

      {posts.length > VISIBLE_COUNT && (
        <a
          href={`#${anchorId}`}
          className="inline-block mt-6 text-sm font-medium text-[#2563EB] hover:underline"
        >
          查看全部
        </a>
      )}
    </section>
  );
}
