import {defineCustomElement} from 'vue';
import CoralPopup from './components/CoralPopup.ce.vue';
import CoralPopupTrigger from './components/CoralPopupTrigger.ce.vue';
import {hostReactAppReady} from "@/utils";

await hostReactAppReady()
const CoralElement = defineCustomElement(CoralPopup);
customElements.define('coral-popup', CoralElement);
const CoralPopupTriggerElement = defineCustomElement(CoralPopupTrigger)
customElements.define('coral-popup-trigger', CoralPopupTriggerElement);


document
    .querySelector('.js-timer-block')
    ?.insertAdjacentHTML('beforebegin', `
<coral-popup-trigger id="coral-popup-trigger">
    <div slot="icon" class="icon">%</div>
    <span slot="text" class="text">
        Скидка <br> до 20 000₽
    </span>
</div>
</coral-popup-trigger>
<coral-popup
expires="2025-08-15"
auto-show="true"
>
     <img
        slot="visual"
        alt="Море"
        class="popup-image"
        src="https://framerusercontent.com/images/bP2sbtLwrHdZK7un4zBeBJ8d234.jpg"
        width="374"
        height="262"
    />
    <span slot="ligal" class="popup-ligal" style="color: #FFFFFF;">
      Реклама. ООО «ТО КОРАЛ ТРЕВЕЛ ЦЕНТР» erid: 2W5zFG913g41
    </span>
    <h2 slot="title">Статус «в отпуске»</h2>
    <p slot="subtitle">Еще есть половина лета, чтобы отдохнуть на море с выгодой</p>
    <button slot="button" class="popup-btn">Продолжить бронирование</button>
    <ul class="popup-list" slot="list">
      <li>Промокод: <span class="promo" style="color: #0072ce;
  font-weight: bold;">ЖАРА</span></li>
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
`);
