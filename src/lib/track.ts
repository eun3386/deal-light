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

/** ?ignore=1 로 한 번 접속한 브라우저(운영자 본인)는 집계에서 제외 */
export function setIgnored(on: boolean) {
  try {
    if (on) localStorage.setItem("dl_ignore", "1");
    else localStorage.removeItem("dl_ignore");
  } catch {}
}

export function track(event: string) {
  try {
    if (localStorage.getItem("dl_ignore")) return;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, vid: vid() }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
