import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "아이들과미래재단 임직원 AI교육 신청",
  description:
    "아이들과미래재단 임직원을 위한 2회기 AI 업무 생산성 교육 — 일정을 선택하고 신청해 주세요.",
  openGraph: {
    title: "아이들과미래재단 임직원 AI교육 신청",
    description: "생성형 AI · 바이브코딩으로 업무를 한 단계 끌어올리는 사내 워크숍.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
