type HeroSectionProps = {
  publishedCount: number;
  teamCount: number;
};

// 整個重做，直接照參考圖（Artspace「UPCOMING RELEASES」）的排版比例：
// 文字置中、標題大小克制（約卡片標題字級的 2.5-3 倍，不做滿版巨大化），
// 底部改成一整排緊密並排、高度／角度略有錯落的直條，模擬「書脊排列成一
// 列」的效果，取代上一版四散飄浮的小圖示（那版被反饋不符合參考圖節奏）。
const BAR_COUNT = 56;

// 種子亂數產生器（mulberry32）。之前用 Math.sin() 當亂數源，本意是避開
// Math.random()（每次呼叫都不同、一定會造成 hydration mismatch），但
// Math.sin() 這類三角函式的精確度是「implementation-defined」，ECMAScript
// 規格沒有保證不同 JS engine（Node.js 伺服器 vs 瀏覽器）對同一個輸入一定
// 算出位元級相同的結果——實測 SSR 跟 CSR 兩邊算出來的值真的在小數點後幾位
// 開始不一樣，導致 hydration mismatch。mulberry32 只用整數位元運算
// （Math.imul、位移、XOR），這些運算 ECMAScript 規格保證跨 engine 一定
// bit-for-bit 相同，才是真正可靠的「固定種子」寫法。
function mulberry32(seed: number): () => number {
  let state = seed;
  return function next() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 主色 #2563EB 及其淺／深色階，透明度控制在 0.55–0.95，確保「清楚的視覺
// 存在感」而不是上一版那種幾乎看不見的低透明度。
// 顏色直接寫成 rgb()：瀏覽器把 inline style 的顏色值讀回來時一律會正規化
// 成 rgb()（不管原本寫 hex 還是別的格式），這裡索性直接寫 rgb()，跟瀏覽器
// 正規化後的格式一致，避免 hex／rgb 格式落差被 React 的 hydration 檢查
// 誤判成不一致。
const SPINE_COLORS = [
  "rgb(37, 99, 235)", // #2563EB
  "rgb(59, 130, 246)", // #3B82F6
  "rgb(96, 165, 250)", // #60A5FA
  "rgb(147, 197, 253)", // #93C5FD
  "rgb(29, 78, 216)", // #1D4ED8
  "rgb(191, 219, 254)", // #BFDBFE
];

// 固定種子（隨便一個數字，只要每次都一樣就好）：同一個 generator 依序取值，
// 不用每個 bar 各自重算一個 seed，寫法更單純也更不容易出錯。數值另外用
// toFixed 收斂到固定小數位數，避免萬一還有其他浮點誤差來源時，SSR 序列化
// 成 HTML 字串的結果跟 CSR 算出的物件在字串層級對不起來。
const random = mulberry32(20260810);

const SPINE_BARS = Array.from({ length: BAR_COUNT }, () => {
  const width = 10 + random() * 16; // 10–26px，寬度不一但緊密排列
  const heightPct = 45 + random() * 55; // 45%–100%，高低錯落
  const rotate = (random() - 0.5) * 10; // -5deg ~ 5deg
  const color = SPINE_COLORS[Math.floor(random() * SPINE_COLORS.length)];
  const opacity = 0.55 + random() * 0.4;
  return {
    width: Number(width.toFixed(2)),
    heightPct: Number(heightPct.toFixed(2)),
    rotate: Number(rotate.toFixed(2)),
    color,
    opacity: Number(opacity.toFixed(3)),
  };
});

export default function HeroSection({ publishedCount, teamCount }: HeroSectionProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 mb-10">
      <div className="pt-14 pb-0 text-center">
        <span className="text-[#2563EB] font-semibold text-xs tracking-[0.3em] uppercase block mb-3">
          C O M M U N I T Y &nbsp; W A L L
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-5">
          共學牆
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-4">
          這裡是團隊策展的學習紀錄：每篇都附上「我原本的程度」與「花了多久」，
          記錄真實的卡關與解法，而不只是完成後的成品。
        </p>
        <p className="text-xs text-gray-400 tracking-wide mb-10">
          已有 {publishedCount} 篇真實紀錄　·　涵蓋 {teamCount} 個小組
        </p>
      </div>

      {/* 書脊裝飾帶：一整排緊密並排的直條，每條代表一則精選心得。純色塊
          （不放直式文字）——直式 CJK 文字疊加旋轉在窄長條上，跨瀏覽器的
          排版穩定度風險較高（容易溢出、擠壓變形），純色塊在各種寬度下
          都穩定可控，這裡選穩定的做法。 */}
      <div
        className="relative h-28 md:h-36 flex items-end justify-center overflow-hidden"
        aria-hidden="true"
      >
        {SPINE_BARS.map((bar, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{
              width: `${bar.width}px`,
              height: `${bar.heightPct}%`,
              backgroundColor: bar.color,
              opacity: bar.opacity,
              transform: `rotate(${bar.rotate}deg)`,
              // 瀏覽器會把 transform-origin 正規化成「x軸 y軸」順序，
              // 這裡直接寫成正規化後的順序，避免關鍵字順序被誤判成不一致。
              transformOrigin: "center bottom",
            }}
          />
        ))}
      </div>
    </section>
  );
}
