import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ScamBanner from "@/components/ScamBanner";

export const metadata: Metadata = {
  title: "딜라이트 · 다낭 시세 요정",
  description: "바가지 스트레스 없는 여행, 다낭 한시장·야시장 로컬 시세 검색 서비스",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-slate-100 text-slate-900 antialiased">
        <div className="mx-auto min-h-screen max-w-md bg-white pb-20 shadow-sm">
          <ScamBanner />
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
