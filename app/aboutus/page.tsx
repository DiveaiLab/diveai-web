"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";

// 符合團隊初衷且可愛溫馨的吉祥物語錄集
const mascotQuotes = [
  "嗨！別害怕 AI，我們先想清楚問題，再一起找到對的工具！💡",
  "記得喔～何時該信、何時該查、何時動手做，這就是我們的 AI 判斷力！✨",
  "一步一步來！做過一次專題，焦慮就會變成你的能力值！🚀",
  "獨學不如共學～快去『共學牆』看看大家都在玩些什麼吧！🌱",
  "AI 不是要取代你，而是陪你把時間省下來去享受生活！☕",
  "不用一次懂完所有事，今天跟我一起踏出呆一步就好囉！🤖",
];

export default function AboutUsPage() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [isPop, setIsPop] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // 點擊吉祥物切換語錄
  const handleMascotClick = () => {
    let nextIndex = Math.floor(Math.random() * mascotQuotes.length);
    if (nextIndex === quoteIndex) {
      nextIndex = (quoteIndex + 1) % mascotQuotes.length;
    }
    setQuoteIndex(nextIndex);
    setShowBubble(true);
    setIsPop(true);

    setTimeout(() => setIsPop(false), 300);
  };

  return (
    <div className="min-h-screen bg-[#E9F6FF] text-[#0E0E2C] font-sans selection:bg-[#6FC1CC]/30 selection:text-[#32738F] overflow-x-hidden">
      {/* 1. 全站通用頂部導覽列 */}
      <Navbar />

      <main className="pb-16 md:pb-24">
        {/* 2. Hero 區塊 (👈 左側：吉祥物公仔 | 👉 右側：標題 + 右側空間精簡有序起源說明) */}
        <section className="relative overflow-hidden pt-10 md:pt-16 pb-12 px-4">
          {/* 背景漸層光暈氣泡 */}
          <div
            className="absolute -top-12 -left-16 w-[480px] h-[480px] rounded-full bg-[#6FC1CC]/25 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-16 -right-16 w-[420px] h-[420px] rounded-full bg-[#F8C0A0]/25 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* 👈 左側欄位：公仔 (吉祥物機器人 + 對話氣泡) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-start sticky top-24">
              {/* 對話氣泡 */}
              <div
                className={`transition-all duration-300 transform mb-3 ${showBubble
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-2 pointer-events-none"
                  }`}
              >
                <div className="relative bg-[#FAFCFE] text-[#0E0E2C] border-2 border-[#6FC1CC] px-5 py-3 rounded-2xl shadow-xl max-w-[280px] sm:max-w-[320px] text-center text-xs sm:text-sm font-bold leading-relaxed">
                  <p>{mascotQuotes[quoteIndex]}</p>
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#6FC1CC]" />
                </div>
              </div>

              {/* 吉祥物點擊觸發點 */}
              <div
                onClick={handleMascotClick}
                title="點擊我有驚喜喔！"
                className={`relative w-full max-w-[320px] aspect-square flex items-center justify-center cursor-pointer group transition-transform duration-300 ${isPop ? "scale-95" : "hover:scale-105"
                  }`}
              >
                <span className="absolute -top-1 bg-[#F8C0A0] text-[#0E0E2C] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm group-hover:animate-bounce z-20">
                  👆 點我聽心聲！
                </span>

                <div
                  className="absolute inset-0 border border-[#32738F]/20 rounded-full group-hover:border-[#6FC1CC] transition-colors"
                  aria-hidden="true"
                />
                <div className="relative z-10 w-[70%] aspect-square rounded-[36px] bg-[#FAFCFE]/95 border-2 border-white/80 shadow-[0_20px_50px_rgba(50,115,143,0.2)] flex items-center justify-center p-5 group-hover:shadow-[0_25px_60px_rgba(111,193,204,0.35)] transition-all">
                  <span
                    className="absolute top-4 right-5 w-4 h-4 rounded-full bg-[#F8C0A0]"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute bottom-5 left-4 w-2.5 h-2.5 rounded-full bg-[#F8C0A0]"
                    aria-hidden="true"
                  />
                  <Image
                    src="/images/diveai-mascot.png"
                    alt="呆一步 AI 機器人圖示"
                    width={237}
                    height={221}
                    className="w-full h-auto object-contain transition-transform group-hover:-rotate-3"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* 👉 右側欄位：上方標題 + 下方精簡有序「我們的起源與堅持」卡片鏈 */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              {/* 1. 主標題與副標題 */}
              <div>
                <span className="text-[#32738F] font-extrabold text-xs tracking-[0.2em] uppercase block mb-3">
                  ABOUT US
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0E0E2C] tracking-tight leading-[1.18] mb-3">
                  把 AI，用在對的地方。
                </h1>
                <p className="text-[#32738F] font-bold text-base sm:text-lg">
                  陪你用更簡單、更踏實的方式，一步步走進 AI 的世界。
                </p>
              </div>

              {/* 2. 精簡有序「我們的起源與堅持」小區塊卡片 */}
              <div className="w-full pt-2 border-t border-[#32738F]/15">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#6FC1CC]" />
                  <h3 className="text-xs font-extrabold text-[#32738F] tracking-widest uppercase">
                    OUR STORY & MISSION ｜ 我們的起源與堅持
                  </h3>
                </div>

                {/* 有序 3 步驟卡片列表 (精美尺寸不佔空間) */}
                <div className="space-y-3.5">
                  {/* 步驟 01 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFCFE] border border-[#32738F]/15 shadow-sm hover:border-[#6FC1CC] transition-all flex items-start gap-4">
                    <span className="w-8 h-8 rounded-xl bg-[#E9F6FF] text-[#32738F] font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#6FC1CC]/30">
                      01
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-extrabold text-[#0E0E2C]">
                          緣起通識課堂
                        </h4>
                        <span className="text-[10px] font-bold text-[#32738F] bg-[#E9F6FF] px-2 py-0.5 rounded-md">
                          🎓 師生延續
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#0E0E2C]/75 leading-relaxed">
                        我們發起於一門大學通識課，由授課老師與修課學生一起延續下來。
                      </p>
                    </div>
                  </div>

                  {/* 步驟 02 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFCFE] border-2 border-[#6FC1CC]/60 shadow-sm hover:border-[#6FC1CC] transition-all flex items-start gap-4">
                    <span className="w-8 h-8 rounded-xl bg-[#F8C0A0]/30 text-[#0E0E2C] font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#F8C0A0]">
                      02
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-extrabold text-[#0E0E2C]">
                          建立核心判斷框架
                        </h4>
                        <span className="text-[10px] font-bold text-[#32738F] bg-[#E9F6FF] px-2 py-0.5 rounded-md">
                          🧠 消除焦慮
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#0E0E2C]/75 leading-relaxed mb-2.5">
                        相信 AI
                        焦慮多半來自沒有判斷框架，而不是能力不足；所以先在課堂上建立
                      </p>

                      {/* 膠囊簡約按鈕組 */}
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() =>
                            setActiveStep(activeStep === 1 ? null : 1)
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold border transition-all ${activeStep === 1
                              ? "bg-[#32738F] text-white border-[#32738F]"
                              : "bg-[#E9F6FF] text-[#32738F] border-[#6FC1CC]/40 hover:bg-[#6FC1CC]/20"
                            }`}
                        >
                          🔍 「何時信」
                        </button>
                        <button
                          onClick={() =>
                            setActiveStep(activeStep === 2 ? null : 2)
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold border transition-all ${activeStep === 2
                              ? "bg-[#32738F] text-white border-[#32738F]"
                              : "bg-[#E9F6FF] text-[#32738F] border-[#6FC1CC]/40 hover:bg-[#6FC1CC]/20"
                            }`}
                        >
                          🛡️ 「何時查」
                        </button>
                        <button
                          onClick={() =>
                            setActiveStep(activeStep === 3 ? null : 3)
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold border transition-all ${activeStep === 3
                              ? "bg-[#32738F] text-white border-[#32738F]"
                              : "bg-[#E9F6FF] text-[#32738F] border-[#6FC1CC]/40 hover:bg-[#6FC1CC]/20"
                            }`}
                        >
                          🛠️ 「何時動手做」
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-[#0E0E2C]/75 leading-relaxed mt-2.5">
                        的判斷方式，再把它變成社群每天在練的習慣。
                      </p>
                    </div>
                  </div>

                  {/* 步驟 03 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFCFE] border border-[#32738F]/15 shadow-sm hover:border-[#6FC1CC] transition-all flex items-start gap-4">
                    <span className="w-8 h-8 rounded-xl bg-[#E9F6FF] text-[#32738F] font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#6FC1CC]/30">
                      03
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-extrabold text-[#0E0E2C]">
                          跨出課堂多管道學習
                        </h4>
                        <span className="text-[10px] font-bold text-[#32738F] bg-[#E9F6FF] px-2 py-0.5 rounded-md">
                          🚀 社群持續
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#0E0E2C]/75 leading-relaxed">
                        現在除了每日更新的日報與共學牆，也持續辦線下工作坊與
                        YouTube 頻道，讓學習不只停在課堂裡。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 核心價值區塊 (3 大卡片) */}
        <section className="relative z-10 py-12 md:py-20 bg-[#FAFCFE] rounded-[36px] md:rounded-[56px] shadow-[0_-12px_40px_rgba(50,115,143,0.06)] px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 01 */}
              <div className="relative flex flex-col min-h-[260px] p-8 rounded-3xl bg-[#E9F6FF] border border-[#32738F]/15 hover:border-[#32738F]/35 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="w-12 h-12 rounded-full bg-[#FAFCFE]/90 border border-[#32738F]/20 text-[#32738F] font-extrabold text-sm flex items-center justify-center mb-6">
                  01
                </span>
                <h3 className="text-[#0E0E2C] font-extrabold text-xl mb-3">
                  用在對的地方
                </h3>
                <p className="text-[#0E0E2C]/70 text-sm sm:text-base leading-relaxed">
                  不是所有事都該交給 AI。先想清楚問題，再決定工具 —— 這比會下 Prompt 更重要。
                </p>
              </div>

              {/* Card 02 */}
              <div className="relative flex flex-col min-h-[260px] p-8 rounded-3xl bg-[#E9F6FF] border border-[#32738F]/15 hover:border-[#32738F]/35 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="w-12 h-12 rounded-full bg-[#FAFCFE]/90 border border-[#32738F]/20 text-[#32738F] font-extrabold text-sm flex items-center justify-center mb-6">
                  02
                </span>
                <h3 className="text-[#0E0E2C] font-extrabold text-xl mb-3">
                  動手做，消除焦慮
                </h3>
                <p className="text-[#0E0E2C]/70 text-sm sm:text-base leading-relaxed">
                  AI 焦慮來自距離感。做過一個專題、寫過一次 Agent，焦慮就變成判斷力。
                </p>
              </div>

              {/* Card 03 */}
              <div className="relative flex flex-col min-h-[260px] p-8 rounded-3xl bg-[#E9F6FF] border border-[#32738F]/15 hover:border-[#32738F]/35 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="w-12 h-12 rounded-full bg-[#FAFCFE]/90 border border-[#32738F]/20 text-[#32738F] font-extrabold text-sm flex items-center justify-center mb-6">
                  03
                </span>
                <h3 className="text-[#0E0E2C] font-extrabold text-xl mb-3">
                  共學，而非獨學
                </h3>
                <p className="text-[#0E0E2C]/70 text-sm sm:text-base leading-relaxed">
                  每個人的科系與問題不同，互相看彼此怎麼用，學得最快。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 團隊介紹區塊 */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#0E0E2C] text-center mb-10 md:mb-14">
              團隊成員
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {/* Member 1 */}
              <div
                onClick={handleMascotClick}
                className="flex flex-col items-center p-6 md:p-8 rounded-2xl bg-[#FAFCFE] border border-[#32738F]/12 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="w-24 h-24 rounded-full border-2 border-[#6FC1CC] bg-[#E9F6FF] overflow-hidden flex items-center justify-center p-3 mb-4 shadow-inner group-hover:scale-105 transition-transform">
                  <Image
                    src="/images/diveai-mascot.png"
                    alt="創辦 / 內容"
                    width={96}
                    height={96}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <h4 className="font-extrabold text-[#0E0E2C] text-lg mb-1">
                  待補
                </h4>
                <p className="text-xs sm:text-sm font-bold text-[#32738F]">
                  創辦 / 內容
                </p>
              </div>

              {/* Member 2 */}
              <div
                onClick={handleMascotClick}
                className="flex flex-col items-center p-6 md:p-8 rounded-2xl bg-[#FAFCFE] border border-[#32738F]/12 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="w-24 h-24 rounded-full border-2 border-[#6FC1CC] bg-[#E9F6FF] overflow-hidden flex items-center justify-center p-3 mb-4 shadow-inner group-hover:scale-105 transition-transform">
                  <Image
                    src="/images/diveai-mascot.png"
                    alt="課程設計"
                    width={96}
                    height={96}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <h4 className="font-extrabold text-[#0E0E2C] text-lg mb-1">
                  待補
                </h4>
                <p className="text-xs sm:text-sm font-bold text-[#32738F]">
                  課程設計
                </p>
              </div>

              {/* Member 3 */}
              <div
                onClick={handleMascotClick}
                className="flex flex-col items-center p-6 md:p-8 rounded-2xl bg-[#FAFCFE] border border-[#32738F]/12 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="w-24 h-24 rounded-full border-2 border-[#6FC1CC] bg-[#E9F6FF] overflow-hidden flex items-center justify-center p-3 mb-4 shadow-inner group-hover:scale-105 transition-transform">
                  <Image
                    src="/images/diveai-mascot.png"
                    alt="社群經營"
                    width={96}
                    height={96}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <h4 className="font-extrabold text-[#0E0E2C] text-lg mb-1">
                  待補
                </h4>
                <p className="text-xs sm:text-sm font-bold text-[#32738F]">
                  社群經營
                </p>
              </div>

              {/* Member 4 */}
              <div
                onClick={handleMascotClick}
                className="flex flex-col items-center p-6 md:p-8 rounded-2xl bg-[#FAFCFE] border border-[#32738F]/12 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="w-24 h-24 rounded-full border-2 border-[#6FC1CC] bg-[#E9F6FF] overflow-hidden flex items-center justify-center p-3 mb-4 shadow-inner group-hover:scale-105 transition-transform">
                  <Image
                    src="/images/diveai-mascot.png"
                    alt="技術 / 專題"
                    width={96}
                    height={96}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <h4 className="font-extrabold text-[#0E0E2C] text-lg mb-1">
                  待補
                </h4>
                <p className="text-xs sm:text-sm font-bold text-[#32738F]">
                  技術 / 專題
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 行動呼籲 CTA 區塊 */}
        <section className="py-12 md:py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0E0E2C] leading-snug mb-8">
              每週影片與社群，都在 YouTube 與共學牆。
            </h2>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/commuity-wall"
                className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-8 rounded-full bg-[#0E0E2C] text-[#FAFCFE] font-extrabold text-sm sm:text-base hover:bg-[#32738F] hover:-translate-y-0.5 transition-all shadow-md"
              >
                <span>逛共學牆</span>
                <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full border border-[#32738F] bg-[#FAFCFE] text-[#32738F] font-extrabold text-sm sm:text-base hover:bg-[#E9F6FF] hover:-translate-y-0.5 transition-all"
              >
                閱讀日報
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full border border-[#6FC1CC] bg-[#FAFCFE] text-[#32738F] font-extrabold text-sm sm:text-base hover:bg-[#E9F6FF] hover:-translate-y-0.5 transition-all"
              >
                探索課程
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 全站通用頁尾 */}
      <Footer />
    </div>
  );
}
