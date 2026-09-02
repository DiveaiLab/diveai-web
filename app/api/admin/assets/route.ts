import { NextResponse } from "next/server";
import { isAuthResponse, requireAdminSession } from "@/lib/admin/auth";
import { createId, isoNow, jsonError } from "@/lib/admin/http";
import { getContentAssetsBucket, getEnv } from "@/lib/cloudflare/env";

export const runtime = "edge";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "asset";
}

export async function POST(request: Request) {
  const session = await requireAdminSession(request);

  if (isAuthResponse(session)) {
    return session;
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return jsonError("File is required");
  }

  if (!file.type.startsWith("image/")) {
    return jsonError("Only image uploads are supported");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return jsonError("Image must be 10 MB or smaller");
  }

  const env = getEnv();
  const assetsBucket = getContentAssetsBucket(env);

  if (!assetsBucket) {
    return jsonError("Image uploads are temporarily disabled", 503);
  }

  const id = createId("asset");
  const filename = sanitizeFilename(file.name);
  const r2Key = `content/${new Date().toISOString().slice(0, 10)}/${id}-${filename}`;
  const bytes = await file.arrayBuffer();

  await assetsBucket.put(r2Key, bytes, {
    httpMetadata: {
      contentType: file.type || "application/octet-stream",
    },
  });

  await env.DB.prepare(
    `INSERT INTO admin_assets (id, r2_key, filename, content_type, size_bytes, uploaded_by_email, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, r2Key, file.name, file.type || "application/octet-stream", file.size, session.email, isoNow())
    .run();

  return NextResponse.json({
    ok: true,
    asset: {
      id,
      r2Key,
      filename: file.name,
      url: `/api/admin/assets/${r2Key}`,
    },
  });
}
