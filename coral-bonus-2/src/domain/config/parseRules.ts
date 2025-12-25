import type {RulesConfig, Stars} from '../types'
import {DEFAULT_RULES} from './defaults'
import {parseJsonAttr} from './parseJsonAttr'

function toNumber(v: any, fallback = 0) {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
}

function normalizeStarsBonus(raw: any): Partial<Record<Stars, number>> {
    const out: Partial<Record<Stars, number>> = {}
    if (!raw || typeof raw !== 'object') return out
    const v3 = raw[3] ?? raw['3']
    const v4 = raw[4] ?? raw['4']
    const v5 = raw[5] ?? raw['5']
    if (v3 != null) out[3] = toNumber(v3, 0)
    if (v4 != null) out[4] = toNumber(v4, 0)
    if (v5 != null) out[5] = toNumber(v5, 0)
    return out
}

export function parseRules(raw: string | null | undefined): RulesConfig {
    const parsed = parseJsonAttr<Partial<RulesConfig>>(raw ?? null, {})

    const scopeCountry = String(parsed.scope?.country ?? DEFAULT_RULES.scope.country)
    const basePercent = toNumber(parsed.base?.percent, DEFAULT_RULES.base?.percent ?? 0)
    const welcomeNewUserAmount = toNumber(
        parsed.welcome?.newUserAmount,
        DEFAULT_RULES.welcome?.newUserAmount ?? 0,
    )
    const starsBonus = normalizeStarsBonus(parsed.starsBonus)

    const promotions = Array.isArray(parsed.promotions)
        ? parsed.promotions
            .map(p => ({
                code: String((p as any)?.code ?? ''),
                title: (p as any)?.title != null ? String((p as any).title) : undefined,
                amount: toNumber((p as any)?.amount, 0),
                from: (p as any)?.from != null ? String((p as any).from) : undefined,
                until: (p as any)?.until != null ? String((p as any).until) : undefined,
            }))
            .filter(p => p.code && p.amount > 0)
        : []

    return {
        scope: {country: scopeCountry},
        base: {percent: basePercent},
        welcome: {newUserAmount: welcomeNewUserAmount},
        starsBonus,
        promotions,
    }
}
