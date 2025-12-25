import type {NormalizedInput, Stars} from '../types'
import {findLastViewItem} from './readViewItem'
import {isNewUserFromDataLayer} from './readUser'

function toNumber(x: any, fallback = 0) {
    const n = Number(x)
    return Number.isFinite(n) ? n : fallback
}

function extractStarsFromName(name: string | undefined): Stars | null {
    if (!name) return null
    const m = name.match(/([3-5])\s*\*/i)
    if (!m) return null
    const s = Number(m[1])
    return (s === 3 || s === 4 || s === 5) ? (s as Stars) : null
}

export function normalizeFromDataLayer(now = new Date()): NormalizedInput {
    const viewItem = findLastViewItem()
    const item = viewItem?.ecommerce?.items?.[0]

    const priceRub =
        toNumber(viewItem?.ecommerce?.value, 0) ||
        toNumber(item?.price, 0)

    const hotelId = item?.item_id != null ? String(item.item_id) : null
    const hotelName = item?.item_name != null ? String(item.item_name) : null
    const countryName = item?.item_brand != null ? String(item.item_brand) : null
    const hotelStars = extractStarsFromName(item?.item_name)

    return {
        now,
        countryName,
        hotelId,
        hotelName,
        hotelStars,
        priceRub,
        isNewUser: isNewUserFromDataLayer(),
    }
}
