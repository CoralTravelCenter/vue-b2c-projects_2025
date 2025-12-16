export interface ICashbackPromotion {
    name: string;
    value: number;
}

export interface ICashbackData {
    id: number;
    name: string;
    promotions: ICashbackPromotion[];
}

export interface IOverlayDetail {
    action: "open" | "close";
    targetId: string;
    label?: string;
    ui: "tooltip" | "popover";
    hotelId?: number;
    promoCount?: number;
}
