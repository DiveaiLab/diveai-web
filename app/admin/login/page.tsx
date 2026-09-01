import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminSessionFromHeaders } from "@/lib/admin/auth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const session = await getAdminSessionFromHeaders(new Headers(await headers()));

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFCFE] px-6 text-[#0E0E2C]">
      <LoginForm />
    </main>
  );
}
