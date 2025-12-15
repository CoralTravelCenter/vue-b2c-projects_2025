import {createApp} from "vue";
import App from "@/components/App.vue";
import "./style.css";
import {hostReactAppReady, mediaMatcherMaxWidth, ReactDomObserver,} from "../../usefuls";

function waitForGlobals(keys: string[], timeout = 300): Promise<void> {
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            const ready = keys.every((k) => (window as any)[k]);
            if (ready) {
                clearInterval(timer);
                resolve();
            }
        }, timeout);
    });
}

function getCashbackHotelIds(): number[] {
    return (window as any)._coralBonusCashback.map((h: any) => h.id);
}

function isHotelWithCashback(): boolean {
    const insider = (window as any).insider_object;
    if (!insider?.product?.id) return false;

    const insiderHotelId = Number(insider?.product?.id);
    const cashbackIds = getCashbackHotelIds();
    return cashbackIds.includes(insiderHotelId);
}

(window as any)._coralBonusCashback = [
    {
        name: "AJMAN HOTEL",
        promotions: [
            {
                name: "для новых владельцев карт СoralBonus<br> по акции «Добро пожаловать!»",
                value: 3000,
            },
            {
                name: "Сокровища Востока",
                value: 4000,
            },
            {
                name: "по акции «Первым рейсом!»",
                value: 5000,
            },
            {
                name: "по акции «На волне доверия»",
                value: 6000,
            },
        ],
        id: 1982,
    },
    {
        name: "BAHI AJMAN PALACE HOTEL",
        promotions: [
            {
                name: "Добро пожаловать",
                value: 3000,
            },
        ],
        id: 8230,
    },
    {
        name: "ALDEIA SANTA RITA",
        promotions: [],
        id: 5780,
    },
    {
        name: "KHAO LAK MARRIOTT BEACH RESORT & SPA",
        promotions: [
            {
                name: "Добро пожаловать",
                value: 3000,
            },
            {
                name: "Первым рейсом",
                value: 5000,
            },
        ],
        id: 72544,
    },
];

(async () => {
    await hostReactAppReady();
    await waitForGlobals(["insider_object", "_coralBonusCashback"]);

    const isInit = isHotelWithCashback();
    if (!isInit) return;

    mediaMatcherMaxWidth(993, (isMobile: boolean) => {
        if (isMobile) {
            return;
        } else {
            new ReactDomObserver(".coral-bonus", {
                onAppear: (el: HTMLElement) => {
                    createApp(App).mount(el);
                },
            }).start();
        }
    });
})();
