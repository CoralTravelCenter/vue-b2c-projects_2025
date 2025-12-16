import {toNum} from "./number";

export type TargetProps = { hotelId?: number; ymLabel?: string };

export type TargetLike = {
    id: string | number;
    el?: HTMLElement | null;
    props?: TargetProps | unknown;
};

export function resolveHotelId(target: TargetLike | undefined, fallbackId: number): number | null {
    const raw = (target?.props as TargetProps | undefined)?.hotelId;
    const fromProps = toNum(raw);
    return fromProps ?? toNum(fallbackId);
}

export function getYmLabel(target: TargetLike | undefined): string | undefined {
    return (target?.props as TargetProps | undefined)?.ymLabel;
}
