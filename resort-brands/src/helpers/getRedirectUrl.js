import {doRequestToServer, REDIRECT_URL_API} from "../api.js";

export async function getRedirectUrl(arvLoc, brandDatesRange, brandNightsQuantity) {
  const payload = {
    reservationType: 2,
    beginDates: brandDatesRange,
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
      pageNumber: 1,
      pageSize: arvLoc.length,
      sortType: 0,
    },
  }

  try {
    return await doRequestToServer(REDIRECT_URL_API, payload);
  } catch (e) {
    console.error("Ошибка получения ссылки:", e);
    return null;
  }
}
