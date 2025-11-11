import {PACKAGE_ENDPOINTS} from "@/api";
import useFetch from "@/composibles/useFetch.js";

export default async function usePriceSearchList(locations, days, nights) {
  const payload = {
    beginDates: days.value,
    arrivalLocations: locations,
    departureLocations: [
      {
        id: "2671-5",
        name: "Москва",
        type: 5,
        friendlyUrl: "moskva"
      }
    ],
    nights: [
      {
        value: nights
      }
    ],
    datePickerMode: 0,
    roomCriterias: [
      {
        passengers: [
          {
            age: 20,
            passengerType: 0
          },
          {
            age: 20,
            passengerType: 0
          },
        ]
      }
    ],
    reservationType: 0,
    paging: {
      hasNextPage: false,
      hasPreviousPage: false,
      pageNumber: 1,
      pageSize: 20,
      sortType: 0
    },
    additionalFilters: [],
    imageSizes: [0],
    flightType: 2
  }
  console.log(payload)
  return await useFetch(PACKAGE_ENDPOINTS.PRICE_SEARCH_LIST, payload);
}
