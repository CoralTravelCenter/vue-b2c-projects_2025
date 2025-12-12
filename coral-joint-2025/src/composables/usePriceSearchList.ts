import {DEFAULT_DEPARTURE, DEFAULT_DEPARTURE_FRIENDLY, DEFAULT_DEPARTURE_ID, PACKAGE_ENDPOINTS} from "@/api";
import useFetch from "./useFetch";
import {ArrivalLocation} from "@/types";
import type {ComputedRef} from "vue";

export default async function usePriceSearchList(location: ArrivalLocation, days: string[][], nights: ComputedRef<number>): Promise<any> {
    const payload = {
        searchSource: 1,
        searchCriterias: {
            additionalFilters: [],
            arrivalLocations: [location],
            beginDates: days,
            datePickerMode: 0,
            imageSizes: [4],
            departureLocations: [
                {
                    id: DEFAULT_DEPARTURE_ID,
                    name: DEFAULT_DEPARTURE,
                    friendlyUrl: DEFAULT_DEPARTURE_FRIENDLY,
                    type: 5,
                },
            ],

            flightType: 2,

            nights: [
                {
                    value: nights.value,
                },
            ],

            paging: {
                hasNextPage: false,
                hasPreviousPage: false,
                pageNumber: 1,
                pageSize: 20,
                sortType: 0,
            },

            reservationType: 0,

            roomCriterias: [
                {
                    passengers: [
                        {
                            age: 20,
                            passengerType: 0,
                        },
                        {
                            age: 20,
                            passengerType: 0,
                        }
                    ]
                },
            ],
        },
    };
    return await useFetch(PACKAGE_ENDPOINTS.PRICE_SEARCH_LIST, payload)
}
