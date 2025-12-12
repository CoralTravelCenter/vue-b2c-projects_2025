<script setup>
import {filterFreshOffers} from "../filterFreshOffers";
import Tabs from "./components/Tabs/Tabs.vue";
import Card from "./components/Card/Card.vue";
import {computed, ref} from "vue";
import {useUrlSearchParams} from "@vueuse/core";

const currentFilter = ref("Все акции");

const promotionsArr = ref(window._promotion_settings ?? []);

// только свежие акции
const freshOffers = computed(() =>
		promotionsArr.value.filter(o => filterFreshOffers(o))
);

const offersNormalized = computed(() =>
		freshOffers.value.map(p => {
			const raw = p.filter ?? "";
			const arr = Array.isArray(raw)
					? raw
					: String(raw)
							.split(",")
							.map(s => s.trim())
							.filter(Boolean);

			const filtersArr = [...new Set(arr)]; // дедуп

			return {...p, filtersArr};
		})
);


const filters = computed(() => {
	const set = new Set();
	offersNormalized.value.forEach(p => p.filtersArr.forEach(f => set.add(f)));
	return ["Все акции", ...set];
});


const filteredPromotions = computed(() => {
	if (currentFilter.value === "Все акции") return offersNormalized.value;
	return offersNormalized.value.filter(p =>
			p.filtersArr.includes(currentFilter.value)
	);
});

const params = useUrlSearchParams("history");
const domen = computed(() => location.origin.includes('coral.ru'));
const isApplication = computed(() => params.mw === "true");


const isBonus = p => p.filtersArr.some(f => /bonus/i.test(f));


</script>

<template>
	<Tabs :filters="filters" v-model="currentFilter" :class="domen ? 'coral' : 'sunmar'"/>

	<ul class="cards-container" :key="currentFilter">
		<Card
				v-for="promotion in filteredPromotions"
				:key="promotion.name"
				class="card"
				:class="domen ? 'coral' : 'sunmar'"
				:data-filter="promotion.filtersArr.join(', ')"
				:visual="promotion.visual"
				:name="promotion.name"
				:description="promotion.description"
				:url="promotion.url"
				:promo_end_text="promotion.promo_end_text"
				:ligal="promotion.ligal"
				:erid="isApplication ? promotion.app_erid : promotion.erid"
				:entry_point="promotion.entry_point"
				v-show="!(isApplication && promotion.name.includes('SunmarBonus'))"
				v-bonus="isBonus(promotion) && promotion.name"
		/>
	</ul>
</template>

<style scoped lang="scss">
@use '../../../common/css/mixins';

.cards-container {
	list-style: none;
	padding: 0;
	margin: 0;
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
