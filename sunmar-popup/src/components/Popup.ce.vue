<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, shallowRef} from 'vue'
import {useMutationObserver} from '@vueuse/core'

type Props = {
	autoShow?: boolean | string | number
	guardSelectors?: string
	ymMetrika?: string
}

const {autoShow, guardSelectors, ymMetrika} = defineProps<Props>()

// --- autoShow как delay ---
function resolveAutoShowDelay(value: Props['autoShow']): number | null {
	if (value === undefined || value === null) return null
	if (value === false || value === 'false') return null
	if (value === true || value === '') return 2000

	const n = Number(value)
	if (!Number.isFinite(n) || n <= 0) return null
	return n
}

const autoShowDelay = resolveAutoShowDelay(autoShow)
const hasAutoShow = autoShowDelay !== null

// --- state ---
const mounted = shallowRef(false)
const visible = shallowRef(false)

// попап автоматом показывается только один раз
const wasShownOnce = shallowRef(false)

// блокировочная логика
const hasSeenBlockers = shallowRef(false)    // блокеры хотя бы раз появились
const blockersResolved = shallowRef(false)   // фаза блокировки пройдена (для авто-показа)

let autoShowTimer: number | null = null
const GUARD_APPEAR_WAIT = 300
let guardAppearTimer: number | null = null

// --- селекторы блокировки ---
function parseGuardSelectors(): string[] {
	if (!guardSelectors) return []
	return guardSelectors
			.split(',')
			.map(s => s.trim())
			.filter(Boolean)
}

const selectors = parseGuardSelectors()
const hasGuardSelectors = selectors.length > 0

function isBlockedNow(): boolean {
	if (!selectors.length) return false
	return selectors.some(sel => !!document.querySelector(sel))
}

function fireMetrika() {
	if (!ymMetrika) return

	try {
		const fn = new Function(ymMetrika)
		fn()
	} catch (e) {
		console.warn('Ошибка выполнения команды ymMetrika:', e)
	}
}

// --- scroll ---
function lockScroll() {
	document.body.classList.add('js-scroll-lock')
}

function unlockScroll() {
	document.body.classList.remove('js-scroll-lock')
}

// --- ВНУТРЕННИЙ показ (для авто-логики) ---
async function internalShow() {
	if (visible.value) return
	if (wasShownOnce.value) return           // авто — только один раз
	if (!blockersResolved.value) return
	if (isBlockedNow()) return

	wasShownOnce.value = true

	mounted.value = true
	await nextTick()
	visible.value = true
	lockScroll()
	fireMetrika()
}

// --- ПУБЛИЧНЫЙ показ (popupElement.show()) ---
async function publicShow() {
	if (visible.value) return
	if (isBlockedNow()) return

	mounted.value = true
	await nextTick()
	visible.value = true
	lockScroll()
	fireMetrika()
}

function hide() {
	if (!visible.value) return
	visible.value = false
}

function afterLeave() {
	mounted.value = false
	unlockScroll()
}

// --- авто-показ ---
function scheduleAutoShowIfNeeded() {
	if (!hasAutoShow) return
	if (!blockersResolved.value) return
	if (wasShownOnce.value) return
	if (autoShowTimer !== null) return

	autoShowTimer = window.setTimeout(async () => {
		autoShowTimer = null
		await internalShow()
	}, autoShowDelay as number)
}

// --- ожидание появления guard-selectors (300ms) ---
function scheduleGuardAppearWait() {
	if (!hasGuardSelectors) return
	if (guardAppearTimer !== null) return

	guardAppearTimer = window.setTimeout(() => {
		guardAppearTimer = null

		// если блокеры так и не появились и их сейчас нет —
		// считаем, что блокеров нет и не будет
		if (!hasSeenBlockers.value && !isBlockedNow()) {
			blockersResolved.value = true
			scheduleAutoShowIfNeeded()
		}
	}, GUARD_APPEAR_WAIT)
}

// --- оценка блокировки ---
function evaluateBlockers() {
	// guardSelectors не переданы — блокеров нет
	if (!hasGuardSelectors) {
		blockersResolved.value = true
		scheduleAutoShowIfNeeded()
		return
	}

	const blocked = isBlockedNow()

	if (blocked) {
		// блокеры появились
		hasSeenBlockers.value = true
		blockersResolved.value = false
		if (visible.value) hide()
		return
	}

	// блокеров сейчас нет
	if (!hasSeenBlockers.value) {
		// ещё ни разу не видели блокеры → даём им шанс появиться 300ms
		blockersResolved.value = false
		scheduleGuardAppearWait()
		return
	}

	// блокеры уже были и исчезли → фаза блокировки пройдена (для авто-показа)
	blockersResolved.value = true
	scheduleAutoShowIfNeeded()
}

// --- ESC ---
function onKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape') hide()
}

// --- DOM observer ---
useMutationObserver(
		document.body,
		() => {
			evaluateBlockers()
		},
		{childList: true, subtree: true}
)

// --- lifecycle ---
onMounted(() => {
	document.addEventListener('keydown', onKeydown, true)
	evaluateBlockers()
})

onUnmounted(() => {
	document.removeEventListener('keydown', onKeydown, true)

	if (autoShowTimer !== null) {
		clearTimeout(autoShowTimer)
		autoShowTimer = null
	}

	if (guardAppearTimer !== null) {
		clearTimeout(guardAppearTimer)
		guardAppearTimer = null
	}

	unlockScroll()
})

defineExpose({show: publicShow, hide})
</script>

<template>
	<div v-if="mounted" class="popup-body" @click.self="hide">
		<transition name="dialog-fade" @after-leave="afterLeave">
			<div
					v-show="visible"
					class="popup-dialog"
					part="dialog"
					role="dialog"
					aria-modal="true"
			>
				<button class="popup-close" type="button" @click="hide" aria-label="Закрыть">
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<path d="M14.6666 1.3335L1.33331 14.6668" stroke="#535353"/>
						<path d="M1.33329 1.3335L14.6666 14.6668" stroke="#535353"/>
					</svg>
				</button>

				<div class="popup-visual">
					<slot name="visual"/>
					<slot name="erid"/>
				</div>

				<div class="popup-content">
					<slot/>
					<slot name="headline"/>
					<slot name="subline"/>
					<ul class="popup-benefits">
						<slot name="benefit"/>
					</ul>
					<slot name="action"/>
					<slot name="attention"/>
				</div>
			</div>
		</transition>
	</div>
</template>

<style lang="scss">
@use 'Popup';
</style>
