import {DEFAULT_DEPARTURE, doRequestToServer, REDIRECT_URL_API} from "../api.js";

export async function getRedirectUrl(arvLoc, brandDatesRange, brandNightsQuantity) {
  const payload = {
    additionalFilters: [],
    reservationType: 1,
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
  }

  return doRequestToServer(REDIRECT_URL_API, payload);
}
