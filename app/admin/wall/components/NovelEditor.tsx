"use client";

import { useRef, useState } from "react";
import {
  EditorRoot,
  EditorContent,
  type EditorInstance,
  type JSONContent,
  StarterKit,
  TiptapLink,
  TiptapUnderline,
  TiptapImage,
  UpdatedImage,
  TextStyle,
  Color,
  HighlightExtension,
  Placeholder,
  HorizontalRule,
  handleImageDrop,
  handleImagePaste,
  createImageUpload,
} from "novel";
import { Markdown } from "tiptap-markdown";
import { uploadWallImage } from "@/app/lib/supabase/upload-image";

// novel@1.0.2（目前 npm 上最新的正式版本）還沒內建 Markdown 支援
// （GitHub 上比較新的原始碼有，但還沒發新版），所以額外自己裝
// tiptap-markdown 這個 Tiptap 官方生態系常用的擴充套件來做 Markdown 讀寫。
//
// html 這裡設 true（而不是 novel 之後內建版本用的 false）：因為下面
// ColorTextStyle 的顏色是序列化成行內 HTML（<span style="color:...">），
// html:false 會讓「重新打開已存在的文章編輯」時，這段 HTML 被當成純文字
// 顯示（實測會出現逃逸過的 &lt;span&gt; 字樣，顏色救不回來），開 html:true
// 讓編輯器能正確把顏色 parse 回來繼續編輯。這只影響後台編輯器本身讀取
// Markdown 的方式，跟前台 MarkdownBody.tsx 用 rehype-sanitize 限制哪些
// HTML 可以顯示是兩件事、互不影響——後台本來就是內部信任的操作環境
// （目前也還沒有登入門檻），前台那邊的安全限制完全沒有放寬。
const MarkdownExtension = Markdown.configure({
  html: true,
  transformCopiedText: true,
});

// 投稿者用的所見即所得編輯器：外觀跟操作都是一般文書編輯器（工具列按鈕、
// 反白選字），完全不用碰 Markdown 語法；底層用 Novel／Tiptap，掛
// MarkdownExtension（tiptap-markdown）之後，編輯器可以直接吃 Markdown
// 字串當初始內容，內容變動時也能直接吐出 Markdown 字串
// （editor.storage.markdown.getMarkdown()），存進 Supabase 的 articles.body_md
// 就是這個字串，前台再用 react-markdown 轉回 HTML 顯示（見
// app/commuity-wall/components/MarkdownBody.tsx）。
//
// 顏色文字：下面工具列的色塊用的是 TextStyle + Color 這兩個 mark。
// tiptap-markdown 預設不知道怎麼把「文字顏色」這種沒有對應 Markdown 語法
// 的樣式序列化成字串（實測會直接整個丟掉，顏色會憑空消失），所以自己把
// TextStyle 擴充一個 markdown serialize 規則，遇到有 color 屬性時包成
// <span style="color:...">，沒有 color 屬性（其他用途的 textStyle mark）
// 就照舊，不多包東西。這樣工具列選色，存出來的 Markdown 就會帶顏色，
// 剛好跟 MarkdownBody.tsx 的 rehype-sanitize 規則對得上，投稿者選色、
// 看到的就是最後渲染出來的顏色，不用手動輸入任何 HTML。
const ColorTextStyle = TextStyle.extend({
  addStorage() {
    return {
      markdown: {
        serialize: {
          open: (_state: unknown, mark: { attrs: { color?: string } }) =>
            mark.attrs.color ? `<span style="color: ${mark.attrs.color}">` : "",
          close: (_state: unknown, mark: { attrs: { color?: string } }) =>
            mark.attrs.color ? "</span>" : "",
          mixable: true,
        },
      },
    };
  },
});

const extensions = [
  StarterKit.configure({
    horizontalRule: false,
  }),
  HorizontalRule,
  TiptapUnderline,
  TiptapLink.configure({
    HTMLAttributes: { class: "text-[#2563EB] underline underline-offset-2" },
  }),
  TiptapImage,
  UpdatedImage,
  ColorTextStyle,
  Color,
  HighlightExtension,
  MarkdownExtension,
  Placeholder.configure({
    placeholder: "在這裡寫下你的學習歷程...輸入 / 可以快速插入標題、清單等格式",
  }),
];

const COLOR_SWATCHES = [
  { label: "預設", value: "" },
  { label: "藍色", value: "#2563EB" },
  { label: "紅色", value: "#DC2626" },
  { label: "綠色", value: "#16A34A" },
  { label: "橘色", value: "#EA580C" },
  { label: "紫色", value: "#7C3AED" },
];

async function uploadFn(file: File): Promise<string> {
  return uploadWallImage(file, "content");
}

const imageUpload = createImageUpload({
  onUpload: uploadFn,
  validateFn: (file) => {
    if (!file.type.startsWith("image/")) {
      window.alert("只能上傳圖片檔案");
      return false;
    }
    if (file.size / 1024 / 1024 > 10) {
      window.alert("圖片大小請控制在 10MB 以內");
      return false;
    }
    return true;
  },
});

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={
        active
          ? "h-8 min-w-8 px-2 rounded-lg bg-[#2563EB] text-white text-sm font-semibold"
          : "h-8 min-w-8 px-2 rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-semibold"
      }
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: EditorInstance | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  async function handlePickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    setUploading(true);
    try {
      const src = await uploadWallImage(file, "content");
      editor.chain().focus().setImage({ src }).run();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "圖片上傳失敗");
    } finally {
      setUploading(false);
    }
  }

  function setLink() {
    const previousUrl = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("連結網址", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 rounded-t-lg px-2 py-1.5">
      <ToolbarButton
        label="標題 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        label="標題 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <ToolbarButton
        label="粗體"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        label="斜體"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        label="底線"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        label="刪除線"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolbarButton>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <ToolbarButton
        label="項目清單"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •≡
      </ToolbarButton>
      <ToolbarButton
        label="編號清單"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.≡
      </ToolbarButton>
      <ToolbarButton
        label="引用"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        &ldquo;
      </ToolbarButton>
      <ToolbarButton
        label="程式碼區塊"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        {"</>"}
      </ToolbarButton>
      <ToolbarButton label="分隔線" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        ―
      </ToolbarButton>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <ToolbarButton label="連結" active={editor.isActive("link")} onClick={setLink}>
        🔗
      </ToolbarButton>
      <ToolbarButton label="插入圖片" onClick={() => fileInputRef.current?.click()}>
        {uploading ? "…" : "🖼"}
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePickImage}
      />
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <span className="text-xs text-gray-400 mr-1">顏色</span>
      {COLOR_SWATCHES.map((swatch) => (
        <button
          key={swatch.label}
          type="button"
          title={swatch.label}
          aria-label={swatch.label}
          onClick={() =>
            swatch.value
              ? editor.chain().focus().setColor(swatch.value).run()
              : editor.chain().focus().unsetColor().run()
          }
          className="h-6 w-6 rounded-full border border-gray-200"
          style={{ backgroundColor: swatch.value || "#ffffff" }}
        />
      ))}
    </div>
  );
}

type NovelEditorProps = {
  initialMarkdown: string;
  onChange: (markdown: string) => void;
};

// 用 initialMarkdown 當作「不受控」的初始值：只有第一次掛載時拿來初始化
// 編輯器內容，之後編輯器內部狀態自己管理（跟一般文書編輯器一樣），不會
// 因為 parent re-render 就重設游標位置或內容。
export default function NovelEditor({ initialMarkdown, onChange }: NovelEditorProps) {
  const [editorInstance, setEditorInstance] = useState<EditorInstance | null>(null);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <EditorRoot>
        <Toolbar editor={editorInstance} />
        <EditorContent
          initialContent={initialMarkdown as unknown as JSONContent}
          extensions={extensions}
          className="min-h-[320px] max-h-[600px] overflow-y-auto px-4 py-3"
          editorProps={{
            attributes: {
              class:
                "prose prose-sm max-w-none focus:outline-none [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-5 [&_h3]:mb-2 [&_a]:text-[#2563EB] [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_code]:bg-gray-100 [&_code]:rounded [&_code]:px-1 [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-lg [&_pre]:p-3 [&_img]:rounded-lg [&_img]:max-w-full",
            },
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, imageUpload),
            handlePaste: (view, event) => handleImagePaste(view, event, imageUpload),
          }}
          onCreate={({ editor }) => setEditorInstance(editor)}
          onUpdate={({ editor }) => {
            const markdown = editor.storage.markdown.getMarkdown() as string;
            onChange(markdown);
          }}
        />
      </EditorRoot>
    </div>
  );
}
