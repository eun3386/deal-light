"use client";
import Link from "next/link";
import { useState } from "react";

export default function Feedback() {
  const [kind, setKind] = useState<"bug" | "idea">("bug");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const valid = message.trim().length >= 5;
  const field = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600";

  async function submit() {
    if (!valid) return;
    setBusy(true);
    setError("");
    try {
      // 직전에 보던 화면을 같이 보내 재현을 돕는다
      const page = document.referrer.startsWith(location.origin) ? new URL(document.referrer).pathname : undefined;
      const res = await fetch("/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, message, contact, page, userAgent: navigator.userAgent }),
      });
      if (res.ok) setDone(true);
      else if (res.status === 429) setError("너무 자주 보냈어요. 잠시 후 다시 시도해주세요.");
      else if (res.status === 503) setError("지금은 접수를 받을 수 없어요. 잠시 후 다시 시도해주세요.");
      else setError("보내지 못했어요. 내용을 5자 이상 적어주세요.");
    } catch {
      setError("네트워크 오류로 보내지 못했어요.");
    }
    setBusy(false);
  }

  if (done) {
    return (
      <main className="space-y-4 p-6 text-center">
        <div className="text-5xl">🙏</div>
        <h1 className="text-xl font-bold">알려주셔서 고마워요!</h1>
        <p className="text-sm text-slate-500">확인 후 고칠게요.</p>
        <Link href="/" className="block rounded-xl bg-teal-600 py-3 text-sm font-bold text-white">홈으로</Link>
      </main>
    );
  }

  return (
    <main className="space-y-4 p-4">
      <h1 className="text-xl font-bold">🐞 오류 신고 · 의견 보내기</h1>
      <p className="text-sm text-slate-500">안 되는 부분이나 아쉬운 점을 알려주세요. 익명으로 보내져요.</p>
      <div className="grid grid-cols-2 gap-2">
        {([["bug", "🐞 오류가 있어요"], ["idea", "💡 이런 게 있으면 좋겠어요"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setKind(k)} className={`rounded-lg border py-2.5 text-sm ${kind === k ? "border-teal-600 bg-teal-50 font-bold text-teal-700" : "border-slate-300 text-slate-500"}`}>{label}</button>
        ))}
      </div>
      <label className="block text-sm font-medium">내용
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} placeholder={kind === "bug" ? "어떤 화면에서 무엇을 눌렀더니 어떻게 됐나요?" : "어떤 기능이 있으면 좋을까요?"} className={`${field} mt-1 h-32`} />
      </label>
      <label className="block text-sm font-medium">연락처 (선택)
        <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={100} placeholder="답장이 필요하면 이메일·카톡 ID" className={`${field} mt-1`} />
      </label>
      <button onClick={submit} disabled={!valid || busy} className="w-full rounded-xl bg-teal-600 py-3 font-bold text-white disabled:opacity-40">{busy ? "보내는 중…" : "보내기"}</button>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </main>
  );
}
