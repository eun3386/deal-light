import { NextResponse } from "next/server";
import { getStore } from "@/lib/data";
import { allow, redis } from "@/lib/server";
import type { Review } from "@/lib/types";

const KEY = "reviews";

export async function GET() {
  if (!redis) return NextResponse.json({ error: "storage not configured" }, { status: 503 });
  const rows = await redis.lrange<Review>(KEY, 0, 999);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!redis) return NextResponse.json({ error: "storage not configured" }, { status: 503 });
  if (!(await allow(req, "review", 4))) return NextResponse.json({ error: "too many requests" }, { status: 429 });

  const b = await req.json().catch(() => null);
  const store = typeof b?.storeId === "string" ? getStore(b.storeId) : undefined;
  const rating = Number(b?.rating);
  const content = typeof b?.content === "string" ? b.content.trim().slice(0, 300) : "";
  if (!store || !Number.isInteger(rating) || rating < 1 || rating > 5 || !content) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const row: Review = { id: crypto.randomUUID(), storeId: store.id, rating, content, createdAt: new Date().toISOString() };
  await redis.lpush(KEY, row);
  await redis.ltrim(KEY, 0, 1999);
  return NextResponse.json({ ok: true });
}
