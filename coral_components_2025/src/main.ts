import {defineCustomElement} from "vue";
import CoralJoint from '@/components/CoralJoint/CoralJoint.ce.vue'
import CoralPopup from '@/components/CoralPopup/CoralPopup.ce.vue'
import CoralPopupTrigger from '@/components/CoralPopupTrigger/CoralPopupTrigger.ce.vue'
import {hostReactAppReady} from "@/utils";

if (!customElements.get('coral-popup')) {
    customElements.define('coral-popup', defineCustomElement(CoralPopup))
}
if (!customElements.get('coral-popup-trigger')) {
    customElements.define('coral-popup-trigger', defineCustomElement(CoralPopupTrigger))
}

if (!customElements.get('coral-joint')) {
    customElements.define('coral-joint', defineCustomElement(CoralJoint))
}


const markup: string = `
 <coral-joint
        countries="Турция"
        hotels='[
           {
            "name": "ATALLA HOTEL", 
            "benefits": ["Популярный отель", "Реновация 2023"],
            "erid": "12345"
           },
           {
            "name": "XANADU MAKADI BAY", 
            "benefits": ["Отличная цена в мае", "Большая территория"],
            "erid": "5678"
           }
        ]'
        lookup-days="14"
        lookup-nights="7"
></coral-joint>
`;

(async () => {
    await hostReactAppReady()
    // await Promise.all([
    //     customElements.whenDefined('coral-popup'),
    //     customElements.whenDefined('coral-popup-trigger'),
    // ])
    //
    // const popup = document.querySelector('coral-popup') as HTMLElement & { showPopup?: () => void } | null
    // const trigger = document.querySelector('coral-popup-trigger') as HTMLElement | null
    //
    // if (popup) {
    //     document.body.append(popup)
    // }
    //
    // if (trigger) {
    //     const container = document.querySelector('a[href*="where-to-buy"]')?.parentElement?.parentElement
    //     container?.append(trigger)
    //     trigger?.addEventListener('click', () => {
    //         const redirectTo = trigger.getAttribute('redirect-to')
    //
    //         if (redirectTo) {
    //             window.location.href = redirectTo
    //         } else if (popup?.showPopup) {
    //             popup.showPopup()
    //         }
    //     })
    // }

    document.body.insertAdjacentHTML('beforeend', markup)
})()
