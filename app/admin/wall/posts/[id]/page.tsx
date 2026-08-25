import EditPostClient from "../../components/EditPostClient";

export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditPostClient id={id} />;
}
