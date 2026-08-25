"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useWallState } from "@/app/lib/wall/wall-state-context";
import { isSupabaseConfigured } from "@/app/lib/supabase/client";

export default function AdminWallDashboardPage() {
  const { posts, teams, postsLoading } = useWallState();
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  // 依出現次數排序，常用標籤排前面，投稿時比較容易照現有標籤填、
  // 不會每個人自己發明一個新名字（同一個技術散成好幾個標籤）。
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.techTags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">共學牆後台</h1>
      <p className="text-sm text-gray-500 mb-8">投稿文章、更新小組動態的管理入口。</p>

      {!isSupabaseConfigured && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700 leading-relaxed">
          目前還沒設定 Supabase，文章資料先存在瀏覽器 localStorage（跟之前一樣，換瀏覽器或清快取資料會不見）。
          設定好 <code className="bg-amber-100 rounded px-1">.env.local</code> 的
          <code className="bg-amber-100 rounded px-1 ml-1">NEXT_PUBLIC_SUPABASE_URL</code> /
          <code className="bg-amber-100 rounded px-1 ml-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          （記得先到 Supabase 專案的 SQL editor 依序執行
          <code className="bg-amber-100 rounded px-1 ml-1">supabase/migrations/</code> 底下的三個檔案）之後會自動改讀寫真的資料庫，不用改任何程式碼。
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-1">已發布文章</p>
          <p className="text-2xl font-bold text-gray-900">{postsLoading ? "…" : publishedCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-1">草稿</p>
          <p className="text-2xl font-bold text-gray-900">{postsLoading ? "…" : draftCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-1">小組數</p>
          <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/admin/wall/posts"
          className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-[#2563EB] transition-colors"
        >
          <h2 className="font-bold text-gray-900 mb-1">文章管理</h2>
          <p className="text-xs text-gray-500">新增、編輯、發布或刪除共學牆文章。</p>
        </Link>
        <Link
          href="/admin/wall/teams"
          className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-[#2563EB] transition-colors"
        >
          <h2 className="font-bold text-gray-900 mb-1">小組動態</h2>
          <p className="text-xs text-gray-500">更新各小組目前進度與本次目標。</p>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-bold text-gray-900 mb-4">使用說明</h2>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">怎麼寫文章</h3>
          <ul className="text-sm text-gray-600 leading-relaxed list-disc list-outside pl-5 space-y-1.5">
            <li>
              到<Link href="/admin/wall/posts/new" className="text-[#2563EB] hover:underline mx-1">文章管理 → 新增文章</Link>
              ，內文欄位直接用工具列排版即可，不用手動輸入任何 Markdown 語法（## 之類的符號）。
            </li>
            <li>反白文字後可以加粗體、底線、連結；工具列上的色塊可以直接把選取的文字改成藍／紅／綠／橘／紫色。</li>
            <li>工具列的 H2／H3 按鈕可以插入小標，把文章分段（例如「我原本的程度」「花了多久」「卡在哪、怎麼解決」這種段落，用小標分開會比較好讀）。</li>
            <li>圖片可以直接把檔案拖進內文區塊、或貼上剪貼簿裡的截圖，也可以按工具列的圖片按鈕選檔案上傳；封面圖在下面單獨一欄，一樣是選檔案上傳。</li>
            <li>寫到一半可以先存成「草稿」狀態，前台不會顯示；確定要公開了再切換成「已發布」。</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            可用的技術標籤{tagCounts.length > 0 && `（目前共 ${tagCounts.length} 個，依使用次數排序）`}
          </h3>
          {tagCounts.length === 0 ? (
            <p className="text-xs text-gray-400">還沒有任何文章使用過標籤。</p>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-2.5">
                投稿時「技術標籤」欄位盡量從下面挑既有的標籤填（用逗號分隔），同一個技術盡量用同一個名字，
                前台的標籤篩選頁（/commuity-wall/tag/[標籤]）才能把相關文章聚在一起，不會因為有人打「LLM」、有人打「大語言模型」而拆成兩群。
              </p>
              <div className="flex flex-wrap gap-2">
                {tagCounts.map(([tag, count]) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-full px-2.5 py-1"
                  >
                    {tag}
                    <span className="text-gray-400">{count}</span>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
