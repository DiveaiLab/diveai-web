import { NextResponse } from "next/server";
import { isoNow, jsonError } from "@/lib/admin/http";
import { getEnv } from "@/lib/cloudflare/env";
import { rowToArticle } from "../route";

export const runtime = "edge";

type ArticleRow = {
  id: string;
  kind: string;
  title: string;
  body_md: string;
  cover_url: string;
  links: string;
  scene: string;
  tech_tags: string;
  author_name: string;
  author_avatar_url: string;
  like_count: number;
  status: string;
  created_at: string;
  updated_at: string;
};

// camelCase 欄位名稱 → wall_articles 的 snake_case 欄名，只有出現在
// payload 裡的欄位才會被更新（局部更新，跟後台 updatePost() 的用法對齊）。
const FIELD_MAP: Record<string, string> = {
  kind: "kind",
  title: "title",
  bodyMd: "body_md",
  coverUrl: "cover_url",
  links: "links",
  scene: "scene",
  techTags: "tech_tags",
  authorName: "author_name",
  authorAvatarUrl: "author_avatar_url",
  likeCount: "like_count",
  status: "status",
  createdAt: "created_at",
};
const JSON_FIELDS = new Set(["links", "scene", "techTags"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = (await request.json()) as Record<string, unknown>;

  const setClauses: string[] = [];
  const values: unknown[] = [];

  for (const [key, column] of Object.entries(FIELD_MAP)) {
    if (!(key in payload)) continue;
    setClauses.push(`${column} = ?`);
    values.push(JSON_FIELDS.has(key) ? JSON.stringify(payload[key]) : payload[key]);
  }

  if (setClauses.length === 0) {
    return jsonError("沒有要更新的欄位");
  }

  setClauses.push("updated_at = ?");
  values.push(isoNow());
  values.push(id);

  const env = getEnv();
  await env.DB.prepare(`UPDATE wall_articles SET ${setClauses.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  const updated = await env.DB.prepare("SELECT * FROM wall_articles WHERE id = ?")
    .bind(id)
    .first<ArticleRow>();

  if (!updated) {
    return jsonError("找不到這篇文章", 404);
  }

  return NextResponse.json({ item: rowToArticle(updated) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const env = getEnv();
  await env.DB.prepare("DELETE FROM wall_articles WHERE id = ?").bind(id).run();
  return NextResponse.json({ ok: true });
}
