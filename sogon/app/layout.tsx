import type { Metadata } from "next";
import { Gowun_Batang, Nanum_Pen_Script } from "next/font/google";
import "@fontsource/pretendard/400.css";
import "@fontsource/pretendard/700.css";
import "./globals.css";

const gowunBatang = Gowun_Batang({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gowun-batang",
});

const nanumPen = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nanum-pen",
});

export const metadata: Metadata = {
  title: "소곤",
  description: "프라이빗한데 반응이 있는 하루 기록 공간",
  verification: {
    google: "ggKZ1AlVWDBwCfiFZ0cPmk_dOBSPmU8D4_KwrPz348o",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${gowunBatang.variable} ${nanumPen.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
