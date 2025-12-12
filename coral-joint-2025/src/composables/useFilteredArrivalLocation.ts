import type {ComputedRef} from "vue";

export function useFilteredArrivalLocation(hotelNames: ComputedRef<string[]>, arloc: ArivalLocation[]) {
    const nameSet = new Set(
        hotelNames.value.map(s => s.trim().toLowerCase())
    );
    return arloc.filter(item =>
        nameSet.has(item.name.trim().toLowerCase())
    );
}
