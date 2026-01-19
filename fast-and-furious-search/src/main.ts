import './style.css';
import {SimpleReactDomObserver} from "../../usefuls";
import {createApp} from "vue";
import App from "./App.vue";

(window as any).POPULAR_TOURS = [
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
];


 new SimpleReactDomObserver('[data-testid="quickSearchBarBlock"]', {
    onAppear: el => {
        if (!el) return
        const searchApp = document.createElement('div')
        searchApp.id = 'quick-search-app'
        el?.parentElement?.append(searchApp)
        const app = createApp(App)
        app.mount('#quick-search-app')
    },
}).start()
