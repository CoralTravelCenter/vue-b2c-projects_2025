import './style.css';
import {ReactDomObserver} from "../../usefuls";
import {type App as VueApp, createApp} from "vue";
import App from "./App.vue";

(window as any).POPULAR_TOURS = [
    {
        name: 'Турция',
        dates: ["2025-10-22", "2025-10-29"],
        stars: ["5"],
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

const HOST_SELECTOR = '[data-testid="quickSearchBarBlock"]';
const APP_ID = 'quick-search-app';

let vueApp: VueApp<Element> | null = null;

function ensureMounted(hostEl: Element) {
    if (!hostEl?.parentElement) return;

    let container = document.getElementById(APP_ID);
    if (!container) {
        container = document.createElement('div');
        container.id = APP_ID;
        hostEl.parentElement.append(container);
    }

    if (vueApp) return;

    vueApp = createApp(App);
    vueApp.mount(container);
}

function startObserver() {
    new ReactDomObserver(HOST_SELECTOR, {
        onAppear: (el) => {
            if (!el) return;
            ensureMounted(el);
        },
    }).start();
}

startObserver();

(window as any).CoralRouteBus.subscribe((state: { url: string }) => {
    if (state.url !== '/') return;
    startObserver();
});
