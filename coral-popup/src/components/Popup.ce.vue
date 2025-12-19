<script setup lang="ts">
import {onMounted, onUnmounted, shallowRef} from 'vue'
import {useStorage} from '@vueuse/core'

import publicShow from '../helpers/publicShow'
import {unlockScroll} from '../helpers/scroll'
import resolveAutoShow from '../helpers/resolveAutoShow'
import parseGuardSelectors from '../helpers/parseGuardSelectors'
import waitUntilElementsGone from "../helpers/waitUntilElementGone.ts";
import {IProps} from "../types";

const {
	id,
	autoShow,
	guardSelectors,
	ymMetrika,
} = defineProps<IProps>()

const mounted = shallowRef(false)
const visible = shallowRef(false)

let abort: AbortController | null = null
let autoDelayTimer: number | null = null

function clearAutoTimer() {
	if (autoDelayTimer !== null) {
		clearTimeout(autoDelayTimer)
		autoDelayTimer = null
	}
}

function hide() {
	if (!visible.value) return
	visible.value = false
}

function afterLeave() {
	mounted.value = false
	unlockScroll()
	clearAutoTimer()
}

function onKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape') hide()
}

function runAutoShow(args: {
	autoShowAttr?: string
	autoDelay: false | number
	wasAutoShown: { value: boolean }
}) {
	const {autoShowAttr, autoDelay, wasAutoShown} = args

	if (autoShowAttr === undefined) return
	if (autoDelay === false) return
	if (wasAutoShown.value) return

	wasAutoShown.value = true

	const ctx = {visible, mounted, ymMetrika}
	const doShow = () => publicShow(ctx)

	if (autoDelay === 0) doShow()
	else autoDelayTimer = setTimeout(doShow, autoDelay)
}

async function setupAutoShow() {
	abort?.abort()
	abort = new AbortController()
	clearAutoTimer()

	if (autoShow === undefined) return

	const autoDelay = resolveAutoShow(autoShow)

	const wasAutoShown = useStorage<boolean>(
			`coral-popup-auto-shown-${id}`,
			false,
			sessionStorage
	)

	const guards = parseGuardSelectors(guardSelectors)

	await waitUntilElementsGone({
		floating: guards,
	});

	runAutoShow({
		autoShowAttr: autoShow,
		autoDelay,
		wasAutoShown,
	})
}

function show() {
	const ctx = {visible, mounted, ymMetrika}
	return publicShow(ctx)
}

onMounted(() => {
	document.addEventListener('keydown', onKeydown, true)
	void setupAutoShow()
})

onUnmounted(() => {
	document.removeEventListener('keydown', onKeydown, true)
	abort?.abort()
	clearAutoTimer()
	unlockScroll()
})

defineExpose({show, hide, afterLeave})
</script>


<template>
	<div v-if="mounted" class="popup-backdroppo"></div>

	<div v-if="mounted" part="popup-body" class="popup-body" @click.self="hide()">
		<transition name="dialog-fade" @after-leave="afterLeave()">
			<div
					v-show="visible"
					class="popup-dialog"
					part="popup-dialog"
					role="dialog"
					aria-modal="true"
			>
				<button class="popup-close" type="button" @click="hide()" aria-label="Закрыть">
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<path d="M14.6666 1.3335L1.33331 14.6668" stroke="#535353"/>
						<path d="M1.33329 1.3335L14.6666 14.6668" stroke="#535353"/>
					</svg>
				</button>

				<div class="popup-visual">
					<slot name="visual" part="visual"/>
					<slot name="erid" part="erid"/>
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
