export default function resolveAutoShow(v?: string): false | number {
    if (v === undefined) return false
    if (v === '') return 0
    return Number(v)
}
