import {defineCustomElement} from "vue";
import Popup from './components/Popup.ce.vue'
import markup from './markup.html?raw'
import trigger from './trigger.html?raw'
import './style.css';

const componentName = 'coral-popup';
const definedComponent = defineCustomElement(Popup)
if (!customElements.get(componentName)) {
    customElements.define(componentName, definedComponent)
}

(async () => {
    await customElements.whenDefined('coral-popup')
    document.body.insertAdjacentHTML('beforeend', markup)

    const popupElement = document?.querySelector('coral-popup');

    const placeToInsert = document?.querySelector('div[class*="PhotoGalleryMainCarousel_mainSwiperContainer__"]')
    console.log(placeToInsert);
    placeToInsert && placeToInsert.insertAdjacentHTML('beforeend', trigger)

    const popupTrigger = document?.querySelector('#promo-trigger');


    if (popupTrigger) {
        popupElement && popupTrigger.addEventListener('click', (e) => {
            console.log(e.currentTarget)
            popupElement.show()
        })
    }
})()
