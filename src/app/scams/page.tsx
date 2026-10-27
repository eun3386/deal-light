import { getScams } from "@/lib/data";

const sev = { 1: "주의", 2: "경계", 3: "위험" } as const;

export default function Scams() {
  return (
    <main className="space-y-3 p-4">
      <h1 className="text-xl font-bold">🚨 바가지·사기 수법</h1>
      <p className="text-sm text-slate-500">다낭에서 자주 보고되는 수법이에요. 알고 있으면 대부분 피할 수 있어요.</p>
      {getScams().map((s) => (
        <article key={s.id} className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-center justify-between"><h2 className="font-bold text-red-700">{s.title}</h2><span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] text-white">{sev[s.severity]}</span></div>
          <p className="mt-1 text-sm text-slate-700">{s.summary}</p>
          <p className="mt-2 rounded-lg bg-white p-2 text-xs text-teal-800">✅ {s.tip}</p>
        </article>
      ))}
    </main>
  );
}
