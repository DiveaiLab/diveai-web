import Link from "next/link";

// 複製自 app/aboutus/page.tsx 的 Footer 區塊，Pages 選單裡的「共學牆」
// 改成 active 樣式（比照原本 aboutus 對「About us」的處理方式）。
export default function WallFooter() {
  return (
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
                <span className="font-bold text-gray-900 text-lg">DiveAI</span>
              </div>
              <p className="text-gray-900 font-bold text-base mb-6 leading-snug">
                把 AI，
                <br />
                用在對的地方。
              </p>
            </div>

            <div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-2 max-w-sm"
              >
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
              <p className="text-xs text-gray-400 mt-2">每週 3 封，隨時可退訂。</p>
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
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    日報 | 學習地圖
                  </Link>
                </li>
                <li>
                  <Link
                    href="/commuity-wall"
                    className="hover:text-gray-900 transition-colors font-medium text-gray-700"
                  >
                    共學牆
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    活動 | 課程
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    AI 工具箱
                  </Link>
                </li>
                <li>
                  <Link
                    href="/aboutus"
                    className="hover:text-gray-900 transition-colors"
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
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    新手入門包
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    Vibe Coding 工具
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    研究與報告
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    職涯準備
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
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
  );
}
