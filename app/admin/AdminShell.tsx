"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "首頁", exact: true },
  { href: "/admin/content", label: "科普文章管理" },
  { href: "/admin/users", label: "使用者管理" },
];

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#FAFCFE] text-[#0E0E2C]">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-[#ECF1F4] bg-white px-5 py-5 lg:border-b-0 lg:border-r">
          <Link href="/admin" className="block">
            <span className="block text-sm font-bold text-[#32738F]">DiveAI Admin</span>
            <span className="mt-1 block text-xl font-extrabold">呆一布網站後台</span>
          </Link>
          <nav className="mt-5 flex gap-2 overflow-x-auto lg:flex-col">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-[#32738F] text-white"
                      : "text-[#0E0E2C] hover:bg-[#ECF1F4]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => void logout()}
            disabled={loggingOut}
            className="mt-5 h-10 rounded-md border border-[#32738F] px-4 text-sm font-bold text-[#32738F] transition hover:bg-[#ECF1F4] disabled:opacity-60"
          >
            {loggingOut ? "登出中" : "登出"}
          </button>
        </aside>
        <div className="min-w-0 px-6 py-8 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
