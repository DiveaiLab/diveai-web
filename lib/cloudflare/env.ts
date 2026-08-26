import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env as CloudflareEnv;
}

export function isLocalAuthBypassEnabled(env: CloudflareEnv): boolean {
  const authBypass = env.CMS_AUTH_BYPASS ?? process.env.CMS_AUTH_BYPASS;
  const nodeEnv = env.NODE_ENV ?? process.env.NODE_ENV;

  return authBypass === "true" && nodeEnv !== "production";
}

export function getContentAssetsBucket(env: CloudflareEnv): R2Bucket | null {
  const assetsEnabled = env.CMS_CONTENT_ASSETS_ENABLED ?? process.env.CMS_CONTENT_ASSETS_ENABLED;

  if (assetsEnabled !== "true") {
    return null;
  }

  return env.CONTENT_ASSETS ?? null;
}

export function isContentAssetsEnabled(env: CloudflareEnv): boolean {
  return getContentAssetsBucket(env) !== null;
}
