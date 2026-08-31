import {ARRIVAL_LOCATIONS_API, doRequestToServer} from "../api.js";

const REQUEST_BATCH_SIZE = 5;

const normalizeId = (id) => id == null ? "" : String(id).split("-")[0].trim();
const normalizeHotelName = (name) => String(name).trim().toLocaleLowerCase();

export async function getArrivalLocationDetails(hotels, {signal} = {}) {
  const normalizedHotels = Array.from(
    new Set(
      (Array.isArray(hotels) ? hotels : [])
        .filter((name) => typeof name === "string")
        .map((name) => name.trim())
        .filter(Boolean)
    )
  );

  if (normalizedHotels.length === 0) {
    return {locations: [], missingHotels: []};
  }

  const responses = [];
  for (let index = 0; index < normalizedHotels.length; index += REQUEST_BATCH_SIZE) {
    const names = normalizedHotels.slice(index, index + REQUEST_BATCH_SIZE);
    const batch = await Promise.all(
      names.map((name) => doRequestToServer(ARRIVAL_LOCATIONS_API, {text: name}, {signal}))
    );
    responses.push(...batch);
  }

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

  const requestedByNormalizedName = new Map(
    normalizedHotels.map((name) => [normalizeHotelName(name), name])
  );
  const result = [];
  for (const [id, loc] of byId.entries()) {
    const locationName = typeof loc?.name === "string" ? loc.name.trim() : "";
    if (locationName && requestedByNormalizedName.has(normalizeHotelName(locationName))) {
      result.push({
        id,
        type: loc.type,
        name: locationName,
        friendlyUrl: loc.friendlyUrl,
      });
    }
  }

  const resolvedNames = new Set(result.map((location) => normalizeHotelName(location.name)));
  const missingHotels = normalizedHotels.filter((name) => !resolvedNames.has(normalizeHotelName(name)));

  return {locations: result, missingHotels};
}

export async function getArrivalLocation(hotels, options) {
  const {locations} = await getArrivalLocationDetails(hotels, options);
  return locations;
}
