import Link from "next/link";

type TagMarqueeProps = {
  tags: string[];
};

// 固定寫死的膠囊配色（主色 #2563EB 及其色階輪替），不用隨機——上次 Hero
// 的書脊裝飾帶已經因為隨機數值在伺服器／瀏覽器算出不同結果炸過一次
// hydration mismatch，這裡直接記取教訓，全部固定值。
const PILL_VARIANTS = [
  "bg-blue-50 text-[#2563EB] border border-blue-200",
  "bg-[#2563EB] text-white border border-[#2563EB]",
  "bg-blue-100 text-blue-800 border border-blue-200",
  "bg-white text-[#2563EB] border border-[#2563EB]",
];

// 三列的滾動方向／速度也是固定寫死：方向交錯（右／左／右），速度略有差異，
// 純 CSS keyframe 動畫，同樣不涉及任何隨機數值。
const ROWS: { durationSeconds: number; reverse: boolean }[] = [
  { durationSeconds: 30, reverse: true }, // 第一列：往右滑
  { durationSeconds: 38, reverse: false }, // 第二列：往左滑
  { durationSeconds: 24, reverse: true }, // 第三列：往右滑
];

// 平均分成三列（不需要特別邏輯分類，依序輪流塞進三列即可）。
function chunkIntoRows(tags: string[], rowCount: number): string[][] {
  const rows: string[][] = Array.from({ length: rowCount }, () => []);
  tags.forEach((tag, i) => {
    rows[i % rowCount].push(tag);
  });
  return rows;
}

export default function TagMarquee({ tags }: TagMarqueeProps) {
  const rows = chunkIntoRows(tags, ROWS.length);

  return (
    <div className="max-w-5xl mx-auto px-4 mb-10">
      {/* 每列內容重複兩份，靠 translateX(-50%) 做無縫循環：一份內容的寬度
          剛好等於整條軌道的一半，捲到一半時視覺上跟起點完全銜接。 */}
      <style>{`
        @keyframes wall-tag-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div className="space-y-3">
        {rows.map((rowTags, rowIndex) => {
          if (rowTags.length === 0) return null;
          const rowConfig = ROWS[rowIndex];
          const doubled = [...rowTags, ...rowTags];

          return (
            <div key={rowIndex} className="overflow-hidden">
              <div
                className="flex w-max gap-3"
                style={{
                  animation: `wall-tag-marquee ${rowConfig.durationSeconds}s linear infinite`,
                  animationDirection: rowConfig.reverse ? "reverse" : "normal",
                }}
              >
                {doubled.map((tag, i) => (
                  <Link
                    key={`${tag}-${i}`}
                    href={`/commuity-wall/tag/${encodeURIComponent(tag)}`}
                    className={`shrink-0 text-xs font-medium px-4 py-1.5 rounded-full whitespace-nowrap hover:opacity-80 transition-opacity ${
                      PILL_VARIANTS[(rowIndex + i) % PILL_VARIANTS.length]
                    }`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
