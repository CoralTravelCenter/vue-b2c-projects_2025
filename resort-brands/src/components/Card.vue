<script setup>
import {computed} from 'vue';
import priceCalculation from "../helpers/priceCalculation.js";

const props = defineProps({
	slide: {
		type: Object,
		required: true,
	},
	currentCountry: {
		type: String,
		required: true,
	},
});

// Нормализация рейтинга и определение категории
const numericRating = computed(() => {
	const r = props.slide?.rating;
	return typeof r === 'number' ? r : Number.NaN;
});

const starsCount = computed(() => {
	const r = numericRating.value;
	return Number.isFinite(r) ? Math.max(0, Math.min(5, Math.floor(r))) : 0;
});

const isNumericRating = computed(() => Number.isFinite(numericRating.value));
const categoryText = computed(() => (!isNumericRating.value && typeof props.slide?.rating === 'string') ? props.slide.rating : '');

// Локальный компонент иконки, чтобы не засорять шаблон
const LocationIcon = {
	name: 'LocationIcon',
	template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M12.8337 5.66683C12.8337 9.72673 8.50032 14.6668 8.50032 14.6668C8.50032 14.6668 4.16699 9.72673 4.16699 5.66683C4.16699 3.2736 6.10709 1.3335 8.50032 1.3335C10.8936 1.3335 12.8337 3.2736 12.8337 5.66683Z" stroke="#535353" stroke-width="0.5" stroke-linejoin="round"/>
      <path d="M8.5 7.66699C9.60457 7.66699 10.5 6.77156 10.5 5.66699C10.5 4.56242 9.60457 3.66699 8.5 3.66699C7.39543 3.66699 6.5 4.56242 6.5 5.66699C6.5 6.77156 7.39543 7.66699 8.5 7.66699Z" stroke="#535353" stroke-width="0.5" stroke-linejoin="round"/>
    </svg>
  `,
};
</script>

<template>
	<article class="card">
		<div class="card__visual">
			<img
					:alt="slide.name"
					:src="slide.img"
					loading="lazy"
					decoding="async"
					referrerpolicy="no-referrer"
			/>
		</div>

		<span class="card__location" aria-label="Локация">
      <LocationIcon aria-hidden="true" current-country=""/>
      {{ slide.location_name }}
    </span>

		<h3 id="card__hotel-name" class="card__hotel-name">
			{{ slide.name }}
		</h3>

		<div v-if="isNumericRating" class="card__rating" aria-label="Рейтинг отеля">
			<img
					v-for="i in starsCount"
					:key="`star-${i}`"
					alt="Звезда рейтинга"
					src="//b2ccdn.coral.ru/content/landing-pages/vue_map_slider/rating-icon.svg"
					width="16"
					height="16"
			/>
		</div>
		<p v-else-if="categoryText" class="card__category">{{ categoryText }}</p>

		<div class="card__push-bottom">
			<div class="card__price">
        <span>
          от {{ priceCalculation(slide.price) }} <small>/ ночь</small>
        </span>

				<!-- Если реального URL нет, можно заменить на <button> и повесить обработчик -->
				<a
						class="coral-main-btn custom"
						href="#"
						:data-onlyhotel-lookup-destination="currentCountry"
						:data-onlyhotel-lookup-regions="slide.name"
						:data-onlyhotel-lookup-depth-days="14"
				>
					Забронировать
				</a>
			</div>

			<span class="card__attention">
        * Цена указана из расчёта проживания не менее 7 ночей, за одного туриста, без перелёта
      </span>
		</div>
	</article>
</template>

<style scoped lang="scss">
@use '../styles/mixins';

.card {
	background: #fff;
	border-radius: 12px;
	padding: 8px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;

	@include mixins.respond-up(lg) {
		max-width: 300px;
	}
}

.card__visual {
	height: 170px;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		border-radius: 12px;
	}
}

.card__location {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	color: rgba(0, 0, 0, 0.65);

	svg {
		flex-shrink: 0;
	}
}

.card__hotel-name {
	font-size: 16px;
	font-weight: 600;
	margin: 0; /* reset */
}

.card__rating {
	display: flex;

	img {
		width: 16px !important;
		height: 16px !important;
	}
}

.card__category {
	color: #f7db14;
	margin: 0;
}

.card__push-bottom {
	margin-top: auto;
}

.card__price {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	margin-bottom: 8px;
	font-size: 16px;
	font-weight: 600;
	color: #0093d0;
	flex-wrap: wrap;
}

.card__attention {
	color: rgba(0, 0, 0, 0.65);
	border-top: 1px solid #f0f0f0;
	padding-top: 0.8em;
	font-size: 0.625rem;
	line-height: 1.5;
	display: inline-block;
}

.coral-main-btn.custom {
	padding: 10px 12px;
}
</style>
