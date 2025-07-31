<template>
	<button class="popup-trigger">
		<slot name="icon"/>
		<slot name="text"/>
	</button>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {useMediaQuery} from '@vueuse/core'

const props = defineProps<{
	for: string
}>()

const slotContainer = ref<HTMLElement | null>(null)

// 🟢 Медиазапрос: mobile = < 768px
const isMobile = useMediaQuery('(max-width: 767px)')

// CSS-селекторы для мест вставки
const SELECTOR_MOBILE = '.mobile-trigger-container'
const SELECTOR_DESKTOP = '.header-buttons'

// Возвращает нужный селектор по текущему брейкпоинту
function resolveTargetSelector(): string {
	return isMobile.value ? SELECTOR_MOBILE : SELECTOR_DESKTOP
}

function moveSlot() {
	const target = document.querySelector(resolveTargetSelector())
	if (target && slotContainer.value) {
		target.appendChild(slotContainer.value)
	} else {
		console.warn(`[coral-popup-trigger] target "${resolveTargetSelector()}" not found`)
	}
}

onMounted(() => {
	const popup = document.getElementById(props.for) as HTMLElement & { open?: () => void }

	if (!popup || typeof popup.open !== 'function') {
		console.warn(`[coral-popup-trigger] popup with id="${props.for}" not found or invalid`)
		return
	}

	slotContainer.value?.addEventListener('click', () => popup.open())
	moveSlot()
})

// При смене брейкпоинта переносим слот
watch(isMobile, () => {
	moveSlot()
})
</script>

<style scoped>
.popup-trigger {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	background: transparent;
	padding: 7px 16px 7px 8px;
	border: 1px solid rgba(0, 0, 0, 0.15);
	border-radius: 40px;
	width: fit-content;
	cursor: pointer;
	flex-shrink: 0;
	transition: border-color 0.3s ease;
}
</style>
