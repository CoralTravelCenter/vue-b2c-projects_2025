import './index.css';
import {defineCustomElement} from "vue";
import CoralJoint from '@/components/CoralJoint/CoralJoint.ce.vue'
import {hostReactAppReady} from "@/utils";

// if (!customElements.get('coral-popup')) {
//     customElements.define('coral-popup', defineCustomElement(CoralPopup))
// }
// if (!customElements.get('coral-popup-trigger')) {
//     customElements.define('coral-popup-trigger', defineCustomElement(CoralPopupTrigger))
// }

if (!customElements.get('coral-joint')) {
    customElements.define('coral-joint', defineCustomElement(CoralJoint))
}


const markup: string = `
<coral-joint hotels="ATALLA HOTEL, XANADU MAKADI BAY" lookup-days="14" lookup-nights="7">
<img slot="visual" src="https://b2ccdn.coral.ru/content/pages/Small_carousel_Coral_548x210.jpg">
<div slot="location">
<span>Египет, Шарм-эш-Шейх</span>
</div>
<h3 slot="hotelName">IBEROTEL REDSINA (ex. MAGIC WORLD SHARM)</h3>
</coral-joint>
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
