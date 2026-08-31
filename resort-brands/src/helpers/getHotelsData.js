import {DEFAULT_DEPARTURE, doRequestToServer, HOTEL_PRICE_API} from "../api.js";
import {getParsedRating} from "./getParsedRating.js";

export async function getHotelData(arvLoc, brandDatesRange, brandNightsQuantity, {signal} = {}) {
  if (!Array.isArray(arvLoc) || arvLoc.length === 0) return [];

  const payload = {
    searchSource: 1,
    searchCriterias: {
      additionalFilters: [],
      reservationType: 0,
      beginDates: brandDatesRange,
      datePickerMode: 0,
      departureLocations: [DEFAULT_DEPARTURE],
      flightType: 2,
      nights: [{value: brandNightsQuantity}],
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
        hasNextPage: false,
        hasPreviousPage: false,
        pageNumber: 1,
        pageSize: arvLoc.length,
        sortType: 0,
      },
    },
  }

  const response = await doRequestToServer(HOTEL_PRICE_API, payload, {signal});

  const hotelCategories = response?.result?.hotelCategories ?? {};
  const products = response?.result?.products ?? [];

  if (products.length === 0) return [];

  return products.map(obj => {
    const {hotel, offers} = obj;
    const rawPrice = Number(offers?.[0]?.price?.amount);

    return {
      price: Number.isFinite(rawPrice) ? rawPrice : null,
      name: hotel?.name ?? "Без названия",
      location_name: hotel?.locationSummary
        ? hotel.locationSummary.split(',').slice(1, 3).map((part) => part.trim()).join(', ')
        : "Неизвестная локация",
      img: hotel?.images?.[0]?.sizes?.[0]?.url,
      rating: getParsedRating(hotelCategories[hotel?.categoryKey]?.name),
    };
  });
}
