<script lang="ts" setup>
type Props = {
	redirectTo: string
}
const {redirectTo} = defineProps<Props>()
</script>

<template>
	<a class="coral-popup-trigger" v-if="redirectTo" :href="redirectTo" target="_blank" rel="noopener noreferrer">
		<slot part="icon" name="icon"></slot>
		<slot part="text" name="text"></slot>
	</a>
	<button v-else class="coral-popup-trigger">
		<slot part="icon" name="icon"></slot>
		<slot part="text" name="text"></slot>
	</button>
</template>

<style lang="scss">
@use 'Bubble';
</style>
