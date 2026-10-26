"use client";
import { useState } from "react";

export default function ShareButton({ text = "다낭 한시장 갈 때 보려고 만든 시세표예요 👇" }: { text?: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    const url = location.origin;
    try {
      if (navigator.share) return await navigator.share({ title: "딜라이트 · 다낭 시세 요정", text, url });
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {}
  }
  return (
    <button onClick={share} className="w-full rounded-xl bg-yellow-300 py-3 text-sm font-bold text-slate-900 active:scale-95">
      {done ? "링크가 복사됐어요 ✅" : "💬 다낭 가는 친구에게 시세표 공유하기"}
    </button>
  );
}
