"use client";
import Link from "next/link";
import { getScams } from "@/lib/data";

export default function ScamBanner() {
  const s = getScams()[0];
  return (
    <Link href="/scams" className="sticky top-0 z-20 flex items-center gap-2 bg-red-600 px-4 py-2 text-xs text-white">
      <span>🚨</span>
      <span className="truncate"><b>{s.title}</b> · {s.summary}</span>
    </Link>
  );
}
