import {get, set} from "idb-keyval"
import {loadWorldBorders21} from "@/lib/ymaps21-borders"

const CACHE_VERSION = 1
const KEY = `ymaps21:borders:001:ru:q3:v${CACHE_VERSION}`
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 365 // 365 дней

type CacheRecord = { ts: number; data: any }

function toPlainJson(data: any) {
    // на случай если там есть не-клонируемые штуки — делаем JSON-safe копию
    return JSON.parse(JSON.stringify(data))
}

export async function getWorldBordersCached(apikey: string) {
    try {
        const cached = await get<CacheRecord>(KEY)
        if (cached?.data && (Date.now() - cached.ts) < MAX_AGE_MS) {
            return cached.data
        }
    } catch {
        // если IndexedDB недоступен — просто грузим с сети
    }

    const live = await loadWorldBorders21(apikey)
    const plain = toPlainJson(live)

    try {
        await set(KEY, {ts: Date.now(), data: plain} satisfies CacheRecord)
    } catch {
        // не смогли сохранить — не критично
    }

    return plain
}
