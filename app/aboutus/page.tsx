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

// 四大團隊專案組詳細資料
interface ProjectGroup {
  id: string;
  badge: string;
  number: string;
  title: string;
  tagline: string;
  accentColor: string;
  accentBorder: string;
  bullets: {
    icon: string;
    text: string;
  }[];
  techTags: string[];
  detailSection?: {
    desc: string;
    items?: {
      icon: string;
      title: string;
      desc: string;
    }[];
  };
}

const projectGroups: ProjectGroup[] = [
  {
    id: "bot",
    number: "01",
    badge: "AI Agent 研發",
    title: "呆一布機器人",
    tagline: "使用 OpenClaw、Hermes Agent 打造智慧隨身助手",
    accentColor: "#32738F",
    accentBorder: "border-[#6FC1CC]",
    bullets: [
      { icon: "🤖", text: "使用 OpenClaw、Hermes agent 框架" },
      { icon: "⚡", text: "打造呆一布機器人，讓呆一布幫忙做事" },
      { icon: "🛠️", text: "建立日常工作流自動化與工具調用" },
    ],
    techTags: ["OpenClaw", "Hermes Agent", "工作流自動化"],
    detailSection: {
      desc: "結合前沿 Agent 架構與智慧自動化工作流，打造能夠主動協助處理日常瑣事、整合各項工具與資源的智慧「呆一布機器人」，讓 AI 真正落地成為生活與學習上的得力夥伴。",
    },
  },
  {
    id: "daily",
    number: "02",
    badge: "日報 ✕ 原型孵化",
    title: "呆一布日報想想組",
    tagline: "每日 AI 自動發文，發想共鳴點子並打造有趣原型機",
    accentColor: "#6FC1CC",
    accentBorder: "border-[#6FC1CC]",
    bullets: [
      { icon: "📰", text: "做出呆一布 AI 日報，每天自動搜尋新聞來源並發文" },
      { icon: "💡", text: "從日報中發想有什麼值得做、會讓學生有共鳴的內容" },
      { icon: "🧪", text: "動手做有趣的原型機（Rapid Prototype）" },
    ],
    techTags: ["自動發文", "新聞採集", "學生共鳴", "趣味原型機"],
    detailSection: {
      desc: "透過自動化管線每日持續搜尋全球 AI 趨勢來源並精準發布；更以日報為創意泉源，深入挖掘貼近學生真實痛點的好點子，快速動手打造有趣又有感的 AI 原型機！",
    },
  },
  {
    id: "community",
    number: "03",
    badge: "社群 ✕ 自媒體實戰",
    title: "社群兼 Hahow 組",
    tagline: "製作數據儀表板、拍片剪片，攜手 Hahow 共創課程",
    accentColor: "#F8C0A0",
    accentBorder: "border-[#F8C0A0]",
    bullets: [
      { icon: "📊", text: "製作社群數據儀表板，掌握互動與流量趨勢" },
      { icon: "🎬", text: "喜歡經營社群，拍片、剪片與日常分享" },
      { icon: "🎓", text: "與 Hahow 行銷團隊一起完成高品質課程" },
      { icon: "✨", text: "未來想做自己的頻道，趁現在先練習上手！" },
    ],
    techTags: ["數據儀表板", "影音創作", "Hahow 合作", "頻道實戰"],
    detailSection: {
      desc: "熱愛社群與影音創作的夢想發射台！不僅打造專業的社群數據儀表板，也負責拍片、剪片與社群日常營運，並與知名線上課程平台 Hahow 行銷團隊深度合作課程。想做個人頻道，就趁現在實戰練習！",
    },
  },
  {
    id: "web",
    number: "04",
    badge: "平台架設 ✕ 7 大架構",
    title: "呆一布網頁架設",
    tagline: "打造完整的 DiveAI 官方平台，串聯 7 大核心模組",
    accentColor: "#0E0E2C",
    accentBorder: "border-[#32738F]",
    bullets: [
      { icon: "🏠", text: "首頁：品牌介紹、理念、吉祥物、頻道連結" },
      { icon: "🗺️", text: "AI 學習地圖 ＆ 🧰 工具箱使用心得" },
      { icon: "📰", text: "呆一布日報頁 ＆ 🧱 共學專案展示牆" },
      { icon: "📚", text: "活動與讀書會 ＆ 🤖 機器人互動入口" },
    ],
    techTags: ["Next.js", "Tailwind CSS", "MDX", "平台架設"],
    detailSection: {
      desc: "從無到有建置現代化官方網站，串聯 7 大核心模組：首頁、AI 學習地圖、AI 工具箱、呆一布日報頁、共學專案牆、活動與讀書會頁面，以及呆一布機器人入口！",
      items: [
        { icon: "🏠", title: "首頁", desc: "品牌介紹、理念、吉祥物、頻道連結" },
        { icon: "🗺️", title: "AI 學習地圖", desc: "初學者從零理解 AI 的路線" },
        { icon: "🧰", title: "AI 工具箱", desc: "工具介紹與實戰心得" },
        { icon: "📰", title: "呆一布日報頁", desc: "讓每日 AI 新聞被看見" },
        { icon: "🧱", title: "共學專案牆", desc: "展示大家做出來的 AI 專案" },
        { icon: "📚", title: "活動與讀書會", desc: "記錄每週共學內容與成果" },
        { icon: "🤖", title: "機器人入口", desc: "直接與呆一布互動的智慧窗口" },
      ],
    },
  },
];

export default function AboutUsPage() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [isPop, setIsPop] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

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

  const selectedGroup = projectGroups.find((g) => g.id === selectedGroupId);

  return (
    <div className="min-h-screen bg-[#E9F6FF] text-[#0E0E2C] font-sans selection:bg-[#6FC1CC]/30 selection:text-[#32738F] overflow-x-hidden">
      {/* 1. 全站通用頂部導覽列 */}
      <Navbar />

      <main className="pb-16 md:pb-24">
        {/* 2. Hero 區塊 */}
        <section className="relative overflow-hidden pt-10 md:pt-16 pb-12 px-4">
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
              <div
                className={`transition-all duration-300 transform mb-3 ${
                  showBubble
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-2 pointer-events-none"
                }`}
              >
                <div className="relative bg-[#FAFCFE] text-[#0E0E2C] border-2 border-[#6FC1CC] px-5 py-3 rounded-2xl shadow-xl max-w-[280px] sm:max-w-[320px] text-center text-xs sm:text-sm font-bold leading-relaxed">
                  <p>{mascotQuotes[quoteIndex]}</p>
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#6FC1CC]" />
                </div>
              </div>

              <div
                onClick={handleMascotClick}
                title="點擊我有驚喜喔！"
                className={`relative w-full max-w-[320px] aspect-square flex items-center justify-center cursor-pointer group transition-transform duration-300 ${
                  isPop ? "scale-95" : "hover:scale-105"
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

            {/* 👉 右側欄位：主標題 + 起源說明 */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              <div>
                <span className="text-[#32738F] font-extrabold text-xs tracking-[0.2em] uppercase block mb-3">
                  ABOUT US ｜ 關於我們
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0E0E2C] tracking-tight leading-[1.18] mb-3">
                  把 AI，用在對的地方。
                </h1>
                <p className="text-[#32738F] font-bold text-base sm:text-lg">
                  陪你用更簡單、更踏實的方式，一步步走進 AI 的世界。
                </p>
              </div>

              <div className="w-full pt-2 border-t border-[#32738F]/15">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#6FC1CC]" />
                  <h3 className="text-xs font-extrabold text-[#32738F] tracking-widest uppercase">
                    OUR STORY & MISSION ｜ 我們的起源與堅持
                  </h3>
                </div>

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
                        相信 AI 焦慮多半來自沒有判斷框架，而不是能力不足；所以先在課堂上建立
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveStep(activeStep === 1 ? null : 1)
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold border transition-all ${
                            activeStep === 1
                              ? "bg-[#32738F] text-white border-[#32738F]"
                              : "bg-[#E9F6FF] text-[#32738F] border-[#6FC1CC]/40 hover:bg-[#6FC1CC]/20"
                          }`}
                        >
                          🔍 「何時信」
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveStep(activeStep === 2 ? null : 2)
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold border transition-all ${
                            activeStep === 2
                              ? "bg-[#32738F] text-white border-[#32738F]"
                              : "bg-[#E9F6FF] text-[#32738F] border-[#6FC1CC]/40 hover:bg-[#6FC1CC]/20"
                          }`}
                        >
                          🛡️ 「何時查」
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveStep(activeStep === 3 ? null : 3)
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold border transition-all ${
                            activeStep === 3
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
        <section className="relative z-10 py-12 md:py-16 bg-[#FAFCFE] rounded-[36px] md:rounded-[56px] shadow-[0_-12px_40px_rgba(50,115,143,0.06)] px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[#32738F] font-extrabold text-xs tracking-[0.2em] uppercase block mb-2">
                OUR CORE VALUES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E0E2C]">
                三大核心精神，帶你踏實前進
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="relative flex flex-col min-h-[240px] p-7 md:p-8 rounded-3xl bg-[#E9F6FF] border border-[#32738F]/15 hover:border-[#32738F]/35 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="w-12 h-12 rounded-2xl bg-[#FAFCFE]/90 border border-[#32738F]/20 text-[#32738F] font-extrabold text-sm flex items-center justify-center mb-5">
                  01
                </span>
                <h3 className="text-[#0E0E2C] font-extrabold text-xl mb-2.5">
                  用在對的地方
                </h3>
                <p className="text-[#0E0E2C]/70 text-sm leading-relaxed">
                  不是所有事都該交給 AI。先想清楚問題，再決定工具 —— 這比會下 Prompt 更重要。
                </p>
              </div>

              <div className="relative flex flex-col min-h-[240px] p-7 md:p-8 rounded-3xl bg-[#E9F6FF] border border-[#32738F]/15 hover:border-[#32738F]/35 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="w-12 h-12 rounded-2xl bg-[#FAFCFE]/90 border border-[#32738F]/20 text-[#32738F] font-extrabold text-sm flex items-center justify-center mb-5">
                  02
                </span>
                <h3 className="text-[#0E0E2C] font-extrabold text-xl mb-2.5">
                  動手做，消除焦慮
                </h3>
                <p className="text-[#0E0E2C]/70 text-sm leading-relaxed">
                  AI 焦慮來自距離感。做過一個專題、寫過一次 Agent，焦慮就變成判斷力。
                </p>
              </div>

              <div className="relative flex flex-col min-h-[240px] p-7 md:p-8 rounded-3xl bg-[#E9F6FF] border border-[#32738F]/15 hover:border-[#32738F]/35 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="w-12 h-12 rounded-2xl bg-[#FAFCFE]/90 border border-[#32738F]/20 text-[#32738F] font-extrabold text-sm flex items-center justify-center mb-5">
                  03
                </span>
                <h3 className="text-[#0E0E2C] font-extrabold text-xl mb-2.5">
                  共學，而非獨學
                </h3>
                <p className="text-[#0E0E2C]/70 text-sm leading-relaxed">
                  每個人的科系與問題不同，互相看彼此怎麼用，學得最快也最有趣。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 團隊分工與四大專案組 (一行 4 個重點小卡片) */}
        <section id="projects" className="py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            {/* 標題與簡介 */}
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#32738F]/10 text-[#32738F] font-extrabold text-xs tracking-wider uppercase mb-3">
                <span>👥</span> TEAM & FOCUS GROUPS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E0E2C] tracking-tight mb-4">
                團隊分工與四大專案組
              </h2>
              <p className="text-[#0E0E2C]/75 text-sm sm:text-base leading-relaxed">
                我們依據專長與興趣分為四個核心專案小組，共同推進 DiveAI 的共學生態！點擊卡片可查看詳細介紹。
              </p>
            </div>

            {/* 一行 4 個重點小卡片 (Grid 4 欄) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {projectGroups.map((group) => {
                const isSelected = selectedGroupId === group.id;
                return (
                  <article
                    key={group.id}
                    onClick={() =>
                      setSelectedGroupId(isSelected ? null : group.id)
                    }
                    className={`relative rounded-[28px] p-6 bg-[#FAFCFE] border-2 transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                      isSelected
                        ? `${group.accentBorder} shadow-[0_16px_36px_rgba(50,115,143,0.18)] ring-2 ring-[#6FC1CC]/30 -translate-y-1.5`
                        : "border-[#32738F]/15 hover:border-[#6FC1CC] hover:shadow-[0_12px_28px_rgba(50,115,143,0.12)] hover:-translate-y-1"
                    }`}
                  >
                    <div>
                      {/* 卡片頂部：編號與標籤 */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="w-9 h-9 rounded-xl bg-[#E9F6FF] border border-[#6FC1CC]/40 text-[#32738F] font-extrabold text-sm flex items-center justify-center shadow-xs">
                          {group.number}
                        </span>
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#E9F6FF] text-[#32738F] border border-[#6FC1CC]/30">
                          {group.badge}
                        </span>
                      </div>

                      {/* 卡片標題與副標 */}
                      <h3 className="text-xl font-extrabold text-[#0E0E2C] tracking-tight mb-2 group-hover:text-[#32738F] transition-colors">
                        【專案{group.number.replace(/^0/, "")}】
                        <br />
                        {group.title}
                      </h3>
                      <p className="text-xs font-bold text-[#32738F] mb-4 line-clamp-2">
                        {group.tagline}
                      </p>

                      {/* 重點條列清單 */}
                      <ul className="space-y-2 mb-5 border-t border-[#32738F]/10 pt-3">
                        {group.bullets.map((b, bIdx) => (
                          <li
                            key={bIdx}
                            className="text-xs text-[#0E0E2C]/80 flex items-start gap-2 leading-relaxed"
                          >
                            <span className="text-sm flex-shrink-0 mt-0.5">
                              {b.icon}
                            </span>
                            <span>{b.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 卡片底部：標籤與展開提示 */}
                    <div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {group.techTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-[#E9F6FF]/70 text-[#32738F] text-[10px] font-bold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#32738F]/10 flex items-center justify-between text-[11px] font-extrabold text-[#32738F]">
                        <span>{isSelected ? "收起詳情" : "點擊查看詳情"}</span>
                        <span className="text-sm">
                          {isSelected ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* 選中組別展開詳情面板 */}
            {selectedGroup && (
              <div className="mt-8 p-6 sm:p-8 rounded-[32px] bg-[#FAFCFE] border-2 border-[#6FC1CC] shadow-[0_16px_40px_rgba(50,115,143,0.12)] transition-all animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#32738F]/15">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#32738F] text-white font-extrabold text-sm flex items-center justify-center">
                      {selectedGroup.number}
                    </span>
                    <div>
                      <h4 className="text-xl font-extrabold text-[#0E0E2C]">
                        【專案{selectedGroup.number.replace(/^0/, "")}】
                        {selectedGroup.title} 深度解析
                      </h4>
                      <span className="text-xs font-bold text-[#32738F]">
                        {selectedGroup.badge} ｜ {selectedGroup.tagline}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedGroupId(null)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-[#0E0E2C]/60 hover:text-[#0E0E2C] hover:bg-[#E9F6FF] self-start sm:self-auto transition-colors"
                  >
                    ✕ 關閉
                  </button>
                </div>

                <div className="py-4 text-xs sm:text-sm text-[#0E0E2C]/80 leading-relaxed">
                  <p>{selectedGroup.detailSection?.desc}</p>
                </div>

                {/* 若為專案四，展示 7 大架構網格 */}
                {selectedGroup.detailSection?.items && (
                  <div className="mt-2 pt-4 border-t border-[#32738F]/15">
                    <h5 className="text-xs font-extrabold text-[#32738F] uppercase tracking-wider mb-3">
                      🚀 7 大核心架構一覽：
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {selectedGroup.detailSection.items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl bg-white border border-[#32738F]/15 shadow-xs ${
                            idx === selectedGroup.detailSection!.items!.length - 1
                              ? "sm:col-span-2 bg-[#E9F6FF]/60 border-[#6FC1CC]"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span>{item.icon}</span>
                            <span className="text-xs font-extrabold text-[#0E0E2C]">
                              {item.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#0E0E2C]/70">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 5. 行動呼籲 CTA 區塊 */}
        <section className="py-12 md:py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-[#32738F] font-extrabold text-xs tracking-[0.2em] uppercase block mb-3">
              JOIN OUR JOURNEY
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0E0E2C] leading-snug mb-4">
              每週影片與社群，都在 YouTube 與共學牆。
            </h2>
            <p className="text-[#0E0E2C]/70 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              無論你是剛接觸 AI 的新手，還是想動手做專案的創作者，歡迎一起加入 DiveAI 共學生態圈！
            </p>

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
