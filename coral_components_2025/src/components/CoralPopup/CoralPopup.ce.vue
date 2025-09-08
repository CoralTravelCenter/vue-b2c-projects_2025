<script setup lang="ts">
import {nextTick, onMounted, ref} from 'vue'

type Props = {
	autoShow?: string
	expires?: string
	redirect?: string
}

const props = defineProps<Props>()

const mounted = ref(false)
const visible = ref(false)

function isExpired(): boolean {
	const {expires} = props
	if (!expires) return false

	const ts = Date.parse(expires)
	if (Number.isNaN(ts)) return false

	return Date.now() > ts
}

async function showPopup() {
	mounted.value = true
	await nextTick()
	visible.value = true
	document.body.style.overflow = 'hidden'
}

function closePopup() {
	visible.value = false
}

function afterDialogLeave() {
	mounted.value = false
	document.body.style.overflow = ''
}

function handleButtonClick() {
	if (props.redirect) {
		window.open(props.redirect, '_blank')
	} else {
		closePopup()
	}
}

onMounted(() => {
	setTimeout(() => {
		if (!isExpired() && props.autoShow) {
			showPopup()
		}
	}, 2000)
})

defineExpose({showPopup})
</script>


<template>
	<div
			class="popup-overlay"
			v-if="mounted"
			:data-state="visible ? 'open' : 'closed'"
			@click.self="closePopup"
	>
		<div class="popup-backdrop" aria-hidden="true"/>
		<transition name="dialog-fade" @after-leave="afterDialogLeave">
			<div class="popup-dialog" v-if="visible">
				<button class="popup-close" @click="closePopup">
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
					<slot name="title"/>
					<slot name="subtitle"/>
					<slot name="button" @click="handleButtonClick"/>
					<slot name="list"/>
					<slot name="footnote"/>
					<slot name="disclaimers"/>
				</div>
			</div>
		</transition>
	</div>
</template>

<style lang="scss">
@use "CoralPopup";
</style>
