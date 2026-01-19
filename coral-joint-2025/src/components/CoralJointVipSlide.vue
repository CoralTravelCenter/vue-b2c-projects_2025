<script setup lang="ts">
const props = defineProps<({
	visual: string,
	headline?: string,
	text?: string,
	logo: string,
	url: string,
	erid: string,
	ligal: string,
})>()

</script>

<template>
	<div class="coral-joint__card coral-joint__card--static">

		<div class="coral-joint__visual">
			<img
					:src="visual"
					:alt="headline"
					class="coral-joint__image"
			>
		</div>

		<div class="coral-joint__content">

			<div class="coral-joint__header">
				<div class="coral-joint__logo" style="height: 26px">
					<img :src="logo" alt="" class="coral-joint__logo-img">
				</div>

				<h3 class="coral-joint__title" v-html="headline">

				</h3>
			</div>

			<p class="coral-joint__text" v-html="text">
			</p>

			<div class="coral-joint__footer">
				<button type="button" class="coral-joint__button">
					Узнать больше
				</button>
			</div>

		</div>
	</div>
</template>
