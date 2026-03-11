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
  if (!Number.isFinite(nights) || nights <= 0) return [];

  // cache hit
  if (Object.prototype.hasOwnProperty.call(dataCache.value, key)) {
    return dataCache.value[key];
  }

  isLoading.value = true;
  try {
    const arvLoc = await getArrivalLocation(hotels);
    const res = await getHotelData(arvLoc, range, nights);
    const normalized = Array.isArray(res) ? res : [];
    dataCache.value[key] = normalized;
    return normalized;
  } catch (e) {
    isError.value = e?.message || "Не удалось загрузить данные";
    return [];
  } finally {
    isLoading.value = false;
  }
}
