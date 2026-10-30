import { NextResponse } from "next/server";
import { notifyDiscord } from "@/lib/server";
import { getStats } from "@/lib/stats";

// Vercel Cron(vercel.json)이 매일 호출. CRON_SECRET이 설정돼 있으면 Vercel이 Authorization 헤더로 보내준다.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new NextResponse(null, { status: 401 });

  const s = await getStats();
  if (!s) return new NextResponse(null, { status: 503 });
  const today = s.daily[0];
  const e = today.events;
  const n = (k: string) => e[k] ?? 0;
  const views = ["pv_home", "pv_prices", "pv_report", "pv_scams", "pv_feedback"].reduce((a, k) => a + n(k), 0);
  await notifyDiscord(
    [
      `📊 오늘(${today.day}) 요약`,
      `방문 ${today.visitors}명 · 페이지뷰 ${views} · 검색 ${n("search")} · 공유 ${n("share_click")} · 가격 제보 ${n("report_submit")}`,
      `최근 7일: 방문 ${s.visitors7d}명 · 재방문 ${s.returning7d}명 (${Math.round(s.returnRate * 100)}%)`,
    ].join("\n"),
  );
  return NextResponse.json({ ok: true });
}
