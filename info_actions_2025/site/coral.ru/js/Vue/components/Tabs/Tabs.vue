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
.tabs-navigation {
	width: 100%;
	margin-bottom: 32px;


	&__list {
		width: 100%;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		justify-content: start;
		gap: 12px;
		margin: 0;
		padding: 0;
		border-radius: 48px;

		@media (min-width: 1280px) {
			background: #FFFFFF;
			padding: 12px;
		}
	}

	&__item {
		border-radius: 24px;
		padding: 12px 24px;
		text-align: center;
		cursor: pointer;
		background: #fff;
		line-height: 1;
		transition: all 300ms ease;

		@media (min-width: 1280px) {
			flex-grow: 1;
		}
	}

	&__item.js-active {
		background: #0093D0;
		color: #FFFFFF;
	}
}

.tabs-navigation.sunmar {

	.tabs-navigation__list {
		background: #F5F5F8;
	}

	.tabs-navigation__item {
		background: #F5F5F8;
		padding: 16px 30px;
		font-weight: 600;
	}

	.tabs-navigation__item.js-active {
		background: #061A3E;
	}
}
</style>
