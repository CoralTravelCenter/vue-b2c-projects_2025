export default function parseGuardSelectors(raw?: string): string[] {
    if (!raw) return []

    return raw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
}
