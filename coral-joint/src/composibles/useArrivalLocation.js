import {PACKAGE_ENDPOINTS} from '@/api'
import useFetch from "@/composibles/useFetch";

const DEFAULT_DEPARTURE = 'Москва';
const DEFAULT_DEPARTURE_ID = '2671-5';
const DEFAULT_DEPARTURE_FRIENDLY = 'moskva';

export default async function usePackageArrivalLocation(hotels) {
  const requests = hotels.value.map(async hotel => {
    return useFetch(PACKAGE_ENDPOINTS.LIST_ARRIVAL_LOCATIONS, {
      departureLocations: [{
        id: DEFAULT_DEPARTURE_ID,
        name: DEFAULT_DEPARTURE,
        type: 5,
        friendlyUrl: DEFAULT_DEPARTURE_FRIENDLY
      }],
      text: hotel
    });
  })
  return Promise.all(requests);
}
