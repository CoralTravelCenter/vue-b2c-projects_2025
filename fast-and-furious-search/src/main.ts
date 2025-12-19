import './style.css';
import {ReactDomObserver} from "../../usefuls";
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


let resolveClick!: () => void
const clickPromise = new Promise<void>((res) => (resolveClick = res))

let appeared = false

const QSRecentlyView = new ReactDomObserver(
    'div[class*="QSRecentlyView_qsRecentlyViewContainer__"]',
    {
        once: true,
        onAppear: (el) => {
            appeared = true

            if (!el) return resolveClick()

            const firstCard = el.querySelectorAll(
                'div[class*="QSRecentlyViewItem_qsRecentlyViewItemContainer__"]',
            ) as NodeList | null

            // если карточек нет — продолжаем
            if (!firstCard) return resolveClick()

            firstCard[0].addEventListener(
                'click',
                (e) => {
                    console.log(e.target)
                    resolveClick()
                }
            )
        },
    },
)

QSRecentlyView.start()

// если не появился — не ждём вечно
setTimeout(() => {
    if (!appeared) resolveClick()
}, 150) // время подстрой под сайт

await clickPromise
console.log('__Resolve')


const FastSearchView = new ReactDomObserver('#rc-tabs-1-panel-1', {
    onAppear: el => {
        if (!el) return
        const searchApp = document.createElement('div')
        searchApp.id = 'quick-search-app'
        el?.parentElement?.append(searchApp)
        const app = createApp(App)
        app.mount('#quick-search-app')
    },
})
FastSearchView.start()

// &p=1 & w = 0 & s = 0 & ws = 10 - пакеты
