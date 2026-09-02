import { NextResponse } from "next/server";
import { createId, isoNow, jsonError } from "@/lib/admin/http";
import { getEnv } from "@/lib/cloudflare/env";

export const runtime = "edge";

// D1 裡的 row 形狀（snake_case，JSON 欄位是字串）跟前端 WallPost
// （camelCase，JSON 欄位是陣列/物件）互相轉換的共用邏輯。
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

function parseJsonArray(value: string): unknown[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function rowToArticle(row: ArticleRow) {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    bodyMd: row.body_md,
    coverUrl: row.cover_url,
    links: parseJsonArray(row.links),
    scene: parseJsonArray(row.scene),
    techTags: parseJsonArray(row.tech_tags),
    authorName: row.author_name,
    authorAvatarUrl: row.author_avatar_url,
    likeCount: row.like_count,
    status: row.status,
    createdAt: row.created_at,
  };
}

// 目前 /admin/wall 還沒有登入門檻（產品決策，先不做），這幾個 API route
// 也先不加權限檢查，跟後台介面本身的風險等級一致——之後要收斂權限時，
// 這裡是要補 requireAdminSession（跟 feat-cms 分支同一套）的地方。
export async function GET() {
  const env = getEnv();
  const result = await env.DB.prepare(
    "SELECT * FROM wall_articles ORDER BY created_at DESC"
  ).all<ArticleRow>();

  return NextResponse.json({ items: (result.results || []).map(rowToArticle) });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Record<string, unknown>;

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const bodyMd = typeof payload.bodyMd === "string" ? payload.bodyMd.trim() : "";
  const authorName = typeof payload.authorName === "string" ? payload.authorName.trim() : "";

  if (!title || !bodyMd || !authorName) {
    return jsonError("title、bodyMd、authorName 為必填欄位");
  }

  const env = getEnv();
  const id = createId("wall");
  const now = isoNow();

  await env.DB.prepare(
    `INSERT INTO wall_articles (
      id, kind, title, body_md, cover_url, links, scene, tech_tags,
      author_name, author_avatar_url, like_count, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
  )
    .bind(
      id,
      payload.kind,
      title,
      bodyMd,
      payload.coverUrl ?? "",
      JSON.stringify(payload.links ?? []),
      JSON.stringify(payload.scene ?? []),
      JSON.stringify(payload.techTags ?? []),
      authorName,
      payload.authorAvatarUrl ?? "",
      payload.status ?? "draft",
      payload.createdAt,
      now
    )
    .run();

  const created = await env.DB.prepare("SELECT * FROM wall_articles WHERE id = ?")
    .bind(id)
    .first<ArticleRow>();

  return NextResponse.json({ item: created ? rowToArticle(created) : null });
}
