import {DEFAULT_DEPARTURE, DEFAULT_DEPARTURE_FRIENDLY, DEFAULT_DEPARTURE_ID, PACKAGE_ENDPOINTS} from '@/api'
import useFetch from "./useFetch";

async function useArrivalLocation(hotels: ComputedRef<string[]>) {
    const requests = hotels.value.map(async (hotel: string): Promise<any> => {
        return await useFetch(PACKAGE_ENDPOINTS.LIST_ARRIVAL_LOCATIONS, {
            text: hotel
        })
    })
    return await Promise.all(requests)
}

async function usePackageArrivalLocation(hotels: ComputedRef<string[]>) {
    const requests = hotels.value.map(async (hotel: string): Promise<any> => {
        return await useFetch(PACKAGE_ENDPOINTS.LIST_ARRIVAL_LOCATIONS, {
            departureLocations: [{
                id: DEFAULT_DEPARTURE_ID,
                name: DEFAULT_DEPARTURE,
                type: 5,
                friendlyUrl: DEFAULT_DEPARTURE_FRIENDLY
            }],
            text: hotel
        })
    })
    return await Promise.all(requests)
}

export {useArrivalLocation, usePackageArrivalLocation}
