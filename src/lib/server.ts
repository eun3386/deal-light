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

// 여러 프로젝트가 같은 디스코드 채널을 쓰므로 어느 프로젝트의 알림인지 이름을 붙인다
const PROJECT = "딜라이트";

/** 디스코드 웹훅 알림. DISCORD_WEBHOOK_URL이 없으면 아무것도 하지 않고, 실패해도 호출한 쪽에 영향 없음 */
export async function notifyDiscord(content: string): Promise<void> {
  const hook = process.env.DISCORD_WEBHOOK_URL;
  if (!hook) return;
  try {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: PROJECT, content: `**[${PROJECT}]** ${content}`.slice(0, 1900), allowed_mentions: { parse: [] } }),
    });
  } catch {}
}
