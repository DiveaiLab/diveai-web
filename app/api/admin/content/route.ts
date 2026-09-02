import { NextResponse } from "next/server";
import { isAuthResponse, requireAdminSession } from "@/lib/admin/auth";
import { createId, isoNow, jsonError } from "@/lib/admin/http";
import { getEnv } from "@/lib/cloudflare/env";
import {
  AI_EXPLAINER_CONTENT_TYPE,
  buildContentInput,
  generateSlug,
  replaceContentTags,
  validateContentInput,
  type ContentRow,
} from "@/lib/content/content";

export const runtime = "edge";

export async function GET(request: Request) {
  const session = await requireAdminSession(request);

  if (isAuthResponse(session)) {
    return session;
  }

  const env = getEnv();
  const url = new URL(request.url);
  const contentType = url.searchParams.get("type") || AI_EXPLAINER_CONTENT_TYPE;
  const result = await env.DB.prepare(
    `SELECT
      ci.*,
      GROUP_CONCAT(t.name, ',') AS tags
     FROM content_items ci
     LEFT JOIN content_tags ct ON ct.content_id = ci.id
     LEFT JOIN tags t ON t.id = ct.tag_id
     WHERE ci.content_type = ?
     GROUP BY ci.id
     ORDER BY ci.updated_at DESC`,
  )
    .bind(contentType)
    .all<ContentRow>();

  return NextResponse.json({ items: result.results || [] });
}

export async function POST(request: Request) {
  const session = await requireAdminSession(request);

  if (isAuthResponse(session)) {
    return session;
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const input = buildContentInput(payload);
  const env = getEnv();
  const contentType = input.contentType || AI_EXPLAINER_CONTENT_TYPE;

  if (input.status !== "draft" && !input.slug && input.slugStrategy !== "manual") {
    input.slug = await generateSlug(env.DB, contentType, input.slugStrategy);
  }

  const validationError = validateContentInput(input);

  if (validationError) {
    return jsonError(validationError);
  }

  const slug = input.slug || null;
  const id = createId("content");
  const now = isoNow();

  try {
    await env.DB.prepare(
      `INSERT INTO content_items (
        id, content_type, title, slug, slug_strategy, status, finished_at, reviewed_at,
        published_at, author, reviewer, excerpt, body_markdown, cover_image_key,
        cover_image_alt, metadata_json, created_at, updated_at, created_by_email, updated_by_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        contentType,
        input.title,
        slug,
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
        now,
        now,
        session.email,
        session.email,
      )
      .run();

    await replaceContentTags(env.DB, id, input.tags);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create content";

    if (message.includes("UNIQUE")) {
      return jsonError("Slug already exists for this content type", 409);
    }

    return jsonError(message, 500);
  }

  return NextResponse.json({ ok: true, id, slug });
}
