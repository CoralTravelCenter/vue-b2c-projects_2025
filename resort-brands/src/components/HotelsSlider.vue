<script setup>
import {computed} from 'vue'
import {useMediaQuery} from '@vueuse/core'
import Card from './Card.vue'

/* ==========================
 *  Пропсы
 *  - sliderItems: массив карточек отелей
 *  - currentCountry: страна для data-атрибутов внутри Card
 * ========================== */
const props = defineProps({
	sliderItems: {
		type: Array,
		required: true,
		default: () => [],
		// Валидация структуры слайдов (минимальный набор полей)
		validator: (arr) => Array.isArray(arr) && arr.every((item) =>
				item && typeof item === 'object' &&
				'name' in item && 'img' in item && 'location_name' in item && 'rating' in item && 'price' in item
		),
	},
	currentCountry: {
		type: String,
		required: true,
	},
})

/* ==========================
 *  Вычисления
 *  - hasMany: нужно ли использовать слайдер (более двух карточек)
 *  - isLargeScreen: десктопный брейкпоинт для показа стрелок
 * ========================== */
const hasMany = computed(() => props.sliderItems.length > 2)
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
</script>

<template>
	<section class="hotel-slider" aria-label="Слайдер отелей">
		<!-- Кнопка "назад" (показываем только на десктопе и при достаточном количестве карточек) -->
		<button
				v-show="hasMany && isLargeScreen"
				class="hotel-slider__nav-btn hotel-slider__nav-btn--prev"
				type="button"
				aria-label="Предыдущие отели"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="5" height="9" viewBox="0 0 5 9" fill="none" aria-hidden="true">
				<path d="M4.583 1.165 1.25 4.498 4.583 7.832" stroke="#535353" stroke-linejoin="round"/>
			</svg>
		</button>

		<!-- Слайдер: веб-компоненты Swiper -->
		<swiper-container
				v-if="hasMany"
				:space-between="24"
				:slides-offset-after="24"
				:allow-touch-move="true"
				:scrollbar-hide="false"
				:slides-per-view="1"
				:centered-slide="true"
				:navigation="{ prevEl: '.hotel-slider__nav-btn--prev', nextEl: '.hotel-slider__nav-btn--next' }"
				:breakpoints="{
					630: {slidesPerView: 2},
        	1024: { slidesPerView: 2.5, allowTouchMove: false }
      }"
		>
			<swiper-slide v-for="slide in sliderItems" :key="slide.name">
				<!-- Готовая карточка (отдельный компонент) -->
				<Card :slide="slide" :currentCountry="currentCountry"/>
			</swiper-slide>
		</swiper-container>

		<!-- Фолбэк-сетка, когда карточек мало -->
		<div v-else class="hotel-slider__cards">
			<Card v-for="slide in sliderItems" :key="slide.name" :slide="slide" :currentCountry="currentCountry"/>
		</div>

		<!-- Кнопка "вперёд" (показываем только на десктопе и при достаточном количестве карточек) -->
		<button
				v-show="hasMany && isLargeScreen"
				class="hotel-slider__nav-btn hotel-slider__nav-btn--next"
				type="button"
				aria-label="Следующие отели"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="6" height="9" viewBox="0 0 6 9" fill="none" aria-hidden="true">
				<path d="M1.25 1.165 4.583 4.498 1.25 7.832" stroke="#535353" stroke-linejoin="round"/>
			</svg>
		</button>
	</section>
</template>

<style scoped lang="scss">
/* =============================================
 *  Блок: hotel-slider (BEM)
 *  Назначение: обёртка слайдера/ленты карточек отелей
 *  Примечание: стили карточки находятся внутри Card.vue
 * ============================================= */
.hotel-slider {
	position: relative;
}

/* Навигационные кнопки слайдера */
.hotel-slider__nav-btn {
	position: absolute;
	top: 50%;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	background: #fff;
	border: 1px solid #fff;
	border-radius: 50%;
	transform: translateY(-50%);
	cursor: pointer;
	transition: border-color 0.3s ease;

	svg {
		pointer-events: none;
	}

	svg path {
		transition: stroke 0.3s ease;
	}

	&:hover {
		border-color: #66d1ff;

		svg path {
			stroke: #66d1ff;
		}
	}
}

/* Скрываем стрелки, когда Swiper помечает их как disabled */
.hotel-slider__nav-btn.swiper-button-disabled {
	display: none;

	&:hover {
		border-color: #66d1ff;

		svg path {
			stroke: #66d1ff;
		}
	}
}

/* Модификаторы направления */
.hotel-slider__nav-btn--prev {
	left: -64px;
}

.hotel-slider__nav-btn--next {
	right: 16px;
}

/* Встроенные элементы Swiper (веб-компонент) */
swiper-container {
	/* Градиентная маска справа для красивого схода кадра */
	position: relative;
}

/* Псевдоэлемент поверх правого края контейнера */
@media (width >= 1024px) {
	swiper-container::after {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 3;
		width: 20%;
		height: 100%;
		background: linear-gradient(90deg, rgb(38 38 38 / 0%) 0%, #262626 250%);
		content: "";
		pointer-events: none;
	}
}

/* Низкий скроллбар и внутренние отступы (через ::part) */
swiper-container::part(scrollbar) {
	top: unset;
	bottom: 11px;
	background: rgb(217 217 217 / 20%);
	border-radius: 16px;
}

swiper-container::part(container) {
	/* Внутренний контейнер: добавляем отступ под скроллбар */
	padding-bottom: 24px;
}

/* Слайды растягиваем по высоте контента карточки */
swiper-slide {
	display: flex;
	height: auto;
}

/* Фолбэк-лента карточек (когда нет слайдера) */
.hotel-slider__cards {
	display: flex;
	gap: 24px;
	padding-right: 24px;
	padding-bottom: 24px;
}
</style>
