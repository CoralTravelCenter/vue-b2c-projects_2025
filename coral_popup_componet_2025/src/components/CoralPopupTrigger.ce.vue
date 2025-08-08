<script lang="ts">
import {onMounted, ref} from 'vue'

const btn = ref(null)

onMounted(() => {
	const host = btn.value?.getRootNode()?.host
	btn?.value.addEventListener('click', () => {
		host.dispatchEvent(
				new CustomEvent('open', {bubbles: true, composed: true})
		)
	})
})
</script>

<template>
	<button class="popup-trigger" ref="btn">
		<slot name="icon"></slot>
		<slot name="text"></slot>
	</button>
</template>

<style scoped>
@import "./CoralPopupTrigger.scss";

.popup-trigger {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	background: transparent;
	padding: 7px 16px 7px 8px;
	border: 1px solid rgba(0, 0, 0, 0.15);
	border-radius: 40px;
	width: fit-content;
	cursor: pointer;
	flex-shrink: 0;
	transition: border-color 0.3s ease;

	&:hover {
		border-color: #66d1ff;
	}
}
</style>
<script setup lang="ts">
</script>
