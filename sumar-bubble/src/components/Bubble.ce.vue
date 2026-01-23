<script lang="ts" setup>
type Props = {
	redirectTo: string
}
const {redirectTo} = defineProps<Props>()
</script>

<template>
	<a class="sunmar-popup-trigger" part="sunmar-popup-trigger" v-if="redirectTo" :href="redirectTo" target="_blank" rel="noopener noreferrer">
		<slot name="icon"></slot>
		<slot name="text"></slot>
	</a>
	<button v-else class="sunmar-popup-trigger" part="sunmar-popup-trigger">
		<slot name="icon"></slot>
		<slot name="text"></slot>
	</button>
</template>

<style lang="scss">
@use 'Bubble';
</style>
