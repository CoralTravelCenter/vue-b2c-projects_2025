<script setup>
import {filterFreshOffers} from "../../../common/js/usefuls";
import Tabs from "./components/Tabs/Tabs.vue";
import Card from "./components/Card/Card.vue";
import {computed, ref} from "vue";


const promotionsArr = ref(window._promotion_settings ?? [])
const filteredPromotions = computed(() => {
	return promotionsArr.value.filter(o => filterFreshOffers(o))
})
const filters = computed(() => {
	const names = promotionsArr.value.map(p => p.filter).filter(Boolean)
	return [...new Set(names)]
})
</script>

<template>
	<Tabs :filters="filters"></Tabs>
	<div class="cards-container">
		<Card :key="promotion.name" v-for="promotion in filteredPromotions" v-bind="promotion"/>
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
</style>