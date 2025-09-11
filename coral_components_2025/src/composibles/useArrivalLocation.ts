import {ONLY_HOTEL_ENDPOINTS} from '@/api'
import useFetch from "@/composibles/useFetch";
import {ComputedRef} from "vue";

export default async function useArrivalLocation(hotels: ComputedRef<string[]>) {
    const requests = hotels.value.map(async (hotel: string): Promise<any> => {
        return await useFetch(ONLY_HOTEL_ENDPOINTS.LIST_ARRIVAL_LOCATIONS, {
            text: hotel
        })
    })
    return await Promise.all(requests)
}
