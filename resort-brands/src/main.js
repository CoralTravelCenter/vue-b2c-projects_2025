import {createApp} from 'vue';
import App from './App.vue';
// import './data.js';
import {register} from 'swiper/element/bundle';
import {Skeletor} from 'vue-skeletor';
import 'vue-skeletor/dist/vue-skeletor.css';
import './styles/main.scss';

register();

const app = createApp(App);
app.mount('#resort-hotels')
app.component(Skeletor.name, Skeletor);
