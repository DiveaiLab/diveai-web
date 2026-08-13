import { notFound } from "next/navigation";
import ContentEditor from "../ContentEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditContentPage({ params }: PageProps) {
  const { id } = await params;

  if (id === "new") {
    notFound();
  }

  return <ContentEditor id={id} />;
}
