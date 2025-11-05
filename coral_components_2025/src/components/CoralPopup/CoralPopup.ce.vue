<script setup lang="ts">
import {computed, ComputedRef, nextTick, onBeforeMount, onMounted, onUnmounted, ref} from 'vue'

// Типы пропсов
type Props = {
	autoShow?: boolean
	expires?: string
	yandexMetrika?: string
}

// Пропсы
const {autoShow, expires, yandexMetrika} = defineProps<Props>()

// Состояния
const mounted = ref(false)
const visible = ref(false)
const allowed = ref(true)

const ymData: ComputedRef<string> = computed(() => {
	return (yandexMetrika?.startsWith('{')) ? JSON.parse(yandexMetrika) : yandexMetrika
})

function isWithinExpire(): boolean {
	if (!expires) return true
	const t = new Date(expires).getTime()
	return Number.isFinite(t) ? Date.now() < t : false
}

// --- Метрика ---
function notifyOpened() {
	if (ymData && (window as any).ym) {
		ym(96674199, 'reachGoal', ymData.value)
	}
}

// --- Управление показом ---
async function show() {
	if (!allowed.value) return
	if (visible.value) return
	mounted.value = true
	await nextTick()
	visible.value = true
	scrollLock()
	notifyOpened()
}

function hide() {
	if (!visible.value) return
	visible.value = false
	scrollBack()
}

function toggle() {
	visible.value ? hide() : show()
}

// --- Работа со скроллом ---
function scrollLock() {
	document.body.classList.add('js-scroll-lock')
}

function scrollBack() {
	document.body.classList.remove('js-scroll-lock')
}

// --- Закрытие по Esc ---
function onKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape' && visible.value) hide()
}

// --- Инициализация ---
function init() {
	if (!allowed.value) return
	autoShow && setTimeout(show, 2000)
}

// --- Хуки ---
onBeforeMount(() => {
	allowed.value = isWithinExpire()
})
onMounted(() => {
	if (!allowed.value) return
	document.addEventListener('keydown', onKeydown, true)
	init()
})
onUnmounted(() => {
	document.removeEventListener('keydown', onKeydown, true)
})

// --- Методы наружу ---
defineExpose({show, hide, toggle})
</script>

<template>
	<div
			v-if="mounted"
			class="popup-overlay"
			:data-state="visible ? 'open' : 'closed'"
			@click.self="hide"
			part="overlay"
	>
		<div class="popup-backdrop" aria-hidden="true" part="overlay"/>
		<transition name="dialog-fade" @after-leave="mounted = false">
			<div v-if="visible" class="popup-dialog" part="dialog" role="dialog" aria-modal="true">
				<button class="popup-close" type="button" @click="hide" aria-label="Закрыть">
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M14.6666 1.3335L1.33331 14.6668" stroke="#535353"/>
						<path d="M1.33329 1.3335L14.6666 14.6668" stroke="#535353"/>
					</svg>
				</button>

				<div class="popup-visual">
					<slot name="visual"/>
					<slot name="ligal"/>
				</div>

				<div class="popup-content">
					<slot/>
					<slot name="title"/>
					<slot name="subtitle"/>
					<slot name="button" @click="hide"></slot>
					<slot name="list"/>
					<slot name="footnote"/>
					<slot name="disclaimers"/>
				</div>
			</div>
		</transition>
	</div>
</template>

<style lang="scss">
@use 'CoralPopup';
</style>
