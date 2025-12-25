import type {ViewItemPayload} from './readViewItem'
import {setLastViewItem} from './viewItemStore'

type Callback = () => void

declare global {
    interface Window {
        dataLayer?: any[]
        __coralBonusDL__?: {
            patched: boolean
            subs: Set<Callback>
            timer: number | null
            delayMs: number
        }
    }
}

export function watchDataLayer(onChange: Callback, delayMs = 50): () => void {
    const w = window as any
    w.dataLayer = w.dataLayer || []
    const dl = w.dataLayer

    w.__coralBonusDL__ = w.__coralBonusDL__ || {
        patched: false,
        subs: new Set<Callback>(),
        timer: null as number | null,
        delayMs,
    }

    const store = w.__coralBonusDL__!
    store.delayMs = delayMs
    store.subs.add(onChange)

    const schedule = () => {
        if (store.timer != null) window.clearTimeout(store.timer)
        store.timer = window.setTimeout(() => {
            store.timer = null
            for (const cb of store.subs) cb()
        }, store.delayMs)
    }

    // Один раз: при старте — попробуем найти последний view_item из существующего dataLayer
    // (однократный проход - только при первой инициализации)
    const initLastViewItemOnce = () => {
        for (let i = dl.length - 1; i >= 0; i--) {
            const e = dl[i]
            if (e?.event === 'view_item' && e?.ecommerce?.items?.length) {
                setLastViewItem(e as ViewItemPayload)
                break
            }
        }
    }

    if (!store.patched) {
        store.patched = true
        initLastViewItemOnce()

        const originalPush = dl.push.bind(dl)
        dl.push = (...args: any[]) => {
            const res = originalPush(...args)

            const payload = args?.[0]

            // 1) если это view_item — обновляем кеш
            if (payload?.event === 'view_item' && payload?.ecommerce?.items?.length) {
                setLastViewItem(payload as ViewItemPayload)
                schedule()
                return res
            }

            // 2) если это user_id — тоже триггерим пересчёт (view_item кеш не трогаем)
            if (payload && Object.prototype.hasOwnProperty.call(payload, 'user_id')) {
                schedule()
                return res
            }

            return res
        }
    } else {
        // уже патчено — просто планируем пересчёт
        schedule()
    }

    // первичный пересчёт
    schedule()

    return () => {
        store.subs.delete(onChange)
    }
}
