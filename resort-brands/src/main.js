import {createApp} from 'vue';
import './styles/main.scss';
import App from './App.vue';
import './data.js';
import {register} from 'swiper/element/bundle';

register();

const app = createApp(App);
app.mount('#monkey-app')
