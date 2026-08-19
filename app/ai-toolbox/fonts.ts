import localFont from "next/font/local";

// 專案設計系統指定字體為 LINE Seed TW（見 AGENTS.md）。
// main 的 app/globals.css 目前沒有宣告這個字體、layout.tsx 載入的仍是預設的
// Geist，兩者都是共用檔案、不在本分頁負責範圍內，所以這裡只在 ai-toolbox
// 分頁範圍內自行載入，讓本分頁單獨存在於 main 上時字體也是對的。
//
// ⚠️ 整合階段請刪掉這個檔案：feature/homepage 的 globals.css 已用 @font-face
// 全站宣告同樣三個字重，兩邊並存會讓瀏覽器把同一批字體檔抓兩次（各約 3.4MB）。
// ai-toolbox.module.css 的 font-family 已寫成
// `var(--font-line-seed-tw), "LINE Seed TW", sans-serif`，
// 移除本檔與根容器上的 lineSeedTW.variable 後會自動改用全站宣告的字體。
export const lineSeedTW = localFont({
  src: [
    {
      path: "../../public/fonts/LINESeedTW_OTF_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINESeedTW_OTF_Bd.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINESeedTW_OTF_Eb.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-line-seed-tw",
});
