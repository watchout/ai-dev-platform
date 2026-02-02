import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Development Platform",
  description:
    "Dashboard for the AI Development Framework - progress, scores, alerts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
