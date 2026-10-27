"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { addReview, getReviews, getStore } from "@/lib/data";
import type { Review } from "@/lib/types";

export default function StoreDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const store = getStore(id);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => getReviews(id).then(setReviews);
  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!store) return <main className="p-4">매장을 찾을 수 없어요. <Link href="/stores" className="underline">목록으로</Link></main>;

  async function submit() {
    if (!content.trim()) return;
    setBusy(true);
    try {
      await addReview({ storeId: id, rating, content: content.trim().slice(0, 300) });
      setContent("");
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "리뷰를 저장하지 못했어요.");
    }
    setBusy(false);
  }

  return (
    <main className="space-y-4 p-4">
      <Link href="/stores" className="text-sm text-slate-500">← 목록</Link>
      <div>
        <h1 className="text-xl font-bold">{store.number} · {store.name}</h1>
        <p className="text-sm text-slate-500">{store.floor}층 · {store.fixedPrice ? "정찰제" : "흥정 가능"}</p>
        <p className="mt-2 text-sm">{store.description}</p>
      </div>
      <section className="space-y-2 rounded-2xl bg-slate-50 p-3">
        <h2 className="text-sm font-bold">리뷰 남기기</h2>
        <div className="flex gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setRating(n)} aria-label={`${n}점`}>{n <= rating ? "⭐" : "☆"}</button>)}
        </div>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="가격은 정직했나요? 어떤 걸 샀는지 알려주세요" className="h-20 w-full rounded-lg border border-slate-300 p-2 text-sm" />
        <button onClick={submit} disabled={busy || !content.trim()} className="w-full rounded-lg bg-teal-600 py-2 text-sm font-bold text-white disabled:opacity-40">등록</button>
        <p className="text-[10px] text-slate-400">영수증 사진 인증은 추후 추가 예정</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-sm font-bold">리뷰 {reviews.length}개</h2>
        {reviews.length === 0 && <p className="text-sm text-slate-400">아직 리뷰가 없어요. 첫 리뷰를 남겨주세요!</p>}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-200 p-3 text-sm">
            <p>{"⭐".repeat(r.rating)}</p>
            <p className="mt-1 whitespace-pre-wrap">{r.content}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
