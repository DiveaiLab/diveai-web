import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* 1. 頂部導覽列 (Navbar) */}
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
            <Link href="#" className="hover:text-gray-900 transition-colors">
              共學牆
            </Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">
              活動 | 課程
            </Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">
              AI 工具箱
            </Link>
            <Link
              href="/aboutus"
              className="text-[#2563EB] font-semibold transition-colors"
            >
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

      <main className="pt-12 pb-16">
        {/* 2. Hero 區塊 (主標題與品牌使命說明) */}
        <section className="max-w-3xl mx-auto text-center px-4 pt-8 pb-14">
          <span className="text-[#2563EB] font-semibold text-xs tracking-[0.25em] uppercase block mb-4">
            A B O U T &nbsp; U S
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.25] mb-8">
            把 AI，
            <br />
            用在對的地方。
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            我們發起於一門大學通識課，由授課老師與修課學生一起延續下來。相信 AI
            焦慮多半來自沒有判斷框架，而不是能力不足；所以先在課堂上建立「何時信、何時查、何時動手做」的判斷方式，再把它變成社群每天在練的習慣。現在除了每日更新的日報與共學牆，也持續辦線下工作坊與
            YouTube 頻道，讓學習不只停在課堂裡。
          </p>
        </section>

        {/* 3. 核心價值區塊 (3 Cards) */}
        <section className="max-w-5xl mx-auto px-4 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 01 */}
            <div className="bg-white border border-gray-100/80 rounded-2xl p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
              <span className="text-[#2563EB] text-2xl font-bold block mb-4">
                01
              </span>
              <h3 className="text-gray-900 font-bold text-lg mb-2">
                用在對的地方
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                不是所有事都該交給 AI。先想清楚問題，再決定工具 —— 這比會下 Prompt 更重要。
              </p>
            </div>

            {/* Card 02 */}
            <div className="bg-white border border-gray-100/80 rounded-2xl p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
              <span className="text-[#2563EB] text-2xl font-bold block mb-4">
                02
              </span>
              <h3 className="text-gray-900 font-bold text-lg mb-2">
                動手做，消除焦慮
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                AI 焦慮來自距離感。做過一個專題、寫過一次 Agent，焦慮就變成判斷力。
              </p>
            </div>

            {/* Card 03 */}
            <div className="bg-white border border-gray-100/80 rounded-2xl p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
              <span className="text-[#2563EB] text-2xl font-bold block mb-4">
                03
              </span>
              <h3 className="text-gray-900 font-bold text-lg mb-2">
                共學，而非獨學
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                每個人的科系與問題不同，互相看彼此怎麼用，學得最快。
              </p>
            </div>
          </div>
        </section>

        {/* 4. 團隊介紹區塊 */}
        <section className="bg-[#F8F7F4] py-16 px-4 mb-20 border-y border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {/* Member 1 */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs mb-3 bg-white/50">
                  [照片]
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-0.5">
                  待補
                </h4>
                <p className="text-xs text-gray-500">創辦 / 內容</p>
              </div>

              {/* Member 2 */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs mb-3 bg-white/50">
                  [照片]
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-0.5">
                  待補
                </h4>
                <p className="text-xs text-gray-500">課程設計</p>
              </div>

              {/* Member 3 */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs mb-3 bg-white/50">
                  [照片]
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-0.5">
                  待補
                </h4>
                <p className="text-xs text-gray-500">社群經營</p>
              </div>

              {/* Member 4 */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs mb-3 bg-white/50">
                  [照片]
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-0.5">
                  待補
                </h4>
                <p className="text-xs text-gray-500">技術 / 專題</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CTA 區塊 (YouTube & 社群) */}
        <section className="max-w-3xl mx-auto text-center px-4 mb-24">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            每週影片與社群，都在 YouTube 與共學牆。
          </h2>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="#"
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all"
            >
              逛共學牆
              <span className="text-xs">↗</span>
            </Link>
            <Link
              href="#"
              className="bg-white border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-medium text-sm px-6 py-2.5 rounded-full transition-all"
            >
              訂閱 Newsletter
            </Link>
          </div>
        </section>
      </main>

      {/* 6. Footer 區塊 */}
      <footer className="border-t border-gray-200/80 bg-white pt-16 pb-12 text-sm text-gray-600">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-100">
            {/* 左側品牌與 Email 訂閱 */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs">
                    <svg
                      className="w-4 h-4"
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
                  <span className="font-bold text-gray-900 text-lg">
                    DiveAI
                  </span>
                </div>
                <p className="text-gray-900 font-bold text-base mb-6 leading-snug">
                  把 AI，
                  <br />
                  用在對的地方。
                </p>
              </div>

              <div>
                <form className="flex items-center gap-2 max-w-sm">
                  <input
                    type="email"
                    placeholder="輸入 Email 訂閱日報"
                    className="flex-1 bg-gray-100/80 border-0 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                  />
                  <button
                    type="submit"
                    aria-label="Submit Email"
                    className="bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl p-2.5 flex items-center justify-center transition-colors"
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
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </form>
                <p className="text-xs text-gray-400 mt-2">
                  每週 3 封，隨時可退訂。
                </p>
              </div>
            </div>

            {/* 中間與右側選單 */}
            <div className="md:col-span-7 grid grid-cols-3 gap-6">
              {/* Pages */}
              <div>
                <h5 className="font-bold text-gray-900 text-xs tracking-wider uppercase mb-4">
                  Pages
                </h5>
                <ul className="space-y-2.5 text-xs text-gray-500">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      日報 | 學習地圖
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      共學牆
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      活動 | 課程
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      AI 工具箱
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/aboutus"
                      className="hover:text-gray-900 transition-colors font-medium text-gray-700"
                    >
                      About us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Collections */}
              <div>
                <h5 className="font-bold text-gray-900 text-xs tracking-wider uppercase mb-4">
                  Collections
                </h5>
                <ul className="space-y-2.5 text-xs text-gray-500">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      新手入門包
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      Vibe Coding 工具
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      研究與報告
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      職涯準備
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-gray-900 transition-colors"
                    >
                      本週熱門
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <h5 className="font-bold text-gray-900 text-xs tracking-wider uppercase mb-4">
                  Social
                </h5>
                <ul className="space-y-2.5 text-xs text-gray-500">
                  <li>
                    <Link
                      href="#"
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          width={20}
                          height={20}
                          x={2}
                          y={2}
                          rx={5}
                          ry={5}
                          strokeWidth={2}
                        />
                        <path
                          d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
                          strokeWidth={2}
                        />
                        <line
                          x1={17.5}
                          x2={17.51}
                          y1={6.5}
                          y2={6.5}
                          strokeWidth={2}
                        />
                      </svg>
                      Instagram
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth={2}
                          d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"
                        />
                        <polygon
                          points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
                          fill="currentColor"
                        />
                      </svg>
                      YouTube
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth={2}
                          d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                        />
                      </svg>
                      Facebook
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 底部智慧財產權與條款 */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
            <p>DiveAI © 2026</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-gray-600 transition-colors">
                Terms &amp; Conditions
              </Link>
              <Link href="#" className="hover:text-gray-600 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
