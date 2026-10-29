import { ImageResponse } from "next/og";

export const alt = "딜라이트 · 다낭 시세 요정";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "딜라이트";
const SUB = "다낭 시세 요정";
const LINE = "바가지 스트레스 없는 여행, 적정가부터 확인하세요";
const TAGS = "망고 · 크록스 · 라탄백 · 마사지 · 택시";

// satori는 한글 글꼴이 없으면 글자가 깨지므로, 쓰는 글자만 담은 Noto Sans KR을 가져온다
async function loadFont(text: string) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@800&text=${encodeURIComponent(text)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1" },
    })
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("font url not found");
  return (await fetch(url)).arrayBuffer();
}

export default async function Image() {
  const data = await loadFont(TITLE + SUB + LINE + TAGS);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 90px", background: "linear-gradient(135deg,#0f766e,#14b8a6)", color: "white", fontFamily: "Noto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <div style={{ fontSize: 150 }}>{TITLE}</div>
          <div style={{ fontSize: 52, opacity: 0.85 }}>{SUB}</div>
        </div>
        <div style={{ fontSize: 46, marginTop: 28 }}>{LINE}</div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 34, background: "rgba(255,255,255,0.18)", padding: "14px 28px", borderRadius: 999, alignSelf: "flex-start" }}>{TAGS}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Noto", data, weight: 800, style: "normal" }] },
  );
}
