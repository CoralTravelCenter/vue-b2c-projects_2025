<script setup>
const props = defineProps({
	currentBrand: {
		type: String,
		required: true,
	},
	brands: {
		type: Array,
		required: true,
	}
})

const model = defineModel('currentBrand')

function setCurrentBrand(newBrand) {
	model.value = newBrand
	ym(96674199, 'reachGoal', 'filter_by_hotel', {
		hotel: model.value
	})
}
</script>

<template>
	<ul class="brand-list">
		<li
				v-for="brand in props.brands"
				:key="brand"
				:class="{'js-active': props.currentBrand === brand }"
				@click="setCurrentBrand(brand)"
		>
			<img
					:src="`https://b2ccdn.coral.ru/content/landing-pages/resort-brands-home/${brand}.png`"
					:alt="brand"
					width="90"
					height="36"
			/>
		</li>
	</ul>
</template>

<style scoped lang="scss">
@use '../styles/mixins';

.brand-list {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 24px;
	list-style: none;
	padding: 0;
	margin: 0;

	@include mixins.respond-up(lg) {
		width: 100%;
	}
}

.brand-list.js-scroll {
	width: 100vw;
	overflow-x: scroll;
	scroll-snap-type: x mandatory;
	padding-inline: 16px;
	justify-content: start;

	-ms-overflow-style: none; /* Для старых версий IE и Edge */
	scrollbar-width: none; /* Для Firefox */

	&::-webkit-scrollbar {
		display: none; /* Скрываем скроллбар в WebKit-браузерах (Chrome, Safari, Opera) */
	}

	@include mixins.respond-up(lg) {
		justify-content: center;
		width: 100%;
	}


	li {
		flex: 1;

		@include mixins.respond-up(lg) {
			flex: unset;
		}


		img {
			width: 80% !important;
			object-fit: contain !important;
		}
	}
}

li {
	scroll-snap-align: start;
	padding: 16px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 100px;
	@include mixins.respond-up(lg) {
		min-width: unset;
		flex: unset;
	}

	img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: contain;
		max-width: 70px;
	}
}

li.js-active {
	border-bottom: 2px solid #33C2FF;
}
</style>
