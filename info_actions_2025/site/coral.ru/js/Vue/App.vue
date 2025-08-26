<script setup>
import {filterFreshOffers} from "../../../common/js/usefuls";
import Tabs from "./components/Tabs/Tabs.vue";
import Card from "./components/Card/Card.vue";
import {computed, ref} from "vue";
import {useUrlSearchParams} from "@vueuse/core";

const currentFilter = ref('Все акции')

const promotionsArr = ref(window._promotion_settings ?? [])

// только свежие акции
const freshOffers = computed(() =>
		promotionsArr.value.filter(o => filterFreshOffers(o))
)

// категории: "Все акции" + уникальные фильтры из freshOffers
const filters = computed(() => {
	const names = freshOffers.value.map(p => p.filter).filter(Boolean)
	return ['Все акции', ...new Set(names)]
})

// карточки для отображения
const filteredPromotions = computed(() => {
	if (currentFilter.value === 'Все акции') return freshOffers.value
	return freshOffers.value.filter(p => p.filter === currentFilter.value)
})

const params = useUrlSearchParams('history')
const domen = location.host.includes('coral')
const isApplication = computed(() => params.mw === 'true')
</script>

<template>
	<Tabs :filters="filters" v-model="currentFilter" :class="domen ? 'coral' : 'sunmar'"/>
	<div class="cards-container" :key="currentFilter">
		<Card
				:class="domen ? 'coral' : 'sunmar'"
				v-for="promotion in filteredPromotions"
				:key="promotion.name"
				:data-filter="promotion.filter"
				:visual="promotion.visual"
				:name="promotion.name"
				:description="promotion.description"
				:url="promotion.url"
				:promo_end_text="promotion.promo_end_text"
				:erid="isApplication ? promotion.app_erid : promotion.erid"
				:entry_point="promotion.entry_point"
				v-show="!(isApplication && promotion.name.includes('SunmarBonus'))"
				v-bonus="promotion.filter.includes('Bonus') && promotion.name"
		/>
	</div>
</template>


<style scoped lang="scss">
@use '../../../common/css/mixins';

.cards-container {
	@include mixins.flex-grid(1, 24px, center);

	@media (min-width: 768px) {
		@include mixins.flex-grid(2, 24px, start);
	}

	@media (min-width: 1280px) {
		@include mixins.flex-grid(4, 24px, start);
	}
}

.cards-container:has(.sunmar) {
	@media (min-width: 1280px) {
		@include mixins.flex-grid(3, 24px, start);
	}
}
</style>
