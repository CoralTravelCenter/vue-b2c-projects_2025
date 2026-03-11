<script lang="ts" setup>
import {shallowRef} from "vue";

const isClosed = shallowRef(true);
let closeTimer: number | null = null;

const open = () => {
	if (closeTimer) {
		clearTimeout(closeTimer);
		closeTimer = null;
	}
	isClosed.value = false;
};

const scheduleClose = () => {
	if (closeTimer) clearTimeout(closeTimer);
	closeTimer = window.setTimeout(() => {
		isClosed.value = true;
		closeTimer = null;
	}, 100);
};

</script>

<template>
	<div
			class="aside-trigger"
			part="trigger"
			@mouseenter="open"
			@mouseleave="scheduleClose"
	>
		<slot name="trigger"></slot>
	</div>

	<aside
			class="aside-widget-container"
			part="container"
			:class="{ 'out-of-view': isClosed }"
			@mouseenter="open"
			@mouseleave="scheduleClose"
	>
		<div class="visual" part="visual">
			<slot name="erid" part="erid"></slot>
			<slot name="visual"></slot>
		</div>

		<div class="content">
			<slot name="headline"></slot>
			<slot name="subline"></slot>
			<slot name="action"></slot>
		</div>
	</aside>
</template>


<style lang="scss">
.aside-trigger {
	border-radius: 0 8px 8px 0;
	width: fit-content;
	height: 56px;
	display: flex;
	padding: 8px 4px;
	align-items: end;
	gap: 10px;
	overflow: clip;
	cursor: pointer;
	color: #FFF;
	text-align: center;
	font-size: 8px;
	font-style: normal;
	font-weight: 500;
	line-height: calc(10 / 8);
	position: fixed;
	z-index: 1000;
	top: 50%;
	left: 0;
}

.aside-widget-container {
	position: fixed;
	z-index: 1002;
	left: 0;
	top: 50%;
	transform: translate3d(0, -50%, 0);
	max-width: 180px;
	background-color: #fff;
	border-radius: 12px;
	overflow: clip;
	transition: transform .3s ease;
}

.aside-widget-container.out-of-view {
	transform: translate3d(-100%, -50%, 0);
	pointer-events: none;
}

.visual {
	max-height: 260px;
	clip-path: circle(70% at 50% 35%);

	> img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
}

.content {
	padding: 8px 16px 16px 16px;
}

::slotted([slot='erid']) {
	position: absolute;
	color: #ffffff;
	top: 10px;
	left: 50%;
	font-size: 8px;
	width: 100%;
	transform: translateX(-50%);
	text-align: center;
}

::slotted([slot='headline']) {
	color: #000000;
	font-size: 16px;
	font-style: normal;
	font-weight: 600;
	line-height: calc(20 / 16);
	margin: 0 0 8px 0;
}

::slotted([slot='subline']) {
	color: #000000;
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	display: inline-block;
	line-height: calc(16 / 12);
	margin: 0 0 16px 0;
}

::slotted([slot='action']) {
	border-radius: 8px;
	display: block;
	color: #ffffff;
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: calc(22 / 14);
	padding: 6px 8px;
	text-align: center;
	background-color: #0092D0;
	transition: transfrom .3s ease;
}

::slotted([slot='action']:hover) {
	background-color: var(--ant-color-primary-hover);
}

::slotted([slot='action']:active) {
	background-color: var(--ant-color-primary-active);
}
</style>
