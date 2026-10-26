export const KRW_PER_VND = 1 / 18; // 대략적인 환율, 필요 시 조정

export const vnd = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}동`;

export const krw = (n: number) =>
  `약 ${(Math.round((n * KRW_PER_VND) / 100) * 100).toLocaleString("ko-KR")}원`;

export const man = (n: number) =>
  n >= 10000 ? `${+(n / 10000).toFixed(1)}만동` : vnd(n);
