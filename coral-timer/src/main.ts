import { defineCustomElement } from "vue";
// @ts-ignore
import Timer from "./Timer/Timer.ce.vue";

// import markup from "./markup.html?raw";

const componentName = "coral-timer";
const definedComponent = defineCustomElement(Timer);
if (!customElements.get(componentName)) {
	customElements.define(componentName, definedComponent);
}

// await customElements.whenDefined(componentName);
// document.querySelector("#monkey-app")?.insertAdjacentHTML("afterbegin", markup);
