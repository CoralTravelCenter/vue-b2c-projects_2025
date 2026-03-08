import {ARRIVAL_LOCATIONS_API, doRequestToServer} from "../api.js";

const normalizeId = (id) => String(id).split("-")[0];

export async function getArrivalLocation(hotels) {
  const normalizedHotels = Array.from(
    new Set(
      (Array.isArray(hotels) ? hotels : [])
        .filter((name) => typeof name === "string")
        .map((name) => name.trim())
        .filter(Boolean)
    )
  );

  if (normalizedHotels.length === 0) {
    console.error("getArrivalLocation: пустой/некорректный массив отелей");
    return [];
  }

  try {
    const responses = await Promise.all(
      normalizedHotels.map((name) =>
        doRequestToServer(ARRIVAL_LOCATIONS_API, {text: name})
      )
    );

    // 1) собираем все локации и УБИРАЕМ ДУБЛИКАТЫ ПО id (id до дефиса)
    const byId = new Map();
    for (const res of responses) {
      const list = res?.result?.locations ?? [];
      for (const loc of list) {
        const id = normalizeId(loc?.id);
        if (id && !byId.has(id)) {
          byId.set(id, loc);
        }
      }
    }

    // 2) СТРОГО фильтруем по имени (ровно как передали)
    const nameSet = new Set(normalizedHotels);
    const result = [];
    for (const [id, loc] of byId.entries()) {
      const locationName = typeof loc?.name === "string" ? loc.name.trim() : "";
      if (locationName && nameSet.has(locationName)) {
        result.push({
          id,
          type: loc.type,
          name: locationName,
          friendlyUrl: loc.friendlyUrl,
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Ошибка загрузки локаций:", error);
    return [];
  }
}
