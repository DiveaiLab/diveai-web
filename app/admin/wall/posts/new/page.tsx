"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import PostForm, { type PostFormOutput } from "../../components/PostForm";
import { useWallState } from "@/app/lib/wall/wall-state-context";

export default function AdminNewPostPage() {
  const { createPost } = useWallState();
  const router = useRouter();

  async function handleSubmit(data: PostFormOutput) {
    await createPost(data);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">新增文章</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <PostForm submitLabel="建立文章" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
