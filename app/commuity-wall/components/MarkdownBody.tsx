"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// 允許內文用行內 HTML 加顏色，例如 <span style="color:#2563EB">重點</span>。
// rehype-sanitize 預設不放行 style 屬性，這裡在預設規則之外，額外允許
// span／strong／em 帶 style，讓作者可以標顏色，同時繼續擋掉 <script>、
// on* 事件、javascript: 連結等真正危險的東西。
// 注意：這個內文目前只有後台（app/admin/wall/）能寫入，是團隊內部作者
// 專用的欄位，不是任何人都能填的公開留言／表單，才適合放寬到這個程度。
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [...(defaultSchema.attributes?.span ?? []), "style"],
    strong: [...(defaultSchema.attributes?.strong ?? []), "style"],
    em: [...(defaultSchema.attributes?.em ?? []), "style"],
    p: [...(defaultSchema.attributes?.p ?? []), "style"],
  },
};

type MarkdownBodyProps = {
  content: string;
};

// 文章單篇頁的大段內文渲染：bodyMd 是 Markdown 字串，這裡統一轉成排版
// 好看的 HTML。標題／段落／連結等元素用 components 覆寫成貼合站內風格的
// Tailwind class，而不是額外裝 @tailwindcss/typography。
export default function MarkdownBody({ content }: MarkdownBodyProps) {
  return (
    <div className="text-gray-600 text-sm md:text-base leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        components={{
          h1: ({ children }) => (
            <h2 className="text-gray-900 font-bold text-xl md:text-2xl mt-10 mb-4 first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="text-gray-900 font-bold text-lg md:text-xl mt-10 mb-4 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-gray-900 font-bold text-base md:text-lg mt-8 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-5">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 mb-5 space-y-1.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 mb-5 space-y-1.5">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#2563EB]/30 pl-4 italic text-gray-500 mb-5">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 text-gray-800 rounded px-1.5 py-0.5 text-[0.9em]">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 mb-5 overflow-x-auto text-xs md:text-sm">
              {children}
            </pre>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563EB] hover:underline"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-200 px-3 py-2">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
