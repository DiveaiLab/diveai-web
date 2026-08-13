import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env as CloudflareEnv;
}

export function isLocalAuthBypassEnabled(env: CloudflareEnv): boolean {
  return env.CMS_AUTH_BYPASS === "true" && env.NODE_ENV !== "production";
}
