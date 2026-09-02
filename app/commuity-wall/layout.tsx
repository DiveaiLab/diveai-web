import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diveai-web",
  description: "Diveai-web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
