<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

// Props
type Props = {
	autoShow?: boolean
	expires?: string
	redirect?: string
}

const { autoShow, expires, redirect } = defineProps<Props>()

// States
const mounted = ref(false)
const visible = ref(false)

// Functions
function shouldShowPopup(expires: string | undefined): boolean {
	if (autoShow) return false
	if (!expires) return true

	try {
		const expiryDate = new Date(expires)
		return Date.now() < expiryDate.getTime()
	} catch (error) {
		console.error('Invalid date format:', error)
		return false
	}
}

async function showPopup() {
	mounted.value = true
	await nextTick()
	visible.value = true
	document.body.classList.add('popup-open')
}

function closePopup() {
	visible.value = false
}

function afterDialogLeave() {
	mounted.value = false
	document.body.classList.remove('popup-open')
}

function handleButtonClick() {
	if (redirect) {
		window.open(redirect, '_blank')
	} else {
		closePopup()
	}
}

function initPopup() {
	setTimeout(() => {
		if (shouldShowPopup(expires)) {
			showPopup()
		}
	}, 2000)
}

// Lifecycle Hooks
onMounted(initPopup)
// Expose public methods
defineExpose({ showPopup })
</script>

<template>
	<div
		class="popup-overlay"
		v-if="mounted"
		:data-state="visible ? 'open' : 'closed'"
		@click.self="closePopup"
	>
		<div class="popup-backdrop" aria-hidden="true" />
		<transition name="dialog-fade" @after-leave="afterDialogLeave">
			<div class="popup-dialog" v-if="visible">
				<button class="popup-close" @click="closePopup">
					<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M14.6666 1.3335L1.33331 14.6668" stroke="#535353" />
						<path d="M1.33329 1.3335L14.6666 14.6668" stroke="#535353" />
					</svg>
				</button>

				<div class="popup-visual">
					<slot name="visual" />
					<slot name="ligal" />
				</div>

				<div class="popup-content">
					<!-- Default slot for flexible content -->
					<slot />

					<!-- Named slots for specific content types -->
					<slot name="title" />
					<slot name="subtitle" />
					<slot name="button" @click="handleButtonClick" />
					<slot name="list" />
					<slot name="footnote" />
					<slot name="disclaimers" />
				</div>
			</div>
		</transition>
	</div>
</template>

<style lang="scss">
@use 'CoralPopup';
</style>
