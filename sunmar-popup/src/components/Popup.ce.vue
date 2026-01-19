<script setup lang="ts">
import {type RemovableRef, useStorage} from '@vueuse/core'
import {onMounted, onUnmounted, shallowRef, watchEffect} from 'vue'

import {usePageScrollToggle} from '@fluejs/noscroll/vue'
import parseGuardSelectors from '../helpers/parseGuardSelectors'
import publicShow from '../helpers/publicShow.ts'
import resolveAutoShow from '../helpers/resolveAutoShow'
import waitUntilElementsGone from '../helpers/waitUntilElementGone.ts'
import {AutoshowArgs, ICtx, IGuards, IProps} from '../types'

const { id, autoShow, guardSelectors, ymMetrika } = defineProps<IProps>()

const mounted = shallowRef(false)
const visible = shallowRef(false)
const isPageScrollDisabled = shallowRef(false)

let autoDelayTimer: number | null = null
let wasAutoShown: RemovableRef<boolean> | null = null

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
	isPageScrollDisabled.value = false
	clearAutoTimer()
}

function onKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape') hide()
}

function runAutoShow(args: AutoshowArgs) {
	const { autoShowAttr, autoDelay, wasAutoShown } = args

	if (autoShowAttr === undefined) return
	if (autoDelay === false) return
	if (wasAutoShown.value) return

	wasAutoShown.value = true

	const ctx: ICtx = { visible, mounted, ymMetrika }
	const doShow = () => publicShow(ctx, isPageScrollDisabled)

	if (autoDelay === 0) doShow()
	else autoDelayTimer = window.setTimeout(doShow, autoDelay)
}

async function setupAutoShow() {
	clearAutoTimer()

	if (autoShow === undefined) return

	const autoDelay = resolveAutoShow(autoShow)
	wasAutoShown = useStorage<boolean>(`sunmar-popup-auto-shown-${id}`, false)

	const guards: IGuards = parseGuardSelectors(guardSelectors)
	await waitUntilElementsGone({ floating: guards })

	runAutoShow({
		autoShowAttr: autoShow,
		autoDelay,
		wasAutoShown,
	})
}

function show() {
	const ctx = { visible, mounted, ymMetrika }
	return publicShow(ctx, isPageScrollDisabled)
}

usePageScrollToggle(isPageScrollDisabled)

onMounted(() => setupAutoShow())

watchEffect(onCleanup => {
	if (!visible.value) return
	document.addEventListener('keydown', onKeydown, true)
	onCleanup(() => {
		document.removeEventListener('keydown', onKeydown, true)
	})
})

onUnmounted(() => {
	clearAutoTimer()
	isPageScrollDisabled.value = false
	wasAutoShown = null
})

defineExpose({ show, hide })
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
				<button
					class="popup-close"
					type="button"
					@click="hide()"
					aria-label="Закрыть"
				>
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<path d="M14.6666 1.3335L1.33331 14.6668" stroke="#535353" />
						<path d="M1.33329 1.3335L14.6666 14.6668" stroke="#535353" />
					</svg>
				</button>

				<div class="popup-visual" part="popup-visual">
					<slot name="visual"/>
					<slot name="erid"/>
				</div>

				<div class="popup-content" part="popup-content">
					<slot name="headline"/>
					<slot name="subline"/>
					<ul class="popup-benefits" part="popup-benefits">
						<slot name="benefit"/>
					</ul>
					<slot name="action"/>
					<slot name="attention"/>
					<slot />
				</div>
			</div>
		</transition>
	</div>
</template>

<style lang="scss">
@use 'Popup';
</style>
