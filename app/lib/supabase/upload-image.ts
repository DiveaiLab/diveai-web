import { supabase, isSupabaseConfigured, WALL_IMAGES_BUCKET } from "./client";

// 圖片上傳共用函式：封面圖選擇器（PostForm）跟內文編輯器（NovelEditor 貼上／
// 拖曳圖片）都呼叫這個函式，差別只在 pathPrefix（covers/ 或 content/），
// 回傳的是可以直接放進 <img src> 的公開網址。
//
// Supabase 還沒設定好的情況下（isSupabaseConfigured 為 false）沒有地方可以
// 真的上傳檔案，直接丟出錯誤，呼叫端要接住並提示使用者。
export async function uploadWallImage(file: File, pathPrefix: "covers" | "content"): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      "還沒設定 Supabase，無法上傳圖片。請先在 .env.local 填入 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY。"
    );
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const fileName = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(WALL_IMAGES_BUCKET).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) {
    throw new Error(`圖片上傳失敗：${error.message}`);
  }

  const { data } = supabase.storage.from(WALL_IMAGES_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}
