import { NextResponse } from "next/server";
import {
  clearAdminSessionCookie,
  getSessionCookie,
  revokeAdminSession,
} from "@/lib/admin/session";
import { getEnv } from "@/lib/cloudflare/env";

export const runtime = "edge";

export async function POST(request: Request) {
  const token = getSessionCookie(request.headers);

  if (token) {
    await revokeAdminSession(getEnv().DB, token);
  }

  const response = NextResponse.json({ ok: true });
  clearAdminSessionCookie(response);

  return response;
}
