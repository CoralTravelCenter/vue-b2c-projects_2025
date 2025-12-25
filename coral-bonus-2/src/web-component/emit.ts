import type {CalcResult} from '@/domain/types'

export const BONUS_EVENT = 'coral:bonus-updated'

export function emitBonusUpdated(el: HTMLElement, result: CalcResult) {
    el.dispatchEvent(
        new CustomEvent(BONUS_EVENT, {
            bubbles: true,
            detail: result,
        }),
    )
}
