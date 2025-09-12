<script lang="ts" setup>

// Типы пропсов
type Props = {
	redirectTo: string
}

// Пропсы
const {redirectTo} = defineProps<Props>()
</script>

<template>
	<a class="coral-popup-trigger" v-if="redirectTo" :href="redirectTo" target="_blank" rel="noopener noreferrer">
		<slot name="icon"></slot>
		<slot name="text"></slot>
	</a>
	<button v-else class="coral-popup-trigger" @click="show">
		<slot name="icon"></slot>
		<slot name="text"></slot>
	</button>
</template>

<style lang="scss">
@use 'CoralPopupTrigger';
</style>
