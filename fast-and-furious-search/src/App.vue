<script setup lang="ts">
import {computed} from "vue";
import Card from "./components/Card.vue";

const data = computed(() => {
	return window.POPULAR_TOURS
})
</script>
<template>
	<div class="label">
		<svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
			<path d="M0.5 5.83325H3.41667V13.3333H0.5V5.83325Z" stroke="#E84E0F" stroke-linejoin="round"/>
			<path
					d="M3.41699 5.83333H4.87533L6.75033 3.75L7.36074 1.91875C7.65459 1.03721 8.77342 0.77309 9.43048 1.43015L9.59845 1.59813C9.90065 1.90033 10.0275 2.33598 9.9348 2.75318L9.25033 5.83333H12.5893C13.6555 5.83333 14.4476 6.82069 14.2163 7.86155L13.2178 12.3545C13.0908 12.9264 12.5835 13.3333 11.9976 13.3333H3.41699V5.83333Z"
					stroke="#E84E0F" stroke-linejoin="round"/>
		</svg>
		Быстрый поиск
	</div>
	<ul class="cards-list">
		<li class="cards-list-item" v-for="item in data" :key="item.id">
			<Card/>
		</li>
	</ul>
</template>
<style scoped>
.label {
	display: flex;
	gap: 6px;
	align-items: center;
	color: var(--Brand-color_Brand_Logo_Mark_4, #E84E0F);
	font-weight: 600;
	font-size: 16px;
	line-height: 11px;
}

.cards-list {
	display: flex;
	gap: 10px;
	margin: 0;
	padding: 0;
	overflow-x: scroll;
	list-style: none;
	scroll-snap-type: x mandatory;
}

.cards-list-item {
	display: grid;
	flex: 1 0 auto;
	grid-template-columns: auto max-content;
	padding: 12px;
	font-size: 12px;
	column-gap: 24px;
	background: red;
	border-radius: 7px;
	scroll-snap-align: start;
}
</style>
