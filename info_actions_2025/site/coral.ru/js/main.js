import {hostReactAppReady} from "../../common/js/usefuls.js";
import {Button, Tooltip} from 'ant-design-vue';
import {createApp} from "vue";
import App from "./Vue/App.vue";
import ymBonus from "./Vue/directives/ymbonus.directive";
import Clipboard from './Vue/directives/clipboard.directive';
import vEntry from './Vue/directives/entry.directive';

(async () => {
  await hostReactAppReady();
  const app = createApp(App)
  app.use(Tooltip)
  app.use(Button)
  app.directive('bonus', ymBonus)
  app.directive('clipboard', Clipboard)
  app.directive('entry', vEntry);
  app.mount("#info-actions");
})()
