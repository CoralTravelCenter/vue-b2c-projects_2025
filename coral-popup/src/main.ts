import {defineCustomElement} from 'vue'
import Popup from './components/Popup.ce.vue'
import './style.css'

const componentName = 'coral-popup'
const definedComponent = defineCustomElement(Popup)
if (!customElements.get(componentName)) {
	customElements.define(componentName, definedComponent)
}
