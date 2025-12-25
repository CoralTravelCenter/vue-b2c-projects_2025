import dayjs from 'dayjs'

export function isActiveByDate(
    now: Date,
    from?: string,
    until?: string,
): boolean {
    const current = dayjs(now)

    if (from) {
        const start = dayjs(from, 'YYYY-MM-DD').startOf('day')
        if (current.isBefore(start)) return false
    }

    if (until) {
        const end = dayjs(until, 'YYYY-MM-DD').endOf('day')
        if (current.isAfter(end)) return false
    }

    return true
}
