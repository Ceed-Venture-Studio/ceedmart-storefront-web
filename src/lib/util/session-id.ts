const KEY = "ceedmart_session_id"

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return ""
  try {
    const existing = window.localStorage.getItem(KEY)
    if (existing) return existing
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `anon-${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 10)}`
    window.localStorage.setItem(KEY, id)
    return id
  } catch {
    return ""
  }
}
