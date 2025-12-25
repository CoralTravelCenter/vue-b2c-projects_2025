import type {Stars} from './input'

export type DateISO = string // 'YYYY-MM-DD' (без времени)

export type RulesConfig = {
    scope: {
        country: string // "EG" | "TR" | ... (то, что задаём в rules)
    }

    base?: {
        percent?: number // 1 => 1%
    }

    welcome?: {
        newUserAmount?: number // фикс для новых
    }

    starsBonus?: Partial<Record<Stars, number>> // {3:3000,4:4000,5:5000}

    promotions?: Array<{
        code: string
        title?: string
        amount: number
        from?: DateISO
        until?: DateISO
    }>
}

// hotel-rules атрибут
export type HotelRule = {
    code: string
    title?: string
    from?: DateISO
    until?: DateISO

    match: {
        hotelIds?: string[]       // ["134", ...]
        stars?: Stars[]           // [4,5]
    }

    bonus: {
        amount?: number           // +1000
        percent?: number          // +1 (% от цены)
    }
}
