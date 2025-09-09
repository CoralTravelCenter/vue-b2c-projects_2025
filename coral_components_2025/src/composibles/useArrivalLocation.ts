import {ONLY_HOTEL_ENDPOINTS} from '@/api'
import useFetch from "@/composibles/useFetch";

export default async function useArrivalLocation(hotels: string[]) {
    const requests = hotels.map(async (hotel: string): Promise<any> => {
        return await useFetch(ONLY_HOTEL_ENDPOINTS.LIST_ARRIVAL_LOCATIONS, {
            text: hotel
        })
    })
    return await Promise.all(requests)
}
