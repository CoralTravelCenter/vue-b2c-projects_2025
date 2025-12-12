import {defineCustomElement} from "vue";
import CoralJoint from '@/components/CoralJoint.ce.vue'
import markup from './markup.html?raw';
import {hostReactAppReady} from "@/usefuls";
import './global.css';


if (!customElements.get('coral-joint')) {
    customElements.define('coral-joint', defineCustomElement(CoralJoint))
}

(async () => {
    await hostReactAppReady()
    await customElements.whenDefined('coral-joint')
    const createRoot = document.createElement('div')
    createRoot.id = 'monkey-app'
    document.body.appendChild(createRoot);
    const root = document?.getElementById('monkey-app')

    if (!root) return;

    root.insertAdjacentHTML('afterbegin', markup)
})()
