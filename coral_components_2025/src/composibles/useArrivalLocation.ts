import {PACKAGE_ENDPOINTS} from '@/api'
import useFetch from "@/composibles/useFetch";
import {ComputedRef} from "vue";
import {hostReactAppReady} from "@/utils";

const DEFAULT_DEPARTURE = 'Москва';
const DEFAULT_DEPARTURE_ID = '2671-5';
const DEFAULT_DEPARTURE_FRIENDLY = 'moskva';

let DEPARTURE: any;

(async () => {
    await hostReactAppReady()
    const NEXT_DATA = JSON.parse(<string>document.querySelector('#__NEXT_DATA__')?.textContent);
    DEPARTURE = NEXT_DATA.props.pageProps.pageData.meta.departures.filter((departure: any) => departure.isCurrent)
})()

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
                id: DEPARTURE.id || DEFAULT_DEPARTURE_ID,
                name: DEPARTURE.name || DEFAULT_DEPARTURE,
                type: 5,
                friendlyUrl: DEPARTURE.friendlyUrl || DEFAULT_DEPARTURE_FRIENDLY
            }],
            text: hotel
        })
    })
    return await Promise.all(requests)
}

export {useArrivalLocation, usePackageArrivalLocation}
