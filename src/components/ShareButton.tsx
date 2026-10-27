"use client";
import { useState } from "react";

function legacyCopy(s: string) {
  const ta = document.createElement("textarea");
  ta.value = s;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  return ok;
}

export default function ShareButton({ text = "다낭 한시장 갈 때 보려고 만든 시세표예요 👇" }: { text?: string }) {
  const [msg, setMsg] = useState("");
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };
  async function share() {
    const url = location.origin;
    const full = `${text}\n${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "딜라이트 · 다낭 시세 요정", text, url });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return; // 사용자가 공유창을 닫음
      }
    }
    try {
      await navigator.clipboard.writeText(full);
      return flash("링크가 복사됐어요 ✅");
    } catch {}
    flash(legacyCopy(full) ? "링크가 복사됐어요 ✅" : `복사하지 못했어요. 주소를 직접 공유해주세요: ${url}`);
  }
  return (
    <button onClick={share} className="w-full rounded-xl bg-yellow-300 py-3 text-sm font-bold text-slate-900 active:scale-95">
      {msg || "💬 다낭 가는 친구에게 시세표 공유하기"}
    </button>
  );
}
