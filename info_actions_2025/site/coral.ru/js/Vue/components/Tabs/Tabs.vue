<script setup>
defineProps({
	filters: {
		type: Array,
		reqired: true
	}
})
</script>
<template>
	<nav class="tabs-navigation">
		<ul class="tabs-navigation__list">
			<li class="tabs-navigation__item" v-for="filter in filters">
				{{filter}}
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
</style>