import { categories } from "@/seed/categories";
import { items } from "@/seed/items";
import { stores } from "@/seed/stores";
import { scams } from "@/seed/scams";
import type { Item, Report, Review } from "./types";

// 정적 콘텐츠(카테고리/품목/매장/스캠)는 src/seed 에서 관리.
// 유저 제보(reports)·리뷰(reviews)는 /api (Upstash Redis)가 설정되면 서버, 아니면 localStorage.
export const getCategories = () => categories;
export const getItems = () => items;
export const getItem = (id: string) => items.find((i) => i.id === id);
export const getStores = () => stores;
export const getStore = (id: string) => stores.find((s) => s.id === id);
export const getScams = () => scams;

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

/** 서버 저장소(API) 사용 가능하면 그 결과, 미설정(503)/네트워크 오류면 null → localStorage 대체 */
async function remoteGet<T>(path: string): Promise<T[] | null> {
  try {
    const res = await fetch(path, { cache: "no-store" });
    return res.ok ? ((await res.json()) as T[]) : null;
  } catch {
    return null;
  }
}

/** true: 서버에 저장됨, false: 서버 미사용(로컬로 저장해야 함). 입력 오류/제한은 throw */
async function remotePost(path: string, body: unknown): Promise<boolean> {
  let res: Response;
  try {
    res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } catch {
    return false;
  }
  if (res.ok) return true;
  if (res.status === 503) return false;
  if (res.status === 429) throw new Error("너무 자주 제보했어요. 잠시 후 다시 시도해주세요.");
  if (res.status === 422) throw new Error("시세와 너무 동떨어진 가격이에요. 가격·수량을 다시 확인해주세요.");
  throw new Error("저장하지 못했어요. 입력값을 확인해주세요.");
}

export async function getReports(): Promise<Report[]> {
  return (await remoteGet<Report>("/api/reports")) ?? lsGet<Report>(LS_REPORTS);
}

export async function addReport(input: Omit<Report, "id" | "createdAt">): Promise<void> {
  if (await remotePost("/api/reports", input)) return;
  lsAdd<Report>(LS_REPORTS, { ...input, id: uid(), createdAt: new Date().toISOString() });
}

export async function getAllReviews(): Promise<Review[]> {
  return (await remoteGet<Review>("/api/reviews")) ?? lsGet<Review>(LS_REVIEWS);
}

export async function getReviews(storeId: string): Promise<Review[]> {
  return (await getAllReviews()).filter((r) => r.storeId === storeId);
}

export async function addReview(input: Omit<Review, "id" | "createdAt">): Promise<void> {
  if (await remotePost("/api/reviews", input)) return;
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
