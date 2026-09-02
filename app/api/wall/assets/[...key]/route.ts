import { jsonError } from "@/lib/admin/http";
import { getEnv, getWallAssetsBucket } from "@/lib/cloudflare/env";

export const runtime = "edge";

type RouteContext = {
  params: Promise<{ key: string[] }>;
};

// 公開讀取（沒有登入檢查）：前台文章要能直接顯示圖片給任何訪客看，跟
// feat-cms 那邊私有資產需要登入才能看的情境不一樣。
export async function GET(_request: Request, context: RouteContext) {
  const { key } = await context.params;
  const objectKey = key.join("/");
  const env = getEnv();
  const bucket = getWallAssetsBucket(env);

  if (!bucket) {
    return jsonError("圖片上傳功能還沒開放（R2 帳號層級還沒啟用）", 503);
  }

  const object = await bucket.get(objectKey);

  if (!object) {
    return jsonError("找不到這個圖片", 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
}
