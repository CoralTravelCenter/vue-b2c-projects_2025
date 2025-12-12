export function safeParse<T>(raw: string, fallback: T): T {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw.replace(/'/g, '"')) as T
    } catch {
        return fallback;
    }
}
