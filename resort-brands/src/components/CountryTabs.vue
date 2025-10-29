<script setup>
/* ==========================
 *  Пропсы
 *  - countries: массив строк с названиями стран
 * ========================== */
const props = defineProps({
	countries: {
		type: Array,
		required: true,
		default: () => [],
		validator: (arr) => Array.isArray(arr) && arr.every((v) => typeof v === 'string' && v.trim().length > 0),
	},
})

/* ==========================
 *  v-model (defineModel)
 *  - currentCountry: активная страна
 * ========================== */
const model = defineModel('currentCountry')

/* ==========================
 *  Метрика
 * ========================== */
const YM_ID = 96674199

function sendAnalytics(country) {
	if (typeof window !== 'undefined' && typeof window.ym === 'function') {
		window.ym(YM_ID, 'reachGoal', 'filter_by_country', {country})
	}
}

function handleClick(country) {
	model.value = country
	sendAnalytics(country)
}
</script>

<template>
	<ul class="country-tabs" role="tablist" aria-label="Фильтр по странам">
		<li v-for="country in props.countries" :key="country" class="country-tabs__item" role="presentation">
			<button
					type="button"
					class="country-tabs__btn"
					:class="{ 'country-tabs__btn--active': model === country }"
					role="tab"
					:aria-selected="model === country"
					@click="handleClick(country)"
			>
				{{ country }}
			</button>
		</li>
	</ul>
</template>

<style scoped>
/* =============================================
 *  Блок: country-tabs (BEM)
 *  Назначение: табы выбора страны
 * ============================================= */

.country-tabs {
	display: flex;
	list-style: none;
	gap: 16px;
	margin: 0;
	padding: 12px;
	background: #ffffff;
	border-radius: 48px;
}

.country-tabs__btn {
	cursor: pointer;
	padding: 12px 24px;
	border-radius: 24px;
	line-height: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: transparent;
	border: none;
	font: inherit;
	color: #000000;
}

.country-tabs__btn:not(.country-tabs__btn--active):hover {
	color: #0093d0;
}

.country-tabs__btn--active {
	background: #0093d0;
	color: #fff;
}
</style>
