import WallPageClient from "./WallPageClient";
import { isWallPostScene } from "./lib/mock-posts";

// 刻意不在 Client Component 用 useSearchParams 讀取 ?scene=，改用 Server
// Component 的 searchParams prop，在這裡先讀好再往下傳。原因：
// 1) useSearchParams 在靜態建置時官方就要求外面包一層 Suspense，否則 build 失敗。
// 2) 實測發現，在本機 Next.js 16.3 + Turbopack 的 dev 模式下，
//    「Suspense 包 useSearchParams 的 Client Component」這個組合會讓整個子樹
//    的 client-side hydration 完全沒有生效（畫面看起來正常，但按鈕、下拉選單
//    全部沒反應）。這是本機實測到的行為，不是理論推測，先在這裡繞開，
//    避免同樣的狀況也發生在其他頁面。
export default async function CommunityWallPage({
  searchParams,
}: {
  searchParams: Promise<{ scene?: string }>;
}) {
  const { scene } = await searchParams;
  const initialScene = scene && isWallPostScene(scene) ? scene : "";
  // key={initialScene}：網址的 scene 參數在外部改變時（例如瀏覽器上一頁/
  // 下一頁），讓元件整個重新掛載以取得新的初始篩選值。
  return <WallPageClient key={initialScene} initialScene={initialScene} />;
}
