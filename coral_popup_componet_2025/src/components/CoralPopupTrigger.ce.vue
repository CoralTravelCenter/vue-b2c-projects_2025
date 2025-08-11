<script lang="ts">
import {onMounted} from "vue";


onMounted(() => {
	const customEv = new CustomEvent('open-popup', {
		bubbles: true,
		composed: true,
	});
	console.log(customEv);
	document.dispatchEvent(customEv)
})
</script>

<template>
	<Teleport to=".header-client-side-desktop > div > div > div">
		<button class="popup-trigger">
			<slot name="icon"></slot>
			<slot name="text"></slot>
		</button>
	</Teleport>
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
