import {toNum} from "./number";

type AnyRecord = Record<string, any>;

export function parseViewItemPrice(payload: unknown): number | null {
    const p = payload as AnyRecord;
    return toNum(p?.ecommerce?.value);
}

export function upsertPricesFromViewItemList(
    payload: unknown,
    priceByHotelId: Record<number, number>,
) {
    const p = payload as AnyRecord;
    const items = p?.ecommerce?.items;
    if (!Array.isArray(items)) return;

    for (const it of items) {
        const hid = toNum(it?.item_id ?? it?.id ?? it?.itemId);
        const price = toNum(it?.price ?? it?.item_price ?? it?.itemPrice ?? it?.value ?? it?.item_value);
        if (hid != null && price != null) priceByHotelId[hid] = price;
    }
}
