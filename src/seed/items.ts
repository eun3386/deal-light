import type { Item } from "@/lib/types";

// ⚠️ 출시 전 현지 후기/카페 시세로 반드시 검증·갱신하세요. (VND 기준, 대략적인 초기값)
const i = (
  id: string,
  categoryId: string,
  name: string,
  unit: string,
  min: number,
  avg: number,
  ripoff: number,
  aliases: string[] = [],
  note?: string,
): Item => ({ id, categoryId, name, unit, min, avg, ripoff, aliases, note });

export const items: Item[] = [
  // 과일
  i("mango", "fruit", "애플망고", "1kg", 40000, 55000, 100000, ["망고", "mango", "xoài"], "무게를 직접 확인하세요"),
  i("mangosteen", "fruit", "망고스틴", "1kg", 50000, 70000, 130000, ["mangosteen", "măng cụt"]),
  i("durian", "fruit", "두리안", "1kg", 60000, 90000, 180000, ["durian", "sầu riêng"]),
  i("dragonfruit", "fruit", "용과", "1kg", 25000, 35000, 70000, ["dragon fruit", "thanh long"]),
  i("lychee", "fruit", "리치", "1kg", 40000, 60000, 120000, ["lychee", "vải"], "시즌(5~7월) 외엔 비쌈"),
  i("rambutan", "fruit", "람부탄", "1kg", 30000, 45000, 90000, ["rambutan", "chôm chôm"]),
  i("coconut", "fruit", "코코넛", "1개", 20000, 30000, 60000, ["coconut", "dừa"]),
  i("watermelon", "fruit", "수박", "1kg", 15000, 20000, 40000, ["watermelon", "dưa hấu"]),
  // 신발
  i("crocs", "shoes", "크록스(스타일)", "1켤레", 150000, 220000, 450000, ["crocs", "크록스"]),
  i("flipflop", "shoes", "슬리퍼/플립플롭", "1켤레", 80000, 120000, 250000, ["슬리퍼"]),
  i("sneakers", "shoes", "운동화", "1켤레", 300000, 450000, 900000, ["sneakers"]),
  i("sandals", "shoes", "여성 샌들", "1켤레", 120000, 180000, 350000, ["샌들"]),
  // 의류
  i("tshirt", "clothes", "티셔츠", "1벌", 80000, 120000, 250000, ["t-shirt", "티"]),
  i("dress", "clothes", "원피스", "1벌", 150000, 250000, 500000, ["dress"]),
  i("aodai", "clothes", "아오자이(맞춤)", "1벌", 700000, 1200000, 2500000, ["ao dai", "아오자이"], "원단/완성 기간에 따라 편차 큼"),
  i("hat", "clothes", "모자", "1개", 100000, 150000, 300000, ["hat", "cap"]),
  i("linen-pants", "clothes", "린넨 팬츠", "1벌", 120000, 180000, 350000, ["바지"]),
  // 라탄
  i("rattan-s", "rattan", "라탄백 (소)", "1개", 150000, 250000, 500000, ["rattan", "라탄백"]),
  i("rattan-m", "rattan", "라탄백 (중)", "1개", 250000, 400000, 800000, ["rattan"]),
  i("rattan-basket", "rattan", "라탄 바구니", "1개", 100000, 170000, 350000, ["basket", "바구니"]),
  i("rattan-hat", "rattan", "라탄 모자", "1개", 120000, 200000, 400000, ["rattan hat"]),
  // 기념품
  i("g7", "souvenir", "G7 커피", "1박스", 60000, 80000, 150000, ["g7", "커피"]),
  i("magnet", "souvenir", "마그넷", "1개", 15000, 25000, 50000, ["magnet", "자석"]),
  i("dried-mango", "souvenir", "건망고", "500g", 100000, 150000, 300000, ["dried mango"]),
  i("cashew", "souvenir", "캐슈넛", "500g", 120000, 180000, 350000, ["cashew", "견과"]),
  i("coffee-bean", "souvenir", "원두커피", "500g", 100000, 160000, 320000, ["coffee bean"]),
  i("lacquer", "souvenir", "칠기 소품", "1개", 80000, 150000, 350000, ["lacquer"]),
  // 마사지
  i("massage-60", "massage", "전신 마사지 60분", "1회", 250000, 350000, 600000, ["massage", "맛사지"], "팁 별도 강요 주의"),
  i("massage-90", "massage", "전신 마사지 90분", "1회", 350000, 500000, 800000, ["massage"]),
  i("foot-60", "massage", "발마사지 60분", "1회", 200000, 300000, 500000, ["foot massage", "풋"]),
  i("nail", "massage", "젤네일", "1회", 150000, 250000, 450000, ["nail", "네일"]),
  // 택시
  i("airport-city", "taxi", "공항 → 시내(그랩/택시)", "1회", 100000, 150000, 300000, ["airport", "공항", "grab"], "미터기/앱 가격 확인"),
  i("city-short", "taxi", "시내 단거리 택시", "1회", 30000, 50000, 150000, ["taxi"]),
  i("han-my-khe", "taxi", "한시장 → 미케비치", "1회", 60000, 90000, 200000, ["미케비치", "my khe"]),
  i("cyclo", "taxi", "씨클로 30분", "1회", 150000, 250000, 500000, ["cyclo", "시클로"]),
  // 먹거리
  i("banhmi", "food", "반미", "1개", 25000, 35000, 70000, ["banh mi", "bánh mì"]),
  i("pho", "food", "쌀국수", "1그릇", 40000, 60000, 120000, ["pho", "phở"]),
  i("bunCha", "food", "분짜", "1인", 45000, 65000, 130000, ["bun cha"]),
  i("beer", "food", "생맥주(로컬)", "1잔", 10000, 20000, 60000, ["bia hơi", "beer"]),
  i("sugarcane", "food", "사탕수수 주스", "1잔", 10000, 15000, 40000, ["sugarcane"]),
  i("seafood", "food", "해산물 (1인 기준)", "1인", 250000, 400000, 900000, ["seafood", "해산물"], "메뉴판에 가격 적힌 곳 이용"),
];
