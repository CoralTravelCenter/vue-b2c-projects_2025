import {getHotelData} from "./getHotelsData.js";
import {getArrivalLocationDetails} from "./getArrivalLocations.js";

const emptyResult = (status, missingHotels = []) => ({items: [], status, missingHotels});

function isExpiredRange(range) {
  const endDate = Date.parse(`${range[1]}T23:59:59`);
  return Number.isFinite(endDate) && endDate < Date.now();
}

/** Загружает и кэширует предложения для набора поисковых параметров. */
export async function fetchData(
  dataCache,    // Ref<Record<string, any>>
  key,          // string
  hotels,       // string[]
  range,        // [from, to]
  nights,       // number
  signal
) {
  // гварды
  if (!Array.isArray(hotels) || hotels.length === 0) return emptyResult('invalid-config');
  if (!Array.isArray(range) || range.length !== 2) return emptyResult('invalid-config');
  if (!Number.isFinite(nights) || nights <= 0) return emptyResult('invalid-config');
  if (isExpiredRange(range)) return emptyResult('expired');

  // cache hit
  if (Object.prototype.hasOwnProperty.call(dataCache.value, key)) {
    const cached = dataCache.value[key];
    return Array.isArray(cached)
      ? {items: cached, status: cached.length ? 'success' : 'no-offers', missingHotels: []}
      : cached;
  }

  const {locations, missingHotels} = await getArrivalLocationDetails(hotels, {signal});
  if (locations.length === 0) return emptyResult('no-locations', missingHotels);

  const response = await getHotelData(locations, range, nights, {signal});
  const items = Array.isArray(response) ? response : [];
  const result = {
    items,
    status: items.length ? 'success' : 'no-offers',
    missingHotels,
  };
  dataCache.value = {...dataCache.value, [key]: result};
  return result;
}
