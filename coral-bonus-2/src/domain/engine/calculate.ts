import type {CalcResult, NormalizedInput, RulesConfig, UiLine} from '../types'
import {isActiveByDate} from './date'

function toNumber(x: any, fallback = 0) {
    const n = Number(x)
    return Number.isFinite(n) ? n : fallback
}

function percentOf(value: number, percent: number) {
    if (!Number.isFinite(value) || value <= 0) return 0
    if (!Number.isFinite(percent) || percent <= 0) return 0
    return Math.floor(value * (percent / 100))
}

export function calculateResult(rules: RulesConfig, input: NormalizedInput): CalcResult {
    const lines: UiLine[] = []
    const price = Math.max(0, toNumber(input.priceRub, 0))

    // итог всегда считаем отдельно (а не через lines)
    let totalAmountRub = 0

    const pushLine = (title: string | undefined, amountRub: number, url?: string) => {
        if (!title) return
        if (!amountRub || amountRub <= 0) return

        totalAmountRub += amountRub
        lines.push({title, amountRub, url})
    }

    // 0) scope
    if (rules.scope?.country && input.countryName !== rules.scope.country) {
        return {amountRub: 0, lines: []}
    }

    // 1) base (в UI показываем текст, в сумму добавляем рубли)
    if (rules.base?.name) {
        const pct = Math.max(0, toNumber(rules.base.percent, 0))
        const rub = percentOf(price, pct)

        if (rub > 0) {
            lines.push({
                title: rules.base.name,
                percent: rules.base.percent,
            })
            totalAmountRub += rub
        }
    }


    // 2) welcome (текст только из конфига)
    if (rules.welcome && input.isNewUser) {
        pushLine(
            rules.welcome.name,
            Math.max(0, toNumber(rules.welcome.amount, 0)),
            rules.welcome.url,
        )
    }

    // 3) starsBonus
    const stars = input.hotelStars // 3 | 4 | 5 | null
    const sb = rules.starsBonus

    if (stars && sb?.name && sb?.values) {
        const amount = Math.max(0, toNumber((sb.values as any)[String(stars)], 0))

        if (amount > 0) {
            lines.push({
                title: sb.name,      // "по акции «Первым рейсом»"
                amountRub: amount,   // 3000/4000/5000
                url: sb.url,         // ✅ ссылка из конфига
            })
            totalAmountRub += amount
        }
    }

    // 4) promotions
    for (const p of rules.promotions ?? []) {
        if (!p?.name) continue
        if (!isActiveByDate(input.now, p.from, p.until)) continue

        pushLine(p.name, Math.max(0, toNumber(p.amount, 0)), p.url)
    }

    return {amountRub: totalAmountRub, lines}
}
