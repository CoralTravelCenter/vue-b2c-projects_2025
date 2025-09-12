<script setup lang="ts">
import {computed, ComputedRef, onMounted, ShallowRef, shallowRef} from 'vue';
import useHotelData from '@/composibles/useHotelData';
import {formattedDates, pluralizeNights} from "@/utils";
import {Hotel} from "@/types";
import {useClipboard, useMediaQuery} from "@vueuse/core";

// Props
const {countries, hotels, lookupDays, lookupNights} = defineProps<{
	countries: string;
	hotels: string;
	lookupDays: string;
	lookupNights: string;
}>();

// Reactive Data
const hotelData = shallowRef<Array<{
	formattedPrice: string;
	isElite: boolean;
	hotelName: string;
	location: string;
	visual: string;
	rating: string | number;
	dates: string[];
	meal: string[];
}>>([]);

const hotelsArr: Hotel[] = JSON.parse(hotels);

// Computed Properties
const requestedHotelNames: ComputedRef<string[]> = computed(() => {
	return hotelsArr.map(({name}) => name);
});
const requestedBenefits: ComputedRef<string[][]> = computed(() => {
	return hotelsArr.map(({benefits}) => benefits);
});
const hotelErids: ComputedRef<string[]> = computed(() => {
	return hotelsArr.map(({erid}) => erid);
});
const hotelLigals: ComputedRef<string[]> = computed(() => {
	return hotelsArr.map(({ligal}) => ligal);
});

// VueUse
const {copy, copied} = useClipboard();
const notLargeScreen = useMediaQuery('(max-width: 993px)');

// Стэйт
const isActive: ShallowRef<boolean> = shallowRef(false);

// Functions
function handleTrigger(e: MouseEvent) {
	isActive.value = !isActive.value;
	// if (e.type === 'mouseover' || e.type === 'click') {
	// 	ym(96674199, 'reachGoal', 'joint_popup_show')
	// }
}

function handleTourButton() {
	// ym(96674199, 'reachGoal', 'joint_popup_click')
}

// Fetch Hotel Data
async function fetchHotelData() {
	try {
		hotelData.value = await useHotelData(requestedHotelNames, lookupDays, lookupNights);
	} catch (error) {
		console.error('Ошибка при загрузке данных об отелях:', error);
	}
}

// Lifecycle Hooks
onMounted(fetchHotelData);
</script>


<template>
	<button
			class="joint-trigger"
			:class="{'out-of-view': isActive}"
			@click="handleTrigger"
			@mouseover="handleTrigger"
	>
				<span class="icon wobble-hor-bottom-loop">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 20" fill="none">
						<path d="M3.49988 9.14001L17.4999 3.14001V17.14L3.49988 13.14V9.14001Z" stroke="white"
									stroke-linejoin="round"></path>
						<path
								d="M0.499878 9.64001C0.499878 8.81159 1.17145 8.14001 1.99988 8.14001V8.14001C2.82831 8.14001 3.49988 8.81159 3.49988 9.64001V12.64C3.49988 13.4684 2.82831 14.14 1.99988 14.14V14.14C1.17145 14.14 0.499878 13.4684 0.499878 12.64V9.64001Z"
								stroke="white" stroke-linejoin="round"></path>
						<path
								d="M17.4999 2.64001C17.4999 1.81159 18.1715 1.14001 18.9999 1.14001V1.14001C19.8283 1.14001 20.4999 1.81159 20.4999 2.64001V17.64C20.4999 18.4684 19.8283 19.14 18.9999 19.14V19.14C18.1715 19.14 17.4999 18.4684 17.4999 17.64V2.64001Z"
								stroke="white" stroke-linejoin="round"></path>
						<path
								d="M6.99988 14.14V17.14C6.99988 18.2446 7.89531 19.14 8.99988 19.14H10.4999C11.6044 19.14 12.4999 18.2446 12.4999 17.14V15.64"
								stroke="white" stroke-linejoin="round"></path>
					</svg>
				</span>
		Надо брать
	</button>
	<swiper-container
			:class="{'out-of-view': !isActive}"
			:slides-per-view="1"
			@mouseleave="handleTrigger"
			pagination="true"
			space-between="8"
	>
		<div v-if="notLargeScreen" slot="container-start">
			<button class="popup-close" @click="handleTrigger">
				<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M14.6666 1.3335L1.33331 14.6668" stroke="#535353"/>
					<path d="M1.33329 1.3335L14.6666 14.6668" stroke="#535353"/>
				</svg>
			</button>
		</div>
		<swiper-slide v-for="(hotel, idx) in hotelData">
			<div class="visual" v-bind="{ 'data-category': hotel.isElite ? 'ELITE SERVICE' : null }">
				<img :src="hotel.visual" :alt="hotel.hotelName">
			</div>
			<div class="location">
				<svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16" fill="none">
					<path
							d="M9.33335 5.66659C9.33335 9.72649 5.00002 14.6666 5.00002 14.6666C5.00002 14.6666 0.666687 9.72649 0.666687 5.66659C0.666687 3.27335 2.60679 1.33325 5.00002 1.33325C7.39325 1.33325 9.33335 3.27335 9.33335 5.66659Z"
							stroke="#535353" stroke-width="0.7" stroke-linejoin="round"/>
					<ellipse cx="5" cy="5.66675" rx="2" ry="2" stroke="#535353" stroke-width="0.7" stroke-linejoin="round"/>
				</svg>
				<span>{{ hotel.location }}</span>
			</div>
			<h3>{{ hotel.hotelName }}</h3>
			<ul class="rating">
				<li class="star" v-for="_star in hotel.rating">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path
								d="M17.7364 6.89552L12.7774 6.17481L10.5606 1.68067C10.5001 1.55762 10.4005 1.45802 10.2774 1.39747C9.96882 1.24512 9.59382 1.37208 9.43952 1.68067L7.22272 6.17481L2.26374 6.89552C2.12702 6.91505 2.00202 6.9795 1.90632 7.07716C1.79062 7.19607 1.72686 7.35606 1.72906 7.52196C1.73126 7.68787 1.79923 7.84611 1.91804 7.96192L5.50593 11.46L4.65827 16.3994C4.63839 16.5143 4.65111 16.6325 4.69497 16.7405C4.73884 16.8486 4.8121 16.9422 4.90645 17.0107C5.0008 17.0792 5.11246 17.1199 5.22878 17.1282C5.34509 17.1365 5.4614 17.1121 5.56452 17.0576L10.0001 14.7256L14.4356 17.0576C14.5567 17.1221 14.6973 17.1436 14.8321 17.1201C15.1719 17.0615 15.4005 16.7393 15.3419 16.3994L14.4942 11.46L18.0821 7.96192C18.1798 7.86622 18.2442 7.74122 18.2637 7.6045C18.3165 7.2627 18.0782 6.9463 17.7364 6.89552Z"
								fill="#FADB14"/>
					</svg>
				</li>
			</ul>
			<ul class="benefits">
				<li class="benefit" v-for="benefit in requestedBenefits[idx]">{{ benefit }}</li>
			</ul>
			<span class="price">{{ hotel.formattedPrice }}</span>
			<span class="meal">
				{{ hotel.meal.toString() }}
			</span>
			<span class="dates">
				{{ formattedDates(hotel.dates) }}
			</span>
			<span class="nights">
				{{ lookupNights }}&nbsp;{{ pluralizeNights(Number(lookupNights)) }} на&nbsp;двоихх</span>
			<div class="actions">
				<a href="#" class="prime-btn"
					 :data-onlyhotel-lookup-destination="countries"
					 :data-onlyhotel-lookup-regions="hotel.hotelName"
					 :data-onlyhotel-lookup-depth-days="lookupDays"
					 @click="handleTourButton"
				>
					Выбрать тур
				</a>
				<div class="ligal-container">
					<span v-if="!copied" class="ligal">Реклама</span>
					<span
							class="erid"
							v-if="!copied"
							@click="copy(hotelErids[idx])">
						{{ hotelLigals[idx] }}
						<span>{{ hotelErids[idx] }}</span>
					</span>
					<span class="success" v-if="copied">Скопировано!</span>
				</div>
			</div>
		</swiper-slide>
	</swiper-container>
</template>

<style lang="scss">
@use 'CoralJoint';
</style>
