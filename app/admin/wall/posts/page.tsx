"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useWallState } from "@/app/lib/wall/wall-state-context";
import { KIND_LABELS, type WallPostKind, type WallPostStatus } from "@/app/lib/wall/mock-posts";

const KIND_FILTER_OPTIONS: { value: WallPostKind | "all"; label: string }[] = [
  { value: "all", label: "全部類型" },
  { value: "project", label: "專案" },
  { value: "note", label: "筆記" },
  { value: "agent", label: "Agent" },
];

const STATUS_FILTER_OPTIONS: { value: WallPostStatus | "all"; label: string }[] = [
  { value: "all", label: "全部狀態" },
  { value: "published", label: "已發布" },
  { value: "draft", label: "草稿" },
];

const selectClass =
  "border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all";

export default function AdminPostsListPage() {
  const { posts, deletePost, updatePost } = useWallState();
  const [kindFilter, setKindFilter] = useState<WallPostKind | "all">("all");
  const [statusFilter, setStatusFilter] = useState<WallPostStatus | "all">("all");
  const [tagFilter, setTagFilter] = useState("all");

  // 篩選用的標籤選單：後台看得到所有文章（含草稿）的標籤，跟前台
  // getAllPublishedTags() 只收已發布文章的標籤不一樣。
  const allTags = useMemo(() => {
    const seen = new Set<string>();
    for (const post of posts) {
      for (const tag of post.techTags) seen.add(tag);
    }
    return Array.from(seen).sort((a, b) => a.localeCompare(b, "zh-Hant"));
  }, [posts]);

  // 新到舊排序後再套篩選，草稿也一起顯示（後台本來就要看得到所有狀態，
  // 跟前台只顯示已發布文章的邏輯是分開的）。
  const filteredPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0))
      .filter((post) => kindFilter === "all" || post.kind === kindFilter)
      .filter((post) => statusFilter === "all" || post.status === statusFilter)
      .filter((post) => tagFilter === "all" || post.techTags.includes(tagFilter));
  }, [posts, kindFilter, statusFilter, tagFilter]);

  const hasActiveFilter = kindFilter !== "all" || statusFilter !== "all" || tagFilter !== "all";

  function resetFilters() {
    setKindFilter("all");
    setStatusFilter("all");
    setTagFilter("all");
  }

  async function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(`確定要刪除「${title}」嗎？這個動作無法復原。`);
    if (!confirmed) return;
    try {
      await deletePost(id);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "刪除失敗，請稍後再試一次");
    }
  }

  async function togglePublish(id: string, currentStatus: "draft" | "published") {
    try {
      await updatePost(id, { status: currentStatus === "published" ? "draft" : "published" });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "更新失敗，請稍後再試一次");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
        <Link
          href="/admin/wall/posts/new"
          className="bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + 新增文章
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value as WallPostKind | "all")}
          className={selectClass}
        >
          {KIND_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as WallPostStatus | "all")}
          className={selectClass}
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className={selectClass}
        >
          <option value="all">全部標籤</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-gray-400 hover:text-gray-700 px-1"
          >
            清除篩選
          </button>
        )}
        <span className="text-xs text-gray-400 ml-auto">
          {filteredPosts.length} / {posts.length} 篇
        </span>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-sm text-gray-400">
          {hasActiveFilter ? "沒有符合篩選條件的文章。" : "目前還沒有任何文章。"}
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-3 font-medium">狀態</th>
                <th className="px-4 py-3 font-medium">類型</th>
                <th className="px-4 py-3 font-medium">標題</th>
                <th className="px-4 py-3 font-medium">作者</th>
                <th className="px-4 py-3 font-medium">日期</th>
                <th className="px-4 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3">
                    <span
                      className={
                        post.status === "published"
                          ? "inline-block text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5"
                          : "inline-block text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5"
                      }
                    >
                      {post.status === "published" ? "已發布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{KIND_LABELS[post.kind]}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium max-w-xs truncate">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{post.authorName}</td>
                  <td className="px-4 py-3 text-gray-400">{post.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => togglePublish(post.id, post.status)}
                        className="text-[#2563EB] hover:underline"
                      >
                        {post.status === "published" ? "改回草稿" : "發布"}
                      </button>
                      <Link
                        href={`/admin/wall/posts/${post.id}`}
                        className="text-gray-500 hover:text-gray-900"
                      >
                        編輯
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
