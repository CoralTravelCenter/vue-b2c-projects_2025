import {defineCustomElement} from "vue";
import SunmarPopupTriggerCe from '@/components/SunmarPopupTrigger/SunmarPopupTrigger.ce.vue'
import SunmarPopupCe from '@/components/SunmarPopup/SunmarPopup.ce.vue'
import {hostReactAppReady, mediaMatcher} from "@/utils";
import './index.css';

interface sunmarPopupElement extends HTMLElement {
    show(): void,

    hide(): void
}


if (!customElements.get('sunmar-popup')) {
    customElements.define('sunmar-popup', defineCustomElement(SunmarPopupCe))
}

if (!customElements.get('sunmar-popup-trigger')) {
    customElements.define('sunmar-popup-trigger', defineCustomElement(SunmarPopupTriggerCe))
}


const markup: string = `
<sunmar-popup-trigger>
<span slot="icon">₽</span>
<span slot="text">Скидка<br> 20 000 ₽</span>
</sunmar-popup-trigger>
<sunmar-popup>
 <img slot="visual" alt="Море" src="https://content.sunmar.ru/resize/576x522/media/image/1/704/636643240080221840.jpg"
         width="374" height="262">
    <span slot="ligal">
            Реклама. ООО «ТО КОРАЛ ТРЕВЕЛ ЦЕНТР» erid: 2W5zFG913g41
        </span>
    <h2 slot="title">Статус «в отпуске»</h2>
    <p slot="subtitle">Еще есть половина лета, чтобы отдохнуть на море с выгодой</p>
    <button slot="button" class="popup-prime-button">Продолжить бронирование</button>
    <ul slot="list">
        <li>Промокод: <span class="promo" style="color: #0072ce; font-weight: 700;">ЖАРА</span>
        </li>
        <li>Скидка: <strong>до 20 000 ₽</strong></li>
        <li>Даты акции: <strong>18.07.2025 – 21.07.2025</strong></li>
        <li>Даты начала отдыха: <strong>июль – сентябрь 2025</strong></li>
        <li>Направления: <strong>все</strong></li>
    </ul>
    <p slot="footnote">
        Чтобы воспользоваться промокодом, введите его в поле «Примечание к заказу» или сообщите менеджеру
    </p>
    <ul slot="disclaimers">
        <li>*Скидка 5 000 ₽ от 150 000 ₽, 10 000 ₽ от 300 000 ₽, 15 000 ₽ от 450 000 ₽, 20 000 ₽ от 600 000 ₽</li>
        <li>**Акция распространяется только на новые неоплаченные бронирования пакетных туров или отелей на сайте
            sunmar.ru. Она&nbsp;не суммируется с&nbsp;другими предложениями sunmar Travel и&nbsp;программой лояльности
            sunmarBonus и не распространяется на GDS билеты в&nbsp;составе пакетного тура.
        </li>
    </ul>
</sunmar-popup>
`;

(async () => {
    await hostReactAppReady()
    await Promise.all([
        customElements.whenDefined('sunmar-popup'),
        customElements.whenDefined('sunmar-popup-trigger'),
        customElements.whenDefined('sunmar-joint'),
    ])
    document.body.insertAdjacentHTML('beforeend', markup)

    const popup = document.querySelector('sunmar-popup') as sunmarPopupElement
    const trigger = document.querySelector('sunmar-popup-trigger') as HTMLElement | null

    if (popup) {
        document.body.append(popup)
    }

    if (trigger) {
        let container: HTMLElement | null = null

        mediaMatcher(993, (isMobile: boolean) => {
            container = isMobile
                ? (document?.querySelector('.header-mobile .right-group') as HTMLElement | null)
                : (document?.querySelector('a[href*="where-to-buy"]')?.parentElement?.parentElement as HTMLElement | null)
        })

        container?.prepend(trigger)

        if (!trigger.hasAttribute('href')) {
            trigger.addEventListener('click', () => popup.show())
        }
    }
})()
