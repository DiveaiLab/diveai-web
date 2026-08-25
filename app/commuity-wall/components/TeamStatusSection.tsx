"use client";

import { useWallState } from "@/app/lib/wall/wall-state-context";

// 小組短標籤：拿掉「組」字當作卡片頂部的小分類標籤（社群組 → 社群），
// 不额外造新資料欄位，也維持繁體中文（不用參考圖那種英文分類字）。
function shortLabel(name: string): string {
  return name.endsWith("組") ? name.slice(0, -1) : name;
}

// stickyNote 資料本身就寫成「這次對焦目標：...」（之前便條紙版型用的完整
// 一句話），現在卡片改成有獨立的「本次目標」標籤，兩者疊在一起會重複講
// 兩次，這裡把資料裡重複的前綴去掉，只在畫面上顯示需要重複的地方顯示。
function stripFocusGoalPrefix(text: string): string {
  return text.replace(/^這次對焦目標[：:]\s*/, "");
}

// 小組動態：原本是左側 sticky 側欄，現在改成放在三個 carousel 分區下方、
// 橫向並排的卡片列（比照參考圖 Team Status 的排法），桌機一列 4 張、
// 手機兩欄換行，卡片本身純靜態展示，不可點擊。
//
// 資料改成從 useWallState() 讀（不再直接 import 靜態的 mockTeamGroups），
// 這樣後台（app/admin/wall/teams）更新小組動態後，這裡會立刻反映最新內容。
export default function TeamStatusSection() {
  const { teams } = useWallState();

  return (
    <section className="max-w-7xl mx-auto px-4 mt-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">小組動態</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white border border-gray-100/80 rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]"
          >
            <span className="inline-block text-[11px] font-semibold text-[#2563EB] bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5 mb-3">
              {shortLabel(team.name)}
            </span>
            <h3 className="text-base font-bold text-gray-900 mb-4">{team.name}</h3>

            <p className="text-[11px] font-semibold text-gray-400 tracking-wide mb-1">
              目前進度
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {team.currentFocus}
            </p>

            <p className="text-[11px] font-semibold text-gray-400 tracking-wide mb-1">
              本次目標
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {stripFocusGoalPrefix(team.stickyNote)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
