<script setup lang="ts">
import {nextTick, onMounted, ref} from 'vue'

const props = defineProps<{
	autoShow?: string;
	expires?: string;
	redirect?: string;
	trigger?: string;
}>()

const mounted = ref(false) // показывает/скрывает overlay (v-if)
const visible = ref(false) // показывает/скрывает сам диалог (v-if)

function isExpired(): boolean {
	if (!props.expires) return false
	const now = new Date()
	const date = new Date(`${props.expires}`)
	return now.getTime() > date.getTime()
}

function showPopup() {
	mounted.value = true                  // смонтировать overlay
	nextTick(() => {                      // затем плавно показать диалог
		visible.value = true
		document.body.style.overflow = 'hidden'
	})
}

function closePopup() {
	visible.value = false                 // запуск leave-анимации диалога
}

function afterDialogLeave() {
	mounted.value = false                 // убрать overlay после диалога
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
		if (!isExpired() && props.autoShow) showPopup()
	}, 2000)

	document.addEventListener('coral:open-popup', (e) => {
		console.log('Поймано событие', e.detail) // { source: 'trigger' }
		// здесь вызвать showPopup()
	})
})
</script>

<template>
	<teleport to="body">
		<div
				class="popup-overlay"
				v-if="mounted"
				:data-state="visible ? 'open' : 'closed'"
				@click.self="closePopup"
				@some-event="showPopup"
		>
			<div class="popup-backdrop" aria-hidden="true"/>

			<transition name="dialog-fade" @after-leave="afterDialogLeave">
				<div class="popup-dialog" v-if="visible">
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
	</teleport>
</template>

<style lang="scss">
@import "./CoralPopup.scss";
</style>
