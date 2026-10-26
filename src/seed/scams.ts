import type { Scam } from "@/lib/types";

export const scams: Scam[] = [
  { id: "c1", severity: 3, title: "저울 속이기", summary: "과일을 올릴 때 저울을 손으로 누르거나, 저울 바늘이 0이 아닌 상태로 시작해요.", tip: "눈앞에서 0 확인 → 직접 사진 찍기. 가능하면 봉지 단위 가격을 먼저 물어보세요." },
  { id: "c2", severity: 3, title: "밑장빼기", summary: "시식·고른 과일 대신 상태 나쁜 걸 몰래 바꿔 담아줘요.", tip: "봉지를 받은 뒤 바로 내용물 확인. 고른 물건에서 눈을 떼지 마세요." },
  { id: "c3", severity: 2, title: "택시 잔돈/미터기", summary: "미터기 조작, 고액권 내면 잔돈 안 주거나 지폐를 바꿔치기해요.", tip: "그랩(Grab) 앱 이용, 소액권 준비, 지폐 단위(0 개수) 꼭 확인." },
  { id: "c4", severity: 2, title: "환전 사기", summary: "공항·길가 환전소의 불리한 환율 또는 계산기 조작.", tip: "금은방/은행 환전 이용, 계산기는 직접 눌러 확인." },
  { id: "c5", severity: 1, title: "마사지 팁 강요", summary: "끝난 뒤 팁을 강하게 요구하거나 추가 코스를 끼워 팔아요.", tip: "시작 전 코스·가격·팁 포함 여부를 확인하세요." },
  { id: "c6", severity: 1, title: "사진 찍고 돈 요구", summary: "과일 광주리를 쥐여주고 사진 찍은 뒤 비용을 요구해요.", tip: "받지 말고 정중히 'No' 하고 지나가세요." },
];
