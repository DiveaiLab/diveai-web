import { notFound } from "next/navigation";
import { getEnv, isContentAssetsEnabled } from "@/lib/cloudflare/env";
import ContentEditor from "../ContentEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditContentPage({ params }: PageProps) {
  const { id } = await params;
  const assetsEnabled = isContentAssetsEnabled(getEnv());

  if (id === "new") {
    notFound();
  }

  return <ContentEditor id={id} assetsEnabled={assetsEnabled} />;
}
