const STORAGE_KEY = "smm_connected_platforms"

export function getStoredConnections(): Record<string, Record<string, string>> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveStoredConnection(platformId: string, credentials: Record<string, string>) {
  if (typeof window === "undefined") return
  try {
    const current = getStoredConnections()
    current[platformId] = credentials
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // ignore
  }
}

export function removeStoredConnection(platformId: string) {
  if (typeof window === "undefined") return
  try {
    const current = getStoredConnections()
    delete current[platformId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // ignore
  }
}
