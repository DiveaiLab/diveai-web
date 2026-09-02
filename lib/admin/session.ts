import { NextResponse } from "next/server";
import { createId, isoNow } from "@/lib/admin/http";
import { generateSessionToken, hashSessionToken } from "@/lib/admin/crypto";

export const ADMIN_SESSION_COOKIE = "diveai_admin_session";
export const ADMIN_SESSION_DAYS = 7;

type SessionRow = {
  id: string;
  email: string;
  expires_at: string;
  revoked_at: string | null;
};

export function getCookieValue(headers: Headers, name: string): string | null {
  const cookieHeader = headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [rawName, ...rawValue] = cookie.trim().split("=");

    if (rawName === name) {
      return rawValue.join("=") || null;
    }
  }

  return null;
}

export function getSessionCookie(headers: Headers): string | null {
  return getCookieValue(headers, ADMIN_SESSION_COOKIE);
}

export function getSessionExpiresAt(): Date {
  return new Date(Date.now() + ADMIN_SESSION_DAYS * 24 * 60 * 60 * 1000);
}

export function setAdminSessionCookie(response: NextResponse, token: string, expires: Date) {
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires,
    path: "/",
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
}

export async function createAdminSession(
  db: D1Database,
  email: string,
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSessionToken();
  const tokenHash = await hashSessionToken(token);
  const expiresAt = getSessionExpiresAt();

  await db.prepare(
    `INSERT INTO admin_sessions (id, email, token_hash, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(createId("session"), email, tokenHash, expiresAt.toISOString(), isoNow())
    .run();

  return { token, expiresAt };
}

export async function findValidAdminSession(
  db: D1Database,
  token: string,
): Promise<SessionRow | null> {
  const tokenHash = await hashSessionToken(token);
  const session = await db.prepare(
    `SELECT id, email, expires_at, revoked_at
     FROM admin_sessions
     WHERE token_hash = ?
     LIMIT 1`,
  )
    .bind(tokenHash)
    .first<SessionRow>();

  if (!session || session.revoked_at || new Date(session.expires_at).getTime() <= Date.now()) {
    return null;
  }

  return session;
}

export async function revokeAdminSession(db: D1Database, token: string): Promise<void> {
  const tokenHash = await hashSessionToken(token);

  await db.prepare(
    `UPDATE admin_sessions
     SET revoked_at = ?
     WHERE token_hash = ? AND revoked_at IS NULL`,
  )
    .bind(isoNow(), tokenHash)
    .run();
}

export async function revokeAdminUserSessions(db: D1Database, email: string): Promise<void> {
  await db.prepare(
    `UPDATE admin_sessions
     SET revoked_at = ?
     WHERE lower(email) = lower(?) AND revoked_at IS NULL`,
  )
    .bind(isoNow(), email)
    .run();
}
