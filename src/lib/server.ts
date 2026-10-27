import { Redis } from "@upstash/redis";

// Vercel 마켓플레이스(Upstash)는 KV_REST_API_*, 직접 만들면 UPSTASH_REDIS_REST_* 이름을 씁니다.
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

// 설정이 없으면 null → API는 503을 반환하고 클라이언트는 localStorage로 대체
export const redis = url && token ? new Redis({ url, token }) : null;

/** IP 기준 분당 요청 제한. 통과하면 true */
export async function allow(req: Request, bucket: string, max = 6): Promise<boolean> {
  if (!redis) return false;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const key = `rl:${bucket}:${ip}`;
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, 60);
  return n <= max;
}
