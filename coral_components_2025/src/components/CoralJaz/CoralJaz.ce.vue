<script setup lang="ts">

</script>

<template>
	<button class="jaz-trigger">
			<span class="icon wobble-hor-bottom-loop">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 20" fill="none">
					<path d="M3.49988 9.14001L17.4999 3.14001V17.14L3.49988 13.14V9.14001Z" stroke="white"
								stroke-linejoin="round"></path>
					<path
							d="M0.499878 9.64001C0.499878 8.81159 1.17145 8.14001 1.99988 8.14001V8.14001C2.82831 8.14001 3.49988 8.81159 3.49988 9.64001V12.64C3.49988 13.4684 2.82831 14.14 1.99988 14.14V14.14C1.17145 14.14 0.499878 13.4684 0.499878 12.64V9.64001Z"
							stroke="white" stroke-linejoin="round"></path>
					<path
							d="M17.4999 2.64001C17.4999 1.81159 18.1715 1.14001 18.9999 1.14001V1.14001C19.8283 1.14001 20.4999 1.81159 20.4999 2.64001V17.64C20.4999 18.4684 19.8283 19.14 18.9999 19.14V19.14C18.1715 19.14 17.4999 18.4684 17.4999 17.64V2.64001Z"
							stroke="white" stroke-linejoin="round"></path>
					<path
							d="M6.99988 14.14V17.14C6.99988 18.2446 7.89531 19.14 8.99988 19.14H10.4999C11.6044 19.14 12.4999 18.2446 12.4999 17.14V15.64"
							stroke="white" stroke-linejoin="round"></path>
				</svg>
			</span>
		Надо брать
	</button>
	<slot name="text"></slot>
</template>

<style lang="scss">
@use 'CoralJaz';
</style>
