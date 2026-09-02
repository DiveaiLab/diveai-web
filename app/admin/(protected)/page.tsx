import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="flex max-w-5xl flex-col gap-8">
      <header className="flex flex-col gap-2 border-b border-[#ECF1F4] pb-6">
        <p className="text-sm font-bold text-[#32738F]">DiveAI Admin</p>
        <h1 className="text-3xl font-extrabold">呆一布網站後台</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/content"
          className="rounded-lg border border-[#ECF1F4] bg-white p-6 shadow-sm transition hover:border-[#6FC1CC]"
        >
          <h2 className="text-xl font-bold">科普文章管理</h2>
          <p className="mt-2 text-sm leading-6 text-[#8C8CA1]">
            管理 AI 科普文章，未來可加入課程介紹與其他內容類型。
          </p>
        </Link>
        <Link
          href="/admin/users"
          className="rounded-lg border border-[#ECF1F4] bg-white p-6 shadow-sm transition hover:border-[#6FC1CC]"
        >
          <h2 className="text-xl font-bold">使用者管理</h2>
          <p className="mt-2 text-sm leading-6 text-[#8C8CA1]">
            管理後台帳號、角色、啟用狀態與臨時密碼。
          </p>
        </Link>
      </section>
    </main>
  );
}
