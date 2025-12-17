import {nextTick} from "vue";
import {lockScroll} from "./scroll.ts";
import fireMetrika from "./fireMetrika.ts";

export default async function publicShow(visible, mounted, ymMetrika, id) {
    if (visible.value) return


    mounted.value = true
    await nextTick()

    visible.value = true
    lockScroll()
    fireMetrika(ymMetrika)
}
