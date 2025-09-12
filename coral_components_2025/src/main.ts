import {defineCustomElement} from "vue";
import CoralJoint from '@/components/CoralJoint/CoralJoint.ce.vue'
import CoralPopupTrigger from '@/components/CoralPopupTrigger/CoralPopupTrigger.ce.vue'
import CoralPopup from '@/components/CoralPopup/CoralPopup.ce.vue'
import {hostReactAppReady} from "@/utils";

// interface CoralPopupElement extends HTMLElement {
//     show(): void
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


const markup: string = `
 <coral-joint
        countries="Турция"
        hotels='[
           {
            "name": "ATALLA HOTEL", 
            "benefits": ["Популярный отель", "Реновация 2023"],
            "ligal": "ООО Центрбронь",
            "erid": "12345"
           },
           {
            "name": "XANADU MAKADI BAY", 
            "benefits": ["Отличная цена в мае", "Большая территория"],
            "ligal": "ООО Центршмонь",
            "erid": "56789"
           }
        ]'
        lookup-days="14"
        lookup-nights="7"
></coral-joint>
<!--<coral-popup-trigger>-->
<!--<span slot="icon">₽</span>-->
<!--<span slot="text">Скидка<br> 20 000 ₽</span>-->
<!--</coral-popup-trigger>-->
<!--<coral-popup>-->
<!-- <img slot="visual" alt="Море" src="https://content.coral.ru/resize/576x522/media/image/1/704/636643240080221840.jpg"-->
<!--         width="374" height="262">-->
<!--    <span slot="ligal">-->
<!--            Реклама. ООО «ТО КОРАЛ ТРЕВЕЛ ЦЕНТР» erid: 2W5zFG913g41-->
<!--        </span>-->
<!--    <h2 slot="title">Статус «в отпуске»</h2>-->
<!--    <p slot="subtitle">Еще есть половина лета, чтобы отдохнуть на море с выгодой</p>-->
<!--    <button slot="button" class="popup-prime-button">Продолжить бронирование</button>-->
<!--    <ul slot="list">-->
<!--        <li>Промокод: <span class="promo" style="color: #0072ce; font-weight: 700;">ЖАРА</span>-->
<!--        </li>-->
<!--        <li>Скидка: <strong>до 20 000 ₽</strong></li>-->
<!--        <li>Даты акции: <strong>18.07.2025 – 21.07.2025</strong></li>-->
<!--        <li>Даты начала отдыха: <strong>июль – сентябрь 2025</strong></li>-->
<!--        <li>Направления: <strong>все</strong></li>-->
<!--    </ul>-->
<!--    <p slot="footnote">-->
<!--        Чтобы воспользоваться промокодом, введите его в поле «Примечание к заказу» или сообщите менеджеру-->
<!--    </p>-->
<!--    <ul slot="disclaimers">-->
<!--        <li>*Скидка 5 000 ₽ от 150 000 ₽, 10 000 ₽ от 300 000 ₽, 15 000 ₽ от 450 000 ₽, 20 000 ₽ от 600 000 ₽</li>-->
<!--        <li>**Акция распространяется только на новые неоплаченные бронирования пакетных туров или отелей на сайте-->
<!--            coral.ru. Она&nbsp;не суммируется с&nbsp;другими предложениями Coral Travel и&nbsp;программой лояльности-->
<!--            CoralBonus и не распространяется на GDS билеты в&nbsp;составе пакетного тура.-->
<!--        </li>-->
<!--    </ul>-->
<!--</coral-popup>-->
`;

(async () => {
    await hostReactAppReady()
    await Promise.all([
        customElements.whenDefined('coral-popup'),
        customElements.whenDefined('coral-popup-trigger'),
        customElements.whenDefined('coral-joint'),
    ])
    document.body.insertAdjacentHTML('beforeend', markup)

    // const popup = document.querySelector('coral-popup') as CoralPopupElement
    // const trigger = document.querySelector('coral-popup-trigger') as HTMLElement | null
    //
    // if (popup) {
    //     document.body.append(popup)
    // }
    //
    // if (trigger) {
    //     let container: HTMLElement | null | undefined = null
    //     mediaMatcher(993, (isMobile) => {
    //         container = isMobile
    //             ? document?.querySelector('.header-mobile .right-group')
    //             : document?.querySelector('a[href*="where-to-buy"]')?.parentElement?.parentElement
    //     })
    //     container?.append(trigger)
    //     if (!trigger.hasAttribute('href')) {
    //         trigger.addEventListener('click', () => popup.show())
    //     }
    // }
})()
