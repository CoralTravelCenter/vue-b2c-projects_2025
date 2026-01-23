import {defineCustomElement} from "vue";
import Bubble from './components/Bubble.ce.vue'
// import markup from './markup.html?raw';
// import './style.css';

const componentName = 'sunmar-bubble';
const definedComponent = defineCustomElement(Bubble)
if (!customElements.get(componentName)) {
    customElements.define(componentName, definedComponent)
}
//
// (async ()=> {
//     await customElements.whenDefined(componentName);
//
//     const placeHolder = document?.querySelector('#quick-search-tab-area .ant-tabs-nav-wrap');
//     placeHolder?.insertAdjacentHTML('afterend', markup)
//
//     const popup = document?.getElementById('14_feb');
//     const trigger = document?.getElementById('sunmar-popup-trigger');
//
//     if (popup && trigger) {
//         trigger.addEventListener('click', () => {
//             console.log('click');
//             popup?.show();
//         });
//     }
// })()
