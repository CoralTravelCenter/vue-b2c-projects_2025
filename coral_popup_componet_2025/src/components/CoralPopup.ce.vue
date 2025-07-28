<template>
	<div
		class="popup-overlay"
		v-show="visible"
		:data-state="visible ? 'open' : 'closed'"
		@click.self="close"
	>
		<div class="popup-backdrop" aria-hidden="true"/>

		<transition name="dialog-fade">
			<div class="popup-dialog" v-show="visible">
				<button class="popup-close">×</button>
				<slot name="visual"/>
				<slot name="content"/>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import {
	ref, onMounted, onBeforeUnmount
} from 'vue';

const props = defineProps<{
	autoShow?: boolean;
	expires?: string;
}>();

const visible = ref(false);

function isExpired(): boolean {
	if (!props.expires) return false;
	const now = new Date();
	const date = new Date(`${props.expires}T23:59:59`);
	return now.getTime() > date.getTime();
}

function open() {
	if (isExpired()) return ;
	visible.value = true;
	document.body.style.overflow = 'hidden';
}

function close() {
	visible.value = false;
	document.body.style.overflow = '';
}

onMounted(() => {
	if (!isExpired() && props.autoShow) open();
});

onBeforeUnmount(() => {
	document.body.style.overflow = '';
});

defineExpose({ open, close });
</script>

<style scoped>
.popup-overlay {
	position: fixed;
	inset: 0;
	z-index: 999;
	padding: 2rem;
	display: flex;
	align-items: start;
	justify-content: center;
	overflow-y: scroll;
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
