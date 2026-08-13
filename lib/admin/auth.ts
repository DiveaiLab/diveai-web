import { NextResponse } from "next/server";
import { getEnv, isLocalAuthBypassEnabled } from "@/lib/cloudflare/env";

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

export function getAccessEmail(request: Request): string | null {
  const directEmail = request.headers.get("cf-access-authenticated-user-email");

  if (directEmail) {
    return directEmail.toLowerCase();
  }

  const debugEmail = request.headers.get("x-diveai-admin-email");
  const env = getEnv();

  if (debugEmail && isLocalAuthBypassEnabled(env)) {
    return debugEmail.toLowerCase();
  }

  if (isLocalAuthBypassEnabled(env)) {
    return "local-admin@diveai.local";
  }

  return null;
}

export async function getAdminSession(request: Request): Promise<AdminSession | null> {
  const env = getEnv();
  const email = getAccessEmail(request);

  if (!email) {
    return null;
  }

  if (isLocalAuthBypassEnabled(env)) {
    return {
      email,
      displayName: "Local Admin",
      role: "admin",
      authBypassed: true,
    };
  }

  const user = await env.DB.prepare(
    "SELECT email, display_name, role, is_active FROM admin_users WHERE lower(email) = lower(?) LIMIT 1",
  )
    .bind(email)
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
