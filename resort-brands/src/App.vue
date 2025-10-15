<script setup>
import {computed, ref, watch} from "vue";
import {StorageSerializers, useMediaQuery, useSessionStorage} from "@vueuse/core";
import {readBrand, readCountry, writeBrand, writeCountry} from "./helpers/setCache.js";
import BrandFilter from "./components/BrandFilter.vue";
import Navigation from "./components/Navigation.vue";
import {fetchData} from "./helpers/fetchData.js";
import HotlesSlider from "./components/HotlesSlider.vue";
import SelectNavigation from "./components/SelectNavigation.vue";

/** UI state + результат */
const isLoading = ref(false);
const isError = ref(null);
const data = ref([]);
const isLargeScreen = useMediaQuery('(min-width: 1024px)')

/** Хранилища */
const filters = useSessionStorage("rb-filters", {}, {serializer: StorageSerializers.object});
const dataCache = useSessionStorage("rb-data", {}, {serializer: StorageSerializers.object});

/** Инициализация */
const defaultCountry = _resortBrands.countries[0]?.name || "";

/** Список стран */
const countries = computed(() => _resortBrands.countries.map(c => c.name));

/** Текущая страна */
const currentCountry = computed({
	get: () => readCountry(filters, defaultCountry),
	set: v => writeCountry(filters, v),
});

/** Бренды выбранной страны */
const brandsOfCurrentCountry = computed(() => {
	const c = _resortBrands.countries.find(x => x.name === currentCountry.value);
	return c ? Array.from(new Set(c.brands.map(b => b.name))) : [];
});

/** Текущий бренд */
const currentBrand = computed({
	get() {
		const saved = readBrand(filters, "");
		const list = brandsOfCurrentCountry.value;
		if (saved && list.includes(saved)) return saved;
		const fallback = list[0] || "";
		if (fallback && fallback !== saved) writeBrand(filters, fallback);
		return fallback;
	},
	set: v => writeBrand(filters, v),
});

/** --- Узлы бренда  --- */
const brandNodeInCountry = computed(() => {
	const country = _resortBrands.countries.find(c => c.name === currentCountry.value);
	return country?.brands.find(b => b.name === currentBrand.value) || null;
});
const globalBrandNode = computed(() =>
		_resortBrands.brands.find(b => b.name === currentBrand.value) || null
);

/** --- Вся информация по текущему бренду --- */
const brandInfo = computed(() => {
	const node = brandNodeInCountry.value;
	const global = globalBrandNode.value;

	const settings = node?.settings || global?.settings || {};
	const dateRange = settings?.dateRange;
	const nights = settings?.nights;
	const hotels = node?.hotels || [];

	return {
		name: node?.name ?? global?.name ?? currentBrand.value,
		slogan: node?.slogan ?? global?.slogan ?? "",
		page: node?.page ?? global?.page ?? "",
		dateRange: Array.isArray(dateRange) && dateRange.length === 2 ? dateRange : null,
		nights: (Number.isFinite(nights) && nights > 0) ? nights : null,
		hotels: Array.isArray(hotels) ? hotels : [],
	};
});

/** Производные поля из brandInfo */
const brandDatesRange = computed(() => brandInfo.value.dateRange);
const brandNightsQuantity = computed(() => brandInfo.value.nights);
const brandHotelsOfCountry = computed(() => brandInfo.value.hotels);
const landingLink = computed(() => brandInfo.value.page || null);

/** Реагируем на СТРАНУ и БРЕНД */
watch(
		[currentCountry, currentBrand],
		async () => {
			const key = `${currentBrand.value}::${currentCountry.value}`.trim().toLowerCase();
			const hotels = brandHotelsOfCountry.value;
			const range = brandDatesRange.value;
			const nights = brandNightsQuantity.value;
			data.value = await fetchData(isError, isLoading, dataCache, key, hotels, range, nights);
		},
		{immediate: true}
);

</script>

<template>
	<div class="app-container">
		<div class="headline-wrapper">
			<h2>Бренды, которые создают отдых</h2>
			<Navigation
					class="country-tabs"
					v-if="isLargeScreen"
					:countries="countries"
					v-model:currentCountry="currentCountry"
			/>
			<SelectNavigation
					v-else
					:countries="countries"
					v-model:currentCountry="currentCountry"
			/>
		</div>

		<div class="main-view">
			<div class="main-view-action">
				<h3>{{ currentBrand }}</h3>
				<span v-if="brandInfo?.slogan">{{ brandInfo.slogan }}</span>
				<a
						v-if="landingLink"
						:href="landingLink"
						class="coral-main-btn"
						target="_blank"
						rel="noopener noreferrer"
				>
					Подробнее о сети
				</a>
			</div>

			<div class="main-view-slider">
				<div v-if="isLoading" class="skeletors-container">
					<Skeletor width="33%" height="377" as="div"/>
					<Skeletor width="33%" height="377" as="div"/>
					<Skeletor width="33%" height="377" as="div"/>
				</div>

				<HotlesSlider
						v-else
						class="hotels-slider"
						:sliderItems="data"
						:currentCountry="currentCountry"
				/>
			</div>
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

.skeletors-container {
	display: flex;
	gap: 16px;

	.vue-skeletor--rect {
		border-radius: 8px;
	}
}

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
	padding: 24px 0 0 16px;
	flex-shrink: 0;
	min-height: 560px;
	justify-content: space-between;
	overflow: clip;

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
	text-align: center;
	gap: 16px;
	color: #FFFFFF;
	padding-bottom: 24px;

	@include mixins.respond-up(lg) {
		padding-inline: 100px;
	}

	h3 {
		color: #FFF;
		font-size: 30px;
		font-style: normal;
		text-align: center;
		margin: 0;
		font-weight: 600;
		text-transform: uppercase;
	}

	@include mixins.respond-up(lg) {
		width: 40%;
	}
}

.main-view-slider {
	width: 100%;
	@include mixins.respond-up(lg) {
		width: 60%;
	}
}
</style>
