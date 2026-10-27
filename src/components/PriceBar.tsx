import type { Item } from "@/lib/types";
import { krw, man } from "@/lib/format";

export default function PriceBar({ item, avg }: { item: Item; avg: number }) {
  const max = item.ripoff * 1.3;
  const pct = (v: number) => `${Math.min(100, (v / max) * 100)}%`;
  return (
    <div>
      <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="absolute inset-y-0 left-0 bg-emerald-400" style={{ width: pct(avg) }} />
        <div className="absolute inset-y-0 bg-amber-300" style={{ left: pct(avg), width: `calc(${pct(item.ripoff)} - ${pct(avg)})` }} />
        <div className="absolute inset-y-0 right-0 bg-red-400" style={{ left: pct(item.ripoff) }} />
        <div className="absolute inset-y-0 w-0.5 bg-slate-700" style={{ left: pct(item.min) }} />
      </div>
      <div className="mt-1 grid grid-cols-3 text-[11px] text-slate-600">
        <span>최저 <b className="text-emerald-700">{man(item.min)}</b></span>
        <span className="text-center">평균 <b className="text-slate-900">{man(avg)}</b></span>
        <span className="text-right">호구 <b className="text-red-600">{man(item.ripoff)}~</b></span>
      </div>
      <div className="text-right text-[10px] text-slate-400">평균 {krw(avg)}</div>
      <p className={`mt-1 text-[10px] ${item.src ? "text-slate-400" : "text-amber-600"}`}>
        {item.src ? `근거: ${item.src}` : "⚠️ 검증 전 추정치 · 제보로 보정돼요"}
      </p>
    </div>
  );
}
