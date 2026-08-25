import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 兩個環境變數都要有才算「已設定 Supabase」。專案還沒接 Supabase 之前
// （例如還沒建立專案、還沒把金鑰貼進 .env.local），這兩個變數會是
// undefined，這時候共學牆改用 app/lib/wall/wall-state-context.tsx 裡的
// localStorage 假資料，不會噴錯、也不會擋開發，等金鑰補上後自動切換成
// 真的 Supabase 讀寫，不用改任何程式碼。
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// 共學牆封面圖／內文圖片上傳用的 bucket（見
// supabase/migrations/0002_wall_images_storage.sql）。
export const WALL_IMAGES_BUCKET = "wall-images";
