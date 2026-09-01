"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "登入失敗");
      }

      router.push("/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "登入失敗");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={login}
      className="flex w-full max-w-md flex-col gap-5 rounded-lg border border-[#ECF1F4] bg-white p-6 shadow-sm"
    >
      <div>
        <p className="text-sm font-bold text-[#32738F]">DiveAI Admin</p>
        <h1 className="mt-2 text-3xl font-extrabold">後台登入</h1>
      </div>

      {error ? (
        <div className="rounded-md border border-[#F8C0A0] bg-[#FAFCFE] p-3 text-sm text-[#0E0E2C]">
          {error}
        </div>
      ) : null}

      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
          required
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold">密碼</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className="h-11 rounded-md border border-[#ECF1F4] px-3 outline-none focus:border-[#6FC1CC]"
          required
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="h-11 rounded-md bg-[#32738F] px-5 text-sm font-bold text-white transition hover:bg-[#0E0E2C] disabled:opacity-60"
      >
        {submitting ? "登入中" : "登入"}
      </button>
    </form>
  );
}
