import type {NormalizedInput} from '../types'
import {findLastViewItem} from './readViewItem'
import {isNewUserFromDataLayer} from './readUser'

function toNumber(x: any, fallback = 0) {
    const n = Number(x)
    return Number.isFinite(n) ? n : fallback
}

function readStarsFromInsider(): 3 | 4 | 5 | null {
    const raw = (window as any).insider_object?.product?.custom?.Star
    if (raw == null) return null

    // допускаем "4", 4, "4*", "4*DELUXE"
    const m = String(raw).match(/[345]/)
    if (!m) return null

    const n = Number(m[0])
    return (n === 3 || n === 4 || n === 5) ? (n as 3 | 4 | 5) : null
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
    const hotelStars = readStarsFromInsider()

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
