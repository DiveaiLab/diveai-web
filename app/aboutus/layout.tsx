import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "關於我們 - Diveai",
  description: "關於我們的詳細介紹",
};

export default function AboutUsLayout({
  children,
}: Readonly<{
  children: Readonly<React.ReactNode>;
}>) {
  return <>{children}</>;
}
