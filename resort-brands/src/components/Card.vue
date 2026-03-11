<script setup>
import {computed, inject, ref} from 'vue';
import priceCalculation from "../helpers/priceCalculation.js";
import {getArrivalLocation} from "../helpers/getArrivalLocations.js";
import {getRedirectUrl} from "../helpers/getRedirectUrl.js";
import LocationIcon from "./LocationIcon.vue";

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

const brandDatesRange = inject('brandDatesRange', ref(null))
const brandNightsQuantity = inject('brandNightsQuantity', ref(null))
const isRedirecting = ref(false)

const hasValidSearchParams = computed(() => {
	const range = brandDatesRange.value
	const nights = brandNightsQuantity.value
	return Array.isArray(range) && range.length === 2 && Number.isFinite(nights) && nights > 0
})

const displayedNights = computed(() => {
	const nights = Number(brandNightsQuantity.value)
	return Number.isFinite(nights) && nights > 0 ? nights : 7
})

async function onRedirectClick({name}) {
	if (!name || isRedirecting.value || !hasValidSearchParams.value) return

	isRedirecting.value = true
	try {
		const arvLoc = await getArrivalLocation([name]);
		if (!Array.isArray(arvLoc) || arvLoc.length === 0) return

		const res = await getRedirectUrl(arvLoc, brandDatesRange.value, brandNightsQuantity.value);
		const redirectionUrl = res?.result?.redirectionUrl
		const queryParam = res?.result?.queryParam
		if (!redirectionUrl || !queryParam) return

		const builtLink = `https://www.coral.ru/${redirectionUrl}?qp=${queryParam}&p=2&w=0&s=0`;
		window.open(builtLink, '_blank', 'noopener,noreferrer');
	} finally {
		isRedirecting.value = false
	}
}
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
      <LocationIcon aria-hidden="true"/>
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
				<button
						class="coral-main-btn custom"
						@click="onRedirectClick(slide)"
						:disabled="isRedirecting || !hasValidSearchParams"
				>
					Забронировать
				</button>
			</div>

			<span class="card__attention">
        * Цена указана из расчёта проживания не менее {{ displayedNights }} ночей, за одного туриста, без перелёта
      </span>
		</div>
	</article>
</template>

<style scoped lang="scss">
@use '../styles/mixins';

.card {
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
	padding: 8px;
	background: #fff;
	border-radius: 12px;

	@include mixins.respond-up(lg) {
		max-width: 300px;
	}
}

.card__visual {
	height: 170px;

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 12px;
	}
}

.card__location {
	display: inline-flex;
	gap: 4px;
	align-items: center;
	color: rgb(0 0 0 / 65%);
	font-size: 12px;

	svg {
		flex-shrink: 0;
	}
}

.card__hotel-name {
	margin: 0; /* reset */
	font-weight: 600;
	font-size: 16px;
}

.card__rating {
	display: flex;

	img {
		width: 16px !important;
		height: 16px !important;
	}
}

.card__category {
	margin: 0;
	color: #f7db14;
}

.card__push-bottom {
	margin-top: auto;
}

.card__price {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8px;
	color: #0093d0;
	font-weight: 600;
	font-size: 16px;
}

.card__attention {
	display: inline-block;
	padding-top: 0.8em;
	color: rgb(0 0 0 / 65%);
	font-size: 0.625rem;
	line-height: 1.5;
	border-top: 1px solid #f0f0f0;
}

.coral-main-btn.custom {
	padding: 10px 12px;
	font-weight: 400;
	cursor: pointer;

	&:disabled {
		cursor: default;
		opacity: 0.7;
	}
}
</style>
