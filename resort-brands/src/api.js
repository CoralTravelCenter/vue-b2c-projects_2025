export const ARRIVAL_LOCATIONS_API = '/endpoints/PackageTourHotelProduct/ListArrivalLocations'
export const HOTEL_PRICE_API = '/endpoints/PackageTourHotelProduct/PriceSearchList'
export const REDIRECT_URL_API = '/endpoints/PackageTourHotelProduct/PriceSearchEncrypt'

export const DEFAULT_DEPARTURE = {
  id: '2671-5',
  name: 'Москва',
  friendlyUrl: 'moskva',
  type: 5,
}

export async function doRequestToServer(url, data, {signal} = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
      signal,
    });

    // Проверяем HTTP-статус ответа
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    if (e?.name !== 'AbortError') {
      console.error(`Request to ${url} failed:`, e.message);
    }
    throw e;
  }
}
