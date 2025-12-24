import { defineCustomElement } from "vue";
import Popup from "./components/Popup.ce.vue";

const componentName = "coral-popup";
const definedComponent = defineCustomElement(Popup);
if (!customElements.get(componentName)) {
	customElements.define(componentName, definedComponent);
}
