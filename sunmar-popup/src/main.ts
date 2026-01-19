import {defineCustomElement} from 'vue'
import Popup from './components/Popup.ce.vue'
import './style.css'

const componentName = 'sunmar-popup'
const definedComponent = defineCustomElement(Popup)
if (!customElements.get(componentName)) {
	customElements.define(componentName, definedComponent)
}

// (async () => {
// 	await customElements.whenDefined(componentName);
// 	document.body.insertAdjacentHTML('beforeend', markup);
// })()
