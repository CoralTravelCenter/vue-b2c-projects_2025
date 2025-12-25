import App from '@/components/App.vue'
import {upsertTarget} from '@/helpers/coralBonus/targets'
import {
	isHotelWithCashback,
	readCashbackFromScript,
	registerCards,
	type UpsertFn,
	waitForGlobals,
} from '@/helpers/dom-helpers'
import '@/style.css'
import type {ICashbackData, IOverlayDetail} from '@/types'
import {createApp} from 'vue'
import {ReactDomObserver} from '../../usefuls'

const CASHBACK_SCRIPT_ID = 'coral-bonus-cashback-json'
// const HOTEL_CARD_ID_PREFIX = "hotelListCard";
// const HOTEL_CARD_SEL = `[id^="${HOTEL_CARD_ID_PREFIX}"]`;
const upsertAppend: UpsertFn = (el, props) =>
    upsertTarget(el, props ?? {}, 'append')

;(async () => {
    await waitForGlobals(['dataLayer', 'insider_object'])

    const cashbackEl = document.getElementById(
        CASHBACK_SCRIPT_ID
    ) as HTMLScriptElement | null
    const parsedCashbackData: ICashbackData[] = cashbackEl
        ? readCashbackFromScript(cashbackEl)
        : []
    const root = document.createElement('div')
    root.id = 'coral-bonus-v-app'
    document.body.append(root)
    createApp(App).mount(root)

    const isInit = isHotelWithCashback(parsedCashbackData)
    if (!isInit) return

    const obs = new MutationObserver(() => {
        const el: HTMLElement | null = document.querySelector('.coral-bonus')
        if (el) {
            upsertAppend(el)
            obs.disconnect()
        }
    })

    obs.observe(document.body, {childList: true, subtree: true})

    new ReactDomObserver('.select-room-list-container', {
        watchChild: true,
        onAppear: (el: HTMLElement) => registerCards(el, upsertAppend),
        onChildMutate: (el: HTMLElement) => registerCards(el, upsertAppend),
    }).start()

    // const isListPage = path.startsWith("/packagetours/") || path.startsWith("/onlyhotel/");
    // if (isListPage) {
    //     const cashbackIds = new Set(parsedCashbackData.map((h) => h.id));
    //     new ReactDomObserver(HOTEL_CARD_SEL, {
    //         onAppear: (el: HTMLElement) => registerHotelListCards(el, cashbackIds, upsertAppend),
    //     }).start();
    //
    //     new ReactDomObserver(".lazyHotelList", {
    //         debug: true,
    //         watchChild: true,
    //         onAppear: (el: HTMLElement) => registerHotelListCards(el, cashbackIds, upsertAppend),
    //         onChildMutate: (el: HTMLElement) => registerHotelListCards(el, cashbackIds, upsertAppend),
    //     }).start();
    // }

    document.addEventListener('coral-bonus:overlay', e => {
        const {detail} = e as CustomEvent<IOverlayDetail>
        if (detail.action !== 'open') return
        //@ts-expect-error
        if (typeof ym === 'function') {
            //@ts-expect-error
            ym(96674199, 'reachGoal', 'cb_cashback', detail)
        }
    })
})()
