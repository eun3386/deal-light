import { NextResponse } from "next/server";
import { redis } from "@/lib/server";
import { getStats } from "@/lib/stats";

// 최근 7일 집계. STATS_TOKEN 환경변수를 설정하고 ?token=... 으로 호출해야 열린다(미설정이면 404).
export async function GET(req: Request) {
  const secret = process.env.STATS_TOKEN;
  if (!secret || !redis) return new NextResponse(null, { status: 404 });
  if (new URL(req.url).searchParams.get("token") !== secret) return new NextResponse(null, { status: 401 });

  return NextResponse.json(await getStats());
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
