import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansThai = Noto_Sans_Thai({ subsets: ["thai"], variable: "--font-noto-sans-thai" });

export const metadata: Metadata = {
  title: "My Portfolio | Paramat Promwichai",
  description: "Portfolio by Paramat Promwichai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // เพิ่ม scroll-smooth ที่แท็ก html
    <html lang="th" className="scroll-smooth"> 
      <body className={`${inter.variable} ${notoSansThai.variable} font-sans`}>{children}</body>
    </html>
  );
}
