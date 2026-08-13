import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env as CloudflareEnv;
}

export function isLocalAuthBypassEnabled(env: CloudflareEnv): boolean {
  const authBypass = env.CMS_AUTH_BYPASS ?? process.env.CMS_AUTH_BYPASS;
  const nodeEnv = env.NODE_ENV ?? process.env.NODE_ENV;

  return authBypass === "true" && nodeEnv !== "production";
}
