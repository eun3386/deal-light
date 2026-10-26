import type { Store } from "@/lib/types";

// ⚠️ 샘플 데이터입니다. 실제 방문/리서치 후 매장 번호·이름·좌표를 교체하세요.
export const stores: Store[] = [
  { id: "s1", number: "1F-A12", name: "샘플 과일가게 A", floor: 1, x: 18, y: 25, categories: ["fruit"], fixedPrice: true, description: "가격표 부착 / 저울 확인 가능 (샘플)" },
  { id: "s2", number: "1F-A27", name: "샘플 과일가게 B", floor: 1, x: 40, y: 22, categories: ["fruit"], fixedPrice: true, description: "소량 구매 가능 (샘플)" },
  { id: "s3", number: "1F-B05", name: "샘플 건과일·견과", floor: 1, x: 70, y: 28, categories: ["souvenir"], fixedPrice: true, description: "시식 후 구매, 정찰제 (샘플)" },
  { id: "s4", number: "1F-B18", name: "샘플 커피·차", floor: 1, x: 82, y: 55, categories: ["souvenir"], fixedPrice: true, description: "G7·원두 정찰 (샘플)" },
  { id: "s5", number: "1F-C03", name: "샘플 반미·먹거리", floor: 1, x: 25, y: 70, categories: ["food"], fixedPrice: true, description: "메뉴판 가격 표시 (샘플)" },
  { id: "s6", number: "1F-C21", name: "샘플 분식 코너", floor: 1, x: 55, y: 75, categories: ["food"], fixedPrice: false, description: "한국어 메뉴판 있음 (샘플)" },
  { id: "s7", number: "2F-D02", name: "샘플 라탄 공방", floor: 2, x: 22, y: 30, categories: ["rattan"], fixedPrice: true, description: "정찰제 라탄백 (샘플)" },
  { id: "s8", number: "2F-D15", name: "샘플 라탄 스토어", floor: 2, x: 50, y: 25, categories: ["rattan"], fixedPrice: false, description: "2개 이상 구매 시 할인 (샘플)" },
  { id: "s9", number: "2F-E07", name: "샘플 의류 A", floor: 2, x: 75, y: 35, categories: ["clothes"], fixedPrice: true, description: "가격 태그 부착 (샘플)" },
  { id: "s10", number: "2F-E19", name: "샘플 아오자이", floor: 2, x: 30, y: 65, categories: ["clothes"], fixedPrice: false, description: "맞춤 아오자이 견적 투명 (샘플)" },
  { id: "s11", number: "2F-F04", name: "샘플 신발가게", floor: 2, x: 62, y: 68, categories: ["shoes"], fixedPrice: true, description: "정찰제 슬리퍼/샌들 (샘플)" },
  { id: "s12", number: "2F-F22", name: "샘플 잡화", floor: 2, x: 85, y: 70, categories: ["souvenir", "clothes"], fixedPrice: true, description: "마그넷·소품 정찰 (샘플)" },
];
