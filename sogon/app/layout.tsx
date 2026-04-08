import type { Metadata } from "next";
import { Gowun_Dodum, Gowun_Batang, Nanum_Pen_Script } from "next/font/google";
import "./globals.css";

const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gowun-dodum",
});

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
  title: "\uC18C\uACE4",
  description: "\uD504\uB77C\uC774\uBE57\uD55C\uB370 \uBC18\uC751\uC774 \uC788\uB294 \uD558\uB8E8 \uAE30\uB85D \uACF5\uAC04",
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
      className={`${gowunDodum.variable} ${gowunBatang.variable} ${nanumPen.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
