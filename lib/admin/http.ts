import { NextResponse } from "next/server";

export function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function normalizeEmail(email: unknown): string {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isoNow(): string {
  return new Date().toISOString();
}

export function createId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `${prefix}_${random}`;
}
