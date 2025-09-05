import {defineCustomElement} from 'vue';
import CoralPopup from '@/components/CoralPopup/CoralPopup.ce.vue';
import CoralPopupTrigger from '@/components/CoralPopupTrigger/CoralPopupTrigger.ce.vue';

customElements.define('coral-popup', defineCustomElement(CoralPopup));
customElements.define('coral-popup-trigger', defineCustomElement(CoralPopupTrigger));

(async () => {
  await Promise.all([
    customElements.whenDefined('coral-popup'),
    customElements.whenDefined('coral-popup-trigger'),
  ]);

  const popup = document?.querySelector('coral-popup');
  const popupTrigger = document?.querySelector('coral-popup-trigger');
  if (popup) document.body.append(popup);
  if (popupTrigger) document.querySelector('a.where-to-buy').parentElement.parentElement.append(popupTrigger);

  const isPopupTrigger = popupTrigger.hasAttribute('redirect-to')
  isPopupTrigger && popup.showPopup()
})()
