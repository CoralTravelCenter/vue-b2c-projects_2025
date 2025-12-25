export type Stars = 3 | 4 | 5

export type NormalizedInput = {
    now: Date

    // Текущий товар из dataLayer view_item
    countryName: string | null // например "Египет" (из item_brand)
    hotelId: string | null     // item_id
    hotelName: string | null   // item_name
    hotelStars: Stars | null   // парсим из hotelName: "4*"
    priceRub: number           // ecommerce.value (fallback item.price)

    // Пользователь
    isNewUser: boolean         // если нет user_id или он пустой
}
