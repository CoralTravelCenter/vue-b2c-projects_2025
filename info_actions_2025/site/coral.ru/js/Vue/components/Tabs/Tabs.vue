<script setup>
defineProps({
	filters: {
		type: Array,
		required: true
	}
})

const model = defineModel({default: 'Все акции'})

function selectFilter(filter) {
	model.value = filter
}
</script>

<template>
	<nav class="tabs-navigation">
		<ul class="tabs-navigation__list">
			<li
					v-for="filter in filters"
					:key="filter"
					class="tabs-navigation__item"
					:class="{ 'js-active': model === filter }"
					:data-tab="filter"
					@click="selectFilter(filter)"
			>
				{{ filter }}
			</li>
		</ul>
	</nav>
</template>

<style scoped lang="scss">
@use 'Tabs';
</style>
