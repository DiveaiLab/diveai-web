import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env as CloudflareEnv;
}

// 跟 feat-cms 分支的 CONTENT_ASSETS 一樣：R2 帳號層級還沒啟用，這個 flag
// 先預設 false，等 R2 可以用了、wrangler.jsonc 裡的 r2_buckets 打開之後，
// 把 WALL_ASSETS_ENABLED 環境變數改成 "true" 就會自動生效。
export function getWallAssetsBucket(env: CloudflareEnv): R2Bucket | null {
  const enabled = env.WALL_ASSETS_ENABLED ?? process.env.WALL_ASSETS_ENABLED;

  if (enabled !== "true") {
    return null;
  }

  return env.WALL_ASSETS ?? null;
}

export function isWallAssetsEnabled(env: CloudflareEnv): boolean {
  return getWallAssetsBucket(env) !== null;
}
