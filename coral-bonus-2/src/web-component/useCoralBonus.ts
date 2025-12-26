import type {CalcResult} from '@/domain/types'
import {setupAutoRecalcByDataLayer} from '@/domain'
import {emitBonusUpdated} from './emit'

export type CoralBonusConfigGetters = {
    getRulesRaw: () => string | null | undefined
    getHotelRulesRaw: () => string | null | undefined
}

export function mountCoralBonus(host: HTMLElement, cfg: CoralBonusConfigGetters) {
    console.log('[coral-bonus] mountCoralBonus host:', host)

    return setupAutoRecalcByDataLayer(
        cfg.getRulesRaw,
        cfg.getHotelRulesRaw,
        // @ts-ignore
        (result: CalcResult) => emitBonusUpdated(host, result)
    )
}
