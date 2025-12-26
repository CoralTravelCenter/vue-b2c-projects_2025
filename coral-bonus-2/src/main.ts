// @ts-ignore
// import CB from '@/web-component/CoralBonus.ce.vue';
import {ReactDomObserver} from "../../usefuls";
// import markup from './markup.html?raw';
import './style.css';

// const componentName = 'coral-bonus';
// const definedComponent = defineCustomElement(CB, {
//     styles: [tippyStyles, tippyStylesAnim, arrow, shadowStyles],
// })
// if (!customElements.get(componentName)) {
//     customElements.define(componentName, definedComponent)
// }


(async () => {
    await customElements.whenDefined('coral-bonus');

    const cdCard = document?.querySelector('#coral-bonus-widget');
    if (!cdCard) return;

    // Вставка в боковую панель
    new ReactDomObserver('.coral-bonus', {
        onAppear: el => {
            const clone = cdCard.cloneNode(true);
            clone.setAttribute('data-clone', 'true');
            el?.append(clone)
        }
    }).start()


    // Вставка в реактивный спискок номеров
    new ReactDomObserver('.select-room-list-container', {
        watchChild: true,
        onAppear: el => {
            const cbCards = el.querySelectorAll<HTMLElement>('div[class*="CoralBonusInformation_coralBonusInformation__"]');
            if (cbCards && cbCards.length > 0) {
                Array.from(cbCards).forEach(card => {
                    const clone = cdCard.cloneNode(true);
                    clone.setAttribute('data-clone', 'true');
                    card.closest('div')?.insertAdjacentElement('beforebegin', clone)
                })
            }
        }
    }).start()
})()
