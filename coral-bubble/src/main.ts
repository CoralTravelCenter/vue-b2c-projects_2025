import {defineCustomElement} from "vue";
import Bubble from './components/Bubble.ce.vue'
// import './style.css';

const componentName = 'coral-bubble';
const definedComponent = defineCustomElement(Bubble)
if (!customElements.get(componentName)) {
    customElements.define(componentName, definedComponent)
}

function mediaMatcher(size, callback) {
    const mediaQuery = window.matchMedia(`(max-width: ${size}px)`);
    callback(mediaQuery.matches);
    mediaQuery.addEventListener("change", (e) => callback(e.matches));
}

(async () => {
    await customElements.whenDefined('coral-bubble')
    const bubble = document?.querySelector('coral-bubble')
    let placeToInsert;
    mediaMatcher(993, isMobile => {
        if (isMobile) {
            placeToInsert = document?.querySelector('div[class*="HeaderMobile_rightGroup__G7AU2"]')
        } else {
            placeToInsert = document?.querySelector('div[class*="HeaderTopBar_iconContainer__"]')
        }
    })
    if (bubble) placeToInsert.append()
})()
