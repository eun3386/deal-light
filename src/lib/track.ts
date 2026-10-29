// 방문자 ID는 브라우저에 저장된 임의 문자열일 뿐 개인을 식별하지 않는다.
function vid(): string {
  try {
    let v = localStorage.getItem("dl_vid");
    if (!v) {
      v = Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
      localStorage.setItem("dl_vid", v);
    }
    return v;
  } catch {
    return "anon" + Math.random().toString(36).slice(2, 10);
  }
}

export function track(event: string) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, vid: vid() }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
