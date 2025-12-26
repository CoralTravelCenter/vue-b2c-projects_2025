import type {CalcResult} from './types'
import {parseRules} from '@/domain/config'
import {normalizeFromDataLayer} from '@/domain/datalayer'
import {watchDataLayer} from './datalayer/watch'
import {calculateResult} from '@/domain/engine'

export function calculateFromInputs(rulesRaw: string | null | undefined): CalcResult {
    const rules = parseRules(rulesRaw)
    const input = normalizeFromDataLayer(new Date())
    return calculateResult(rules, input)
}

export function setupAutoRecalcByDataLayer(
    getRulesRaw: () => string | null | undefined,
    onUpdate: (r: CalcResult) => void,
): () => void {
    const recalc = () => onUpdate(calculateFromInputs(getRulesRaw()))
    const unsub = watchDataLayer(recalc, 50)
    recalc()
    return () => {
        try {
            unsub()
        } catch {
        }
    }
}
