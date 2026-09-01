"use client";

import { useState } from "react";
import type { Comment } from "@/app/lib/wall/mock-posts";

type CommentSectionProps = {
  postId: string;
  comments: Comment[];
  isLoggedIn: boolean;
};

// 開發階段假名字：目前沒有真實登入系統，新送出的留言先固定顯示這個作者名。
// 之後接真實留言系統／Supabase Auth 時，改成讀取真實使用者的名字。
const MOCK_CURRENT_USER_NAME = "我";

// 讀書會筆記（kind = 'note'）單篇頁專屬的留言／回饋區塊。
// 新留言只存在於當前瀏覽階段的 React state，重新整理頁面就會消失，
// 之後接真實留言系統再改成寫入資料庫。
export default function CommentSection({
  postId,
  comments,
  isLoggedIn,
}: CommentSectionProps) {
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");

  const allComments = [...comments, ...localComments];
  const canSubmit = draft.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return; // 空白內容不可送出（防呆，按鈕本身也已 disabled）

    const newComment: Comment = {
      id: `local-${Date.now()}`,
      postId,
      authorName: MOCK_CURRENT_USER_NAME,
      content,
      createdAt: "剛剛",
    };
    setLocalComments((prev) => [...prev, newComment]);
    setDraft("");
  }

  return (
    <div className="mb-12">
      <h2 className="text-gray-900 font-bold text-sm mb-4">留言／回饋</h2>

      {allComments.length === 0 ? (
        <p className="text-gray-400 text-sm mb-6">目前還沒有留言。</p>
      ) : (
        <div className="space-y-4 mb-6">
          {allComments.map((comment, index) => {
            const isAccent = index % 2 === 1;
            return (
              <div key={comment.id} className="flex items-start gap-3">
                <div
                  className={
                    isAccent
                      ? "w-8 h-8 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center shrink-0"
                      : "w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0"
                  }
                >
                  {comment.authorName.slice(0, 1)}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={
                      isAccent
                        ? "bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-sm px-4 py-3"
                        : "bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3"
                    }
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  <div className="mt-1.5 px-1 flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-medium text-gray-500">
                      {comment.authorName}
                    </span>
                    <span>{comment.createdAt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 留言輸入框：只有模擬已登入才顯示，未登入時改顯示提示文字 */}
      {isLoggedIn ? (
        <div>
          <p className="text-xs text-gray-400 mb-2">
            目前為測試功能，留言尚未串接後端，重新整理後會清空。
          </p>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="留下你的心得或提問……"
              className="flex-1 bg-gray-100/80 border-0 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="bg-[#2563EB] hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-200 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shrink-0"
            >
              送出
            </button>
          </form>
        </div>
      ) : (
        <p className="text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl px-4 py-3 max-w-md">
          登入後即可留言
        </p>
      )}
    </div>
  );
}
