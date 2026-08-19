// 工具箱的工具資料
//
// 抽成獨立檔案是因為許願池也要用同一份工具名單（讓大家指定「針對哪個工具」），
// 兩邊各寫一份會不同步。之後接資料庫時，這裡改成讀取後端即可。

export type Tool = {
  name: string;
  eyebrow: string;
  summary: string;
  highlights: string[];
  href?: string; // 有連結代表已可使用；無連結代表尚在開發中
};

export type Scenario = {
  id: string;
  title: string;
  lead: string;
  tools: Tool[];
};

export const scenarios: Scenario[] = [
  {
    id: "career",
    title: "找實習、準備求職",
    lead: "從還沒想清楚要投什麼，到履歷、面試都準備好。",
    tools: [
      {
        name: "實習 Agent",
        eyebrow: "INTERNSHIP",
        summary:
          "從找實習、改履歷到模擬面試，一步步陪你把「想投但不知道怎麼開始」變成「已經投出去了」。",
        highlights: ["方向盤點", "履歷修改", "面試演練"],
        href: "/ai-toolbox/internship-agent",
      },
      {
        name: "履歷健檢",
        eyebrow: "RESUME",
        summary:
          "把履歷貼上來，逐段點出哪裡太模糊、哪裡可以量化，並給出可以直接改的建議。",
        highlights: ["逐段檢視", "量化建議"],
      },
      {
        name: "面試模擬器",
        eyebrow: "INTERVIEW",
        summary:
          "依你應徵的職缺出題，一題一題陪你練，答完即時回饋，讓正式面試不再是第一次。",
        highlights: ["職缺出題", "即時回饋"],
      },
    ],
  },
  {
    id: "research",
    title: "寫報告、做研究",
    lead: "資料讀不完、報告不知道怎麼開頭的時候。",
    tools: [
      {
        name: "報告小幫手",
        eyebrow: "REPORT",
        summary:
          "上傳資料與大綱，協助你整理成結構清楚的簡報或書面報告，附上引用來源方便查證。",
        highlights: ["結構整理", "來源標註"],
      },
      {
        name: "文獻速讀",
        eyebrow: "READING",
        summary:
          "把長篇論文或研究報告整理成重點摘要，並標出原文位置，讓你知道該回頭讀哪一段。",
        highlights: ["重點摘要", "原文定位"],
      },
    ],
  },
  {
    id: "starter",
    title: "剛開始用 AI",
    lead: "還在摸索階段，想先知道能拿它做什麼。",
    tools: [
      {
        name: "提示詞入門包",
        eyebrow: "STARTER",
        summary:
          "整理常用的提問範本與情境對照表，照著改幾個字就能用，先累積手感再談進階技巧。",
        highlights: ["範本可套用", "情境對照"],
      },
    ],
  },
];

export const toolNames = scenarios.flatMap((scenario) =>
  scenario.tools.map((tool) => tool.name)
);
