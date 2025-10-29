import {getHotelData} from "./getHotelsData.js";
import {getArrivalLocation} from "./getArrivalLocations.js";

/**
 * Универсальный фетч данных с кэшом
 * управляет isLoading/isError
 */
export async function fetchData(
  isError,      // Ref
  isLoading,    // Ref
  dataCache,    // Ref<Record<string, any>>
  key,          // string
  hotels,       // string[]
  range,        // [from, to]
  nights        // number
) {
  isError.value = null;

  // гварды
  if (!Array.isArray(hotels) || hotels.length === 0) return [];
  if (!Array.isArray(range) || range.length !== 2) return [];
  if (!nights) return [];

  // cache hit
  const cached = dataCache.value[key];
  if (cached) return cached;

  isLoading.value = true;
  try {
    const arvLoc = await getArrivalLocation(hotels);
    const res = await getHotelData(arvLoc, range, nights);
    dataCache.value[key] = res;
    return res;
  } catch (e) {
    isError.value = e?.message || "Не удалось загрузить данные";
    return [];
  } finally {
    isLoading.value = false;
  }
}
