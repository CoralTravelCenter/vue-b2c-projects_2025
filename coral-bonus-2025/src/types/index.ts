interface Promo {
    name: string,
    value: number
}

interface CashbackData {
    name: string;
    promotions: Promo[];
    id: number;
}
