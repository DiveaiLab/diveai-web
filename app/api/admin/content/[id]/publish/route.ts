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
    `SELECT
      ci.title,
      ci.slug,
      ci.excerpt,
      ci.author,
      ci.reviewer,
      ci.body_markdown,
      ci.finished_at,
      ci.reviewed_at,
      ci.published_at,
      GROUP_CONCAT(t.name, ',') AS tags
     FROM content_items ci
     LEFT JOIN content_tags ct ON ct.content_id = ci.id
     LEFT JOIN tags t ON t.id = ct.tag_id
     WHERE ci.id = ?
     GROUP BY ci.id
     LIMIT 1`,
  )
    .bind(id)
    .first<
      Pick<
        ContentRow,
        | "title"
        | "slug"
        | "excerpt"
        | "author"
        | "reviewer"
        | "body_markdown"
        | "finished_at"
        | "reviewed_at"
        | "published_at"
        | "tags"
      >
    >();

  if (!item) {
    return jsonError("Content not found", 404);
  }

  if (
    !item.title ||
    !item.slug ||
    !item.excerpt ||
    !item.tags ||
    !item.body_markdown ||
    !item.finished_at ||
    !item.author ||
    !item.reviewed_at ||
    !item.reviewer
  ) {
    return jsonError(
      "Title, slug, excerpt, tags, body, finished date, author, reviewed date, and reviewer are required before publishing",
    );
  }

  await env.DB.prepare(
    "UPDATE content_items SET status = 'published', published_at = COALESCE(published_at, ?), updated_at = ?, updated_by_email = ? WHERE id = ?",
  )
    .bind(item.published_at || isoNow().slice(0, 10), isoNow(), session.email, id)
    .run();

  return NextResponse.json({ ok: true });
}
