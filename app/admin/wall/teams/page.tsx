"use client";

import { useState } from "react";
import { useWallState } from "@/app/lib/wall/wall-state-context";
import type { TeamGroup } from "@/app/lib/wall/mock-teams";

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all";
const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

function TeamCard({ team }: { team: TeamGroup }) {
  const { updateTeamGroup } = useWallState();
  const [currentFocus, setCurrentFocus] = useState(team.currentFocus);
  const [stickyNote, setStickyNote] = useState(team.stickyNote);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const isDirty = currentFocus !== team.currentFocus || stickyNote !== team.stickyNote;

  function handleSave() {
    updateTeamGroup(team.id, { currentFocus, stickyNote });
    setSavedAt(Date.now());
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="font-bold text-gray-900 mb-4">{team.name}</h2>

      <div className="mb-4">
        <label className={labelClass}>目前進度</label>
        <textarea
          value={currentFocus}
          onChange={(e) => setCurrentFocus(e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>

      <div className="mb-4">
        <label className={labelClass}>本次目標</label>
        <textarea
          value={stickyNote}
          onChange={(e) => setStickyNote(e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty}
          className="bg-[#2563EB] hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          儲存
        </button>
        {!isDirty && savedAt !== null && (
          <span className="text-xs text-gray-400">已儲存</span>
        )}
      </div>
    </div>
  );
}

// 小組動態管理：只有「更新」既有 4 個小組的內容，沒有新增／刪除小組的功能
// （目前是固定 4 個小組，這次需求也只提到「更新小組動態資料」）。每張卡片
// 各自管理自己的草稿文字跟儲存狀態，按下儲存才會真的寫回共用狀態、
// 讓前台立刻看到最新內容。
export default function AdminTeamsPage() {
  const { teams } = useWallState();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">小組動態</h1>
      <p className="text-sm text-gray-500 mb-6">
        更新各小組目前進度與本次目標，儲存後前台「小組動態」區塊會立刻反映最新內容。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
