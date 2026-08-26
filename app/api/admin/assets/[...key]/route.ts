import { isAuthResponse, requireAdminSession } from "@/lib/admin/auth";
import { jsonError } from "@/lib/admin/http";
import { getContentAssetsBucket, getEnv } from "@/lib/cloudflare/env";

export const runtime = "edge";

type RouteContext = {
  params: Promise<{ key: string[] }>;
};

export async function GET(request: Request, context: RouteContext) {
  const session = await requireAdminSession(request);

  if (isAuthResponse(session)) {
    return session;
  }

  const { key } = await context.params;
  const r2Key = key.join("/");
  const env = getEnv();
  const assetsBucket = getContentAssetsBucket(env);

  if (!assetsBucket) {
    return jsonError("Image assets are temporarily disabled", 503);
  }

  const object = await assetsBucket.get(r2Key);

  if (!object) {
    return jsonError("Asset not found", 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "private, max-age=300");

  return new Response(object.body, { headers });
}
