"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllReviews, getCategories, getStores } from "@/lib/data";
import type { Review, Store } from "@/lib/types";
import MarketMap from "@/components/MarketMap";

export default function Stores() {
  const [floor, setFloor] = useState<1 | 2>(1);
  const [sel, setSel] = useState<Store>();
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => { getAllReviews().then(setReviews); }, []);
  const stores = getStores();
  const cats = getCategories();
  const rating = (id: string) => {
    const r = reviews.filter((x) => x.storeId === id);
    return r.length ? { avg: r.reduce((a, b) => a + b.rating, 0) / r.length, n: r.length } : null;
  };

  return (
    <main className="space-y-4 p-4">
      <h1 className="text-xl font-bold">🏪 한시장 착한 정찰제 매장</h1>
      <p className="rounded-lg bg-amber-50 p-2 text-[11px] text-amber-800">⚠️ 현재 매장 정보는 <b>샘플 데이터</b>예요. 실제 방문 후기로 계속 채워가요.</p>
      <div className="flex gap-2">
        {([1, 2] as const).map((f) => (
          <button key={f} onClick={() => { setFloor(f); setSel(undefined); }} className={`flex-1 rounded-full py-2 text-sm font-bold ${floor === f ? "bg-teal-600 text-white" : "bg-slate-100"}`}>{f}층</button>
        ))}
      </div>
      <MarketMap floor={floor} stores={stores} selected={sel?.id} onSelect={setSel} />
      <div className="flex gap-3 text-[11px]"><span>🟢 정찰제</span><span>🟠 흥정 가능</span></div>
      {sel && (
        <Link href={`/stores/${sel.id}`} className="block rounded-xl border-2 border-teal-600 p-3">
          <b>{sel.number} · {sel.name}</b>
          <p className="text-xs text-slate-500">{sel.description}</p>
          <p className="mt-1 text-xs text-teal-700">상세·리뷰 보기 →</p>
        </Link>
      )}
      <ul className="space-y-2">
        {stores.filter((s) => s.floor === floor).map((s) => {
          const r = rating(s.id);
          return (
            <li key={s.id}>
              <Link href={`/stores/${s.id}`} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div>
                  <p className="text-sm font-bold">{s.number} · {s.name}</p>
                  <p className="text-xs text-slate-500">{s.categories.map((c) => cats.find((x) => x.id === c)?.emoji).join(" ")} {s.description}</p>
                </div>
                <div className="text-right text-xs">
                  <span className={`rounded-full px-2 py-0.5 ${s.fixedPrice ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{s.fixedPrice ? "정찰제" : "흥정"}</span>
                  {r && <p className="mt-1">⭐ {r.avg.toFixed(1)} ({r.n})</p>}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
