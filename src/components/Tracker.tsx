"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/track";

const PAGES: Record<string, string> = { "": "pv_home", prices: "pv_prices", report: "pv_report", scams: "pv_scams", stores: "pv_stores", feedback: "pv_feedback" };

/** 화면 이동마다 페이지뷰 이벤트를 남긴다 */
export default function Tracker() {
  const path = usePathname();
  useEffect(() => {
    const ev = PAGES[path.split("/")[1] ?? ""];
    if (ev) track(ev);
  }, [path]);
  return null;
}
