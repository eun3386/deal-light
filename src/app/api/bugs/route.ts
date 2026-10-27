import { after, NextResponse } from "next/server";
import { allow, notifyDiscord, redis } from "@/lib/server";

const KEY = "bugs";
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// 연락처가 들어오므로 공개 GET은 두지 않음. Upstash 콘솔(Data Browser)의 `bugs` 키에서 확인.
export async function POST(req: Request) {
  if (!redis) return NextResponse.json({ error: "storage not configured" }, { status: 503 });
  if (!(await allow(req, "bug", 3))) return NextResponse.json({ error: "too many requests" }, { status: 429 });

  const b = await req.json().catch(() => null);
  const message = str(b?.message, 1000);
  const kind = b?.kind === "idea" ? "idea" : "bug";
  if (message.length < 5) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const row = {
    id: crypto.randomUUID(),
    kind,
    message,
    contact: str(b?.contact, 100) || undefined,
    page: str(b?.page, 200) || undefined,
    userAgent: str(b?.userAgent, 300) || undefined,
    createdAt: new Date().toISOString(),
  };
  await redis.lpush(KEY, row);
  await redis.ltrim(KEY, 0, 999);
  after(() =>
    notifyDiscord(
      [
        `${kind === "bug" ? "🐞 오류 신고" : "💡 의견"}`,
        message,
        row.page ? `화면: ${row.page}` : "",
        row.contact ? `연락처: ${row.contact}` : "",
      ].filter(Boolean).join("\n"),
    ),
  );
  return NextResponse.json({ ok: true });
}
