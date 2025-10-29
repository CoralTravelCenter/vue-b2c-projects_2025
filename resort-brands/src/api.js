export const ARRIVAL_LOCATIONS_API = '/endpoints/OnlyHotelProduct/ListArrivalLocations'
export const HOTEL_PRICE_API = '/endpoints/OnlyHotelProduct/PriceSearchList'
export const REDIRECT_URL_API = '/endpoints/OnlyHotelProduct/PriceSearchEncrypt'

export async function doRequestToServer(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    });

    // Проверяем HTTP-статус ответа
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error(`Request to ${url} failed:`, e.message);
    throw e;
  }
}
