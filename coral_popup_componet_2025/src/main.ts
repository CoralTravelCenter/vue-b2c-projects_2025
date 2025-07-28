import {defineCustomElement} from 'vue';
import CoralPopup from './components/CoralPopup.ce.vue';
import css from './components/CoralPopup.scss?raw'

// Регистрируем кастомный элемент
const CoralElement = defineCustomElement(CoralPopup);
customElements.define('coral-popup', CoralElement);

// Вставляем его в конец body
document
	.querySelector('body')
	?.insertAdjacentHTML('beforeend', `

<coral-popup
  auto-show
  expires="2025-07-27"
>

  <div class="popup-visual" slot="visual">
    <img alt="Море" class="popup-image" src="https://framerusercontent.com/images/bP2sbtLwrHdZK7un4zBeBJ8d234.jpg" width="374" height="262" />
    <span class="popup-ligal" style="color: #FFFFFF;">Реклама. ООО «ТО КОРАЛ ТРЕВЕЛ ЦЕНТР» erid: 2W5zFG913g41</span>
  </div>

  <div class="popup-content" slot="content">
    <h2 class="popup-title">Статус «в отпуске»</h2>
    <p class="popup-subtitle">Еще есть половина лета, чтобы отдохнуть на море с выгодой</p>

    <a class="popup-btn" href="https://tailwindcss.com/">Продолжить бронирование</a>

    <ul class="popup-list">
      <li>Промокод: <span class="promo">ЖАРА</span></li>
      <li>Скидка: <strong>до 20 000 ₽</strong></li>
      <li>Даты акции: <strong>18.07.2025 – 21.07.2025 г.</strong></li>
      <li>Даты начала отдыха: <strong>июль - сентябрь 2025 г.</strong></li>
      <li>Направления: <strong>все</strong></li>
    </ul>

    <p class="popup-footnote">
      Чтобы воспользоваться промокодом, введите его в поле «Примечание к заказу» в пункте «Другое» или сообщите менеджеру
    </p>

    <ul class="popup-disclaimers">
      <li>*Скидка 5 000 ₽ на туры и отели от 150 000 ₽, скидка 10 000 ₽ на туры и отели от 300 000 ₽, скидка 15 000 ₽ на туры и отели от 450 000 ₽, скидка 20 000 ₽ на туры и отели от 600 000 ₽</li>
      <li>**Акция распространяется только на новые не оплаченные бронирования пакетных туров или отелей на сайте coral.ru. Она не суммируется с другими предложениями Coral Travel и программой лояльности CoralBonus и не распространяется на GDS билеты в составе пакетного тура.</li>
    </ul>
  </div>
</coral-popup>
`);

