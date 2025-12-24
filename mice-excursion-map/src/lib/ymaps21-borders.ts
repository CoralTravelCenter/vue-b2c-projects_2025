type YMaps21 = typeof window.ymaps

let ymaps21Promise: Promise<YMaps21> | null = null
let bordersWorldPromise: Promise<any> | null = null

function loadScriptOnce(src: string) {
    return new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null
        if (existing) {
            if ((window as any).ymaps) return resolve()
            existing.addEventListener("load", () => resolve(), {once: true})
            existing.addEventListener("error", () => reject(new Error("Failed to load ymaps 2.1")), {once: true})
            return
        }

        const s = document.createElement("script")
        s.src = src
        s.async = true
        s.onload = () => resolve()
        s.onerror = () => reject(new Error("Failed to load ymaps 2.1"))
        document.head.appendChild(s)
    })
}

export function loadYmaps21(apikey: string, lang = "ru_RU") {
    if (ymaps21Promise) return ymaps21Promise

    const src =
        `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apikey)}` +
        `&lang=${encodeURIComponent(lang)}&coordorder=latlong`

    ymaps21Promise = (async () => {
        await loadScriptOnce(src)
        const ymaps = (window as any).ymaps as YMaps21
        await new Promise<void>((resolve) => ymaps.ready(resolve))
        return ymaps
    })()

    return ymaps21Promise
}

export async function loadWorldBorders21(apikey: string) {
    if (bordersWorldPromise) return bordersWorldPromise
    const ymaps = await loadYmaps21(apikey)
    bordersWorldPromise = ymaps.borders.load("001", {lang: "ru", quality: 3})
    return bordersWorldPromise
}
