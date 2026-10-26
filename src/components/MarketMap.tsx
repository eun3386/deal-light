"use client";
import type { Store } from "@/lib/types";

export default function MarketMap({ floor, stores, selected, onSelect }: { floor: 1 | 2; stores: Store[]; selected?: string; onSelect: (s: Store) => void }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-amber-50">
      {/* 단순화한 구역도: 통로와 구역 */}
      <div className="absolute inset-3 grid grid-cols-3 grid-rows-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-dashed border-amber-300 bg-amber-100/60" />
        ))}
      </div>
      <div className="absolute left-2 top-2 rounded bg-white/80 px-2 py-0.5 text-[10px] text-slate-500">{floor}층 (개략도)</div>
      {stores.filter((s) => s.floor === floor).map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s)}
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white px-1.5 py-0.5 text-[10px] font-bold shadow ${s.id === selected ? "scale-125 bg-teal-700 text-white" : s.fixedPrice ? "bg-emerald-500 text-white" : "bg-amber-400 text-slate-900"}`}
        >
          {s.number.split("-")[1]}
        </button>
      ))}
    </div>
  );
}
