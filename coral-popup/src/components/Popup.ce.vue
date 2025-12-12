<script setup lang="ts">
import {getCurrentInstance, nextTick, onMounted, onUnmounted, shallowRef} from 'vue'
import {useSessionStorage} from '@vueuse/core'
import waitUntilElementsGone from '../helpers/useElementsGone.ts'

type Props = {
	autoShow?: boolean | string | number
	guardSelectors?: string
	ymMetrika?: string
}

const {autoShow, guardSelectors, ymMetrika} = defineProps<Props>()

// --- autoShow как delay ---
function resolveAutoShowDelay(value: Props['autoShow']): number | null {
	if (value === undefined || value === null) return null
	if (value === true || value === '') return 0
	const n = Number(value)
	return Number.isFinite(n) && n >= 0 ? n : null
}


const autoShowDelay = resolveAutoShowDelay(autoShow)
const hasAutoShow = autoShowDelay !== null

// --- state ---
const mounted = shallowRef(false)
const visible = shallowRef(false)

// Авто-показ ровно один раз за сессию

const instance = getCurrentInstance()
const popupId = (instance?.vnode.props as any)?.id ?? crypto.randomUUID()
const wasShownOnce = useSessionStorage<boolean>(
		`coral-popup-auto-shown-${popupId}`,
		false
)

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

function fireMetrika() {
	if (!ymMetrika) return
	try {
		const fn = new Function(ymMetrika)
		fn()
	} catch (e) {
		console.warn('Ошибка выполнения ymMetrika:', e)
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
	if (wasShownOnce.value) return

	wasShownOnce.value = true

	mounted.value = true
	await nextTick()
	visible.value = true
	lockScroll()
	fireMetrika()
}

// --- ПУБЛИЧНЫЙ показ (клик по bubble) ---
async function publicShow() {
	if (visible.value) return

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

// --- авто-логика ---
function setupAutoShow() {
	if (!hasAutoShow) return
	if (wasShownOnce.value) return

	// нет guard-selectors → просто ждём autoShowDelay
	if (!hasGuardSelectors) {
		setTimeout(() => internalShow(), autoShowDelay as number)
		return
	}

	// есть guard-selectors → ждём, пока они полностью исчезнут
	waitUntilElementsGone(
			{
				floating: selectors,     // все guard-селекторы должны исчезнуть
			},
			() => {
				if (wasShownOnce.value) return
				setTimeout(() => internalShow(), autoShowDelay as number)
			}
	)
}

// --- ESC ---
function onKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape') hide()
}

// --- lifecycle ---
onMounted(() => {
	document.addEventListener('keydown', onKeydown, true)
	setupAutoShow()
})

onUnmounted(() => {
	document.removeEventListener('keydown', onKeydown, true)
	unlockScroll()
})

defineExpose({show: publicShow, hide, afterLeave})
</script>


<template>
	<div v-if="mounted" class="popup-backdroppo"></div>
	<div v-if="mounted" part="popup-body" class="popup-body" @click.self="hide">
		<transition name="dialog-fade" @after-leave="afterLeave">
			<div
					v-show="visible"
					class="popup-dialog"
					part="popup-dialog"
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

				<div class="popup-content" part="popup-content">
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
