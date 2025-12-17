<script setup lang="ts">
import {onMounted, shallowRef} from 'vue'
import waitUntilElementsGone from '../helpers/useElementsGone.ts'
import {unlockScroll} from "../helpers/scroll.ts";
import resolveAutoShow from "../helpers/resolveAutoShow.ts";
import parseGuardSelectors from "../helpers/parseGuardSelectors.ts";
import publicShow from "../helpers/publicShow.ts";
import {useStorage} from "@vueuse/core";

type Props = {
	id: string
	autoShow?: string
	guardSelectors?: string
	ymMetrika?: string
}

// Стэйты
const {id, autoShow, guardSelectors, ymMetrika} = defineProps<Props>()
const autoDelay = resolveAutoShow(autoShow)
const mounted = shallowRef(false)
const visible = shallowRef(false)
const selectors = parseGuardSelectors(guardSelectors)
const flag = shallowRef(false)
let autoDelayTimer = null

// Метод скрытия
function hide() {
	if (!visible.value) return
	visible.value = false
}

// Управление переходом
function handleAfterLeave() {
	mounted.value = false
	unlockScroll()
}

// Установка автозапуска
function setupAutoShow() {
	console.log(autoShow)
	console.log(flag.value)
	if (!autoShow || !flag.value) {
		console.log('Не показываем уже было')
		return
	}
	flag.value = useStorage(`coral-popup-auto-shown-${id}`, true)
	waitUntilElementsGone({floating: selectors}, () => {
		if (autoDelay) {
			autoDelayTimer = setTimeout(() => {
				publicShow(visible, mounted, ymMetrika, id)
			}, autoDelay)
		} else {
			publicShow(visible, mounted, ymMetrika, id)
		}
	})
}

function onKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape') hide()
	document.removeEventListener('keydown', onKeydown)
}

onMounted(() => {
	document.addEventListener('keydown', onKeydown)
	setupAutoShow()
})

onMounted(() => flag.value = null)

defineExpose({show: publicShow, hide})
</script>

<template>
	<div v-if="mounted" class="popup-backdroppo"></div>

	<div v-if="mounted" part="popup-body" class="popup-body" @click.self="hide()">
		<transition name="dialog-fade" @after-leave="handleAfterLeave">
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
