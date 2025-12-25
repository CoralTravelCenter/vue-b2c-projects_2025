export type ViewItemEntry = {
    item_id?: string | number
    item_name?: string
    item_brand?: string
    price?: number
    item_variant?: string
}

export type ViewItemPayload = {
    ecommerce?: {
        value?: number
        items?: ViewItemEntry[]
        currency?: string
    }
    event?: string
}

import {getLastViewItem} from './viewItemStore'

export function findLastViewItem(): ViewItemPayload | null {
    return getLastViewItem()
}
