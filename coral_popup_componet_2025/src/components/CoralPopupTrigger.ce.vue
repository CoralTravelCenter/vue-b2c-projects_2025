<script setup lang="ts">
function createEvt() {
	const customEv = new CustomEvent('open-popup', {
		bubbles: true,
		composed: true,
	});
	document.dispatchEvent(customEv)
}
</script>

<template>
	<button class="popup-trigger" @click="createEvt">
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
