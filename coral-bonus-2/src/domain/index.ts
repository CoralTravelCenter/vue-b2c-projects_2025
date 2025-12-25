import type {CalcResult} from './types'
import {parseHotelRules, parseRules} from './config'
import {normalizeFromDataLayer, watchDataLayer} from './datalayer'
import {calculateResult} from './engine'

export function calculateFromInputs(
    rulesRaw: string | null | undefined,
    hotelRulesRaw: string | null | undefined,
): CalcResult {
    const rules = parseRules(rulesRaw)
    const hotelRules = parseHotelRules(hotelRulesRaw)
    const input = normalizeFromDataLayer(new Date())
    return calculateResult(rules, hotelRules, input)
}

export function setupAutoRecalcByDataLayer(
    getRulesRaw: () => string | null | undefined,
    getHotelRulesRaw: () => string | null | undefined,
    onUpdate: (r: CalcResult) => void,
): () => void {
    const recalc = () => onUpdate(calculateFromInputs(getRulesRaw(), getHotelRulesRaw()))
    const unsub = watchDataLayer(recalc, 50)
    recalc()
    return () => {
        try {
            unsub()
        } catch {
        }
    }
}
