import {hostReactAppReady} from "@/utils";
import {defineCustomElement} from 'vue';
import CoralPopup from './components/CoralPopup/CoralPopup.ce.vue';
import CoralPopupTrigger from './components/CoralPopupTrigger/CoralPopupTrigger.ce.vue';
import CoralJaz from './components/CoralJaz/CoralJaz.ce.vue';
import './index.css';

function generateRandomId(length = 12) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < length; i++) {
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
}

function insertOnce(target: HTMLElement | null, position: InsertPosition, html: string, randomId: string) {
    const BODY = document.body;
    if (!BODY.querySelector(`[data-inserted="${randomId}"]`)) {
        target?.insertAdjacentHTML(position, html);
        BODY.setAttribute('data-inserted', randomId);
    }
}

type CoralPopupEl = HTMLElement & { showPopup: () => void };

const HEADER_SELECTOR = '.header-client-side-desktop > div > div > div';
customElements.define('coral-popup', defineCustomElement(CoralPopup));
customElements.define('coral-popup-trigger', defineCustomElement(CoralPopupTrigger));
customElements.define('coral-jaz', defineCustomElement(CoralJaz));

(async () => {
    await hostReactAppReady();

    await Promise.all([
        customElements.whenDefined('coral-popup'),
        customElements.whenDefined('coral-popup-trigger'),
        customElements.whenDefined('coral-jaz'),
    ]);

    const html = `
<coral-popup-trigger 
redirect-to="/poleznaya-informatsiya/offers/hot-offers/promocodes/?banner_on_site=bubble-promocodes"
>
<div slot="icon" class="icon">%</div>
    <span slot="text" class="text">
        Скидка <br> до 20 000₽
    </span>
</coral-popup-trigger>
<coral-popup
expires="2025-09-15"
>
     <img
        slot="visual"
        alt="Море"
        class="popup-image"
        src="https://framerusercontent.com/images/bP2sbtLwrHdZK7un4zBeBJ8d234.jpg"
        width="374"
        height="262"
    />
    <span slot="ligal" class="popup-ligal">
      Реклама. ООО «ТО КОРАЛ ТРЕВЕЛ ЦЕНТР» erid: 2W5zFG913g41
    </span>
    <h2 slot="title">Статус «в отпуске»</h2>
    <p slot="subtitle">Еще есть половина лета, чтобы отдохнуть на море с выгодой</p>
    <button slot="button" class="popup-btn">Продолжить бронирование</button>
    <ul class="popup-list" slot="list">
      <li>Промокод: <span class="promo" style="color: #0072ce; font-weight: 700;">ЖАРА</span>
      </li>
      <li>Скидка: <strong>до 20 000 ₽</strong></li>
      <li>Даты акции: <strong>18.07.2025 – 21.07.2025</strong></li>
      <li>Даты начала отдыха: <strong>июль – сентябрь 2025</strong></li>
      <li>Направления: <strong>все</strong></li>
    </ul>
    <p slot="footnote" class="popup-footnote">
      Чтобы воспользоваться промокодом, введите его в поле «Примечание к заказу» или сообщите менеджеру
    </p>
    <ul slot="disclaimers" class="popup-disclaimers">
      <li>*Скидка 5 000 ₽ от 150 000 ₽, 10 000 ₽ от 300 000 ₽, 15 000 ₽ от 450 000 ₽, 20 000 ₽ от 600 000 ₽</li>
      <li>**Акция распространяется только на новые неоплаченные бронирования пакетных туров или отелей на сайте coral.ru. Она не суммируется с другими предложениями Coral Travel и программой лояльности CoralBonus и не распространяется на GDS билеты в составе пакетного тура.</li>
    </ul>
</coral-popup>
<coral-jaz>
    <span slot="text"></span>
</coral-jaz>
`;

    insertOnce(
        document?.querySelector('section.benefits'),
        'beforebegin',
        html,
        generateRandomId()
    )

    const popup = document.querySelector<CoralPopupEl>('coral-popup');
    const jaz = document.querySelector('coral-jaz');
    if (popup) document.body.append(popup);
    if (jaz) document.body.append(jaz);

    const trigger = document.querySelector('coral-popup-trigger');
    const header = document.querySelector(HEADER_SELECTOR);
    if (trigger && header) header.append(trigger);

    !trigger?.hasAttribute('redirect-to') && trigger?.addEventListener('click', () => popup?.showPopup());
})()
