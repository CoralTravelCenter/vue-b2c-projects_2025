interface HotelCategory {
    isHalfStar: boolean
    name: string
    starCount: number
}

type HotelCategoryKey = string

export default function getRating(category: HotelCategory, key: HotelCategoryKey): number | string {
    const catValue = category[key];
    if (catValue?.name.includes('*')) {
        return Number(catValue?.name.replace('*', '').trim());
    } else {
        return catValue?.name;
    }
}
