import {PACKAGE_ENDPOINTS} from "@/api";
import useFetch from "@/composibles/useFetch";
import {ArrivalLocation} from "@/types";
import {ComputedRef} from "vue";


export default async function usePriceSearchEncrypt(locations: ArrivalLocation[], days: ComputedRef<string[][]>, nights: string): Promise<any> {
    const payload = {
        searchCriterias: {
            reservationType: 2,
            beginDates: days.value,
            nights: [{value: nights}],
            imageSizes: [],
            roomCriterias: [
                {
                    passengers: [
                        {passengerType: 0, age: 20},
                        {passengerType: 0, age: 20},
                    ],
                },
            ],
            arrivalLocations: locations,
            paging: {
                pageNumber: 1,
                pageSize: locations.length,
                sortType: 0,
            },
        },
    }
    console.log(payload);
    return await useFetch(PACKAGE_ENDPOINTS.PRICE_SEARCH_LIST, payload)
}
