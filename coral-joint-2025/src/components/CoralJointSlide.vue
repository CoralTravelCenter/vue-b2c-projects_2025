<script setup lang="ts">
import {ArrivalLocation, EncryptResult, PriceSearchListResult} from "@/types";
import {computed} from "vue";
import getRating from "@/handlers/getRating";
import {cutBeforeBracket, formatPriceRub, formattedDates, pluralizeNights} from "@/usefuls";

const props = defineProps<{
	price: PriceSearchListResult
	encrypt: EncryptResult
	benefits: string[];
	erid: string;
	ligal: string;
	nights: number;
	copied: boolean;
	isMobile: boolean;
	arrivalLocationForLink: ArrivalLocation;
}>();


const propHotelData = computed(() => {
	const {price, benefits, nights, encrypt} = props ?? {};
	const {
		countries = {},
		areas = {},
		meals = {},
		products = [],
		hotelCategories
	} = price ?? {};

	const [product] = products;
	const hotel = product?.hotel;
	const offer = product?.offers?.[0];
	const checkInDate = product?.offers?.[0]?.checkInDate;
	const checkOutDate = product?.offers?.[0]?.checkOutDate;

	const [country] = Object.values(countries);
	const [area] = Object.values(areas);
	const [meal] = Object.values(meals);

	const {queryParam, redirectionUrl} = encrypt;
	const url = `${redirectionUrl}?qp=${queryParam}&p=1&w=0&s=0&ws=10`;

	return {
		location: `${country?.name}, ${cutBeforeBracket(area?.name)}`,
		hotelName: hotel?.name,
		rating: getRating(hotelCategories, hotel?.categoryKey),
		benefits,
		price: formatPriceRub(offer?.price?.amount),
		meal: meal?.name,
		dates: formattedDates([checkInDate, checkOutDate]),
		nights: `${nights} ${pluralizeNights(nights)}`,
		visual: hotel?.images?.[0]?.sizes?.[0]?.url,
		isElite: hotel?.eliteHotel,
		url
	};
});


const emit = defineEmits<{
	(e: 'copy-erid'): void;
}>();
</script>

<template>
	<div
			class="visual"
			v-bind="{ 'data-category': propHotelData.isElite ? 'ELITE SERVICE' : null }"
	>
		<img :src="propHotelData.visual" :alt="propHotelData.hotelName"/>
	</div>

	<div class="location">
		<svg
				xmlns="http://www.w3.org/2000/svg"
				width="10"
				height="16"
				viewBox="0 0 10 16"
				fill="none"
		>
			<path
					d="M9.33335 5.66659C9.33335 9.72649 5.00002 14.6666 5.00002 14.6666C5.00002 14.6666 0.666687 9.72649 0.666687 5.66659C0.666687 3.27335 2.60679 1.33325 5.00002 1.33325C7.39325 1.33325 9.33335 3.27335 9.33335 5.66659Z"
					stroke="#535353"
					stroke-width="0.7"
					stroke-linejoin="round"
			/>
			<ellipse
					cx="5"
					cy="5.66675"
					rx="2"
					ry="2"
					stroke="#535353"
					stroke-width="0.7"
					stroke-linejoin="round"
			/>
		</svg>
		<span>{{ propHotelData.location }}</span>
	</div>

	<h3>{{ propHotelData.hotelName }}</h3>

	<!-- Рейтинг -->
	<ul class="rating" v-if="typeof propHotelData.rating === 'number'">
		<li class="star" v-for="_star in propHotelData.rating" :key="_star">
			<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
			>
				<path
						d="M17.7364 6.89552L12.7774 6.17481L10.5606 1.68067C10.5001 1.55762 10.4005 1.45802 10.2774 1.39747C9.96882 1.24512 9.59382 1.37208 9.43952 1.68067L7.22272 6.17481L2.26374 6.89552C2.12702 6.91505 2.00202 6.9795 1.90632 7.07716C1.79062 7.19607 1.72686 7.35606 1.72906 7.52196C1.73126 7.68787 1.79923 7.84611 1.91804 7.96192L5.50593 11.46L4.65827 16.3994C4.63839 16.5143 4.65111 16.6325 4.69497 16.7405C4.73884 16.8486 4.8121 16.9422 4.90645 17.0107C5.0008 17.0792 5.11246 17.1199 5.22878 17.1282C5.34509 17.1365 5.4614 17.1121 5.56452 17.0576L10.0001 14.7256L14.4356 17.0576C14.5567 17.1221 14.6973 17.1436 14.8321 17.1201C15.1719 17.0615 15.4005 16.7393 15.3419 16.3994L14.4942 11.46L18.0821 7.96192C18.1798 7.86622 18.2442 7.74122 18.2637 7.6045C18.3165 7.2627 18.0782 6.9463 17.7364 6.89552Z"
						fill="#FADB14"
				/>
			</svg>
		</li>
	</ul>
	<span v-else class="rating">{{ propHotelData.rating }}</span>

	<!-- Бенефиты -->
	<ul class="benefits">
		<li class="benefit" v-for="benefit in benefits" :key="benefit">
			{{ benefit }}
		</li>
	</ul>

	<span class="price">{{ propHotelData.price }}</span>
	<div class="mdn">
			<span class="meal">
		    {{ propHotelData.meal }}
		  </span>

		<span class="dates">
		    {{ propHotelData.dates }}
		  </span>

		<span class="nights">
		    {{ propHotelData.nights }} на&nbsp;двоих
		  </span>
	</div>
	<div class="actions">
		<a class="prime-btn"
			 :href="propHotelData.url"
			 target="_blank"
			 @click="safeYm(96674199, 'reachGoal', 'joint_popup_click');"
		>
			Выбрать тур
		</a>

		<!-- Десктоп -->
		<div v-if="!isMobile" class="ligal-container">
			<span v-if="!copied" class="ligal">Реклама</span>
			<span
					v-if="!copied"
					class="erid"
					@click="emit('copy-erid')"
			>
		        {{ ligal }}
		        <span>{{ erid }}</span>
		      </span>
			<span v-if="copied" class="success">Скопировано!</span>
		</div>

		<!-- Мобила -->
		<div v-else class="ligal-container">
		      <span
							class="success"
							v-if="copied"
							:style="{ color: '#52c41a' }"
					>
		        Скопировано!
		      </span>
			<span
					class="ligal"
					v-else
					@click="emit('copy-erid')"
			>
		        Реклама. {{ ligal }}
		        <span> erid: {{ erid }}</span>
		      </span>
		</div>
	</div>
</template>
