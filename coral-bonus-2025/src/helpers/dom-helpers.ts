// dom-helpers.ts
import type {ICashbackData} from "@/types";

export type UpsertFn = (el: HTMLElement, props?: Record<string, unknown>) => void;

export function waitForGlobals(keys: string[], pollMs = 300): Promise<void> {
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            const ready = keys.every((k) => (window as any)[k]);
            if (ready) {
                clearInterval(timer);
                resolve();
            }
        }, pollMs);
    });
}

export function isHotelWithCashback(cashback: ICashbackData[]): boolean {
    const insider = (window as any).insider_object;
    const insiderHotelId = Number(insider?.product?.id);
    if (!Number.isFinite(insiderHotelId)) return false;

    return cashback.some((h) => h.id === insiderHotelId);
}

export function registerCards(node: HTMLElement, upsert: UpsertFn) {
    const sel = 'div[class*="CoralBonusInformation_coralBonusInformation__"]';

    const cards: HTMLElement[] = [];
    if (node.matches(sel)) cards.push(node);
    node.querySelectorAll<HTMLElement>(sel).forEach((c) => cards.push(c));

    cards.forEach((card) => upsert(card));
}

export function registerHotelListCards(node: HTMLElement, cashbackIds: Set<number>, upsert: UpsertFn) {
    const cards: HTMLElement[] = [];
    const sel = `[id^="hotelListCard"]`;

    if (node.matches(sel)) cards.push(node);
    node.querySelectorAll<HTMLElement>(sel).forEach((c) => cards.push(c));

    const hostSel = 'div[class*="CoralBonusInformation_coralBonusInformation__"]';

    cards.forEach((card) => {
        const m = card.id.match(/^hotelListCard(\d+)$/);
        const hotelId = m ? Number(m[1]) : NaN;
        if (!Number.isFinite(hotelId)) return;
        if (!cashbackIds.has(hotelId)) return;

        const host = card.querySelector<HTMLElement>(hostSel);
        if (!host) return;

        upsert(host, {hotelId});
    });
}

export function readCashbackFromScript(data: any): ICashbackData[] {
    const raw = (data.textContent ?? "").trim();
    if (!raw) return [];

    try {
        const data = JSON.parse(raw);
        return Array.isArray(data) ? (data as ICashbackData[]) : [];
    } catch {
        return [];
    }
}
