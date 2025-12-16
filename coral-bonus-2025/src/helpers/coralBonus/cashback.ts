import type {ICashbackData} from "@/types";
import type {TargetLike} from "./targetMeta";
import {resolveHotelId} from "./targetMeta";

export type CashbackLookups = {
    byId: Map<number, ICashbackData>;
    promoSumById: Map<number, number>;
};

export function makeCashbackLookups(list: ICashbackData[]): CashbackLookups {
    const byId = new Map<number, ICashbackData>();
    const promoSumById = new Map<number, number>();

    for (const item of list) {
        byId.set(item.id, item);

        const sum =
            item.promotions?.reduce((acc: number, p: any) => acc + (Number(p?.value) || 0), 0) ?? 0;
        promoSumById.set(item.id, sum);
    }

    return {byId, promoSumById};
}

export function promosForTarget(
    target: TargetLike,
    lookups: CashbackLookups,
    fallbackId: number,
) {
    const id = resolveHotelId(target, fallbackId);
    if (!id) return [];

    const promos = lookups.byId.get(id)?.promotions ?? [];
    if (promos.length > 0) return promos;

    // fallback если пусто
    const fb = lookups.byId.get(fallbackId)?.promotions ?? [];
    return fb;
}

export function promoSumForTarget(
    target: TargetLike,
    lookups: CashbackLookups,
    fallbackId: number,
) {
    const id = resolveHotelId(target, fallbackId);
    if (!id) return 0;

    const sum = lookups.promoSumById.get(id) ?? 0;
    if (sum > 0) return sum;

    // fallback если пусто
    return lookups.promoSumById.get(fallbackId) ?? 0;
}
