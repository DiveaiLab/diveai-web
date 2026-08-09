"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import WallHeader from "./components/WallHeader";
import WallFooter from "./components/WallFooter";
import WallSection from "./components/WallSection";
import { useWallState } from "./lib/wall-state-context";
import {
  SCENE_OPTIONS,
  isWallPostScene,
  type WallPostKind,
  type WallPostScene,
} from "./lib/mock-posts";

const SECTIONS: { kind: WallPostKind; title: string; anchorId: string }[] = [
  { kind: "project", title: "專案展示", anchorId: "project-all" },
  { kind: "agent", title: "Agent 介紹", anchorId: "agent-all" },
  { kind: "note", title: "讀書會筆記", anchorId: "note-all" },
];

type WallPageClientProps = {
  // 由 page.tsx（Server Component）透過 searchParams prop 讀好的初始值，
  // 避免在這裡用 useSearchParams（見 page.tsx 註解說明原因）。
  initialScene: WallPostScene | "";
};

export default function WallPageClient({ initialScene }: WallPageClientProps) {
  const { posts, isLoggedIn, toggleLogin, hasLiked, likePost } = useWallState();
  const router = useRouter();
  const pathname = usePathname();

  // initialScene 只作為初始值：外部網址變化（例如瀏覽器上一頁/下一頁）時，
  // page.tsx 會用 key={initialScene} 讓這個元件整個重新掛載、拿到新的初始值，
  // 而不是在這裡用 useEffect 同步（避免多一次 render）。
  const [activeScene, setActiveScene] = useState<WallPostScene | "">(initialScene);

  // FR：情境標籤篩選同時套用在三個分區上，且反映在網址 query string
  const handleSceneChange = useCallback(
    (value: string) => {
      const nextScene = isWallPostScene(value) ? value : "";
      setActiveScene(nextScene);
      router.replace(nextScene ? `${pathname}?scene=${nextScene}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname]
  );

  // 只顯示 status = 'published'，並套用情境標籤篩選
  const publishedPosts = useMemo(
    () =>
      posts.filter((post) => {
        if (post.status !== "published") return false;
        if (activeScene && !post.scene.includes(activeScene)) return false;
        return true;
      }),
    [posts, activeScene]
  );

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      <WallHeader />

      <main className="pt-12 pb-16">
        {/* Hero 區塊 */}
        <section className="max-w-3xl mx-auto text-center px-4 pt-8 pb-14">
          <span className="text-[#2563EB] font-semibold text-xs tracking-[0.25em] uppercase block mb-4">
            C O M M U N I T Y &nbsp; W A L L
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.25] mb-8">
            共學牆
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            這裡是團隊策展的學習紀錄：每篇都附上「我原本的程度」與「花了多久」，
            記錄真實的卡關與解法，而不只是完成後的成品。
          </p>
        </section>

        {/* 篩選列：模擬登入開關 + 情境標籤篩選 */}
        <section className="max-w-5xl mx-auto px-4 mb-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-gray-600">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isLoggedIn}
              onChange={toggleLogin}
              className="h-4 w-4 accent-[#2563EB]"
            />
            模擬已登入
            <span className="text-gray-400">
              {isLoggedIn ? "（目前：已登入）" : "（目前：未登入）"}
            </span>
          </label>

          <label className="flex items-center gap-2">
            篩選情境標籤：
            <select
              value={activeScene}
              onChange={(e) => handleSceneChange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
            >
              <option value="">全部</option>
              {SCENE_OPTIONS.map((scene) => (
                <option key={scene} value={scene}>
                  {scene}
                </option>
              ))}
            </select>
          </label>
        </section>

        {/* FR：三個分區由上到下並列顯示，不是分頁切換 */}
        {SECTIONS.map((section) => (
          <WallSection
            key={section.kind}
            title={section.title}
            anchorId={section.anchorId}
            posts={publishedPosts.filter((post) => post.kind === section.kind)}
            hasLiked={hasLiked}
            onLike={likePost}
          />
        ))}
      </main>

      <WallFooter />
    </div>
  );
}
