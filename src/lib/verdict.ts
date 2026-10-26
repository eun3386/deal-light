import type { Item } from "./types";

export type Verdict = {
  grade: "god" | "good" | "pricey" | "ripoff";
  title: string;
  message: string;
  emoji: string;
  percent: number; // 평균 대비 %
};

export function judge(item: Item, unitPrice: number, avg = item.avg): Verdict {
  const percent = Math.round((unitPrice / avg - 1) * 100);
  if (unitPrice <= item.min)
    return { grade: "god", emoji: "🏆", percent, title: "당신은 흥정의 신입니다!", message: "최저가급으로 사셨어요. 다낭 상인들이 떨고 있어요." };
  if (unitPrice <= avg * 1.1)
    return { grade: "good", emoji: "👍", percent, title: "적정가에 잘 사셨어요", message: "시세 범위 안이에요. 스트레스 없이 잘 쇼핑하셨네요." };
  if (unitPrice < item.ripoff)
    return { grade: "pricey", emoji: "😅", percent, title: "조금 비싸게 샀네요", message: "다음엔 더 깎아보세요! 나가는 척 한 번이면 효과 좋아요." };
  return { grade: "ripoff", emoji: "🚨", percent, title: "호구 주의!", message: "바가지 구간이에요. 이 제보가 다른 여행객에게 도움이 될 거예요." };
}

export const gradeColor = {
  god: "bg-emerald-100 text-emerald-800",
  good: "bg-green-100 text-green-800",
  pricey: "bg-amber-100 text-amber-800",
  ripoff: "bg-red-100 text-red-800",
} as const;
