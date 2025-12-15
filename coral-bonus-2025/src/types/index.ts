export interface ICashbackPromotion {
    name: string;
    value: number;
}

export interface ICashbackData {
    id: number;
    name: string;
    promotions: ICashbackPromotion[];
}

export interface IWindow {
    _coralBonusCashback?: ICashbackData[];
    insider_object?: {
        product?: { id?: number | string };
    };
}
