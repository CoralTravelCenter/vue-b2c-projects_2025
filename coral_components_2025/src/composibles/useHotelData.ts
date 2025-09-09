import useArrivalLocation from '@/composibles/useArrivalLocation'
import {ComputedRef} from 'vue'
import {useFilteredData} from '@/composibles/useFilteredData'
import usePriceSearchEncrypt from '@/composibles/usePriceSearchEncrypt'
import {Category} from "@/types";


export default async function useHotelData(
    arr: ComputedRef<string[]>,
    days: string,
    nights: string
): Promise<{
    data: Array<{ formattedPrice: string; isElite: boolean }>
    rating: string[]
}> {
    // 1) Подтянули значения и привели типы
    const names: string[] = (arr?.value ?? []).filter(Boolean)
    const d = Number.parseInt(days, 10)
    const n = Number.parseInt(nights, 10)

    // 2) Достаём arrivalLocations
    const arrivalLocations = await useArrivalLocation(names)

    // 3) Безопасный flatMap + защита от пустых locations
    const filteredArrivalLocations = (arrivalLocations ?? [])
        .flatMap(item => useFilteredData(names, item?.result?.locations ?? []))
        .filter(Boolean)

    // 4) Поиск цен/шифрования
    const priceSearchEncrypt = await usePriceSearchEncrypt(
        filteredArrivalLocations,
        Number.isFinite(d) ? d : 0,
        Number.isFinite(n) ? n : 0
    )

    const result = priceSearchEncrypt?.result

    // 5) Рейтинги отелей
    const rating = Object.values(result?.hotelCategories).map((cat) => (cat as Category).name).filter(Boolean) as string[]

    // 6) Форматер выносим из цикла
    const rub = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        maximumFractionDigits: 0,
        currency: 'RUB',
    })

    // 7) Продукты → безопасное извлечение цены и признака
    const data = result?.products.map((prod: any) => {
        const hotelName = prod.name
        const location = prod.locationSummary
        const amount = prod?.offers?.[0]?.price?.amount
        const serverPrice = Number.isFinite(Number(amount)) ? Math.ceil(Number(amount)) : 0
        const formattedPrice = rub.format(serverPrice)
        const isElite = Boolean(prod?.hotel?.eliteHotel)
        return {formattedPrice, isElite, hotelName, location}
    })

    return {data, rating}
}
