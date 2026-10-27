# 딜라이트 (Deal-Light) · 다낭 시세 요정

다낭 한시장/야시장 바가지 예방 & 로컬 시세 검색 MVP (Next.js 15 + Tailwind + Upstash Redis 선택).

## 실행
```bash
npm install
npm run dev   # http://localhost:3000
```
저장소 환경변수가 없으면 제보/리뷰가 브라우저 localStorage에 저장됩니다(본인 기기에만 보임).

## 제보를 모두와 공유하기 (Upstash Redis)
1. Vercel 대시보드 → 프로젝트 → Storage → Upstash Redis 생성/연결 (환경변수 자동 주입)
2. 재배포. `/api/reports`, `/api/reviews`가 값을 저장합니다.
3. 로컬에서 쓰려면 `vercel env pull .env.local`

서버에서 IP당 분당 요청 제한과 값 범위 검사를 합니다. 시세와 너무 동떨어진 제보는 저장하지 않아요.

## 출시 전 꼭 할 일
- `src/seed/items.ts`에서 `src`가 없는 항목은 **검증 전 추정치**입니다(화면에도 표시됨). 후기·현지 확인으로 갱신하세요.
- `src/seed/stores.ts` 매장은 **샘플**입니다. 실제 매장 번호/이름/좌표로 교체하세요.
- `src/lib/format.ts`의 환율(`KRW_PER_VND`) 조정.
- 영수증 사진 인증, 카카오톡 SDK 공유(현재는 Web Share/링크 복사)는 다음 단계.
