// helpers/publicShow.ts
import {nextTick} from 'vue'
import type {ICtx} from "../types";
import {enablePageScroll} from "@fluejs/noscroll";

function fireMetrika(ymMetrika?: string) {
    if (!ymMetrika) return
    try {
        new Function(ymMetrika)()
    } catch (e) {
        console.warn('Ошибка выполнения ymMetrika:', e)
    }
}


export default async function publicShow(ctx: ICtx) {
    if (ctx.visible.value) return

    ctx.mounted.value = true
    await nextTick()

    ctx.visible.value = true
    enablePageScroll()
    fireMetrika(ctx.ymMetrika)
}
