import {defineCustomElement} from "vue";
import Popup from './components/Popup.ce.vue'
import markup from "./markup.html?raw"
import trigger from "./trigger.html?raw"
import './style.css';

const componentName = 'coral-popup';
const definedComponent = defineCustomElement(Popup)
if (!customElements.get(componentName)) {
    customElements.define(componentName, definedComponent)
}

(async () => {
    await customElements.whenDefined('coral-popup')
    document.body.insertAdjacentHTML('beforeend', markup)
    document.body.insertAdjacentHTML('afterbegin', trigger)

    const tr = document.getElementById('promo-trigger')
    const p = document.getElementById('only-flight')

    if (tr && p) {
        tr.addEventListener('click', () => p.show())
    }
})()
