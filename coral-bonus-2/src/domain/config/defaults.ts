import type {HotelRule, RulesConfig} from '../types'

export const DEFAULT_RULES: RulesConfig = {
    scope: {country: 'UNKNOWN'},
    base: {percent: 0},
    welcome: {newUserAmount: 0},
    starsBonus: {},
    promotions: [],
}

export const DEFAULT_HOTEL_RULES: HotelRule[] = []
