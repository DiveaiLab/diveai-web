"use client";

import { useRef, useState } from "react";
import { uploadWallImage } from "@/app/lib/wall/upload-image";

type ImageUploadFieldProps = {
  value: string;
  onChange: (url: string) => void;
};

// 封面圖欄位：主要操作是「選檔案上傳」，上傳完會自動把 R2 回傳的公開網址
// 填進 value。同時保留一個可編輯的網址欄位當作 fallback——R2 帳號層級還沒
// 啟用之前上傳會失敗（後端回傳清楚的錯誤訊息），這時候還是可以手動貼一個
// 外部圖片網址進來，不會卡住整個表單。
export default function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("只能上傳圖片檔案");
      return;
    }
    if (file.size / 1024 / 1024 > 10) {
      setError("圖片大小請控制在 10MB 以內");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const url = await uploadWallImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "圖片上傳失敗");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="w-28 h-20 rounded-lg border border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="封面圖預覽" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-gray-400 text-center px-1">尚無封面圖</span>
          )}
        </div>

        <div className="flex-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-white border border-gray-200 hover:border-[#2563EB] disabled:opacity-50 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {uploading ? "上傳中…" : "選擇圖片上傳"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {error && <p className="text-[11px] text-red-500 mt-1.5">{error}</p>}
        </div>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="上傳後會自動帶入網址，也可以手動貼上外部圖片網址"
        className="mt-3 w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}
