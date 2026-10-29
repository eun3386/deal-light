import Link from "next/link";
import { SHOW_STORES } from "@/lib/flags";

export default function StoresLayout({ children }: { children: React.ReactNode }) {
  if (SHOW_STORES) return children;
  return (
    <main className="space-y-3 p-6 text-center">
      <div className="text-5xl">🏪</div>
      <h1 className="text-xl font-bold">착한매장은 준비 중이에요</h1>
      <p className="text-sm text-slate-500">정찰제 매장을 직접 확인해서 곧 알려드릴게요.</p>
      <Link href="/" className="block rounded-xl bg-teal-600 py-3 text-sm font-bold text-white">시세 보러 가기</Link>
    </main>
  );
}
