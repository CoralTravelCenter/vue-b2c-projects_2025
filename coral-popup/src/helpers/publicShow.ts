// helpers/publicShow.ts
import {nextTick} from 'vue'
import {lockScroll} from './scroll'
import {IPopupCtx} from "../types";

function fireMetrika(ymMetrika?: string) {
    if (!ymMetrika) return
    try {
        new Function(ymMetrika)()
    } catch (e) {
        console.warn('Ошибка выполнения ymMetrika:', e)
    }
}


export default async function publicShow(ctx: IPopupCtx) {
    if (ctx.visible.value) return

    ctx.mounted.value = true
    await nextTick()

    ctx.visible.value = true
    lockScroll()
    fireMetrika(ctx.ymMetrika)
}
