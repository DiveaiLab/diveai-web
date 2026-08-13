"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewContentPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function createDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contentType: "ai_explainer_article",
          title,
          slugStrategy: "timestamp",
          status: "draft",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create draft");
      }

      router.replace(`/admin/content/${data.id}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create draft");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex max-w-3xl flex-col gap-6">
      <header className="border-b border-[#ECF1F4] pb-5">
        <Link href="/admin/content" className="text-sm font-bold text-[#32738F]">
          AI 科普文章
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold">建立草稿</h1>
      </header>

      {error ? (
        <div className="rounded-md border border-[#F8C0A0] bg-white p-4 text-sm text-[#0E0E2C]">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={createDraft}
        className="grid gap-5 rounded-lg border border-[#ECF1F4] bg-white p-5"
      >
        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold">標題</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
            required
          />
        </label>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="h-11 rounded-md bg-[#32738F] px-5 text-sm font-bold text-white transition hover:bg-[#0E0E2C] disabled:opacity-60"
          >
            {submitting ? "建立中" : "建立草稿"}
          </button>
        </div>
      </form>
    </main>
  );
}
