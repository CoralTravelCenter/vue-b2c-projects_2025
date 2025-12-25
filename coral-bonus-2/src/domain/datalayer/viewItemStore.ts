import type {ViewItemPayload} from './readViewItem'

declare global {
    interface Window {
        __coralBonusLastViewItem__?: ViewItemPayload | null
    }
}

export function setLastViewItem(v: ViewItemPayload | null) {
    window.__coralBonusLastViewItem__ = v
}

export function getLastViewItem(): ViewItemPayload | null {
    return window.__coralBonusLastViewItem__ ?? null
}
