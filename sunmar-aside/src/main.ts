import {defineCustomElement} from "vue";
import AsideCe from './components/Aside.ce.vue'
// import markup from './markup.html?raw';

const componentName = 'sunmar-aside';
const definedComponent = defineCustomElement(AsideCe)
if (!customElements.get(componentName)) {
    customElements.define(componentName, definedComponent)
}

// document.querySelector('body')?.insertAdjacentHTML('beforeend', markup)
