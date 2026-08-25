import Link from "next/link";

type TagSidebarProps = {
  tags: string[];
};

// 固定寫死的膠囊配色（主色 #2563EB 及其色階輪替），依 index 輪替，不用隨機。
const PILL_VARIANTS = [
  "bg-blue-50 text-[#2563EB] border border-blue-200",
  "bg-[#2563EB] text-white border border-[#2563EB]",
  "bg-blue-100 text-blue-800 border border-blue-200",
  "bg-white text-[#2563EB] border border-[#2563EB]",
];

// 技術標籤改放左欄，純靜態排列（不再是會捲動的動畫列），桌機 sticky
// 固定在可視範圍內滾動、手機不 sticky、堆疊在右欄內容上方——跟原本
// 「小組動態」在左欄時的 sticky 行為一致，只是內容換成標籤。
export default function TagSidebar({ tags }: TagSidebarProps) {
  return (
    <aside className="md:sticky md:top-28 md:self-start mb-10 md:mb-0">
      <h2 className="text-sm font-bold text-gray-900 mb-4">技術標籤</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <Link
            key={tag}
            href={`/commuity-wall/tag/${encodeURIComponent(tag)}`}
            className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap hover:opacity-80 transition-opacity ${
              PILL_VARIANTS[i % PILL_VARIANTS.length]
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>
    </aside>
  );
}
