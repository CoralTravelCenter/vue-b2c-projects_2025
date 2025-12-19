export default function parseGuardSelectors(raw: string): string[] {
    return raw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
}
