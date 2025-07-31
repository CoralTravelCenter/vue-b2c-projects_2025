import {onBeforeUnmount, onMounted} from 'vue'

export function usePopupTriggers({
                                     autoShow,
                                     trigger,
                                     isExpired,
                                     show
                                 }: {
    autoShow?: number
    trigger?: string
    isExpired: () => boolean
    show: () => void
}) {
    const internalTrigger = document.createElement('button')
    internalTrigger.innerHTML = `<div class="icon">
        <div class="icon-text">%</div>
    </div>
    <div class="text">
        <p>Скидка <br> до 20 000₽</p>
    </div>`;


    const externalElements: HTMLElement[] = []

    const handleTriggerClick = () => {
        show()
    }

    let placeToInsertTrigger: HTMLElement | null | undefined = null

    async function setupTriggers() {
        if (!trigger) return

        const elements = document.querySelectorAll(trigger)
        if (elements.length === 0) {
            console.warn(`[coral-popup] trigger "${trigger}" not found in DOM`)
        }

        elements.forEach(el => {
            el.addEventListener('click', handleTriggerClick)
            externalElements.push(el as HTMLElement)
        })
    }

    async function initializeTriggers() {
        if (isExpired()) return

        internalTrigger.addEventListener('click', handleTriggerClick)
        placeToInsertTrigger = document?.querySelector('[href*="where-to-buy"]')?.closest('.layout-container-limit')
        placeToInsertTrigger?.append(internalTrigger)

        if (autoShow) {
            setTimeout(() => {
                handleTriggerClick()
            }, autoShow)
        } else {
            await setupTriggers()
        }
    }

    function cleanupTriggers() {
        internalTrigger.removeEventListener('click', handleTriggerClick)

        if (placeToInsertTrigger?.contains(internalTrigger)) {
            placeToInsertTrigger.removeChild(internalTrigger)
        }

        externalElements.forEach(el =>
            el.removeEventListener('click', handleTriggerClick)
        )

        document.body.style.overflow = ''
    }

    onMounted(initializeTriggers)
    onBeforeUnmount(cleanupTriggers)

    return {
        triggerInternal: () => internalTrigger.click()
    }
}
