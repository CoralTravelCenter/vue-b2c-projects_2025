import {hostReactAppReady} from "../../common/js/usefuls.js";
import {Tooltip, Button} from 'ant-design-vue';
import {createApp} from "vue";
import App from "./Vue/App.vue";

(async () => {
	await hostReactAppReady();
	const app = createApp(App)
	app.use(Tooltip)
	app.use(Button)
	app.mount("#info-actions");
})()
