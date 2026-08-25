import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "共學牆後台 | DiveAI",
  description: "共學牆內部管理後台：投稿文章、更新小組動態。",
};

const NAV_ITEMS = [
  { href: "/admin/wall", label: "總覽" },
  { href: "/admin/wall/posts", label: "文章管理" },
  { href: "/admin/wall/teams", label: "小組動態" },
];

// 後台獨立區塊，跟前台（app/commuity-wall）路由完全分開，視覺上也刻意跟
// 前台區隔（深色頂列 + 簡單清單排版），讓使用的人一眼知道自己在後台，
// 不會跟公開頁面搞混。開發階段先不加登入門檻（AGENTS.md 提到的「產品邏輯
// 層級的不確定」已經跟負責人確認過，先不用），之後接真的權限系統再補。
export default function AdminWallLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-sm tracking-wide">共學牆後台</span>
            <nav className="flex items-center gap-4 text-sm text-gray-300">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <Link
            href="/commuity-wall"
            className="text-xs text-gray-300 hover:text-white transition-colors"
          >
            ← 回到前台
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
