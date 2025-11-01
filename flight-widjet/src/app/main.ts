import {createApp} from 'vue';
import {createPinia} from 'pinia'
import '@/app/style.css';
import App from '@/app/App.vue';

const app = createApp(App);
app.use(createPinia());
app.mount('#monkey-app');
