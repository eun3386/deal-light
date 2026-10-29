"use client";
import { useMemo, useState } from "react";
import { addReport, getCategories, getItems, getItem, getReports, effectiveAvg } from "@/lib/data";
import { judge, gradeColor, type Verdict } from "@/lib/verdict";
import { vnd, krw } from "@/lib/format";
import type { Location } from "@/lib/types";
import ShareButton from "@/components/ShareButton";
import { track } from "@/lib/track";

export default function Report() {
  const [itemId, setItemId] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("1");
  const [store, setStore] = useState("");
  const [loc, setLoc] = useState<Location>("han");
  const [result, setResult] = useState<{ v: Verdict; unit: number; avg: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const cats = getCategories();
  const items = getItems();
  const item = useMemo(() => getItem(itemId), [itemId]);

  const p = Number(price.replace(/[^\d]/g, ""));
  const q = Number(qty);
  const valid = !!item && p > 0 && q > 0;

  async function submit() {
    if (!item || !valid) return;
    setBusy(true);
    setError("");
    try {
      const { avg } = effectiveAvg(item, await getReports());
      const unit = p / q;
      await addReport({ itemId: item.id, price: p, quantity: q, storeNumber: store.trim() || undefined, location: loc });
      setResult({ v: judge(item, unit, avg), unit, avg });
      track("report_submit");
    } catch (e) {
      setError(e instanceof Error ? e.message : "제보에 실패했어요.");
    }
    setBusy(false);
  }

  const field = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600";

  return (
    <main className="space-y-4 p-4">
      <h1 className="text-xl font-bold">✍️ 내가 산 가격 공유하기</h1>
      <p className="text-sm text-slate-500">익명으로 제보하고, 내 흥정 점수도 바로 확인하세요.</p>
      <label className="block text-sm font-medium">품목
        <select value={itemId} onChange={(e) => setItemId(e.target.value)} className={`${field} mt-1`}>
          <option value="">선택하세요</option>
          {cats.map((c) => (
            <optgroup key={c.id} label={`${c.emoji} ${c.name}`}>
              {items.filter((i) => i.categoryId === c.id).map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium">구매 가격(동)
          <input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="예: 50000" className={`${field} mt-1`} />
        </label>
        <label className="block text-sm font-medium">수량{item ? ` (${item.unit} 기준)` : ""}
          <input inputMode="decimal" value={qty} onChange={(e) => setQty(e.target.value)} className={`${field} mt-1`} />
        </label>
      </div>
      {p > 0 && <p className="-mt-2 text-xs text-slate-400">{vnd(p)} ≈ {krw(p)}</p>}
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium">매장 번호 (선택)
          <input value={store} onChange={(e) => setStore(e.target.value)} placeholder="예: 1F-A12" className={`${field} mt-1`} />
        </label>
        <label className="block text-sm font-medium">장소
          <select value={loc} onChange={(e) => setLoc(e.target.value as Location)} className={`${field} mt-1`}>
            <option value="han">한시장</option><option value="night">야시장</option><option value="etc">기타</option>
          </select>
        </label>
      </div>
      <button onClick={submit} disabled={!valid || busy} className="w-full rounded-xl bg-teal-600 py-3 font-bold text-white disabled:opacity-40">{busy ? "전송 중…" : "제보하고 점수 보기"}</button>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {result && item && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50" onClick={() => setResult(null)}>
          <div className="w-full max-w-md space-y-3 rounded-t-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-5xl">{result.v.emoji}</div>
              <h2 className="mt-2 text-xl font-extrabold">{result.v.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{result.v.message}</p>
            </div>
            <div className={`rounded-xl p-3 text-center text-sm ${gradeColor[result.v.grade]}`}>
              {item.name} {item.unit}당 <b>{vnd(result.unit)}</b> · 평균 대비 <b>{result.v.percent > 0 ? "+" : ""}{result.v.percent}%</b>
              <div className="text-xs opacity-80">현재 평균 {vnd(result.avg)}</div>
            </div>
            <ShareButton text={`나 ${item.name} ${vnd(result.unit)}에 샀어요 — ${result.v.title}`} />
            <button onClick={() => setResult(null)} className="w-full py-2 text-sm text-slate-500">닫기</button>
          </div>
        </div>
      )}
    </main>
  );
}
