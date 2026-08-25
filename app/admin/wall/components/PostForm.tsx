"use client";

import { useState } from "react";
import {
  KIND_LABELS,
  SCENE_OPTIONS,
  type WallPost,
  type WallPostKind,
  type WallPostScene,
  type WallPostStatus,
} from "@/app/lib/wall/mock-posts";
import NovelEditor from "./NovelEditor";
import ImageUploadField from "./ImageUploadField";

export type PostFormOutput = Omit<WallPost, "id" | "likeCount">;

type PostFormProps = {
  initialPost?: WallPost;
  submitLabel: string;
  onSubmit: (data: PostFormOutput) => void | Promise<void>;
};

const KIND_OPTIONS: WallPostKind[] = ["project", "note", "agent"];
const STATUS_OPTIONS: { value: WallPostStatus; label: string }[] = [
  { value: "draft", label: "草稿" },
  { value: "published", label: "已發布" },
];

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all";
const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";
const fieldWrapClass = "mb-5";

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

// 投稿文章表單：新增／編輯共用同一份，差別只在有沒有帶 initialPost。
// 欄位對齊 WallPost 完整結構，likeCount 不開放編輯（那是使用者按讚累積出
// 來的互動數字，不是文章內容本身，新文章一律從 0 開始）。
export default function PostForm({ initialPost, submitLabel, onSubmit }: PostFormProps) {
  const [kind, setKind] = useState<WallPostKind>(initialPost?.kind ?? "note");
  const [status, setStatus] = useState<WallPostStatus>(initialPost?.status ?? "draft");
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [bodyMd, setBodyMd] = useState(initialPost?.bodyMd ?? "");
  const [coverUrl, setCoverUrl] = useState(initialPost?.coverUrl ?? "");
  const [scene, setScene] = useState<WallPostScene[]>(initialPost?.scene ?? []);
  const [techTagsText, setTechTagsText] = useState(
    initialPost?.techTags.join("、") ?? ""
  );
  const [authorName, setAuthorName] = useState(initialPost?.authorName ?? "");
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState(
    initialPost?.authorAvatarUrl ?? ""
  );
  const [links, setLinks] = useState<{ label: string; url: string }[]>(
    initialPost?.links ?? []
  );
  const [createdAt, setCreatedAt] = useState(initialPost?.createdAt ?? todayDateString());
  const [submitting, setSubmitting] = useState(false);

  function toggleScene(value: WallPostScene) {
    setScene((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  function updateLink(index: number, field: "label" | "url", value: string) {
    setLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    );
  }

  function addLinkRow() {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeLinkRow(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  const isValid =
    title.trim() !== "" && bodyMd.trim() !== "" && authorName.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;

    const techTags = techTagsText
      .split(/[,、]/)
      .map((tag) => tag.trim())
      .filter(Boolean);

    const cleanedLinks = links
      .map((link) => ({ label: link.label.trim(), url: link.url.trim() }))
      .filter((link) => link.label !== "" && link.url !== "");

    setSubmitting(true);
    try {
      await onSubmit({
        kind,
        status,
        title: title.trim(),
        bodyMd: bodyMd.trim(),
        coverUrl: coverUrl.trim(),
        links: cleanedLinks,
        scene,
        techTags,
        authorName: authorName.trim(),
        authorAvatarUrl: authorAvatarUrl.trim(),
        createdAt,
      });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "儲存失敗，請稍後再試一次");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={fieldWrapClass}>
          <label className={labelClass}>類型</label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as WallPostKind)}
            className={inputClass}
          >
            {KIND_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {KIND_LABELS[k]}
              </option>
            ))}
          </select>
        </div>

        <div className={fieldWrapClass}>
          <label className={labelClass}>狀態</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as WallPostStatus)}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className={fieldWrapClass}>
          <label className={labelClass}>日期</label>
          <input
            type="date"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className={fieldWrapClass}>
        <label className={labelClass}>標題 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例如：從零打造一個個人記帳網站"
          className={inputClass}
        />
      </div>

      <div className={fieldWrapClass}>
        <label className={labelClass}>內文 *（工具列排版即可，不用手動輸入 Markdown 語法）</label>
        <NovelEditor initialMarkdown={bodyMd} onChange={setBodyMd} />
      </div>

      <div className={fieldWrapClass}>
        <label className={labelClass}>封面圖（留空則顯示「尚無封面圖」）</label>
        <ImageUploadField value={coverUrl} onChange={setCoverUrl} />
      </div>

      <div className={fieldWrapClass}>
        <label className={labelClass}>情境標籤</label>
        <div className="flex flex-wrap gap-3">
          {SCENE_OPTIONS.map((option) => (
            <label
              key={option}
              className="inline-flex items-center gap-1.5 text-sm text-gray-600"
            >
              <input
                type="checkbox"
                checked={scene.includes(option)}
                onChange={() => toggleScene(option)}
                className="h-4 w-4 accent-[#2563EB]"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div className={fieldWrapClass}>
        <label className={labelClass}>技術標籤（用逗號分隔，例如：LLM、RAG）</label>
        <input
          type="text"
          value={techTagsText}
          onChange={(e) => setTechTagsText(e.target.value)}
          placeholder="LLM、RAG、Python"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={fieldWrapClass}>
          <label className={labelClass}>作者姓名 *</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className={fieldWrapClass}>
          <label className={labelClass}>作者頭像網址（留空則顯示「無」）</label>
          <input
            type="text"
            value={authorAvatarUrl}
            onChange={(e) => setAuthorAvatarUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      <div className={fieldWrapClass}>
        <label className={labelClass}>相關連結</label>
        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateLink(index, "label", e.target.value)}
                placeholder="連結名稱"
                className={`${inputClass} flex-1`}
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateLink(index, "url", e.target.value)}
                placeholder="https://..."
                className={`${inputClass} flex-[2]`}
              />
              <button
                type="button"
                onClick={() => removeLinkRow(index)}
                className="text-xs text-gray-400 hover:text-red-500 px-2 transition-colors"
              >
                移除
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLinkRow}
          className="mt-2 text-xs font-semibold text-[#2563EB] hover:underline"
        >
          + 新增連結
        </button>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="bg-[#2563EB] hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          {submitting ? "儲存中…" : submitLabel}
        </button>
        {!isValid && (
          <span className="text-xs text-gray-400">
            標題、內文、作者姓名為必填欄位
          </span>
        )}
      </div>
    </form>
  );
}
