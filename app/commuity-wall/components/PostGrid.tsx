import PostCard from "./PostCard";
import type { WallPost } from "../lib/mock-posts";

type PostGridProps = {
  posts: WallPost[];
  hasLiked: (postId: string) => boolean;
  onLike: (postId: string) => void;
  emptyText?: string;
};

export default function PostGrid({
  posts,
  hasLiked,
  onLike,
  emptyText = "目前沒有已發布的文章",
}: PostGridProps) {
  if (posts.length === 0) {
    return <p className="text-sm text-gray-400">{emptyText}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isLiked={hasLiked(post.id)}
          onLike={onLike}
        />
      ))}
    </div>
  );
}
