export function parseJsonAttr<T>(raw: string | null, fallback: T): T {
    if (!raw) return fallback
    const text = raw.trim()
    if (!text) return fallback

    try {
        return JSON.parse(text) as T
    } catch {
        return fallback
    }
}
