import { redis } from "@/lib/server";

/** 최근 7일(한국 시간, 오늘 포함) 방문자·이벤트 집계 */
export async function getStats() {
  if (!redis) return null;
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
  return { visitors7d: visitors, returning7d: returning, returnRate: visitors ? +(returning / visitors).toFixed(3) : 0, daily };
}
