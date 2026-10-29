import { NextResponse } from "next/server";
import { allow, redis } from "@/lib/server";

// 수요 검증용 가벼운 이벤트 집계. 개인정보 없이 임의의 방문자 ID(vid)와 이벤트 이름만 저장한다.
const EVENTS = ["pv_home", "pv_prices", "pv_report", "pv_scams", "pv_stores", "pv_feedback", "search", "report_submit", "share_click"] as const;
const DAY_TTL = 60 * 60 * 24 * 90;

// 한국 시간 기준 날짜(YYYY-MM-DD)
const today = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

export async function POST(req: Request) {
  if (!redis || !(await allow(req, "track", 60))) return new NextResponse(null, { status: 204 });
  const b = await req.json().catch(() => null);
  const event = String(b?.event ?? "");
  const vid = String(b?.vid ?? "");
  if (!(EVENTS as readonly string[]).includes(event) || !/^[a-z0-9]{8,40}$/.test(vid)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const day = today();
  const p = redis.pipeline();
  p.hincrby(`ev:${day}`, event, 1);
  p.expire(`ev:${day}`, DAY_TTL);
  p.sadd(`uv:${day}`, vid);
  p.expire(`uv:${day}`, DAY_TTL);
  await p.exec();
  return new NextResponse(null, { status: 204 });
}
