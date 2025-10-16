<script setup>
/* ==========================
 *  Пропсы
 *  - currentBrand: активный бренд (начальное значение)
 *  - brands: массив строк с именами брендов
 * ========================== */
const props = defineProps({
	currentBrand: {type: String, required: true},
	brands: {type: Array, required: true, default: () => []},
})

/* ==========================
 *  v-model (defineModel)
 *  - currentBrand: выбранный бренд
 * ========================== */
const model = defineModel('currentBrand')

/* ==========================
 *  Метрика (Яндекс.Метрика)
 * ========================== */
const YM_ID = 96674199

function sendAnalytics(brand) {
	if (typeof window !== 'undefined' && typeof window.ym === 'function') {
		window.ym(YM_ID, 'reachGoal', 'filter_by_hotel', {hotel: brand})
	}
}

/* ==========================
 *  Обработчики
 * ========================== */
function setCurrentBrand(newBrand) {
	model.value = newBrand
	sendAnalytics(newBrand)
}
</script>

<template>
	<!-- Блок: brand-list -->
	<ul class="brand-list brand-list--scroll" aria-label="Фильтр по брендам" role="list">
		<li
				v-for="brand in props.brands"
				:key="brand"
				class="brand-list__item"
				role="presentation"
		>
			<button
					type="button"
					class="brand-list__btn"
					:class="{ 'brand-list__btn--active': model === brand }"
					:aria-pressed="model === brand"
					@click="setCurrentBrand(brand)"
			>
				<img
						class="brand-list__img"
						:src="`https://b2ccdn.coral.ru/content/landing-pages/resort-brands-home/${brand}.png`"
						:alt="brand"
						width="90"
						height="36"
						loading="lazy"
						decoding="async"
				/>
			</button>
		</li>
	</ul>
</template>

<style scoped lang="scss">
@use '../styles/mixins';

/* =============================================
 *  Блок: brand-list (BEM)
 *  Назначение: горизонтальный список логотипов брендов
 *  Примечание: модификатор --scroll включает горизонтальную прокрутку
 * ============================================= */

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

/* Модификатор: прокручиваемый список */
.brand-list--scroll {
	width: 100%;
	overflow-x: auto;
	scroll-snap-type: x mandatory;
	justify-content: flex-start;

	/* Скрываем системные скроллбары, где возможно */
	-ms-overflow-style: none; /* IE/Edge (старые) */
	scrollbar-width: none; /* Firefox */
	&::-webkit-scrollbar {
		display: none;
	}

	/* Chrome/Safari/Opera */

	@include mixins.respond-up(lg) {
		justify-content: center;
	}
}

/* Элемент: пункт списка */
.brand-list__item {
	scroll-snap-align: start;
	min-width: 70px;

	@include mixins.respond-up(md) {
		max-width: 100px;
	}
	@include mixins.respond-up(lg) {
		min-width: unset;
	}
}

/* Элемент: кнопка-обёртка логотипа */
.brand-list__btn {
	cursor: pointer;
	padding: 16px;
	border: none;
	background: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
}

/* Модификатор активной кнопки */
.brand-list__btn--active {
	border-bottom: 2px solid #33c2ff;
}

/* Элемент: изображение логотипа */
.brand-list__img {
	width: 100%;
	max-width: 70px;
	height: 100%;
	display: block;
	object-fit: contain;

	/* На маленьких экранах логотипы чуть меньше внутри scroll-контейнера */
	.brand-list--scroll {
		width: 80% !important;
	}
}
</style>
