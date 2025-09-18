import {defineCustomElement} from "vue";
import CoralJoint from '@/components/CoralJoint/CoralJoint.ce.vue'
import CoralPopupTrigger from '@/components/CoralPopupTrigger/CoralPopupTrigger.ce.vue'
import CoralPopup from '@/components/CoralPopup/CoralPopup.ce.vue'
// import markup from "./markup.html?raw"
// import './index.css';

// interface CoralPopupElement extends HTMLElement {
//     show(): void,
//
//     hide(): void
// }


if (!customElements.get('coral-popup')) {
    customElements.define('coral-popup', defineCustomElement(CoralPopup))
}

if (!customElements.get('coral-popup-trigger')) {
    customElements.define('coral-popup-trigger', defineCustomElement(CoralPopupTrigger))
}

if (!customElements.get('coral-joint')) {
    customElements.define('coral-joint', defineCustomElement(CoralJoint))
}


// (async () => {
//     await hostReactAppReady()
//     await Promise.all([
//         customElements.whenDefined('coral-popup'),
//         customElements.whenDefined('coral-popup-trigger'),
//         customElements.whenDefined('coral-joint'),
//     ])
//     document.body.insertAdjacentHTML('beforeend', markup)
//
//     const popup = document.querySelector('coral-popup') as CoralPopupElement
//     const trigger = document.querySelector('coral-popup-trigger') as HTMLElement | null
//
//     if (popup) {
//         document.body.append(popup)
//     }
//
//     if (trigger) {
//         let container: HTMLElement | null = null
//
//         mediaMatcher(993, (isMobile: boolean) => {
//             container = isMobile
//                 ? (document?.querySelector('.header-mobile .right-group') as HTMLElement | null)
//                 : (document?.querySelector('a[href*="where-to-buy"]')?.parentElement?.parentElement as HTMLElement | null)
//         })
//
//         container?.append(trigger)
//
//         if (!trigger.hasAttribute('href')) {
//             trigger.addEventListener('click', () => popup.show())
//         }
//     }
// })()
