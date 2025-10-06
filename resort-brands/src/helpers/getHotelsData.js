import {doRequestToServer, HOTEL_PRICE_API} from "../api.js";
import {getParsedRating} from "./getParsedRating.js";

export async function getHotelData(arvLoc, brandDatesRange, brandNightsQuantity) {
  const payload = {
    searchCriterias: {
      reservationType: 2,
      beginDates: brandDatesRange.value,
      nights: [{value: brandNightsQuantity.value}],
      imageSizes: [4],
      roomCriterias: [
        {
          passengers: [
            {passengerType: 0, age: 20},
            {passengerType: 0, age: 20},
          ],
        },
      ],
      arrivalLocations: arvLoc,
      paging: {
        pageNumber: 1,
        pageSize: arvLoc.length,
        sortType: 0,
      },
    },
  }

  try {
    const response = await doRequestToServer(HOTEL_PRICE_API, payload);

    const hotelCategories = response?.result?.hotelCategories ?? {};
    const products = response?.result?.products ?? [];

    if (products.length === 0) return null;

    return products.map(obj => {
      const {hotel, offers} = obj;
      return {
        price: offers?.[0]?.price?.amount ?? null,
        name: hotel?.name ?? "Без названия",
        location_name: hotel?.locationSummary
          ? hotel.locationSummary.split(',').slice(1, 3).join(',')
          : "Неизвестная локация",
        img: hotel?.images?.[0]?.sizes?.[0]?.url,
        marker_img: hotel?.images?.[0]?.sizes?.[0]?.url,
        rating: getParsedRating(hotelCategories[hotel?.categoryKey]?.name),
      };
    });
  } catch (e) {
    console.error("Ошибка загрузки локаций:", e);
    return null;
  }
}
