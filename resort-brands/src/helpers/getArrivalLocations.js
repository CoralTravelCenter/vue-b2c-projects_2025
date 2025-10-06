import {ARRIVAL_LOCATIONS_API, doRequestToServer} from "../api";

const normalizeId = (id) => String(id).split("-")[0];

export async function getArrivalLocation(hotels) {
  if (hotels.value.length === 0) {
    console.error("getArrivalLocation: пустой/некорректный массив отелей");
    return [];
  }

  try {
    const responses = await Promise.all(
      hotels.value.map((name) =>
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
    const nameSet = new Set(hotels.value);
    const result = [];
    for (const [id, loc] of byId.entries()) {
      if (loc?.name && nameSet.has(loc.name)) {
        result.push({
          id,
          type: loc.type,
          name: loc.name,
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
