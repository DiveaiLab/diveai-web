"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import PostForm, { type PostFormOutput } from "./PostForm";
import { useWallState } from "@/app/lib/wall/wall-state-context";

type EditPostClientProps = {
  id: string;
};

export default function EditPostClient({ id }: EditPostClientProps) {
  const { getPostById, updatePost } = useWallState();
  const router = useRouter();
  const post = getPostById(id);

  if (!post) {
    return (
      <div>
        <Link
          href="/admin/wall/posts"
          className="text-sm text-[#2563EB] hover:underline mb-6 inline-block"
        >
          ← 返回文章管理
        </Link>
        <p className="text-sm text-gray-500">找不到這篇文章，可能已經被刪除了。</p>
      </div>
    );
  }

  async function handleSubmit(data: PostFormOutput) {
    await updatePost(id, data);
    router.push("/admin/wall/posts");
  }

  return (
    <div>
      <Link
        href="/admin/wall/posts"
        className="text-sm text-[#2563EB] hover:underline mb-6 inline-block"
      >
        ← 返回文章管理
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">編輯文章</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <PostForm initialPost={post} submitLabel="儲存變更" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
