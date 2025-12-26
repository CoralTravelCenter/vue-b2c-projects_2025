import type {RulesConfig} from '../types'

export function parseRules(raw: string | null | undefined): RulesConfig {
    if (!raw) return {}
    try {
        const obj = JSON.parse(raw)
        // лёгкая нормализация чисел (чтобы "3000" тоже ок)
        if (obj?.base) obj.base.percent = Number(obj.base.percent) || 0
        if (obj?.welcome) obj.welcome.amount = Number(obj.welcome.amount) || 0
        if (obj?.promotions?.length) {
            for (const p of obj.promotions) p.amount = Number(p.amount) || 0
        }

        // starsBonus.values числа
        if (obj?.starsBonus?.values) {
            for (const k of Object.keys(obj.starsBonus.values)) {
                obj.starsBonus.values[k] = Number(obj.starsBonus.values[k]) || 0
            }
        }

        return obj as RulesConfig
    } catch (e) {
        console.log('[coral-bonus] rules JSON parse error:', e)
        return {}
    }
}
