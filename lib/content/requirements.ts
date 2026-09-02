export type ContentStatus = "draft" | "ready" | "confirmed" | "published";
export type SlugStrategy = "timestamp" | "sequence" | "manual";

export type ContentRequiredField =
  | "title"
  | "slug"
  | "excerpt"
  | "tags"
  | "bodyMarkdown"
  | "finishedAt"
  | "author"
  | "reviewedAt"
  | "reviewer"
  | "publishedAt";

export const CONTENT_REQUIRED_FIELD_LABELS: Record<ContentRequiredField, string> = {
  title: "Title",
  slug: "Slug",
  excerpt: "Excerpt",
  tags: "Tags",
  bodyMarkdown: "Body",
  finishedAt: "Finished date",
  author: "Author",
  reviewedAt: "Reviewed date",
  reviewer: "Reviewer",
  publishedAt: "Published date",
};

export function getRequiredContentFields(
  status: ContentStatus,
  slugStrategy: SlugStrategy,
): ContentRequiredField[] {
  const fields: ContentRequiredField[] = ["title"];

  if (
    status !== "draft" &&
    (slugStrategy === "timestamp" || slugStrategy === "sequence" || slugStrategy === "manual")
  ) {
    fields.push("slug");
  }

  if (status === "ready" || status === "confirmed" || status === "published") {
    fields.push("excerpt", "tags", "bodyMarkdown", "finishedAt", "author");
  }

  if (status === "confirmed" || status === "published") {
    fields.push("reviewedAt", "reviewer");
  }

  if (status === "published") {
    fields.push("publishedAt");
  }

  return fields;
}
