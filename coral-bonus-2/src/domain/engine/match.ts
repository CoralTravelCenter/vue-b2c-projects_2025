import type {HotelRule, NormalizedInput} from '../types'
import {isActiveByDate} from './date'

export function hotelRuleMatches(rule: HotelRule, input: NormalizedInput): boolean {
    if (!isActiveByDate(input.now, rule.from, rule.until)) return false

    // match hotelIds
    if (rule.match.hotelIds?.length) {
        if (!input.hotelId) return false
        const set = new Set(rule.match.hotelIds.map(String))
        if (!set.has(String(input.hotelId))) return false
    }

    // match stars
    if (rule.match.stars?.length) {
        if (!input.hotelStars) return false
        if (!rule.match.stars.includes(input.hotelStars)) return false
    }

    return true
}
