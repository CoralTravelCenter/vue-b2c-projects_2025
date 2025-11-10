import {defineCustomElement} from 'vue';
import {hostReactAppReady} from "../../usefuls.js";
import CoralJoint from '@/components/CoralJoint.ce.vue'
import markup from './markup.html?raw'

if (!customElements.get('coral-joint')) {
  customElements.define('coral-joint', defineCustomElement(CoralJoint))
}

(async () => {
  await hostReactAppReady()
  await customElements.whenDefined('coral-joint')
  document.body.insertAdjacentHTML('beforeend', markup)
})()
