import WallPageClient from "./WallPageClient";

// 情境標籤篩選已移除，這裡不再需要讀取／處理 searchParams，
// 單純渲染 Client Component 即可（也不需要 Suspense 了）。
export default function CommunityWallPage() {
  return <WallPageClient />;
}
