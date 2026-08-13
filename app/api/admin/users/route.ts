import { NextResponse } from "next/server";
import { isAuthResponse, requireAdminSession } from "@/lib/admin/auth";
import { isoNow, jsonError, normalizeEmail, normalizeString } from "@/lib/admin/http";
import { getEnv } from "@/lib/cloudflare/env";

export const runtime = "edge";

type AdminUser = {
  email: string;
  display_name: string | null;
  role: "admin" | "editor";
  is_active: number;
  created_at: string;
  updated_at: string;
};

function normalizeRole(role: unknown): "admin" | "editor" {
  return role === "admin" ? "admin" : "editor";
}

async function ensureAdmin(request: Request) {
  const session = await requireAdminSession(request);

  if (isAuthResponse(session)) {
    return session;
  }

  if (session.role !== "admin") {
    return jsonError("Only admin users can manage allowlist", 403);
  }

  return session;
}

export async function GET(request: Request) {
  const session = await requireAdminSession(request);

  if (isAuthResponse(session)) {
    return session;
  }

  const env = getEnv();
  const result = await env.DB.prepare(
    "SELECT email, display_name, role, is_active, created_at, updated_at FROM admin_users ORDER BY created_at DESC",
  ).all<AdminUser>();

  return NextResponse.json({ users: result.results || [] });
}

export async function POST(request: Request) {
  const session = await ensureAdmin(request);

  if (isAuthResponse(session)) {
    return session;
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const email = normalizeEmail(payload.email);
  const displayName = normalizeString(payload.displayName);
  const role = normalizeRole(payload.role);
  const now = isoNow();

  if (!email || !email.includes("@")) {
    return jsonError("A valid email is required");
  }

  const env = getEnv();

  await env.DB.prepare(
    `INSERT INTO admin_users (email, display_name, role, is_active, created_at, updated_at)
     VALUES (?, ?, ?, 1, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
      display_name = excluded.display_name,
      role = excluded.role,
      is_active = 1,
      updated_at = excluded.updated_at`,
  )
    .bind(email, displayName || null, role, now, now)
    .run();

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const session = await ensureAdmin(request);

  if (isAuthResponse(session)) {
    return session;
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const email = normalizeEmail(payload.email);
  const displayName = normalizeString(payload.displayName);
  const role = normalizeRole(payload.role);
  const isActive = payload.isActive === false ? 0 : 1;

  if (!email) {
    return jsonError("Email is required");
  }

  const env = getEnv();

  await env.DB.prepare(
    `UPDATE admin_users
     SET display_name = ?, role = ?, is_active = ?, updated_at = ?
     WHERE lower(email) = lower(?)`,
  )
    .bind(displayName || null, role, isActive, isoNow(), email)
    .run();

  return NextResponse.json({ ok: true });
}
