"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories, getReports, getScams, searchItems, effectiveAvg, getItems } from "@/lib/data";
import type { Report } from "@/lib/types";
import PriceBar from "@/components/PriceBar";
import ShareButton from "@/components/ShareButton";

export default function Home() {
  const [q, setQ] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  useEffect(() => { getReports().then(setReports); }, []);
  const results = searchItems(q);
  const cats = getCategories();
  const items = getItems();

  return (
    <main className="space-y-6 p-4">
      <header>
        <h1 className="text-xl font-extrabold text-teal-700">딜라이트 <span className="text-sm font-medium text-slate-500">다낭 시세 요정</span></h1>
        <p className="text-sm text-slate-500">바가지 스트레스 없는 여행, 적정가부터 확인하세요</p>
      </header>

      <div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 망고, 크록스, 라탄백, 마사지…" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600" />
        {q && (
          <div className="mt-3 space-y-3">
            {results.length === 0 && <p className="text-sm text-slate-400">검색 결과가 없어요. <Link href="/report" className="text-teal-700 underline">제보</Link>로 알려주세요!</p>}
            {results.map((it) => {
              const { avg, count } = effectiveAvg(it, reports);
              return (
                <div key={it.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex justify-between text-sm"><b>{it.name}</b><span className="text-slate-500">{it.unit}</span></div>
                  <PriceBar item={it} avg={avg} />
                  {count > 0 && <p className="mt-1 text-[11px] text-teal-700">유저 제보 {count}건 반영</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <section>
        <h2 className="mb-2 font-bold">오늘의 평균 시세</h2>
        <div className="grid grid-cols-4 gap-2">
          {cats.map((c) => (
            <Link key={c.id} href={`/prices/${c.id}`} className="flex flex-col items-center rounded-xl bg-slate-50 py-3 text-xs active:bg-teal-50">
              <span className="text-2xl">{c.emoji}</span>{c.name}
            </Link>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">등록 품목 {items.length}개 · 가격은 초기 추정치에 유저 제보가 반영돼요</p>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between"><h2 className="font-bold">🚨 바가지·사기 수법</h2><Link href="/scams" className="text-xs text-teal-700">전체보기</Link></div>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
          {getScams().map((s) => (
            <Link href="/scams" key={s.id} className="w-60 shrink-0 snap-start rounded-2xl bg-red-50 p-4">
              <p className="font-bold text-red-700">{s.title}</p>
              <p className="mt-1 text-xs text-slate-600">{s.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <Link href="/report" className="block rounded-2xl bg-teal-600 p-4 text-center text-sm font-bold text-white">내가 산 가격 제보하고 흥정 점수 받기 →</Link>
      <ShareButton />
    </main>
  );
}
