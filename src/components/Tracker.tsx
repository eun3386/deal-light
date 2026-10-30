"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { setIgnored, track } from "@/lib/track";

const PAGES: Record<string, string> = { "": "pv_home", prices: "pv_prices", report: "pv_report", scams: "pv_scams", stores: "pv_stores", feedback: "pv_feedback" };

/** 화면 이동마다 페이지뷰 이벤트를 남긴다 */
export default function Tracker() {
  const path = usePathname();
  useEffect(() => {
    const flag = new URLSearchParams(location.search).get("ignore");
    if (flag === "1" || flag === "0") setIgnored(flag === "1");
    const ev = PAGES[path.split("/")[1] ?? ""];
    if (ev) track(ev);
  }, [path]);
  return null;
}
