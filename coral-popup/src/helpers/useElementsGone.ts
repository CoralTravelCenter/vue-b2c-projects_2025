import {useMutationObserver} from '@vueuse/core'

interface WaitUntilElementsGoneConfig {
    required?: string[]
    floating?: string[]
    target?: HTMLElement
}

type WaitUntilElementsGoneCallback = () => void

export default function useElementsGone(
    config: WaitUntilElementsGoneConfig,
    callback: WaitUntilElementsGoneCallback,
): void {
    const {
        required: requiredSelectors = [],
        floating: floatingSelectors = [],
        target = document.body,
    } = config

    if (!target) {
        callback()
        return
    }

    const hasAny = (selectors: string[]): boolean =>
        selectors.some(sel => !!document.querySelector(sel))

    const allGone = (selectors: string[]): boolean =>
        selectors.every(sel => !document.querySelector(sel))

    // для required — фиксируем, что хотя бы раз появились
    const appearedMap = new Map<string, boolean>(
        requiredSelectors.map(sel => [sel, hasAny([sel])]),
    )

    const haveAllRequiredAppeared = (): boolean =>
        requiredSelectors.length === 0 ||
        requiredSelectors.every(sel => appearedMap.get(sel))

    const areAllRequiredGone = (): boolean => allGone(requiredSelectors)
    const areAllFloatingGone = (): boolean => allGone(floatingSelectors)

    let stop: (() => void) | null = null

    const tryFinish = (): void => {
        if (!haveAllRequiredAppeared()) return
        if (!areAllRequiredGone()) return
        if (!areAllFloatingGone()) return

        stop?.()
        callback()
    }

    const handleMutations: MutationCallback = () => {
        // обновляем appeared для required
        requiredSelectors.forEach(sel => {
            if (!appearedMap.get(sel) && hasAny([sel])) {
                appearedMap.set(sel, true)
            }
        })

        tryFinish()
    }

    // стартовая инициализация
    requiredSelectors.forEach(sel => {
        if (hasAny([sel])) {
            appearedMap.set(sel, true)
        }
    })

    // кейс: всё уже случилось до инициализации
    if (
        haveAllRequiredAppeared() &&
        areAllRequiredGone() &&
        areAllFloatingGone()
    ) {
        callback()
        return
    }

    const observerReturn = useMutationObserver(
        target,
        handleMutations,
        {childList: true, subtree: true},
    )

    stop = observerReturn.stop
}
