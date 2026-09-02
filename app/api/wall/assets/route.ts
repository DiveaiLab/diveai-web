import { NextResponse } from "next/server";
import { createId, jsonError } from "@/lib/admin/http";
import { getEnv, getWallAssetsBucket } from "@/lib/cloudflare/env";

export const runtime = "edge";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function sanitizeFilename(filename: string): string {
  return (
    filename
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120) || "asset"
  );
}

// 封面圖／內文圖片上傳。跟 feat-cms 分支的 /api/admin/assets 同一套寫法，
// 差別是這裡沒有登入檢查（跟 /admin/wall 本身一樣還沒做權限），而且回傳的
// 網址是公開可讀的（前台文章要能直接顯示圖片，不像 feat-cms 那邊資產是私有
// 內容需要登入才能看）。
export async function POST(request: Request) {
  const env = getEnv();
  const bucket = getWallAssetsBucket(env);

  if (!bucket) {
    return jsonError("圖片上傳功能還沒開放（R2 帳號層級還沒啟用）", 503);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return jsonError("缺少檔案");
  }
  if (!file.type.startsWith("image/")) {
    return jsonError("只能上傳圖片檔案");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return jsonError("圖片大小請控制在 10MB 以內");
  }

  const id = createId("img");
  const filename = sanitizeFilename(file.name);
  const key = `wall/${new Date().toISOString().slice(0, 10)}/${id}-${filename}`;
  const bytes = await file.arrayBuffer();

  await bucket.put(key, bytes, {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });

  return NextResponse.json({ url: `/api/wall/assets/${key}` });
}
