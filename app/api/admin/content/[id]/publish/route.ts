import { NextResponse } from "next/server";
import { isAuthResponse, requireAdminSession } from "@/lib/admin/auth";
import { isoNow, jsonError } from "@/lib/admin/http";
import { getEnv } from "@/lib/cloudflare/env";
import type { ContentRow } from "@/lib/content/content";

export const runtime = "edge";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const session = await requireAdminSession(request);

  if (isAuthResponse(session)) {
    return session;
  }

  const { id } = await context.params;
  const env = getEnv();
  const item = await env.DB.prepare(
    "SELECT title, slug, author, body_markdown, reviewed_at, published_at FROM content_items WHERE id = ? LIMIT 1",
  )
    .bind(id)
    .first<Pick<ContentRow, "title" | "slug" | "author" | "body_markdown" | "reviewed_at" | "published_at">>();

  if (!item) {
    return jsonError("Content not found", 404);
  }

  if (!item.title || !item.slug || !item.author || !item.body_markdown || !item.reviewed_at) {
    return jsonError("Title, slug, author, body, and reviewed date are required before publishing");
  }

  await env.DB.prepare(
    "UPDATE content_items SET status = 'published', published_at = COALESCE(published_at, ?), updated_at = ?, updated_by_email = ? WHERE id = ?",
  )
    .bind(item.published_at || isoNow().slice(0, 10), isoNow(), session.email, id)
    .run();

  return NextResponse.json({ ok: true });
}
