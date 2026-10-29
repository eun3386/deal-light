import { NextResponse } from "next/server";
import { redis } from "@/lib/server";

// 최근 7일 집계. STATS_TOKEN 환경변수를 설정하고 ?token=... 으로 호출해야 열린다(미설정이면 404).
export async function GET(req: Request) {
  const secret = process.env.STATS_TOKEN;
  if (!secret || !redis) return new NextResponse(null, { status: 404 });
  if (new URL(req.url).searchParams.get("token") !== secret) return new NextResponse(null, { status: 401 });

  const days = Array.from({ length: 7 }, (_, i) => new Date(Date.now() + 9 * 3600 * 1000 - i * 86400000).toISOString().slice(0, 10));
  const seenOn = new Map<string, number>();
  const daily = [];
  for (const day of days) {
    const [events, vids] = await Promise.all([redis.hgetall<Record<string, number>>(`ev:${day}`), redis.smembers(`uv:${day}`)]);
    vids.forEach((v) => seenOn.set(v, (seenOn.get(v) ?? 0) + 1));
    daily.push({ day, visitors: vids.length, events: events ?? {} });
  }
  const visitors = seenOn.size;
  const returning = [...seenOn.values()].filter((n) => n > 1).length;
  return NextResponse.json({ visitors7d: visitors, returning7d: returning, returnRate: visitors ? +(returning / visitors).toFixed(3) : 0, daily });
}
