import {defineCustomElement} from 'vue';
import CoralPopup from './components/CoralPopup.ce.vue';
import CoralPopupTrigger from './components/CoralPopupTrigger.ce.vue';
import {hostReactAppReady} from "@/utils";

await hostReactAppReady()
// Регистрируем кастомный элемент
const CoralElement = defineCustomElement(CoralPopup);
customElements.define('coral-popup', CoralElement);
const CoralPopupTriggerElement = defineCustomElement(CoralPopupTrigger)
customElements.define('coral-popup-trigger', CoralPopupTriggerElement);

// Вставляем его в конец body
document
    .querySelector('.js-timer-block')
    ?.insertAdjacentHTML('beforebegin', `

<!--<style>-->
<!--#coral-popup-trigger {-->
<!--    font-family: inherit;-->
<!--    display: flex;-->
<!--    align-items: center;-->
<!--    justify-content: space-between;-->
<!--    gap: 8px;-->
<!--    background: transparent;-->
<!--    padding: 7px 16px 7px 8px;-->
<!--    border: 1px solid rgba(0, 0, 0, 0.15);-->
<!--    border-radius: 40px;-->
<!--    width: fit-content;-->
<!--    cursor: pointer;-->
<!--    flex-shrink: 0;-->
<!--    transition: border-color 0.3s ease;-->
<!--}-->

<!--#coral-popup-trigger:hover {-->
<!--    border-color: #66d1ff;-->
<!--}-->

<!--#coral-popup-trigger .icon {-->
<!--    width: 32px;-->
<!--    height: 32px;-->
<!--    display: flex;-->
<!--    align-items: center;-->
<!--    justify-content: center;-->
<!--    background: #e84f0e;-->
<!--    border-radius: 100%;-->
<!--    color: #ffffff;-->
<!--}-->

<!--#coral-popup-trigger .text > p {-->
<!--    margin: 0;-->
<!--    line-height: 1;-->
<!--    font-weight: 600;-->
<!--    font-size: 12px;-->
<!--    color: #000;-->
<!--    text-align: left;-->
<!--}-->
<!--</style>-->
<coral-popup-trigger id="coral-popup-trigger">
    <div slot="icon" class="icon">%</div>
    <span slot="text" class="text">
        Скидка <br> до 20 000₽
    </span>
</coral-popup-trigger>
<coral-popup 
trigger="#coral-popup-trigger"
expires="2025-07-31"
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
