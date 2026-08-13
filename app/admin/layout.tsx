import { headers } from "next/headers";
import type { ReactNode } from "react";
import { getAdminSessionFromHeaders } from "@/lib/admin/auth";
import AdminShell from "./AdminShell";

function AdminUnauthorized() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFCFE] px-6 text-[#0E0E2C]">
      <section className="w-full max-w-lg text-center">
        <p className="text-sm font-bold text-[#32738F]">401</p>
        <h1 className="mt-3 text-3xl font-extrabold">請先登入</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#8C8CA1]">
          這個頁面只開放給後台使用者。請先完成 Cloudflare Access Email OTP
          登入；如果已經登入但仍看到這個畫面，代表目前的 email 尚未加入後台 allowlist。
        </p>
      </section>
    </main>
  );
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSessionFromHeaders(new Headers(await headers()));

  if (!session) {
    return <AdminUnauthorized />;
  }

  return <AdminShell>{children}</AdminShell>;
}
