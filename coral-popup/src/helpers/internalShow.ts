import {nextTick} from "vue";

async function internalShow() {
    if (visible.value) return
    if (wasAutoShown.value) return

    // ВАЖНО: фиксируем сразу, как только автопоказ стартовал
    wasAutoShown.value = true

    mounted.value = true
    await nextTick()

    visible.value = true
    lockScroll()
    fireMetrika()
}
