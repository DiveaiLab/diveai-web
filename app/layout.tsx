import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WallStateProvider } from "./lib/wall/wall-state-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diveai-web",
  description: "Diveai-web",
};

// WallStateProvider 放在根 layout：共學牆前台（app/commuity-wall）跟後台
// （app/admin/wall）是兩個不同的路由樹，都要讀寫同一份文章／小組動態資料，
// 只能放在兩者共同的最上層，後台改資料、切回前台頁面才會立刻看到最新內容。
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WallStateProvider>{children}</WallStateProvider>
      </body>
    </html>
  );
}
