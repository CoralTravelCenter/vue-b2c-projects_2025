import './style.css';
import {SimpleReactDomObserver} from '../../utils.js';
import {createApp} from "vue";
import App from "./App.vue";

window.POPULAR_TOURS = [
    {
        promo: true,
        html: '<h5>Черная задница</h5><span>Акция такая</span>'
    },
    {
        name: 'Турция', // название страны для запроса
        dates: ["2025-10-22", "2025-10-29"], // даты для запроса, формат ТОЛЬКО такой
        stars: ["5"], // фильтр для звезд, может быть несколько вариантов
        nights: 7,
        adults: 2,
        dates_to_html: 'Даты вылета: 22.10 - 29.10',
        label: 'Тур',
    },
    {
        name: 'Мальдивы',
        dates: ["2025-12-01", "2025-12-14"],
        stars: [""],
        nights: 7,
        adults: 2,
        dates_to_html: 'Даты вылета: 01.12-14.12',
        label: 'Тур',
    },
    {
        name: 'Египет',
        dates: ["2025-11-24", "2025-11-29"],
        stars: ["5"],
        nights: 7,
        adults: 2,
        dates_to_html: 'Даты вылета: 24.11 - 29.11',
        places_to_html: ['Египет, Хургада'],
        label: 'Тур',
    },
    {
        name: 'ОАЭ',
        dates: ["2025-11-17", "2025-11-22"],
        stars: ["5"],
        nights: 7,
        adults: 2,
        dates_to_html: 'Даты вылета: 17.11 - 22.11',
        places_to_html: ['ОАЭ'],
        label: 'Тур',
    },
];

new SimpleReactDomObserver('#quick-search-tab-area .ant-tabs-tabpane', {
    onAppear: (el: HTMLElement) => {
        const searchApp: HTMLDivElement = document?.createElement('div');
        searchApp.id = 'quick-search-app';
        el?.parentElement.append(searchApp);

        const app = createApp(App);
        app.mount('#quick-search-app')
    }
}).start()
