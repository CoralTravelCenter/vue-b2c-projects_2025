import {defineCustomElement} from "vue";
import Bubble from './components/Bubble.ce.vue'


const componentName = 'coral-bubble';
const definedComponent = defineCustomElement(Bubble)
if (!customElements.get(componentName)) {
    customElements.define(componentName, definedComponent)
}
