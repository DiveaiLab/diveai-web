"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  slug: string | null;
  status: string;
  author: string;
  updated_at: string;
  tags: string | null;
};

export default function AdminContentPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    fetch("/api/admin/content?type=ai_explainer_article")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load content");
        }

        setItems(data.items || []);
      })
      .catch((caught: Error) => setError(caught.message))
      .finally(() => setLoading(false));
  }, []);

  const closeCreateModal = useCallback(() => {
    if (creating) {
      return;
    }

    setIsCreateOpen(false);
    setDraftTitle("");
    setCreateError("");
  }, [creating]);

  useEffect(() => {
    if (!isCreateOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCreateModal();
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeCreateModal, isCreateOpen]);

  function openCreateModal() {
    setDraftTitle("");
    setCreateError("");
    setIsCreateOpen(true);
  }

  async function createDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setCreateError("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contentType: "ai_explainer_article",
          title: draftTitle,
          slugStrategy: "timestamp",
          status: "draft",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create draft");
      }

      router.push(`/admin/content/${data.id}`);
    } catch (caught) {
      setCreateError(caught instanceof Error ? caught.message : "Unable to create draft");
      setCreating(false);
    }
  }

  return (
    <main className="flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 border-b border-[#ECF1F4] pb-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold text-[#32738F]">科普文章管理</p>
          <h1 className="mt-2 text-3xl font-extrabold">AI 科普文章</h1>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex h-11 items-center justify-center rounded-md bg-[#32738F] px-5 text-sm font-bold text-white transition hover:bg-[#0E0E2C]"
        >
          建立草稿
        </button>
      </header>

      {error ? (
        <div className="rounded-md border border-[#F8C0A0] bg-white p-4 text-sm text-[#0E0E2C]">
          {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-[#ECF1F4] bg-white">
        <div className="grid grid-cols-[1fr_120px_160px] gap-4 border-b border-[#ECF1F4] px-4 py-3 text-xs font-bold text-[#8C8CA1] md:grid-cols-[1fr_130px_160px_180px]">
          <span>標題</span>
          <span>狀態</span>
          <span className="hidden md:block">作者</span>
          <span>更新時間</span>
        </div>
        {loading ? (
          <p className="px-4 py-6 text-sm text-[#8C8CA1]">載入中</p>
        ) : items.length === 0 ? (
          <p className="px-4 py-6 text-sm text-[#8C8CA1]">目前沒有文章</p>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/content/${item.id}`}
              className="grid grid-cols-[1fr_120px_160px] gap-4 border-b border-[#ECF1F4] px-4 py-4 text-sm transition last:border-b-0 hover:bg-[#FAFCFE] md:grid-cols-[1fr_130px_160px_180px]"
            >
              <span>
                <strong className="block font-bold">{item.title}</strong>
                <span className="mt-1 block text-xs text-[#8C8CA1]">
                  {item.slug || "尚未建立 slug"}
                  {item.tags ? ` · ${item.tags}` : ""}
                </span>
              </span>
              <span>{item.status}</span>
              <span className="hidden md:block">{item.author || "未填"}</span>
              <span>{new Date(item.updated_at).toLocaleString("zh-TW")}</span>
            </Link>
          ))
        )}
      </section>

      {isCreateOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E0E2C]/50 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCreateModal();
            }
          }}
        >
          <form
            onSubmit={createDraft}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-draft-title"
            className="w-full max-w-md rounded-lg border border-[#ECF1F4] bg-white p-5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#ECF1F4] pb-4">
              <div>
                <p className="text-sm font-bold text-[#32738F]">AI 科普文章</p>
                <h2 id="create-draft-title" className="mt-1 text-2xl font-extrabold">
                  建立草稿
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creating}
                aria-label="關閉"
                className="flex size-9 items-center justify-center rounded-md border border-[#ECF1F4] text-xl leading-none text-[#8C8CA1] transition hover:border-[#32738F] hover:text-[#32738F] disabled:opacity-60"
              >
                ×
              </button>
            </div>

            {createError ? (
              <div className="mt-4 rounded-md border border-[#F8C0A0] bg-white p-3 text-sm text-[#0E0E2C]">
                {createError}
              </div>
            ) : null}

            <label className="mt-5 flex flex-col gap-2">
              <span className="text-sm font-bold">標題</span>
              <input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                autoFocus
                className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
                required
              />
            </label>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creating}
                className="h-11 rounded-md border border-[#32738F] px-5 text-sm font-bold text-[#32738F] transition hover:bg-[#ECF1F4] disabled:opacity-60"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={creating}
                className="h-11 rounded-md bg-[#32738F] px-5 text-sm font-bold text-white transition hover:bg-[#0E0E2C] disabled:opacity-60"
              >
                {creating ? "建立中" : "建立草稿"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}
