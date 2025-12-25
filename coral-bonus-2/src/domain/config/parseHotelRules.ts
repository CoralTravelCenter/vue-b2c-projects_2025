import type {HotelRule, Stars} from '../types'
import {DEFAULT_HOTEL_RULES} from './defaults'
import {parseJsonAttr} from './parseJsonAttr'

function toNumber(v: any, fallback = 0) {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
}

function normalizeStarsArray(raw: any): Stars[] | undefined {
    if (!Array.isArray(raw)) return undefined
    const out: Stars[] = []
    for (const x of raw) {
        const n = Number(x)
        if (n === 3 || n === 4 || n === 5) out.push(n as Stars)
    }
    return out.length ? out : undefined
}

export function parseHotelRules(raw: string | null | undefined): HotelRule[] {
    const parsed = parseJsonAttr<any>(raw ?? null, DEFAULT_HOTEL_RULES)
    if (!Array.isArray(parsed)) return DEFAULT_HOTEL_RULES

    return parsed
        .filter(r => r && typeof r === 'object')
        .map((r: any) => {
            const hotelIds = Array.isArray(r.match?.hotelIds)
                ? r.match.hotelIds.map((id: any) => String(id))
                : undefined

            const stars = normalizeStarsArray(r.match?.stars)

            const amount = toNumber(r.bonus?.amount, 0)
            const percent = toNumber(r.bonus?.percent, 0)

            return {
                code: String(r.code ?? ''),
                title: r.title != null ? String(r.title) : undefined,
                from: r.from != null ? String(r.from) : undefined,
                until: r.until != null ? String(r.until) : undefined,
                match: {
                    hotelIds: hotelIds?.length ? hotelIds : undefined,
                    stars,
                },
                bonus: {
                    amount: amount > 0 ? amount : undefined,
                    percent: percent > 0 ? percent : undefined,
                },
            } as HotelRule
        })
        .filter(r => r.code)
}
