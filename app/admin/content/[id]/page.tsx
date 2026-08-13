import Link from "next/link";
import ContentEditor from "../ContentEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditContentPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#FAFCFE] px-6 py-8 text-[#0E0E2C]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="border-b border-[#ECF1F4] pb-5">
          <Link href="/admin/content" className="text-sm font-bold text-[#32738F]">
            AI 科普文章
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold">編輯文章</h1>
        </header>
        <ContentEditor id={id} />
      </div>
    </main>
  );
}
