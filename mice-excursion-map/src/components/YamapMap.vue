<template>
	<div class="relative w-full h-[500px] rounded-2xl overflow-hidden bg-[#004374] map-wrapper">
		<yandex-map
				v-model="map"
				class="w-full h-full"
				:settings="mapSettings"
		>
			<!-- Базовая схема: только вода/земля/границы (через customization) -->
			<yandex-map-default-scheme-layer :settings="{ customization }"/>

			<!-- Слой для пользовательских geo-объектов (выделяем отдельный source) -->
			<yandex-map-default-features-layer
					:settings="{ source: HIGHLIGHT_SOURCE, zIndex: 1200 }"
			/>

			<!-- Подсветка нужных стран (features приходят уже в координатах v3 [lng,lat]) -->
			<yandex-map-feature
					v-for="(f, i) in highlightFeaturesSafe"
					:key="String((f as any).id ?? i)"
					:settings="{
          geometry: (f as any).geometry,
          properties: (f as any).properties,
          style: HIGHLIGHT_STYLE,
          source: HIGHLIGHT_SOURCE,
          onClick: () => handleFeatureClick(f),
        }"
			/>
		</yandex-map>

		<!-- ВАЖНО: любой DOM-оверлей держим СНАРУЖИ yandex-map -->
		<div class="absolute top-2 right-2 z-50 pointer-events-auto">
			<slot name="overlay"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed, shallowRef} from "vue"
import type {Feature} from "geojson"
import type {VectorCustomization, YMap} from "@yandex/ymaps3-types"
import {YandexMap, YandexMapDefaultFeaturesLayer, YandexMapDefaultSchemeLayer, YandexMapFeature,} from "vue-yandex-maps"

const props = withDefaults(
		defineProps<{
			center?: [number, number]     // [lng, lat]
			zoom?: number
			highlightFeatures?: Feature[] // нужные страны (из App)
		}>(),
		{
			center: () => [33, 40],
			zoom: 3,
			highlightFeatures: () => [],
		}
)

const emit = defineEmits<{
	(e: "select-country", name: string): void
}>()

const map = shallowRef<YMap | null>(null)

const mapSettings = computed(() => ({
	location: {center: props.center, zoom: props.zoom},
	zoomRange: {min: 3, max: 10},
	mode: "vector",
}))

/**
 * Чистая схема:
 * 1) #004374 — вода/задник
 * 2) #01355b — суша (страны)
 * 3) #003f6e — границы стран
 * + скрываем всё лишнее
 */
const customization = shallowRef<VectorCustomization>([
	// убрать подписи/иконки
	{elements: "label", stylers: [{visibility: "off"}]},

	// вода / задник
	{tags: {all: ["water"]}, types: ["polygon"], elements: "geometry.fill", stylers: [{color: "#004374"}]},
	{tags: {all: ["water"]}, types: ["polyline"], elements: "geometry", stylers: [{visibility: "off"}]},
	{tags: {all: ["water"]}, types: ["polygon"], elements: "geometry.outline", stylers: [{visibility: "off"}]},

	// суша (страны)
	{tags: {any: ["land"]}, types: ["polygon"], elements: "geometry.fill", stylers: [{color: "#01355b"}]},
	{tags: {any: ["land"]}, types: ["polygon"], elements: "geometry.outline", stylers: [{visibility: "off"}]},

	// границы стран
	{
		tags: {all: ["admin", "country"]},
		types: ["polyline"],
		elements: "geometry",
		stylers: [{color: "#003f6e"}, {scale: 1}],
	},

	// скрыть прочие admin-уровни (регионы/города/и т.п.)
	{tags: {all: ["admin"], none: ["country"]}, elements: "geometry", stylers: [{visibility: "off"}]},

	// скрыть всё лишнее
	{
		tags: {any: ["road", "poi", "transit", "structure", "geographic_line"]},
		elements: "geometry",
		stylers: [{visibility: "off"}]
	},
	{
		tags: {any: ["landcover", "urban_area", "national_park", "terrain"]},
		elements: "geometry",
		stylers: [{visibility: "off"}]
	},
])

/**
 * Подсветка нужных стран:
 * - заливка поярче (только для выбранных стран)
 * - белый контур 1px
 */
const HIGHLIGHT_SOURCE = "countries-highlight"

const HIGHLIGHT_STYLE = {
	fill: "rgba(0, 90, 154, 0.35)",
	stroke: [{color: "#ffffff", width: 1, opacity: 1}],
} as const

const highlightFeaturesSafe = computed(() =>
		(props.highlightFeatures || []).filter((f: any) => f?.geometry)
)

function handleFeatureClick(f: Feature) {
	const name = (f as any)?.properties?.name
	if (typeof name === "string" && name.trim()) {
		emit("select-country", name.trim())
	}
}
</script>
