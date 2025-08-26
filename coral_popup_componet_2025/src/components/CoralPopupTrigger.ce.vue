<script setup lang="ts">
const emit = defineEmits<{
	(e: 'coral:open-popup', detail?: any): void
}>()

function createEvt() {
	emit('coral:open-popup', {source: 'trigger'}) // detail по желанию
}
</script>

<template>
	<button class="popup-trigger" @click="createEvt">
		<slot name="icon"></slot>
		<slot name="text"></slot>
	</button>
</template>

<style lang="scss">
@import "./CoralPopupTrigger.scss";
</style>
