import {defineCustomElement} from 'vue';
import CoralPopup from '@/components/CoralPopup/CoralPopup.ce.vue';
import CoralPopupTrigger from '@/components/CoralPopupTrigger/CoralPopupTrigger.ce.vue';
import {hostReactAppReady} from "@/utils.js";

customElements.define('coral-popup', defineCustomElement(CoralPopup));
customElements.define('coral-popup-trigger', defineCustomElement(CoralPopupTrigger));

(async () => {
  await hostReactAppReady()
  await Promise.all([
    customElements.whenDefined('coral-popup'),
    customElements.whenDefined('coral-popup-trigger'),
  ]);

  const popup = document?.querySelector('coral-popup');
  if (popup) document.body.append(popup);
})()
