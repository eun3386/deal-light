import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ScamBanner from "@/components/ScamBanner";
import Tracker from "@/components/Tracker";

const TITLE = "딜라이트 · 다낭 시세 요정";
const DESC = "바가지 스트레스 없는 여행, 다낭 한시장·야시장 로컬 시세 검색 서비스";
export const metadata: Metadata = {
  metadataBase: new URL("https://deal-light.vercel.app"),
  title: TITLE,
  description: DESC,
  openGraph: { title: TITLE, description: DESC, type: "website", locale: "ko_KR", siteName: "딜라이트" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-slate-100 text-slate-900 antialiased">
        <div className="mx-auto min-h-screen max-w-md bg-white pb-20 shadow-sm">
          <ScamBanner />
          {children}
          <p className="pb-4 pt-2 text-center text-xs text-slate-400"><Link href="/feedback" className="underline">🐞 오류 신고 · 의견 보내기</Link></p>
        </div>
        <Tracker />
        <BottomNav />
      </body>
    </html>
  );
}
