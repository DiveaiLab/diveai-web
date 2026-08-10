import { mockTeamGroups } from "../lib/mock-teams";

// 每張卡片的便條紙角度／底色不放進資料裡（資料只描述內容），
// 用 index 對應到固定的一組樣式，四張卡片角度、暖色系底色都不一樣。
const STICKY_STYLES = [
  { rotate: "-rotate-2", bg: "bg-amber-100" },
  { rotate: "rotate-1", bg: "bg-orange-100" },
  { rotate: "-rotate-1", bg: "bg-amber-100" },
  { rotate: "rotate-2", bg: "bg-orange-100" },
];

// 左欄「小組動態」：桌機（md 以上）sticky 固定在可視範圍內滾動，
// 手機版（md 以下）不 sticky，直接堆疊在右欄內容上方（由 grid 的 DOM 順序決定）。
// 卡片純靜態展示，不可點擊、不導向任何頁面。
export default function TeamUpdatesSidebar() {
  return (
    <aside className="md:sticky md:top-28 md:self-start mb-10 md:mb-0">
      <h2 className="text-sm font-bold text-gray-900 mb-4">小組動態</h2>
      <div className="space-y-6">
        {mockTeamGroups.map((team, index) => {
          const sticky = STICKY_STYLES[index % STICKY_STYLES.length];
          return (
            <div
              key={team.id}
              className="bg-white border border-gray-100/80 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] p-6"
            >
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                {team.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-5">
                {team.currentFocus}
              </p>

              {/* 便條紙：暖色底、陰影、輕微旋轉，模擬貼在卡片上的質感 */}
              <div
                className={`${sticky.bg} ${sticky.rotate} ml-auto w-fit max-w-[88%] rounded-sm px-3 py-2.5 shadow-md`}
              >
                <p className="text-xs text-amber-900/80 leading-snug">
                  {team.stickyNote}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
