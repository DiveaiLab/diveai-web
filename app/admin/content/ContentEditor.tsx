"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type ContentForm = {
  contentType: string;
  title: string;
  slug: string;
  slugStrategy: "timestamp" | "sequence" | "manual";
  status: "draft" | "ready" | "confirmed" | "published";
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
};

const PREVIEW_STORAGE_KEY = "diveai.contentPreview";

const emptyForm: ContentForm = {
  contentType: "ai_explainer_article",
  title: "",
  slug: "",
  slugStrategy: "timestamp",
  status: "draft",
  finishedAt: "",
  reviewedAt: "",
  publishedAt: "",
  author: "",
  reviewer: "",
  excerpt: "",
  bodyMarkdown: "",
  coverImageKey: "",
  coverImageAlt: "",
  tags: "",
};

type Props = {
  id?: string;
};

export default function ContentEditor({ id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ContentForm>(emptyForm);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isManualSlug = form.slugStrategy === "manual";
  const slugContentType = form.contentType || "ai_explainer_article";
  const slugExample =
    form.slugStrategy === "sequence"
      ? `${slugContentType}-0001`
      : `${slugContentType}-1786608000000`;
  const slugAutoPlaceholder =
    form.slugStrategy === "sequence"
      ? "將依發佈時序號自動生成，請參考下方範例"
      : "將依發佈時時間自動生成，請參考下方範例";

  useEffect(() => {
    if (!id) {
      return;
    }

    fetch(`/api/admin/content/${id}`)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load content");
        }

        const item = data.item;
        setForm({
          contentType: item.content_type || "ai_explainer_article",
          title: item.title || "",
          slug: item.slug || "",
          slugStrategy: item.slug_strategy || "manual",
          status: item.status || "draft",
          finishedAt: item.finished_at || "",
          reviewedAt: item.reviewed_at || "",
          publishedAt: item.published_at || "",
          author: item.author || "",
          reviewer: item.reviewer || "",
          excerpt: item.excerpt || "",
          bodyMarkdown: item.body_markdown || "",
          coverImageKey: item.cover_image_key || "",
          coverImageAlt: item.cover_image_alt || "",
          tags: item.tags || "",
        });
      })
      .catch((caught: Error) => setError(caught.message))
      .finally(() => setLoading(false));
  }, [id]);

  function updateField<Key extends keyof ContentForm>(key: Key, value: ContentForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openPreview() {
    window.localStorage.setItem(
      PREVIEW_STORAGE_KEY,
      JSON.stringify({
        ...form,
        slugPreview: isManualSlug ? form.slug : slugExample,
        updatedAt: new Date().toISOString(),
      }),
    );
    window.open("/admin/content/preview", "_blank", "noopener,noreferrer");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(id ? `/api/admin/content/${id}` : "/api/admin/content", {
        method: id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: isManualSlug || id ? form.slug : "",
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save content");
      }

      router.push(id ? "/admin/content" : `/admin/content/${data.id}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save content");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File, mode: "cover" | "body") {
    const data = new FormData();
    data.set("file", file);
    setError("");

    const response = await fetch("/api/admin/assets", {
      method: "POST",
      body: data,
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Unable to upload image");
      return;
    }

    if (mode === "cover") {
      updateField("coverImageKey", result.asset.r2Key);
      return;
    }

    updateField(
      "bodyMarkdown",
      `${form.bodyMarkdown}\n\n![${file.name}](${result.asset.url})`,
    );
  }

  if (loading) {
    return <p className="text-sm text-[#8C8CA1]">載入中</p>;
  }

  return (
    <form onSubmit={save} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex flex-col gap-5">
        {error ? (
          <div className="rounded-md border border-[#F8C0A0] bg-white p-4 text-sm text-[#0E0E2C]">
            {error}
          </div>
        ) : null}

        <section className="rounded-lg border border-[#ECF1F4] bg-white p-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">Markdown 內文</span>
            <textarea
              value={form.bodyMarkdown}
              onChange={(event) => updateField("bodyMarkdown", event.target.value)}
              className="min-h-[720px] rounded-md border border-[#ECF1F4] p-4 font-mono text-sm leading-6 outline-none focus:border-[#6FC1CC]"
            />
          </label>
          <label className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-md border border-[#32738F] px-4 text-sm font-bold text-[#32738F]">
            插入內文圖片
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  void uploadImage(file, "body");
                }
              }}
            />
          </label>
        </section>
      </div>

      <aside className="flex flex-col gap-5">
        <section className="grid gap-4 rounded-lg border border-[#ECF1F4] bg-white p-5">
          <h2 className="text-base font-bold">文章設定</h2>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">標題</span>
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">摘要</span>
            <textarea
              value={form.excerpt}
              onChange={(event) => updateField("excerpt", event.target.value)}
              className="min-h-24 rounded-md border border-[#ECF1F4] p-3 outline-none focus:border-[#6FC1CC]"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">主題 tags</span>
            <input
              value={form.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
              placeholder="AI, 生成式 AI"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">狀態</span>
            <select
              value={form.status}
              onChange={(event) =>
                updateField("status", event.target.value as ContentForm["status"])
              }
              className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
            >
              <option value="draft">草稿</option>
              <option value="ready">完稿</option>
              <option value="confirmed">已確認</option>
              <option value="published">已發布</option>
            </select>
          </label>
        </section>

        <section className="grid gap-4 rounded-lg border border-[#ECF1F4] bg-white p-5">
          <h2 className="text-base font-bold">網址設定</h2>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">Slug</span>
            <input
              value={isManualSlug ? form.slug : ""}
              onChange={(event) => updateField("slug", event.target.value)}
              disabled={!isManualSlug}
              className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC] disabled:bg-[#ECF1F4] disabled:text-[#8C8CA1]"
              placeholder={isManualSlug ? "輸入自訂 slug" : slugAutoPlaceholder}
            />
            {!isManualSlug ? (
              <span className="text-xs text-[#8C8CA1]">範例：{slugExample}</span>
            ) : null}
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">Slug 自動生成設定</span>
            <select
              value={form.slugStrategy}
              onChange={(event) =>
                updateField("slugStrategy", event.target.value as ContentForm["slugStrategy"])
              }
              className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
            >
              <option value="timestamp">timestamp</option>
              <option value="sequence">序號</option>
              <option value="manual">手動</option>
            </select>
          </label>
        </section>

        <section className="grid gap-4 rounded-lg border border-[#ECF1F4] bg-white p-5">
          <h2 className="text-base font-bold">發布資訊</h2>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">完稿日期</span>
            <input
              type="date"
              value={form.finishedAt}
              onChange={(event) => updateField("finishedAt", event.target.value)}
              className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">確認日期</span>
            <input
              type="date"
              value={form.reviewedAt}
              onChange={(event) => updateField("reviewedAt", event.target.value)}
              className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">發布日期</span>
            <input
              type="date"
              value={form.publishedAt}
              onChange={(event) => updateField("publishedAt", event.target.value)}
              className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">作者</span>
            <input
              value={form.author}
              onChange={(event) => updateField("author", event.target.value)}
              className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold">確認者</span>
            <input
              value={form.reviewer}
              onChange={(event) => updateField("reviewer", event.target.value)}
              className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
            />
          </label>
        </section>

        <section className="rounded-lg border border-[#ECF1F4] bg-white p-5">
          <h2 className="text-base font-bold">封面圖</h2>
          {form.coverImageKey ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/admin/assets/${form.coverImageKey}`}
              alt={form.coverImageAlt || "cover"}
              className="mt-4 aspect-[16/9] w-full rounded-md border border-[#ECF1F4] object-cover"
            />
          ) : (
            <div className="mt-4 flex aspect-[16/9] items-center justify-center rounded-md border border-dashed border-[#8C8CA1] text-sm text-[#8C8CA1]">
              尚未上傳
            </div>
          )}
          <label className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-md bg-[#32738F] px-4 text-sm font-bold text-white">
            上傳封面
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  void uploadImage(file, "cover");
                }
              }}
            />
          </label>
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-bold">封面 alt</span>
            <input
              value={form.coverImageAlt}
              onChange={(event) => updateField("coverImageAlt", event.target.value)}
              className="h-10 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
            />
          </label>
        </section>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={openPreview}
            className="h-11 rounded-md border border-[#32738F] px-5 text-sm font-bold text-[#32738F] transition hover:bg-[#ECF1F4]"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-12 rounded-md bg-[#0E0E2C] px-5 text-sm font-bold text-white transition hover:bg-[#32738F] disabled:opacity-60"
          >
            {saving ? "儲存中" : "儲存"}
          </button>
        </div>
      </aside>
    </form>
  );
}
