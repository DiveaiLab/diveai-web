import { NextResponse } from "next/server";
import { createAdminSession, setAdminSessionCookie } from "@/lib/admin/session";
import { isoNow, jsonError, normalizeEmail, normalizeString } from "@/lib/admin/http";
import { verifyPassword } from "@/lib/admin/crypto";
import { getEnv } from "@/lib/cloudflare/env";

export const runtime = "edge";

type LoginUser = {
  email: string;
  display_name: string | null;
  role: "admin" | "editor";
  is_active: number;
  password_hash: string | null;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as Record<string, unknown>;
  const email = normalizeEmail(payload.email);
  const password = normalizeString(payload.password);

  if (!email || !password) {
    return jsonError("Email and password are required", 400);
  }

  const env = getEnv();
  const user = await env.DB.prepare(
    `SELECT email, display_name, role, is_active, password_hash
     FROM admin_users
     WHERE lower(email) = lower(?)
     LIMIT 1`,
  )
    .bind(email)
    .first<LoginUser>();

  const passwordMatches = await verifyPassword(password, user?.password_hash ?? null);

  if (!user || user.is_active !== 1 || !passwordMatches) {
    return jsonError("Invalid email or password", 401);
  }

  const { token, expiresAt } = await createAdminSession(env.DB, user.email);
  const now = isoNow();

  await env.DB.prepare("UPDATE admin_users SET last_login_at = ?, updated_at = ? WHERE email = ?")
    .bind(now, now, user.email)
    .run();

  const response = NextResponse.json({
    authenticated: true,
    session: {
      email: user.email,
      displayName: user.display_name || user.email,
      role: user.role,
      authBypassed: false,
    },
  });

  setAdminSessionCookie(response, token, expiresAt);

  return response;
}
