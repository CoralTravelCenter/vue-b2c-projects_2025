<script setup lang="ts">
import type {ComputedRef, ShallowRef} from 'vue';
import {computed, onMounted, shallowRef, watch} from 'vue';
import {useClipboard, useMediaQuery} from '@vueuse/core';
import useHotelData from '@/composables/useHotelData';
import {handleTrigger} from '@/handlers/handleTrigger'
import {handleCopyErid} from "@/handlers/handleCopyErid";
import {handleCloseButton} from "@/handlers/handleCloseButton";
import type {ArrivalLocation, Hotel} from '@/types';
import {register} from 'swiper/element/bundle';
import CoralJointSlide from './CoralJointSlide.vue';
import {setScrollLock} from "@/handlers/setScrollLock";
import {safeParse} from "@/handlers/safeParse";
import CoralJointVipSlide from "@/components/CoralJointVipSlide.vue";

register();

const props = defineProps<{
	hotels?: string;
	mode?: string;
	vipDeparture?: string;
	nights?: string;
}>();

// --------- ПАРСИНГ ВХОДНЫХ ДАННЫХ ---------
// режимы
const isStatic = computed(() => props.static || !!props.vipDeparture);
const isDynamic = computed(() => !isStatic.value && !!props.hotels);

// динамические данные (request)
const hotelsArr = computed<Hotel[]>(() =>
		safeParse<Hotel[]>(props.hotels, []),
);

const requestedHotelNames: ComputedRef<string[]> = computed(() =>
		hotelsArr.value.map(({name}) => name),
);

const requestedBenefits: ComputedRef<string[][]> = computed(() =>
		hotelsArr.value.map(({benefits}) => benefits),
);

const hotelErids: ComputedRef<string[]> = computed(() =>
		hotelsArr.value.map(({erid}) => erid),
);

const hotelLigals: ComputedRef<string[]> = computed(() =>
		hotelsArr.value.map(({ligal}) => ligal),
);

const dateRange: ComputedRef<string[][]> = computed(() =>
		hotelsArr.value.map(({period}) => period),
);

const nightsNumber = computed(() =>
		typeof props.nights === 'string' ? Number(props.nights) : props.nights,
);

const vipHotelsList = computed<VipHotel[]>(() =>
		safeParse<VipHotel[]>(props.vipDeparture, []),
);

// --------- СОСТОЯНИЕ ---------

const hotelsData: ShallowRef<
		Array<{
			formattedPrice: string;
			isElite: boolean;
			hotelName: string;
			visual: string;
			rating: string | number;
			dates: string[];
			meal: string[];
		}>
> = shallowRef([]);

const arrivalLocationForLinks: ArrivalLocation[] = shallowRef([])
const notLargeScreen = useMediaQuery('(max-width: 993px)');
const dynamicEvent = computed<'click' | 'mouseover'>(() =>
		notLargeScreen.value ? 'click' : 'mouseover',
);

// true = попап скрыт
const activeRef: ShallowRef<boolean> = shallowRef(true);

const activeState: ComputedRef<string> = computed(() =>
		activeRef.value ? 'closed' : 'opened',
);

// Clipboard
const {copy, copied} = useClipboard();
const copiedIndex = shallowRef<number | null>(null);

async function fetchHotelData() {
	if (!isDynamic.value || !requestedHotelNames.value.length) return;
	console.log(requestedHotelNames.value, dateRange.value, nightsNumber.value);
	try {
		hotelsData.value = await useHotelData(
				requestedHotelNames,
				dateRange,
				nightsNumber
		);
	} catch (error) {
		console.error('Ошибка при загрузке данных об отелях:', error);
	}
}

function handleTrigger(e: MouseEvent) {
	const wasClosed = activeRef.value;

	activeRef.value = !activeRef.value;
	const nowOpen = !activeRef.value;

	// Лочим скролл ТОЛЬКО на мобилке и только по клику
	if (e.type === 'click' && notLargeScreen.value) {
		setScrollLock(nowOpen);
	}

	if (wasClosed && nowOpen) {
		// Метрика открытия
		safeYm(96674199, 'reachGoal', 'joint_popup_show');
	}
}

function safeYm(...args: any[]) {
	(window as any).ym?.(...args);
}


// если экран "расширился" — убираем возможный scroll-lock
watch(notLargeScreen, (isMobile) => {
	if (!isMobile) {
		setScrollLock(false);
	}
});

// --------- ЖИЗНЕННЫЙ ЦИКЛ ---------

onMounted(fetchHotelData)
</script>

<template>
	<!-- КНОПКА-ТРИГГЕР -->
	<button
			v-if="hotels"
			class="joint-trigger"
			:class="{ 'out-of-view': !activeRef }"
			v-on:[dynamicEvent]="handleTrigger"
	>
    <span class="icon wobble-hor-bottom-loop">
      <svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 21 20"
					fill="none"
			>
        <path
						d="M3.49988 9.14001L17.4999 3.14001V17.14L3.49988 13.14V9.14001Z"
						stroke="white"
						stroke-linejoin="round"
				></path>
        <path
						d="M0.499878 9.64001C0.499878 8.81159 1.17145 8.14001 1.99988 8.14001V8.14001C2.82831 8.14001 3.49988 8.81159 3.49988 9.64001V12.64C3.49988 13.4684 2.82831 14.14 1.99988 14.14V14.14C1.17145 14.14 0.499878 13.4684 0.499878 12.64V9.64001Z"
						stroke="white"
						stroke-linejoin="round"
				></path>
        <path
						d="M17.4999 2.64001C17.4999 1.81159 18.1715 1.14001 18.9999 1.14001V1.14001C19.8283 1.14001 20.4999 1.81159 20.4999 2.64001V17.64C20.4999 18.4684 19.8283 19.14 18.9999 19.14V19.14C18.1715 19.14 17.4999 18.4684 17.4999 17.64V2.64001Z"
						stroke="white"
						stroke-linejoin="round"
				></path>
        <path
						d="M6.99988 14.14V17.14C6.99988 18.2446 7.89531 19.14 8.99988 19.14H10.4999C11.6044 19.14 12.4999 18.2446 12.4999 17.14V15.64"
						stroke="white"
						stroke-linejoin="round"
				></path>
      </svg>
    </span>
		Надо брать
	</button>
	<button
			v-else-if="vipDeparture"
			class="joint-trigger vip"
			:class="{ 'out-of-view': !activeRef }"
			v-on:[dynamicEvent]="handleTrigger"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
			<path
					d="M11.3 22.1C17.2647 22.1 22.1 17.2647 22.1 11.3C22.1 5.33532 17.2647 0.5 11.3 0.5C5.33532 0.5 0.5 5.33532 0.5 11.3C0.5 13.0096 0.897249 14.6265 1.60448 16.0633C1.66508 16.1864 1.68495 16.326 1.65737 16.4604L0.679483 21.2254C0.593795 21.643 0.958611 22.0142 1.37758 21.9358L6.30254 21.0143C6.43068 20.9903 6.5629 21.0093 6.68071 21.0651C8.0812 21.7287 9.64725 22.1 11.3 22.1Z"
					stroke="white"/>
			<path
					d="M16.5134 7.48523C15.0814 6.05354 12.76 6.05408 11.3281 7.48592L11.1907 7.35541C9.75143 6.05532 7.52999 6.0984 6.14291 7.48523C4.71099 8.91716 4.71099 11.2392 6.14291 12.6711L11.3281 17.8564L16.5134 12.6711C17.9453 11.2392 17.9453 8.91716 16.5134 7.48523Z"
					stroke="white" stroke-linejoin="round"/>
		</svg>
		Надо<br>
		брать
	</button>

	<!-- ЗАТЕМНЕНИЕ ДЛЯ МОБИЛЫ -->
	<div
			class="backdrop"
			v-show="!activeRef && notLargeScreen"
			aria-hidden="true"
			part="overlay"
	/>

	<!-- ДИНАМИЧЕСКИЙ РЕЖИМ (hotels) -->
	<swiper-container
			v-if="hotels"
			:class="{ 'out-of-view': activeRef }"
			:slides-per-view="1"
			v-on="!notLargeScreen ? { mouseleave: handleTrigger } : {}"
			pagination="true"
			space-between="8"
			:data-state="activeState"
	>
		<!-- КНОПКА ЗАКРЫТИЯ НА МОБИЛЕ -->
		<div v-if="notLargeScreen" slot="container-start">
			<button class="popup-close" @click="handleCloseButton">
				<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M14.6666 1.3335L1.33331 14.6668" stroke="#535353"/>
					<path d="M1.33329 1.3335L14.6666 14.6668" stroke="#535353"/>
				</svg>
			</button>
		</div>

		<swiper-slide
				v-for="(hotel, idx) in hotelsData"
				:key="hotel.hotelName + '-' + idx"
		>
			<CoralJointSlide
					:price="hotel.price"
					:encrypt="hotel.encrypt"
					:benefits="requestedBenefits[idx]"
					:erid="hotelErids[idx]"
					:ligal="hotelLigals[idx]"
					:nights="Number(nightsNumber)"
					:copied="copied && copiedIndex === idx"
					:is-mobile="notLargeScreen"
					:arrivalLocationForLink="arrivalLocationForLinks[idx]"
					@copy-erid="handleCopyErid(idx)"
			/>
		</swiper-slide>
	</swiper-container>

	<!-- СТАТИЧЕСКИЙ РЕЖИМ (vip-hotels) -->
	<swiper-container
			v-else-if="vipDeparture"
			:class="{ 'out-of-view': activeRef }"
			:slides-per-view="1"
			v-on="!notLargeScreen ? { mouseleave: handleTrigger } : {}"
			pagination="true"
			space-between="8"
			:data-state="activeState"
	>
		<div v-if="notLargeScreen" slot="container-start">
			<button class="popup-close" @click="handleCloseButton">
				<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M14.6666 1.3335L1.33331 14.6668" stroke="#535353"/>
					<path d="M1.33329 1.3335L14.6666 14.6668" stroke="#535353"/>
				</svg>
			</button>
		</div>

		<swiper-slide
				class="joint-slider-vip"
				v-for="(hotel, idx) in vipHotelsList"
				:key="hotel.headline + '-' + idx"
		>
			<CoralJointVipSlide
					:visual="hotel.visual"
					:headline="hotel.headline"
					:text="hotel.text"
					:logo="hotel.logo"
					:url="hotel.url"
					:erid="hotel.erid"
					:ligal="hotel.ligal"
			/>
		</swiper-slide>
	</swiper-container>
</template>

<style lang="scss">
@use '../styles/CoralJoint';
</style>
