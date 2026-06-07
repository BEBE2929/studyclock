import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/contexts/LangContext";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "スタディクロック",
  description: "しょうがく1ねんせいのための とけいがくしゅうアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full`}>
      <body className="min-h-full bg-sky-50 font-[family-name:var(--font-noto)]">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
