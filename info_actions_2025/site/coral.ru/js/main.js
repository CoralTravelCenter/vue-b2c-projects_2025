import {hostReactAppReady} from "../../common/js/usefuls.js";
import {Button, Tooltip} from 'ant-design-vue';
import {createApp} from "vue";
import App from "./Vue/App.vue";
import ymCoralbonus from "./Vue/directives/ymCoralbonus";

(async () => {
  await hostReactAppReady();
  const app = createApp(App)
  app.use(Tooltip)
  app.use(Button)
  app.directive('ym-coralbonus', ymCoralbonus)
  app.mount("#info-actions");
})()
