import "./style.css";
import {ReactDomObserver} from "../../usefuls";
import {createApp} from "vue";
import App from "@/components/App.vue";
import {upsertTarget} from "./helpers/coralBonus/targets";
import type {ICashbackData, IOverlayDetail} from "@/types";
import {
    isHotelWithCashback,
    readCashbackFromScript,
    registerCards,
    registerHotelListCards,
    type UpsertFn,
    waitForGlobals
} from "@/helpers/dom-helpers";

const CASHBACK_SCRIPT_ID = "coral-bonus-cashback-json";
const HOTEL_CARD_ID_PREFIX = "hotelListCard";
const HOTEL_CARD_SEL = `[id^="${HOTEL_CARD_ID_PREFIX}"]`;

const upsertAppend: UpsertFn = (el, props) => upsertTarget(el, props ?? {}, "append");

(async () => {
    await waitForGlobals(["dataLayer", "insider_object"]);

    const path = location.pathname;
    const cashbackEl = document.getElementById(CASHBACK_SCRIPT_ID) as HTMLScriptElement | null;
    const parsedCashbackData: ICashbackData[] = cashbackEl ? readCashbackFromScript(cashbackEl) : [];
    const root = document.createElement("div");
    root.id = "coral-bonus-v-app";
    document.body.append(root);
    createApp(App).mount(root);

    const isHotelPage = path.startsWith("/hotels/");
    if (isHotelPage) {
        const isInit = isHotelWithCashback(parsedCashbackData);
        if (!isInit) return;

        new ReactDomObserver(".coral-bonus", {
            onAppear: (el: HTMLElement) => upsertAppend(el),
        }).start();

        new ReactDomObserver(".select-room-list-container", {
            watchChild: true,
            onAppear: (el: HTMLElement) => registerCards(el, upsertAppend),
            onChildMutate: (el: HTMLElement) => registerCards(el, upsertAppend),
        }).start();
    }

    const isListPage = path.startsWith("/packagetours/") || path.startsWith("/onlyhotel/");
    if (isListPage) {
        const cashbackIds = new Set(parsedCashbackData.map((h) => h.id));
        new ReactDomObserver(HOTEL_CARD_SEL, {
            onAppear: (el: HTMLElement) => registerHotelListCards(el, cashbackIds, upsertAppend),
        }).start();

        new ReactDomObserver(".lazyHotelList", {
            debug: true,
            watchChild: true,
            onAppear: (el: HTMLElement) => registerHotelListCards(el, cashbackIds, upsertAppend),
            onChildMutate: (el: HTMLElement) => registerHotelListCards(el, cashbackIds, upsertAppend),
        }).start();
    }

    document.addEventListener("coral-bonus:overlay", (e) => {
        const {detail} = e as CustomEvent<IOverlayDetail>;
        if (detail.action !== "open") return;
        //@ts-ignore
        if (typeof ym === "function") {
            //@ts-ignore
            ym(96674199, "reachGoal", "cb_cashback", detail);
        }
    });
})();
