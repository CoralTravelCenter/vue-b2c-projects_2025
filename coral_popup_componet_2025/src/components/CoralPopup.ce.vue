<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {usePopupTriggers} from '@/composables/usePopupTriggers'

const props = defineProps<{
	autoShow?: number;
	expires?: string;
	redirect?: string;
	trigger?: string;
}>()

const visible = ref(false)

function isExpired(): boolean {
	if (!props.expires) return false
	const now = new Date()
	const date = new Date(`${props.expires}T23:59:59`)
	return now.getTime() > date.getTime()
}

function show() {
	visible.value = true
	document.body.style.overflow = 'hidden'
}

function closePopup() {
	visible.value = false
	document.body.style.overflow = ''
}

function handleButtonClick() {
	if (props.redirect) {
		window.open(props.redirect, '_blank')
	} else {
		closePopup()
	}
}

const {triggerInternal} = usePopupTriggers({
	autoShow: props.autoShow,
	trigger: props.trigger,
	isExpired,
	show
})

defineExpose({
	open: triggerInternal,
	close: closePopup
})

onMounted(() => {
	document.addEventListener('open', show)
})
</script>

<template>
	<div
			class="popup-overlay"
			v-show="visible"
			:data-state="visible ? 'open' : 'closed'"
			@click.self="closePopup"
	>
		<div class="popup-backdrop" aria-hidden="true"/>

		<transition name="dialog-fade">
			<div class="popup-dialog" v-show="visible">
				<button class="popup-close" @click="closePopup">
					<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g stroke-width="0"/>
						<g stroke-linecap="round" stroke-linejoin="round"/>
						<path d="m16 8-8 8m0-8 8 8" stroke="#000" stroke-width="1.5" stroke-linecap="round"
									stroke-linejoin="round"/>
					</svg>
				</button>

				<!-- Фиксированная структура с именованными слотами -->
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

<style scoped lang="scss">
@import "CoralPopup.scss";

*, *::before, *::after {
	box-sizing: border-box;
}

.popup-overlay {
	position: fixed;
	inset: 0;
	z-index: 1000;
	padding: 40px 24px;
	display: flex;
	align-items: start;
	justify-content: center;
	overflow-y: scroll;
}

.popup-dialog {
	background: #fff;
	position: relative;
	border-radius: 20px;
	max-width: 374px;
	width: 100%;
	font-size: 16px;

	@media (max-width: 768px) {
		font-size: 14px;
	}
}

.popup-visual {
	position: relative;
}

.popup-content {
	padding: 14px 24px;
}

/* затемнение */
.popup-backdrop {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: -1;
	animation: fadeInBackdrop 0.3s ease forwards;
	pointer-events: none;
}

.popup-close {
	position: absolute;
	width: 3em;
	height: 3em;
	background: #fff;
	border-radius: 100%;
	z-index: 5;
	border: none;
	top: -1.5em;
	right: -1.5em;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0;
}

.popup-close svg {
	width: 20px;
	height: 20px;
}

@keyframes fadeInBackdrop {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

/* анимация попапа */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
	opacity: 0;
	transform: scale(0.95);
}

.dialog-fade-enter-to,
.dialog-fade-leave-from {
	opacity: 1;
	transform: scale(1);
}
</style>
