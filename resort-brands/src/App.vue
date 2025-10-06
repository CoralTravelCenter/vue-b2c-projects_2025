<script setup>
import {computed, ref, watch} from "vue";
import {StorageSerializers, useSessionStorage} from "@vueuse/core";
import {getArrivalLocation} from "./helpers/getArrivalLocations.js";
import {getHotelData} from "./helpers/getHotelsData.js";
import Navigation from "./components/Navigation.vue";
import BrandFilter from "./components/BrandFilter.vue";
import HotlesSlider from "./components/HotlesSlider.vue";

// Реактивные данные
const currentBrand = ref(_resortBrands.defaults.currentBrand);
const currentCountry = ref(_resortBrands.defaults.defaultCountry);

// Вычисления
const countries = computed(() => _resortBrands.countries.map(c => c.name));

const brandsOfCurrentCountry = computed(() => {
	const country = _resortBrands.countries.find(c => c.name === currentCountry.value);
	return country ? Array.from(new Set(country.brands.map(b => b.name))) : [];
});

const brandHotelsOfCountry = computed(() => {
	const country = _resortBrands.countries.find(c => c.name === currentCountry.value);
	if (!country) return [];
	const brand = country.brands.find(b => b.name === currentBrand.value);
	return brand ? brand.hotels : [];
});

const brandInfo = computed(() => {
	const b = _resortBrands.brands.find(x => x.name === currentBrand.value);
	return b ?? {
		name: currentBrand.value,
		slogan: "",
		page: "",
		settings: {dateRange: null, nights: null}
	};
});

const brandDatesRange = computed(() => brandInfo.value.settings?.dateRange ?? null);
const brandNightsQuantity = computed(() => brandInfo.value.settings?.nights ?? null);

// ---- КЭШ: словарь в sessionStorage ----
const CACHE_KEY = "rb-cache";
const cacheDict = useSessionStorage(CACHE_KEY, {}, {serializer: StorageSerializers.object});

// Ключ пары (brand::country)
const dictKey = computed(() => `${currentBrand.value}::${currentCountry.value}`.trim().toLowerCase());

// Слайдер работает только с кэшом
const sliderItems = computed(() => {
	const items = cacheDict.value[dictKey.value];
	return Array.isArray(items) ? items : [];
});

// UI state
const loading = ref(false);
const error = ref(null);
const data = ref(null);

// Загрузка данных и запись в кэш
async function fetchData() {
	error.value = null;

	if (!brandHotelsOfCountry.value?.length) return;
	if (!brandDatesRange.value || brandDatesRange.value.length !== 2) return;
	if (!brandNightsQuantity.value) return;

	// cache hit
	if (cacheDict.value[dictKey.value]) {
		data.value = cacheDict.value[dictKey.value];
		return;
	}

	try {
		loading.value = true;
		const arvLoc = await getArrivalLocation(brandHotelsOfCountry);
		const res = await getHotelData(
				arvLoc,
				brandDatesRange,
				brandNightsQuantity
		);
		data.value = res;
		cacheDict.value[dictKey.value] = res; // сохраняем
	} catch (e) {
		error.value = e?.message || "Не удалось загрузить данные";
	} finally {
		loading.value = false;
	}
}

// Следим за изменением пары (brand, country)
watch(
		() => [currentBrand.value, currentCountry.value],
		() => fetchData(),
		{immediate: true}
);
</script>


<template>
	<div class="app-container">
		<div class="headline-wrapper">
			<h2>Бренды, которые создают отдых</h2>
			<Navigation
					class="country-tabs"
					:countries="countries"
					v-model:currentCountry="currentCountry"
			/>
		</div>

		<div class="main-view">
			<div class="main-view-action">
				<h3>{{ currentBrand }}</h3>
				<span>{{ brandInfo.slogan }}</span>
				<a href="" class="coral-main-btn">Подробнее</a>
			</div>
			<HotlesSlider class="hotels-slider" :items="sliderItems"/>
		</div>

		<BrandFilter
				class="brands-nav"
				:brands="brandsOfCurrentCountry"
				v-model:currentBrand="currentBrand"
		/>
	</div>
</template>


<style lang="scss" scoped>
@use './styles/mixins';

.app-container {
	width: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

h2 {
	@include mixins.respond-up(md) {
		width: 50%;
	}
}

.country-select {
	align-self: start;
	order: 2;

	@include mixins.respond-up(md) {
		align-self: center;
	}
}

.brands-nav {
	order: 3;

	@include mixins.respond-up(lg) {
		order: 4;
	}
}

.slider {
	order: 4;

	@include mixins.respond-up(lg) {
		order: 3;
	}
}

.headline-wrapper {
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
	gap: 16px;

	@include mixins.respond-up(md) {
		flex-direction: row;
	}
}

.main-view {
	display: flex;
	flex-direction: column;
	background: #262626;
	border-radius: 12px;
	padding: 24px 0 24px 16px;
	flex-shrink: 0;
	min-height: 560px;
	justify-content: space-between;

	@include mixins.respond-up(lg) {
		flex-direction: row;
		min-height: unset;
	}
}

.main-view-action {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-right: 16px;
	gap: 16px;
	color: #FFFFFF;

	h3 {
		color: #FFF;
		font-size: 36px;
		font-style: normal;
		margin: 0;
		font-weight: 600;
		text-transform: uppercase;
	}

	@include mixins.respond-up(lg) {
		width: 40%;
	}
}

.hotels-slider {
	width: 100%;
	@include mixins.respond-up(lg) {
		width: 60%;
	}
}
</style>
