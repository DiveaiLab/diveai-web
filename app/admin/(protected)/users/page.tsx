"use client";

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
  const [temporaryPassword, setTemporaryPassword] = useState<{
    email: string;
    password: string;
  } | null>(null);

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
    setTemporaryPassword(null);

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
    setTemporaryPassword({
      email: data.email || email,
      password: data.temporaryPassword,
    });
    await loadUsers();
  }

  async function updateUser(user: AdminUser, isActive: boolean) {
    setError("");
    setTemporaryPassword(null);

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

  async function resetPassword(user: AdminUser) {
    setError("");
    setTemporaryPassword(null);

    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        displayName: user.display_name || "",
        role: user.role,
        isActive: user.is_active === 1,
        resetPassword: true,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to reset password");
      return;
    }

    setTemporaryPassword({
      email: user.email,
      password: data.temporaryPassword,
    });
    await loadUsers();
  }

  async function copyTemporaryPassword() {
    if (!temporaryPassword) {
      return;
    }

    try {
      await navigator.clipboard.writeText(temporaryPassword.password);
    } catch {
      setError("Unable to copy password");
    }
  }

  return (
    <main className="flex max-w-5xl flex-col gap-6">
      <header className="border-b border-[#ECF1F4] pb-5">
        <p className="text-sm font-bold text-[#32738F]">使用者管理</p>
        <h1 className="mt-2 text-3xl font-extrabold">使用者管理</h1>
      </header>

      {error ? (
        <div className="rounded-md border border-[#F8C0A0] bg-white p-4 text-sm">
          {error}
        </div>
      ) : null}

      {temporaryPassword ? (
        <section className="rounded-lg border border-[#6FC1CC] bg-white p-5">
          <p className="text-sm font-bold text-[#32738F]">臨時密碼（只顯示一次）</p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-[#8C8CA1]">{temporaryPassword.email}</p>
              <code className="mt-1 block rounded-md bg-[#ECF1F4] px-3 py-2 text-lg font-bold text-[#0E0E2C]">
                {temporaryPassword.password}
              </code>
            </div>
            <button
              type="button"
              onClick={() => void copyTemporaryPassword()}
              className="h-10 rounded-md border border-[#32738F] px-4 text-sm font-bold text-[#32738F] transition hover:bg-[#ECF1F4]"
            >
              複製
            </button>
          </div>
        </section>
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
            className="grid gap-3 border-b border-[#ECF1F4] px-4 py-4 text-sm last:border-b-0 md:grid-cols-[1fr_120px_110px_auto]"
          >
            <span>
              <strong className="block">{user.display_name || user.email}</strong>
              <span className="text-[#8C8CA1]">{user.email}</span>
            </span>
            <span>{user.role}</span>
            <span>{user.is_active ? "active" : "inactive"}</span>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <button
                type="button"
                onClick={() => void resetPassword(user)}
                className="h-9 rounded-md border border-[#32738F] px-4 text-sm font-bold text-[#32738F]"
              >
                重設密碼
              </button>
              <button
                type="button"
                onClick={() => void updateUser(user, user.is_active !== 1)}
                className="h-9 rounded-md border border-[#32738F] px-4 text-sm font-bold text-[#32738F]"
              >
                {user.is_active ? "停用" : "啟用"}
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
