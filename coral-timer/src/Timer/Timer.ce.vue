<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps<{
	timer: string; // YYYY-MM-DD
}>();

const timeLeft = ref<number>(0);
const isVisible = ref<boolean>(true);
let interval: number | null = null;

const targetTime = new Date(`${props.timer}T00:00:00`).getTime();

const update = (): void => {
	const diff = targetTime - Date.now();
	timeLeft.value = Math.max(diff, 0);
	if (diff <= 0) stop();
};

const start = (): void => {
	update();
	if (interval === null) interval = window.setInterval(update, 1000);
};

const stop = (): void => {
	if (interval !== null) {
		clearInterval(interval);
		interval = null;
	}
};

onMounted(start);
onUnmounted(stop);

// -------- utils --------

const format = (v: number): string => v.toString().padStart(2, "0");

const plural = (n: number, one: string, few: string, many: string): string => {
	const mod10 = n % 10;
	const mod100 = n % 100;
	if (mod10 === 1 && mod100 !== 11) return one;
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
	return many;
};

// -------- time parts --------

const days = computed(() => Math.floor(timeLeft.value / 86400000));
const hours = computed(() => Math.floor(timeLeft.value / 3600000) % 24);
const minutes = computed(() => Math.floor(timeLeft.value / 60000) % 60);
const seconds = computed(() => Math.floor(timeLeft.value / 1000) % 60);

const daysLabel = computed(() => plural(days.value, "день", "дня", "дней"));

const hoursLabel = computed(() => plural(hours.value, "час", "часа", "часов"));
</script>

<template>
	<div v-if="isVisible" class="container" part="container">
		<div class="text" part="text-block">
			<slot name="headline" />
			<slot name="subline" />
		</div>

		<div class="countdown" part="countdown-block">
			<div class="item">
				<div class="value">{{ format(days) }}</div>
				<div class="label">{{ daysLabel }}</div>
			</div>

			<div class="colon">:</div>

			<div class="item">
				<div class="value">{{ format(hours) }}</div>
				<div class="label">{{ hoursLabel }}</div>
			</div>

			<div class="colon">:</div>

			<div class="item">
				<div class="value">{{ format(minutes) }}</div>
				<div class="label">мин</div>
			</div>

			<div class="colon">:</div>

			<div class="item">
				<div class="value">{{ format(seconds) }}</div>
				<div class="label">сек</div>
			</div>
		</div>

		<slot name="link" />
	</div>
</template>

<style lang="scss">
@use "./Timer.scss";
</style>
