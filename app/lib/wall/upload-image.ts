// 封面圖選擇器（ImageUploadField）跟內文編輯器（NovelEditor 貼上／拖曳圖片）
// 都呼叫這個函式，打 app/api/wall/assets（Cloudflare R2），回傳可以直接放進
// <img src> 的網址。R2 帳號層級還沒啟用之前，這裡會收到後端回傳的 503 錯誤
// 訊息，直接往上拋給呼叫端顯示。
export async function uploadWallImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/wall/assets", { method: "POST", body: formData });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "圖片上傳失敗");
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}
