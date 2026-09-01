import Link from "next/link";

// 複製自 app/aboutus/page.tsx 的 Navbar 區塊，「共學牆」改成 active 樣式，
// 「About us」改回一般連結樣式。其餘結構、class 與 aboutus 保持一致。
export default function WallHeader() {
  return (
    <header className="sticky top-4 z-50 max-w-5xl mx-auto px-4">
      <nav className="bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-sm rounded-full py-2.5 px-6 flex items-center justify-between transition-all">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold shadow-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            DiveAI
          </span>
        </Link>

        {/* 選單連結 */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="#" className="hover:text-gray-900 transition-colors">
            日報 | 學習地圖
          </Link>
          <Link
            href="/commuity-wall"
            className="text-[#2563EB] font-semibold transition-colors"
          >
            共學牆
          </Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">
            活動 | 課程
          </Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">
            AI 工具箱
          </Link>
          <Link href="/aboutus" className="hover:text-gray-900 transition-colors">
            About us
          </Link>
          <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
            工具分類
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* 右側按鈕區 */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            className="p-1.5 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <Link
            href="#"
            className="border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 text-xs font-semibold px-4 py-1.5 rounded-full transition-all"
          >
            Newsletter
          </Link>
        </div>
      </nav>
    </header>
  );
}
