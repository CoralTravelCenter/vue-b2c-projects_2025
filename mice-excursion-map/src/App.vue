<script setup lang="ts">
import {computed, onMounted, ref} from "vue"
import type {Feature} from "geojson"
import YamapMap from "@/components/YamapMap.vue"
import {getWorldBordersCached} from "@/lib/bordersCache"

type YamapCountry = { country_name: string }

function readSettingsOnce(): YamapCountry[] {
	const raw = (window as any)._yamap_settings || []
	return Array.isArray(raw) ? raw : [raw]
}

const countries = ref<YamapCountry[]>([])
const bordersAll = ref<any>(null)

const norm = (s: unknown) => String(s ?? "").trim().toLowerCase()

// если будут расхождения имен между твоими данными и ymaps.borders — добавишь сюда
const NAME_ALIASES: Record<string, string> = {
	// "ОАЭ": "Объединенные Арабские Эмираты",
	// "Китайская Народная Республика": "Китай",
}

const neededNames = computed(() => {
	const set = new Set<string>()
	for (const c of countries.value) {
		const name = String(c?.country_name ?? "").trim()
		set.add(norm(NAME_ALIASES[name] ?? name))
	}
	return set
})

// ymaps2.1 => [lat,lon], ymaps3 => [lon,lat]
function swapLatLonDeep(coords: any): any {
	if (!Array.isArray(coords)) return coords
	if (coords.length === 2 && typeof coords[0] === "number" && typeof coords[1] === "number") {
		return [coords[1], coords[0]]
	}
	return coords.map(swapLatLonDeep)
}

const highlightFeatures = computed<Feature[]>(() => {
	const geo = bordersAll.value
	if (!geo?.features?.length) return []

	const set = neededNames.value

	return (geo.features as any[])
			.filter((f) => set.has(norm(f?.properties?.name)))
			.map((f) => ({
				...f,
				geometry: f?.geometry
						? {...f.geometry, coordinates: swapLatLonDeep(f.geometry.coordinates)}
						: f.geometry,
			}))
})

const YMAPS_API_KEY = import.meta.env.VITE_YMAPS_API_KEY as string

onMounted(async () => {
	countries.value = readSettingsOnce()
	bordersAll.value = await getWorldBordersCached(YMAPS_API_KEY)
})
</script>

<template>
	<YamapMap :highlight-features="highlightFeatures" @select-country="onSelectCountry"/>
</template>
