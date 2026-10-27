"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getCategories, getItems, getReports, effectiveAvg } from "@/lib/data";
import type { Report } from "@/lib/types";
import PriceBar from "@/components/PriceBar";

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const cat = getCategories().find((c) => c.id === category);
  const [reports, setReports] = useState<Report[]>([]);
  useEffect(() => { getReports().then(setReports); }, []);
  if (!cat) return <main className="p-4">카테고리를 찾을 수 없어요. <Link href="/" className="underline">홈으로</Link></main>;
  const items = getItems().filter((i) => i.categoryId === cat.id);

  return (
    <main className="space-y-4 p-4">
      <Link href="/" className="text-sm text-slate-500">← 뒤로</Link>
      <h1 className="text-xl font-bold">{cat.emoji} {cat.name} 시세</h1>
      <div className="flex gap-3 text-[11px]"><span>🟢 적정</span><span>🟡 조금 비쌈</span><span>🔴 호구주의</span></div>
      {items.map((it) => {
        const { avg, count } = effectiveAvg(it, reports);
        return (
          <div key={it.id} className="rounded-xl border border-slate-200 p-3">
            <div className="mb-2 flex justify-between text-sm"><b>{it.name}</b><span className="text-slate-500">{it.unit}</span></div>
            <PriceBar item={it} avg={avg} />
            {it.note && <p className="mt-1 text-[11px] text-amber-700">💡 {it.note}</p>}
            {count > 0 && <p className="text-[11px] text-teal-700">유저 제보 {count}건 반영</p>}
          </div>
        );
      })}
      <Link href="/report" className="block rounded-xl bg-teal-600 py-3 text-center text-sm font-bold text-white">여기 없는 가격 제보하기</Link>
    </main>
  );
}
