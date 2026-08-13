"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getRequiredContentFields,
  type ContentRequiredField,
} from "@/lib/content/requirements";

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

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

const PREVIEW_STORAGE_KEY = "diveai.contentPreview";
const AUTOSAVE_DELAY_MS = 1000;

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

const FIELD_LABELS: Record<ContentRequiredField, string> = {
  title: "標題",
  slug: "Slug",
  excerpt: "摘要",
  tags: "主題 tags",
  bodyMarkdown: "Markdown 內文",
  finishedAt: "完稿日期",
  author: "作者",
  reviewedAt: "確認日期",
  reviewer: "確認者",
  publishedAt: "發布日期",
};

type Props = {
  id: string;
};

function getTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function buildSavePayload(form: ContentForm) {
  return {
    ...form,
    slug: form.slug,
    tags: getTags(form.tags),
  };
}

function isMissingField(form: ContentForm, field: ContentRequiredField) {
  if (field === "tags") {
    return getTags(form.tags).length === 0;
  }

  return !form[field];
}

export default function ContentEditor({ id }: Props) {
  const [form, setForm] = useState<ContentForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const lastSavedPayload = useRef("");
  const saveVersion = useRef(0);
  const isManualSlug = form.slugStrategy === "manual";
  const slugContentType = form.contentType || "ai_explainer_article";
  const slugExample =
    form.slugStrategy === "sequence"
      ? `${slugContentType}-0001`
      : `${slugContentType}-1786608000000`;
  const slugAutoPlaceholder =
    form.slugStrategy === "sequence"
      ? "切到完稿後將依發佈時序號自動生成"
      : "切到完稿後將依發佈時時間自動生成";
  const requiredFields = useMemo(
    () => new Set(getRequiredContentFields(form.status, form.slugStrategy)),
    [form.slugStrategy, form.status],
  );
  const isRequired = (field: ContentRequiredField) => requiredFields.has(field);
  const saveMessage = useMemo(() => {
    if (loading) {
      return "載入中";
    }

    if (saveState === "saving") {
      return "自動儲存中";
    }

    if (saveState === "dirty") {
      return "尚未儲存";
    }

    if (saveState === "error") {
      return "儲存失敗";
    }

    if (lastSavedAt) {
      return `已儲存 ${new Date(lastSavedAt).toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`;
    }

    return "已儲存";
  }, [lastSavedAt, loading, saveState]);

  useEffect(() => {
    fetch(`/api/admin/content/${id}`)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load content");
        }

        const item = data.item;
        const nextForm = {
          contentType: item.content_type || "ai_explainer_article",
          title: item.title || "",
          slug: item.slug || "",
          slugStrategy: item.slug_strategy || "timestamp",
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
        } satisfies ContentForm;

        setForm(nextForm);
        lastSavedPayload.current = JSON.stringify(buildSavePayload(nextForm));
        setLastSavedAt(item.updated_at || "");
        setSaveState("saved");
      })
      .catch((caught: Error) => {
        setError(caught.message);
        setSaveState("error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const payload = JSON.stringify(buildSavePayload(form));

    if (payload === lastSavedPayload.current) {
      return;
    }

    setSaveState("dirty");
    const currentVersion = saveVersion.current + 1;
    saveVersion.current = currentVersion;

    const timeout = window.setTimeout(() => {
      setSaveState("saving");
      setError("");

      fetch(`/api/admin/content/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: payload,
      })
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Unable to save content");
          }

          if (saveVersion.current !== currentVersion) {
            return;
          }

          const savedForm = data.slug ? { ...form, slug: data.slug } : form;
          lastSavedPayload.current = JSON.stringify(buildSavePayload(savedForm));

          if (data.slug && data.slug !== form.slug) {
            setForm(savedForm);
          }

          setLastSavedAt(new Date().toISOString());
          setSaveState("saved");
        })
        .catch((caught) => {
          if (saveVersion.current !== currentVersion) {
            return;
          }

          setError(caught instanceof Error ? caught.message : "Unable to save content");
          setSaveState("error");
        });
    }, AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [form, id, loading]);

  function updateField<Key extends keyof ContentForm>(key: Key, value: ContentForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateStatus(status: ContentForm["status"]) {
    const nextForm = { ...form, status };
    const missingFields = getRequiredContentFields(status, nextForm.slugStrategy).filter(
      (field) => {
        if (field === "slug" && nextForm.slugStrategy !== "manual") {
          return false;
        }

        return isMissingField(nextForm, field);
      },
    );

    if (missingFields.length > 0) {
      setError(`請先補齊：${missingFields.map((field) => FIELD_LABELS[field]).join("、")}`);
      setSaveState("error");
      return;
    }

    setError("");
    updateField("status", status);
  }

  function openPreview() {
    window.localStorage.setItem(
      PREVIEW_STORAGE_KEY,
      JSON.stringify({
        ...form,
        slugPreview: form.slug || (!isManualSlug ? slugExample : ""),
        updatedAt: new Date().toISOString(),
      }),
    );
    window.open("/admin/content/preview", "_blank", "noopener,noreferrer");
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
      setSaveState("error");
      return;
    }

    if (mode === "cover") {
      updateField("coverImageKey", result.asset.r2Key);
      return;
    }

    setForm((current) => ({
      ...current,
      bodyMarkdown: `${current.bodyMarkdown}\n\n![${file.name}](${result.asset.url})`,
    }));
  }

  if (loading) {
    return <p className="text-sm text-[#8C8CA1]">載入中</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-[#ECF1F4] bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold text-[#32738F]">自動儲存</p>
          <span
            className={`mt-1 block text-sm font-bold ${
              saveState === "error" ? "text-[#0E0E2C]" : "text-[#8C8CA1]"
            }`}
          >
            {saveMessage}
          </span>
        </div>
        <button
          type="button"
          onClick={openPreview}
          className="h-11 rounded-md border border-[#32738F] px-5 text-sm font-bold text-[#32738F] transition hover:bg-[#ECF1F4]"
        >
          Preview
        </button>
      </div>

      {error ? (
        <div className="rounded-md border border-[#F8C0A0] bg-white p-4 text-sm text-[#0E0E2C]">
          {error}
        </div>
      ) : null}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 gap-5">
          <section className="grid gap-4 rounded-lg border border-[#ECF1F4] bg-white p-5">
            <h2 className="text-base font-bold">文章內容</h2>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold">標題</span>
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
                required={isRequired("title")}
              />
            </label>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold">摘要</span>
                <textarea
                  value={form.excerpt}
                  onChange={(event) => updateField("excerpt", event.target.value)}
                  className="min-h-24 rounded-md border border-[#ECF1F4] p-3 outline-none focus:border-[#6FC1CC]"
                  required={isRequired("excerpt")}
                />
              </label>
              <div className="grid gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold">主題 tags</span>
                  <input
                    value={form.tags}
                    onChange={(event) => updateField("tags", event.target.value)}
                    className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
                    placeholder="AI, 生成式 AI"
                    required={isRequired("tags")}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold">狀態</span>
                  <select
                    value={form.status}
                    onChange={(event) => updateStatus(event.target.value as ContentForm["status"])}
                    className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
                  >
                    <option value="draft">草稿</option>
                    <option value="ready">完稿</option>
                    <option value="confirmed">已確認</option>
                    <option value="published">已發布</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#ECF1F4] bg-white p-5">
            <div className="flex flex-col gap-3 border-b border-[#ECF1F4] pb-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-base font-bold">Markdown 內文</h2>
              <label className="inline-flex h-10 cursor-pointer items-center rounded-md border border-[#32738F] px-4 text-sm font-bold text-[#32738F]">
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
            </div>
            <textarea
              value={form.bodyMarkdown}
              onChange={(event) => updateField("bodyMarkdown", event.target.value)}
              className="mt-4 h-[calc(100vh-500px)] min-h-[420px] w-full resize-y rounded-md border border-[#ECF1F4] p-4 font-mono text-sm leading-6 outline-none focus:border-[#6FC1CC] xl:h-[calc(100vh-430px)]"
              required={isRequired("bodyMarkdown")}
            />
          </section>
        </div>

        <aside className="grid gap-5 xl:sticky xl:top-6 xl:max-h-[calc(100vh-48px)] xl:overflow-y-auto xl:pr-1">
          <section className="grid gap-4 rounded-lg border border-[#ECF1F4] bg-white p-5">
            <h2 className="text-base font-bold">網址設定</h2>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                disabled={!isManualSlug}
                className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC] disabled:bg-[#ECF1F4] disabled:text-[#8C8CA1]"
                placeholder={isManualSlug ? "輸入自訂 slug" : slugAutoPlaceholder}
                required={isRequired("slug")}
              />
              {!isManualSlug ? (
                <span className="text-xs text-[#8C8CA1]">
                  {form.slug ? `目前 slug：${form.slug}` : `範例：${slugExample}`}
                </span>
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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold">完稿日期</span>
                <input
                  type="date"
                  value={form.finishedAt}
                  onChange={(event) => updateField("finishedAt", event.target.value)}
                  className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
                  required={isRequired("finishedAt")}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold">確認日期</span>
                <input
                  type="date"
                  value={form.reviewedAt}
                  onChange={(event) => updateField("reviewedAt", event.target.value)}
                  className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
                  required={isRequired("reviewedAt")}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold">發布日期</span>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(event) => updateField("publishedAt", event.target.value)}
                  className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
                  required={isRequired("publishedAt")}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold">作者</span>
                <input
                  value={form.author}
                  onChange={(event) => updateField("author", event.target.value)}
                  className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
                  required={isRequired("author")}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold">確認者</span>
                <input
                  value={form.reviewer}
                  onChange={(event) => updateField("reviewer", event.target.value)}
                  className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
                  required={isRequired("reviewer")}
                />
              </label>
            </div>
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
        </aside>
      </div>
    </div>
  );
}
