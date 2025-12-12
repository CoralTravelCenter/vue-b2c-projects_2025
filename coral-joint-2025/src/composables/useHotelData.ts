import {useArrivalLocation} from '@/composables/useArrivalLocation';
import type {ComputedRef} from 'vue';
import {useFilteredArrivalLocation} from "@/composables/useFilteredArrivalLocation";
import usePriceSearchEncrypt from "@/composables/usePriceSearchEncrypt";
import usePriceSearchList from "@/composables/usePriceSearchList";

export default async function useHotelData(
    names: ComputedRef<string[]>,
    days: ComputedRef<string[][]>,
    nights: string
): Promise<HotelItem[]> {
    const arrivalLocationResponses = await useArrivalLocation(names);
    const filteredArrivalLocations = arrivalLocationResponses.flatMap(arloc => {
        const locs = arloc?.result?.locations;
        return useFilteredArrivalLocation(names, locs)
    })

    return await Promise.all(
        filteredArrivalLocations.map(async (item, idx) => {
            const daysByHotel = days.value[idx];
            const [price, encrypt] = await Promise.all([
                usePriceSearchList(item, daysByHotel, nights),
                usePriceSearchEncrypt(item, daysByHotel, nights)
            ]);
            return {price: price?.result, encrypt: encrypt?.result};
        })
    );
}
