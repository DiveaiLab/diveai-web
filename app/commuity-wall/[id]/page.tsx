import PostDetailClient from "../components/PostDetailClient";

// Next.js 16：params 是 Promise，需在 Server Component 裡 await 後再往下傳給
// Client Component（避免 Client Component 自己處理 params Promise 的複雜度）。
export default async function CommunityWallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostDetailClient id={id} />;
}
