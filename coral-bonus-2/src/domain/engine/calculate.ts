import type {BreakdownItem, CalcResult, HotelRule, NormalizedInput, RulesConfig, Stars} from '../types'
import {isActiveByDate} from './date'
import {hotelRuleMatches} from './match'

function toNumber(x: any, fallback = 0) {
    const n = Number(x)
    return Number.isFinite(n) ? n : fallback
}

function percentOf(value: number, percent: number) {
    if (!Number.isFinite(value) || value <= 0) return 0
    if (!Number.isFinite(percent) || percent <= 0) return 0
    return Math.floor(value * (percent / 100))
}

function starsBonusAmount(stars: Stars | null, table: RulesConfig['starsBonus']) {
    if (!stars || !table) return 0
    return toNumber((table as any)[stars], 0)
}

export function calculateResult(
    rules: RulesConfig,
    hotelRules: HotelRule[],
    input: NormalizedInput,
): CalcResult {
    const items: BreakdownItem[] = []

    const price = Math.max(0, toNumber(input.priceRub, 0))

    // 1) base percent
    const basePercent = Math.max(0, toNumber(rules.base?.percent, 0))
    const baseRub = percentOf(price, basePercent)
    if (baseRub > 0) {
        items.push({
            code: 'BASE_PERCENT',
            title: `${basePercent}% от стоимости`,
            amountRub: baseRub,
            meta: {percent: basePercent, priceRub: price},
        })
    }

    // 2) stars bonus
    const starsRub = starsBonusAmount(input.hotelStars, rules.starsBonus)
    if (starsRub > 0 && input.hotelStars) {
        items.push({
            code: `STARS_${input.hotelStars}`,
            title: `Бонус за отель ${input.hotelStars}*`,
            amountRub: starsRub,
            meta: {stars: input.hotelStars},
        })
    }

    // 3) welcome new user
    const welcomeAmount = Math.max(0, toNumber(rules.welcome?.newUserAmount, 0))
    const welcomeRub = input.isNewUser ? welcomeAmount : 0
    if (welcomeRub > 0) {
        items.push({
            code: 'WELCOME',
            title: 'Приветственные бонусы (новый пользователь)',
            amountRub: welcomeRub,
        })
    }

    // 4) promotions
    if (Array.isArray(rules.promotions)) {
        for (const p of rules.promotions) {
            if (!p?.code) continue
            if (!isActiveByDate(input.now, p.from, p.until)) continue

            const amount = Math.max(0, toNumber(p.amount, 0))
            if (amount <= 0) continue

            items.push({
                code: `PROMO:${p.code}`,
                title: p.title ? p.title : `Акция ${p.code}`,
                amountRub: amount,
                meta: {from: p.from, until: p.until, code: p.code},
            })
        }
    }

    // 5) hotelRules (фикс + %), суммируются
    for (const r of hotelRules ?? []) {
        if (!r?.code) continue
        if (!hotelRuleMatches(r, input)) continue

        const fixed = Math.max(0, toNumber(r.bonus?.amount, 0))
        const pct = Math.max(0, toNumber(r.bonus?.percent, 0))
        const pctRub = percentOf(price, pct)
        const totalRuleRub = fixed + pctRub

        if (totalRuleRub <= 0) continue

        items.push({
            code: `HOTEL_RULE:${r.code}`,
            title: r.title ? r.title : `Правило отеля ${r.code}`,
            amountRub: totalRuleRub,
            meta: {ruleCode: r.code, fixed, percent: pct, percentRub: pctRub},
        })
    }

    const amountRub = items.reduce((sum, x) => sum + x.amountRub, 0)
    return {amountRub, items}
}
