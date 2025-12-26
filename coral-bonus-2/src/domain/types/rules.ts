import type {Stars} from './input'

export type DateISO = string // 'YYYY-MM-DD' (без времени)

export type RulesConfig = {
    scope?: {
        country?: string
    }

    base?: {
        name: string
        percent: number
    }

    welcome?: {
        name: string
        amount: number
        url?: string
    }

    starsBonus?: {
        name: string
        values: Record<'3' | '4' | '5', number>
        url?: string
    }

    promotions?: Array<{
        name: string
        amount: number
        from?: string
        until?: string
        url?: string
    }>
}

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
