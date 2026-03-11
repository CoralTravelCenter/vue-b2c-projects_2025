import {defineCustomElement} from "vue";
import Timer from "./component/Timer.ce.vue";
import markup from "./markup.html?raw";

import "./style.css";

const componentName = "coral-timer";
const definedComponent = defineCustomElement(Timer);
if (!customElements.get(componentName)) {
    customElements.define(componentName, definedComponent);
}

customElements.whenDefined(componentName).then(() => {
    const root = document.querySelector("#monkey-app") ?? document.body;
    root?.insertAdjacentHTML("afterbegin", markup);
});
