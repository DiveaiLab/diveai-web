"use client";

import { useMemo, useSyncExternalStore } from "react";
import { markdownToPreview } from "@/lib/content/markdown-preview";

const PREVIEW_STORAGE_KEY = "diveai.contentPreview";

type PreviewContent = {
  title: string;
  slugPreview: string;
  status: string;
  finishedAt: string;
  reviewedAt: string;
  publishedAt: string;
  author: string;
  reviewer: string;
  excerpt: string;
  bodyMarkdown: string;
  coverImageKey: string;
  coverImageAlt: string;
  tags: string;
  updatedAt: string;
};

function subscribeToPreviewStore(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => window.removeEventListener("storage", callback);
}

function getPreviewSnapshot() {
  return window.localStorage.getItem(PREVIEW_STORAGE_KEY) || "";
}

function getServerPreviewSnapshot() {
  return "";
}

export default function ContentPreviewPage() {
  const rawContent = useSyncExternalStore(
    subscribeToPreviewStore,
    getPreviewSnapshot,
    getServerPreviewSnapshot,
  );
  const content = useMemo(() => {
    if (!rawContent) {
      return null;
    }

    try {
      return JSON.parse(rawContent) as PreviewContent;
    } catch {
      return null;
    }
  }, [rawContent]);
  const previewHtml = useMemo(
    () => `<p>${markdownToPreview(content?.bodyMarkdown || "")}</p>`,
    [content?.bodyMarkdown],
  );
  const tags = useMemo(
    () =>
      (content?.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [content?.tags],
  );

  if (!content) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="border-b border-[#ECF1F4] pb-5">
          <p className="text-sm font-bold text-[#32738F]">科普文章管理</p>
          <h1 className="mt-2 text-3xl font-extrabold">文章預覽</h1>
        </header>
        <section className="rounded-lg border border-[#ECF1F4] bg-white p-6 text-sm text-[#8C8CA1]">
          尚未找到可預覽的草稿，請回到編輯頁按 Preview。
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl">
      <article className="rounded-lg border border-[#ECF1F4] bg-white p-6 md:p-10">
        <header className="border-b border-[#ECF1F4] pb-6">
          <div className="flex flex-wrap gap-2 text-xs font-bold text-[#32738F]">
            <span>{content.status || "draft"}</span>
            {content.slugPreview ? <span>{content.slugPreview}</span> : null}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
            {content.title || "未命名文章"}
          </h1>
          {content.excerpt ? (
            <p className="mt-4 text-base leading-7 text-[#8C8CA1]">{content.excerpt}</p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#8C8CA1]">
            {content.author ? <span>作者：{content.author}</span> : null}
            {content.reviewer ? <span>確認者：{content.reviewer}</span> : null}
            {content.publishedAt ? <span>發布：{content.publishedAt}</span> : null}
            {content.reviewedAt ? <span>確認：{content.reviewedAt}</span> : null}
            {content.finishedAt ? <span>完稿：{content.finishedAt}</span> : null}
          </div>
          {tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[#ECF1F4] px-2 py-1 text-xs font-bold text-[#32738F]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {content.coverImageKey ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/admin/assets/${content.coverImageKey}`}
            alt={content.coverImageAlt || content.title || "cover"}
            className="mt-8 aspect-[16/9] w-full rounded-md border border-[#ECF1F4] object-cover"
          />
        ) : null}

        <section
          className="prose-preview mt-8 text-base leading-8 text-[#0E0E2C]"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </article>
    </main>
  );
}
