"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type AdminUser = {
  email: string;
  display_name: string | null;
  role: "admin" | "editor";
  is_active: number;
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");
  const [error, setError] = useState("");

  async function loadUsers() {
    const response = await fetch("/api/admin/users");
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to load users");
      return;
    }

    setUsers(data.users || []);
  }

  useEffect(() => {
    fetch("/api/admin/users")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load users");
        }

        setUsers(data.users || []);
      })
      .catch((caught: Error) => setError(caught.message));
  }, []);

  async function addUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, displayName, role }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to save user");
      return;
    }

    setEmail("");
    setDisplayName("");
    setRole("editor");
    await loadUsers();
  }

  async function updateUser(user: AdminUser, isActive: boolean) {
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        displayName: user.display_name || "",
        role: user.role,
        isActive,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Unable to update user");
      return;
    }

    await loadUsers();
  }

  return (
    <main className="min-h-screen bg-[#FAFCFE] px-6 py-8 text-[#0E0E2C]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="border-b border-[#ECF1F4] pb-5">
          <Link href="/admin" className="text-sm font-bold text-[#32738F]">
            後台
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold">後台使用者</h1>
        </header>

        {error ? (
          <div className="rounded-md border border-[#F8C0A0] bg-white p-4 text-sm">
            {error}
          </div>
        ) : null}

        <form
          onSubmit={addUser}
          className="grid gap-4 rounded-lg border border-[#ECF1F4] bg-white p-5 md:grid-cols-[1fr_1fr_160px_auto]"
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email"
            className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
            required
          />
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="顯示名稱"
            className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as "admin" | "editor")}
            className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
          >
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
          <button className="h-11 rounded-md bg-[#32738F] px-5 text-sm font-bold text-white">
            新增
          </button>
        </form>

        <section className="overflow-hidden rounded-lg border border-[#ECF1F4] bg-white">
          {users.map((user) => (
            <div
              key={user.email}
              className="grid gap-3 border-b border-[#ECF1F4] px-4 py-4 text-sm last:border-b-0 md:grid-cols-[1fr_140px_120px_auto]"
            >
              <span>
                <strong className="block">{user.display_name || user.email}</strong>
                <span className="text-[#8C8CA1]">{user.email}</span>
              </span>
              <span>{user.role}</span>
              <span>{user.is_active ? "active" : "inactive"}</span>
              <button
                onClick={() => void updateUser(user, user.is_active !== 1)}
                className="h-9 rounded-md border border-[#32738F] px-4 text-sm font-bold text-[#32738F]"
              >
                {user.is_active ? "停用" : "啟用"}
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
