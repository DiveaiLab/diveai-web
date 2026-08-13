import { NextResponse } from "next/server";
import { isAuthResponse, requireAdminSession } from "@/lib/admin/auth";
import { isoNow, jsonError } from "@/lib/admin/http";
import { getEnv } from "@/lib/cloudflare/env";
import {
  buildContentInput,
  replaceContentTags,
  validateContentInput,
  type ContentRow,
} from "@/lib/content/content";

export const runtime = "edge";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const session = await requireAdminSession(request);

  if (isAuthResponse(session)) {
    return session;
  }

  const { id } = await context.params;
  const env = getEnv();
  const item = await env.DB.prepare(
    `SELECT
      ci.*,
      GROUP_CONCAT(t.name, ',') AS tags
     FROM content_items ci
     LEFT JOIN content_tags ct ON ct.content_id = ci.id
     LEFT JOIN tags t ON t.id = ct.tag_id
     WHERE ci.id = ?
     GROUP BY ci.id
     LIMIT 1`,
  )
    .bind(id)
    .first<ContentRow>();

  if (!item) {
    return jsonError("Content not found", 404);
  }

  return NextResponse.json({ item });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession(request);

  if (isAuthResponse(session)) {
    return session;
  }

  const { id } = await context.params;
  const payload = (await request.json()) as Record<string, unknown>;
  const input = buildContentInput(payload);
  const validationError = validateContentInput(input);

  if (validationError) {
    return jsonError(validationError);
  }

  if (!input.slug) {
    return jsonError("Slug is required");
  }

  const env = getEnv();

  try {
    await env.DB.prepare(
      `UPDATE content_items
       SET content_type = ?, title = ?, slug = ?, slug_strategy = ?, status = ?,
        finished_at = ?, reviewed_at = ?, published_at = ?, author = ?, reviewer = ?,
        excerpt = ?, body_markdown = ?, cover_image_key = ?, cover_image_alt = ?,
        metadata_json = ?, updated_at = ?, updated_by_email = ?
       WHERE id = ?`,
    )
      .bind(
        input.contentType,
        input.title,
        input.slug,
        input.slugStrategy,
        input.status,
        input.finishedAt || null,
        input.reviewedAt || null,
        input.publishedAt || null,
        input.author,
        input.reviewer,
        input.excerpt,
        input.bodyMarkdown,
        input.coverImageKey || null,
        input.coverImageAlt,
        input.metadataJson || "{}",
        isoNow(),
        session.email,
        id,
      )
      .run();

    await replaceContentTags(env.DB, id, input.tags);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update content";

    if (message.includes("UNIQUE")) {
      return jsonError("Slug already exists for this content type", 409);
    }

    return jsonError(message, 500);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await requireAdminSession(request);

  if (isAuthResponse(session)) {
    return session;
  }

  const { id } = await context.params;
  const env = getEnv();

  await env.DB.prepare("DELETE FROM content_items WHERE id = ?").bind(id).run();

  return NextResponse.json({ ok: true });
}
