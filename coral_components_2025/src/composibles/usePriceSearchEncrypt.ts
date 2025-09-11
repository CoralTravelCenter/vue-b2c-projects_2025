import {ONLY_HOTEL_ENDPOINTS} from "@/api";
import useFetch from "@/composibles/useFetch";
import {calculateDates} from "@/utils";
import {ArrivalLocation} from "@/types";


export default async function usePriceSearchEncrypt(locations: ArrivalLocation[], days: number, nights: number): Promise<any> {
    const beginDates = calculateDates(days, nights);
    const payload = {
        searchCriterias: {
            beginDates,
            arrivalLocations: locations,
            nights: [{value: nights}],
            roomCriterias: [
                {
                    passengers: [
                        {age: 20, passengerType: 0},
                        {age: 20, passengerType: 0},
                    ],
                },
            ],
            reservationType: 2,
            paging: {
                pageNumber: 1,
                pageSize: 20,
                sortType: 0,
            },
            additionalFilters: [],
            imageSizes: [3],
            categories: [],
        }
    }
    const data = await useFetch(ONLY_HOTEL_ENDPOINTS.PRICE_SEARCH_LIST, payload)
    return {data, beginDates}
}
