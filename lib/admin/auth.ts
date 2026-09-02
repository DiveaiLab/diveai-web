import { NextResponse } from "next/server";
import { getEnv, isLocalAuthBypassEnabled } from "@/lib/cloudflare/env";
import { findValidAdminSession, getSessionCookie } from "@/lib/admin/session";

export type AdminSession = {
  email: string;
  displayName: string;
  role: "admin" | "editor";
  authBypassed: boolean;
};

type AdminUserRow = {
  email: string;
  display_name: string | null;
  role: "admin" | "editor";
  is_active: number;
};

function getLocalBypassEmail(headers: Headers, env: CloudflareEnv): string {
  const debugEmail = headers.get("x-diveai-admin-email");

  if (debugEmail && isLocalAuthBypassEnabled(env)) {
    return debugEmail.toLowerCase();
  }

  return "local-admin@diveai.local";
}

export async function getAdminSessionFromHeaders(
  headers: Headers,
): Promise<AdminSession | null> {
  const env = getEnv();

  if (isLocalAuthBypassEnabled(env)) {
    const email = getLocalBypassEmail(headers, env);

    return {
      email,
      displayName: "Local Admin",
      role: "admin",
      authBypassed: true,
    };
  }

  const sessionToken = getSessionCookie(headers);

  if (!sessionToken) {
    return null;
  }

  const session = await findValidAdminSession(env.DB, sessionToken);

  if (!session) {
    return null;
  }

  const user = await env.DB.prepare(
    "SELECT email, display_name, role, is_active FROM admin_users WHERE lower(email) = lower(?) LIMIT 1",
  )
    .bind(session.email)
    .first<AdminUserRow>();

  if (!user || user.is_active !== 1) {
    return null;
  }

  return {
    email: user.email,
    displayName: user.display_name || user.email,
    role: user.role,
    authBypassed: false,
  };
}

export async function getAdminSession(request: Request): Promise<AdminSession | null> {
  return getAdminSessionFromHeaders(request.headers);
}

export async function requireAdminSession(request: Request): Promise<AdminSession | NextResponse> {
  const session = await getAdminSession(request);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized admin user" },
      { status: 401 },
    );
  }

  return session;
}

export function isAuthResponse(value: AdminSession | NextResponse): value is NextResponse {
  return value instanceof NextResponse;
}
