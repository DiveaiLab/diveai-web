import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getAdminSessionFromHeaders } from "@/lib/admin/auth";
import AdminShell from "../AdminShell";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSessionFromHeaders(new Headers(await headers()));

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
