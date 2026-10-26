import { categories } from "@/seed/categories";
import { items } from "@/seed/items";
import { stores } from "@/seed/stores";
import { scams } from "@/seed/scams";
import { supabase } from "./supabase";
import type { Item, Location, Report, Review } from "./types";

// 정적 콘텐츠(카테고리/품목/매장/스캠)는 src/seed 에서 관리.
// 유저 제보(reports)·리뷰(reviews)는 Supabase가 설정되면 DB, 아니면 localStorage.
export const getCategories = () => categories;
export const getItems = () => items;
export const getItem = (id: string) => items.find((i) => i.id === id);
export const getStores = () => stores;
export const getStore = (id: string) => stores.find((s) => s.id === id);
export const getScams = () => scams;
export const isRemote = () => supabase !== null;

const LS_REPORTS = "dl_reports";
const LS_REVIEWS = "dl_reviews";

function lsGet<T>(k: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(k) ?? "[]");
  } catch {
    return [];
  }
}
function lsAdd<T>(k: string, v: T) {
  try {
    localStorage.setItem(k, JSON.stringify([v, ...lsGet<T>(k)].slice(0, 500)));
  } catch {}
}
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

type ReportRow = { id: string; item_id: string; price: number; quantity: number; store_number: string | null; location: Location; created_at: string };
type ReviewRow = { id: string; store_id: string; rating: number; content: string; created_at: string };

export async function getReports(): Promise<Report[]> {
  if (supabase) {
    const { data } = await supabase.from("reports").select("*").order("created_at", { ascending: false }).limit(1000);
    return ((data ?? []) as ReportRow[]).map((r) => ({
      id: r.id, itemId: r.item_id, price: r.price, quantity: r.quantity,
      storeNumber: r.store_number ?? undefined, location: r.location, createdAt: r.created_at,
    }));
  }
  return lsGet<Report>(LS_REPORTS);
}

export async function addReport(input: Omit<Report, "id" | "createdAt">): Promise<void> {
  if (supabase) {
    await supabase.from("reports").insert({
      item_id: input.itemId, price: input.price, quantity: input.quantity,
      store_number: input.storeNumber ?? null, location: input.location,
    });
    return;
  }
  lsAdd<Report>(LS_REPORTS, { ...input, id: uid(), createdAt: new Date().toISOString() });
}

export async function getReviews(storeId: string): Promise<Review[]> {
  if (supabase) {
    const { data } = await supabase.from("reviews").select("*").eq("store_id", storeId).order("created_at", { ascending: false });
    return ((data ?? []) as ReviewRow[]).map((r) => ({
      id: r.id, storeId: r.store_id, rating: r.rating, content: r.content, createdAt: r.created_at,
    }));
  }
  return lsGet<Review>(LS_REVIEWS).filter((r) => r.storeId === storeId);
}

export async function getAllReviews(): Promise<Review[]> {
  if (supabase) {
    const { data } = await supabase.from("reviews").select("*").limit(1000);
    return ((data ?? []) as ReviewRow[]).map((r) => ({
      id: r.id, storeId: r.store_id, rating: r.rating, content: r.content, createdAt: r.created_at,
    }));
  }
  return lsGet<Review>(LS_REVIEWS);
}

export async function addReview(input: Omit<Review, "id" | "createdAt">): Promise<void> {
  if (supabase) {
    await supabase.from("reviews").insert({ store_id: input.storeId, rating: input.rating, content: input.content });
    return;
  }
  lsAdd<Review>(LS_REVIEWS, { ...input, id: uid(), createdAt: new Date().toISOString() });
}

/** 시드 평균에 유저 제보(중앙값)를 가중 반영한 유효 시세 */
export function effectiveAvg(item: Item, reports: Report[]) {
  const unit = reports
    .filter((r) => r.itemId === item.id && r.quantity > 0)
    .map((r) => r.price / r.quantity)
    .sort((a, b) => a - b);
  const n = unit.length;
  if (!n) return { avg: item.avg, count: 0 };
  const median = unit[Math.floor(n / 2)];
  const w = Math.min(n, 10) / (Math.min(n, 10) + 3);
  return { avg: Math.round(item.avg * (1 - w) + median * w), count: n };
}

export function searchItems(q: string): Item[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return items.filter((i) => [i.name, ...i.aliases].some((t) => t.toLowerCase().includes(s)));
}
