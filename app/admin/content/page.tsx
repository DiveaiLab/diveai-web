"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  author: string;
  updated_at: string;
  tags: string | null;
};

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 border-b border-[#ECF1F4] pb-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold text-[#32738F]">內容管理</p>
          <h1 className="mt-2 text-3xl font-extrabold">AI 科普文章</h1>
        </div>
        <Link
          href="/admin/content/new"
          className="inline-flex h-11 items-center justify-center rounded-md bg-[#32738F] px-5 text-sm font-bold text-white transition hover:bg-[#0E0E2C]"
        >
          新增文章
        </Link>
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
                  {item.slug}
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
    </main>
  );
}
