import { createId, isoNow, normalizeString } from "@/lib/admin/http";
import {
  CONTENT_REQUIRED_FIELD_LABELS,
  getRequiredContentFields,
  type ContentRequiredField,
  type ContentStatus,
  type SlugStrategy,
} from "@/lib/content/requirements";

export const AI_EXPLAINER_CONTENT_TYPE = "ai_explainer_article";

export type { ContentStatus, SlugStrategy } from "@/lib/content/requirements";

export type ContentRow = {
  id: string;
  content_type: string;
  title: string;
  slug: string | null;
  slug_strategy: SlugStrategy;
  status: ContentStatus;
  finished_at: string | null;
  reviewed_at: string | null;
  published_at: string | null;
  author: string;
  reviewer: string;
  excerpt: string;
  body_markdown: string;
  cover_image_key: string | null;
  cover_image_alt: string;
  metadata_json: string;
  created_at: string;
  updated_at: string;
  created_by_email: string;
  updated_by_email: string;
  tags?: string;
};

export type ContentInput = {
  contentType: string;
  title: string;
  slug?: string;
  slugStrategy: SlugStrategy;
  status: ContentStatus;
  finishedAt?: string;
  reviewedAt?: string;
  publishedAt?: string;
  author: string;
  reviewer: string;
  excerpt: string;
  bodyMarkdown: string;
  coverImageKey?: string;
  coverImageAlt: string;
  metadataJson?: string;
  tags: string[];
};

export function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((tag) => normalizeString(tag))
      .filter(Boolean)
      .filter((tag, index, tags) => tags.indexOf(tag) === index);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .filter((tag, index, tags) => tags.indexOf(tag) === index);
  }

  return [];
}

export function normalizeStatus(value: unknown): ContentStatus {
  if (value === "ready" || value === "confirmed" || value === "published") {
    return value;
  }

  return "draft";
}

export function normalizeSlugStrategy(value: unknown): SlugStrategy {
  if (value === "sequence" || value === "manual") {
    return value;
  }

  return "timestamp";
}

export async function generateSlug(
  db: D1Database,
  contentType: string,
  strategy: SlugStrategy,
  requestedSlug?: string,
): Promise<string> {
  const normalized = normalizeSlug(requestedSlug);

  if (strategy === "manual") {
    return normalized;
  }

  if (normalized) {
    return normalized;
  }

  if (strategy === "sequence") {
    const result = await db
      .prepare("SELECT COUNT(*) AS count FROM content_items WHERE content_type = ?")
      .bind(contentType)
      .first<{ count: number }>();

    return `${contentType}-${String((result?.count || 0) + 1).padStart(4, "0")}`;
  }

  return `${contentType}-${Date.now()}`;
}

export function normalizeSlug(value: unknown): string {
  return normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function buildContentInput(payload: Record<string, unknown>): ContentInput {
  return {
    contentType: normalizeString(payload.contentType) || AI_EXPLAINER_CONTENT_TYPE,
    title: normalizeString(payload.title),
    slug: normalizeSlug(payload.slug),
    slugStrategy: normalizeSlugStrategy(payload.slugStrategy),
    status: normalizeStatus(payload.status),
    finishedAt: normalizeString(payload.finishedAt),
    reviewedAt: normalizeString(payload.reviewedAt),
    publishedAt: normalizeString(payload.publishedAt),
    author: normalizeString(payload.author),
    reviewer: normalizeString(payload.reviewer),
    excerpt: normalizeString(payload.excerpt),
    bodyMarkdown: typeof payload.bodyMarkdown === "string" ? payload.bodyMarkdown : "",
    coverImageKey: normalizeString(payload.coverImageKey),
    coverImageAlt: normalizeString(payload.coverImageAlt),
    metadataJson: normalizeString(payload.metadataJson) || "{}",
    tags: parseTags(payload.tags),
  };
}

export function validateContentInput(input: ContentInput): string | null {
  if (!input.contentType) {
    return "Content type is required";
  }

  const missingField = getRequiredContentFields(input.status, input.slugStrategy).find((field) =>
    isMissingRequiredContentField(input, field),
  );

  if (missingField) {
    return `${CONTENT_REQUIRED_FIELD_LABELS[missingField]} is required`;
  }

  try {
    JSON.parse(input.metadataJson || "{}");
  } catch {
    return "metadataJson must be valid JSON";
  }

  return null;
}

function isMissingRequiredContentField(
  input: ContentInput,
  field: ContentRequiredField,
): boolean {
  if (field === "tags") {
    return input.tags.length === 0;
  }

  return !input[field];
}

export async function replaceContentTags(
  db: D1Database,
  contentId: string,
  tagNames: string[],
): Promise<void> {
  await db.prepare("DELETE FROM content_tags WHERE content_id = ?").bind(contentId).run();

  for (const name of tagNames) {
    const tagId = createId("tag");

    await db
      .prepare("INSERT OR IGNORE INTO tags (id, name, created_at) VALUES (?, ?, ?)")
      .bind(tagId, name, isoNow())
      .run();

    const tag = await db
      .prepare("SELECT id FROM tags WHERE name = ? LIMIT 1")
      .bind(name)
      .first<{ id: string }>();

    if (tag) {
      await db
        .prepare("INSERT OR IGNORE INTO content_tags (content_id, tag_id) VALUES (?, ?)")
        .bind(contentId, tag.id)
        .run();
    }
  }
}
