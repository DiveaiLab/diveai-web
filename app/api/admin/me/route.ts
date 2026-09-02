import { NextResponse } from "next/server";
import { getEnv, isLocalAuthBypassEnabled } from "@/lib/cloudflare/env";
import { getAdminSession } from "@/lib/admin/auth";

export const runtime = "edge";

export async function GET(request: Request) {
  const env = getEnv();
  const session = await getAdminSession(request);

  if (!session) {
    return NextResponse.json(
      {
        authenticated: false,
        authBypassAvailable: isLocalAuthBypassEnabled(env),
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    authenticated: true,
    session,
  });
}
