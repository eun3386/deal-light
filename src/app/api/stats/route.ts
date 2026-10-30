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

// 집계 초기화(공개 전 테스트 기록 정리용). 방문·이벤트 키(ev:*, uv:*)만 지우고 제보·리뷰·신고 데이터는 건드리지 않는다.
export async function DELETE(req: Request) {
  const secret = process.env.STATS_TOKEN;
  if (!secret || !redis) return new NextResponse(null, { status: 404 });
  if (new URL(req.url).searchParams.get("token") !== secret) return new NextResponse(null, { status: 401 });

  const keys: string[] = [];
  for (const match of ["ev:*", "uv:*"]) {
    let cursor = "0";
    do {
      const [next, found] = await redis.scan(cursor, { match, count: 200 });
      cursor = String(next);
      keys.push(...found);
    } while (cursor !== "0");
  }
  if (keys.length) await redis.del(...keys);
  return NextResponse.json({ deleted: keys });
}
