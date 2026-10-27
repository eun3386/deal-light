import { NextResponse } from "next/server";
import { getItem } from "@/lib/data";
import { allow, redis } from "@/lib/server";
import type { Report } from "@/lib/types";

const KEY = "reports";
const LOCATIONS = ["han", "night", "etc"];

export async function GET() {
  if (!redis) return NextResponse.json({ error: "storage not configured" }, { status: 503 });
  const rows = await redis.lrange<Report>(KEY, 0, 999);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!redis) return NextResponse.json({ error: "storage not configured" }, { status: 503 });
  if (!(await allow(req, "report"))) return NextResponse.json({ error: "too many requests" }, { status: 429 });

  const b = await req.json().catch(() => null);
  const item = typeof b?.itemId === "string" ? getItem(b.itemId) : undefined;
  const price = Number(b?.price);
  const quantity = Number(b?.quantity);
  if (!item || !LOCATIONS.includes(b?.location)) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (!(price >= 1000 && price <= 100_000_000) || !(quantity > 0 && quantity <= 1000)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // 단가가 시세 대비 터무니없으면 장난 제보로 보고 저장하지 않음
  const unit = price / quantity;
  if (unit < item.min * 0.2 || unit > item.ripoff * 4) return NextResponse.json({ error: "out of range" }, { status: 422 });

  const row: Report = {
    id: crypto.randomUUID(),
    itemId: item.id,
    price,
    quantity,
    storeNumber: typeof b.storeNumber === "string" ? b.storeNumber.trim().slice(0, 10) || undefined : undefined,
    location: b.location,
    createdAt: new Date().toISOString(),
  };
  await redis.lpush(KEY, row);
  await redis.ltrim(KEY, 0, 1999);
  return NextResponse.json({ ok: true });
}
