"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SHOW_STORES } from "@/lib/flags";

const tabs = [
  { href: "/", label: "시세", icon: "💰" },
  { href: "/stores", label: "착한매장", icon: "🏪" },
  { href: "/report", label: "제보", icon: "✍️" },
  { href: "/scams", label: "사기주의", icon: "🚨" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur">
      {tabs.filter((t) => SHOW_STORES || t.href !== "/stores").map((t) => {
        const active = t.href === "/" ? path === "/" || path.startsWith("/prices") : path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={`flex flex-1 flex-col items-center py-2 text-xs ${active ? "font-bold text-teal-700" : "text-slate-500"}`}>
            <span className="text-xl leading-none">{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
