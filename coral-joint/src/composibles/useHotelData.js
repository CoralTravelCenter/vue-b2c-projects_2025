import usePackageArrivalLocation from '@/composibles/useArrivalLocation.js'
import useFilteredData from '@/composibles/useFilteredData.js'
import usePriceSearchList from '@/composibles/usePriceSearchList.js'
import {findObjectByKey} from "@/usefuls";


export default async function useHotelData(
  names,
  days,
  nights
) {
  const arrivalLocations = await usePackageArrivalLocation(names);

  const filteredArrivalLocations = (arrivalLocations ?? [])
    .flatMap(item => useFilteredData(names.value, item?.result?.locations ?? []))
    .filter(Boolean)

  const data = await usePriceSearchList(
    filteredArrivalLocations,
    days,
    nights
  )

  const result = data?.result

  // 5) Хулпер для парвильного возвращения категории
  const ratingFormatter = obj => {
    const categoryName = obj.name
    if (obj.name.includes('*')) {
      const cleanedName = categoryName.replace('*', '').trim();
      return Number(cleanedName);
    } else {
      return categoryName;
    }
  };

  // 6) Форматер выносим из цикла
  const rub = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  })

  // 7) Продукты
  return result?.products.map(prod => {
    const hotelName = prod.hotel.name
    const location = prod.hotel.locationSummary
    const visual = prod.hotel.images[0].sizes[0].url
    const amount = prod?.offers?.[0]?.price?.amount
    const serverPrice = Number.isFinite(Number(amount)) ? Math.ceil(Number(amount)) : 0
    const formattedPrice = rub.format(serverPrice)
    const isElite = Boolean(prod?.hotel?.eliteHotel)
    const rating = ratingFormatter(findObjectByKey(prod.hotel.categoryKey, result?.hotelCategories))
    const dates = days
    const meal = prod.roomAlternatives.mealNames
    return {formattedPrice, isElite, hotelName, location, visual, rating, dates, meal}
  })
}
