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
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<g clip-path="url(#clip0_10074_5205)">
				<path d="M1.14696 19.9899V21.2959H11.9982H22.8492V19.9899H11.9982H1.14696Z" fill="#EFC684"/>
				<path
						d="M23.2253 7.79959C22.548 7.13057 21.5812 6.9211 20.7042 7.25397L19.4212 7.73978L19.5506 6.80073C19.6622 5.99013 19.2879 5.21208 18.5969 4.8189C17.9398 4.44464 17.1625 4.50773 16.5674 4.98192L11.9981 8.62458L7.42874 4.98192C6.83341 4.50773 6.05612 4.44489 5.39947 4.81864C4.70849 5.21183 4.33423 5.98962 4.44578 6.80047L4.57524 7.73953L3.29196 7.25372C2.41499 6.92111 1.44817 7.13032 0.771077 7.79909C0.0331587 8.52767 -0.200786 9.59568 0.160349 10.5865L2.52325 17.0672H1.14685V18.3732H7.35783L5.73965 6.62205C5.69322 6.28388 5.86685 6.05524 6.04502 5.95353C6.15606 5.89069 6.37688 5.81372 6.6141 6.003L11.3447 9.7741V17.7203H12.6507V9.7741L17.3813 6.003C17.6183 5.81347 17.8401 5.89069 17.9504 5.95379C18.1288 6.05524 18.3027 6.28413 18.2562 6.62205L16.6378 18.3732H22.8488V17.0672H21.4724L23.8353 10.5865C24.1967 9.59593 23.9627 8.52792 23.2251 7.79909L23.2253 7.79959ZM5.85978 17.0675H3.91303L1.3871 10.1393C1.16704 9.53587 1.39846 9.01499 1.68843 8.72855C1.83959 8.5794 2.25347 8.25738 2.82937 8.47517L4.77789 9.21309L5.85978 17.0675ZM22.6088 10.1393L20.0829 17.0675H18.1364L19.2185 9.21309L21.1668 8.47543C21.7437 8.25688 22.1571 8.57991 22.308 8.7288C22.598 9.01524 22.8291 9.53612 22.6091 10.1395L22.6088 10.1393Z"
						fill="#EFC684"/>
				<path
						d="M13.4051 4.33137C13.5311 3.55544 13.0042 2.82431 12.2282 2.69836C11.4523 2.57241 10.7212 3.09933 10.5952 3.87526C10.4693 4.6512 10.9962 5.38232 11.7721 5.50827C12.548 5.63422 13.2792 5.10731 13.4051 4.33137Z"
						fill="#EFC684"/>
			</g>
			<defs>
				<clipPath id="clip0_10074_5205">
					<rect width="24" height="23.9748" fill="white"/>
				</clipPath>
			</defs>
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
