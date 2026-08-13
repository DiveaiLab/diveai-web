import Link from "next/link";
import { redirect } from "next/navigation";
import ContentEditor from "../ContentEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditContentPage({ params }: PageProps) {
  const { id } = await params;

  if (id === "new") {
    redirect("/admin/content");
  }

  return (
    <main className="flex max-w-7xl flex-col gap-6">
      <header className="border-b border-[#ECF1F4] pb-5">
        <Link href="/admin/content" className="text-sm font-bold text-[#32738F]">
          AI 科普文章
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold">編輯文章</h1>
      </header>
      <ContentEditor id={id} />
    </main>
  );
}
