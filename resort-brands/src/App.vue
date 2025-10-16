<script setup>
import {computed, ref, watch} from 'vue'
import {StorageSerializers, useMediaQuery, useSessionStorage} from '@vueuse/core'
import {readBrand, readCountry, writeBrand, writeCountry} from './helpers/setCache.js'
import BrandList from './components/BrandList.vue'
import CountryTabs from './components/CountryTabs.vue'
import {fetchData} from './helpers/fetchData.js'
import HotlesSlider from './components/HotlesSlider.vue' // ✅ загружаем сразу, без Suspense
import CountrySelect from './components/CountrySelect.vue'

/* =============================================
 *  UI-состояние и результаты
 * ============================================= */
const isLoading = ref(false)
const isError = ref(null)
const data = ref([])
const isLargeScreen = useMediaQuery('(min-width: 1024px)')

/* =============================================
 *  Хранилища
 * ============================================= */
const filters = useSessionStorage('rb-filters', {}, {serializer: StorageSerializers.object})
const dataCache = useSessionStorage('rb-data', {}, {serializer: StorageSerializers.object})

/* =============================================
 *  Исходные данные
 * ============================================= */
const defaultCountry = _resortBrands.countries[0]?.name || ''

/* Страны */
const countries = computed(() => _resortBrands.countries.map((c) => c.name))

/* Текущая страна: хранение/чтение из sessionStorage */
const currentCountry = computed({
	get: () => readCountry(filters, defaultCountry),
	set: (v) => writeCountry(filters, v),
})

/* Список брендов выбранной страны */
const brandsOfCurrentCountry = computed(() => {
	const c = _resortBrands.countries.find((x) => x.name === currentCountry.value)
	return c ? Array.from(new Set(c.brands.map((b) => b.name))) : []
})

/* Текущий бренд: безопасный выбор + запись в кэш */
const currentBrand = computed({
	get() {
		const saved = readBrand(filters, '')
		const list = brandsOfCurrentCountry.value
		if (saved && list.includes(saved)) return saved
		const fallback = list[0] || ''
		if (fallback && fallback !== saved) writeBrand(filters, fallback)
		return fallback
	},
	set: (v) => writeBrand(filters, v),
})

/* Узлы бренда */
const brandNodeInCountry = computed(() => {
	const country = _resortBrands.countries.find((c) => c.name === currentCountry.value)
	return country?.brands.find((b) => b.name === currentBrand.value) || null
})
const globalBrandNode = computed(() => _resortBrands.brands.find((b) => b.name === currentBrand.value) || null)

/* Сводная информация о бренде */
const brandInfo = computed(() => {
	const node = brandNodeInCountry.value
	const global = globalBrandNode.value

	const settings = node?.settings || global?.settings || {}
	const dateRange = settings?.dateRange
	const nights = settings?.nights
	const hotels = node?.hotels || []

	return {
		name: node?.name ?? global?.name ?? currentBrand.value,
		slogan: node?.slogan ?? global?.slogan ?? '',
		page: node?.page ?? global?.page ?? '',
		dateRange: Array.isArray(dateRange) && dateRange.length === 2 ? dateRange : null,
		nights: Number.isFinite(nights) && nights > 0 ? nights : null,
		hotels: Array.isArray(hotels) ? hotels : [],
	}
})

/* Производные поля */
const brandDatesRange = computed(() => brandInfo.value.dateRange)
const brandNightsQuantity = computed(() => brandInfo.value.nights)
const brandHotelsOfCountry = computed(() => brandInfo.value.hotels)
const landingLink = computed(() => brandInfo.value.page || null)

/* =============================================
 *  Загрузка данных (реакция на страну/бренд)
 *  Примечание: компонент слайдера уже загружен, мы только меняем его пропсы
 * ============================================= */
watch([currentCountry, currentBrand], async () => {
	const key = `${currentBrand.value}::${currentCountry.value}`.trim().toLowerCase()
	const hotels = brandHotelsOfCountry.value
	const range = brandDatesRange.value
	const nights = brandNightsQuantity.value
	data.value = await fetchData(isError, isLoading, dataCache, key, hotels, range, nights)
}, {immediate: true})
</script>

<template>
	<div class="app-container">
		<!-- Заголовок и фильтры -->
		<div class="headline-wrapper">
			<h2>Бренды, которые создают отдых</h2>

			<CountryTabs
					v-if="isLargeScreen"
					class="country-tabs"
					:countries="countries"
					v-model:currentCountry="currentCountry"
			/>

			<CountrySelect
					v-else
					:countries="countries"
					v-model:currentCountry="currentCountry"
			/>
		</div>

		<!-- Основной контент: инфоблок + слайдер (скелетоны по флагу isLoading) -->
		<div class="main-view">
			<div class="main-view-action">
				<h3>{{ currentBrand }}</h3>
				<span v-if="brandInfo.slogan">{{ brandInfo.slogan }}</span>
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

		<!-- Навигация по брендам -->
		<BrandList class="brands-nav" :brands="brandsOfCurrentCountry" v-model:currentBrand="currentBrand"/>
	</div>
</template>

<style lang="scss" scoped>
@use './styles/mixins';

/* =============================================
 *  Скелетоны (показываются пока isLoading === true)
 * ============================================= */
.skeletors-container {
	display: flex;
	gap: 16px;

	.vue-skeletor--rect {
		border-radius: 8px;
	}
}

/* =============================================
 *  Контейнер приложения
 * ============================================= */
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

/* Селект стран (см. компонент CountrySelect) */
.country-select {
	align-self: flex-start;
	order: 2;
	@include mixins.respond-up(md) {
		align-self: center;
	}
}

/* Навигация брендов */
.brands-nav {
	order: 3;
	@include mixins.respond-up(lg) {
		order: 4;
	}
}

/* Порядок слайдера для мобильных/десктопа */
.slider {
	order: 4;
	@include mixins.respond-up(lg) {
		order: 3;
	}
}

/* Шапка с фильтрами */
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

/* Основной блок: описание + слайдер */
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
	color: #ffffff;
	padding-bottom: 24px;

	@include mixins.respond-up(lg) {
		padding-inline: 100px;
	}
	@include mixins.respond-up(lg) {
		width: 40%;
	}

	h3 {
		color: #fff;
		font-size: 30px;
		font-style: normal;
		text-align: center;
		margin: 0;
		font-weight: 600;
		text-transform: uppercase;
	}
}

.main-view-slider {
	width: 100%;
	@include mixins.respond-up(lg) {
		width: 60%;
	}
}
</style>
