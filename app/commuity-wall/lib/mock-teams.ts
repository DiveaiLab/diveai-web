// 共學牆左欄「小組動態」假資料。之後可能會換成真實資料來源，
// 目前先純展示，卡片不可點擊、不導向任何頁面。

export type TeamGroup = {
  id: string;
  name: string; // 小組名稱，例如「社群組」
  currentFocus: string; // 目前在做什麼
  stickyNote: string; // 便條紙上的一句話，例如「這次對焦目標：完成共學牆頁面」
};

export const mockTeamGroups: TeamGroup[] = [
  {
    id: "community",
    name: "社群組",
    currentFocus: "經營 Instagram 帳號，這週在準備發布新一篇分享文",
    stickyNote: "這次對焦目標：先把追蹤數衝到 500",
  },
  {
    id: "bot",
    name: "機器人組",
    currentFocus: "測試 Discord 讀書會提醒機器人，抓緊在下次讀書會前上線",
    stickyNote: "這次對焦目標：機器人穩定跑過一次完整流程",
  },
  {
    id: "web",
    name: "網站組",
    currentFocus: "共學牆頁面開發中，這週在處理留言功能與卡片版面",
    stickyNote: "這次對焦目標：把留言功能做完整",
  },
  {
    id: "daily",
    name: "日報組",
    currentFocus: "每天整理 AI 相關新聞，維持日報固定產出不斷更",
    stickyNote: "這次對焦目標：日報連續產出滿 30 天",
  },
];
