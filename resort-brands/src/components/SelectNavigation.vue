<script setup>
const props = defineProps({
	countries: {type: Array, required: true},
})

const model = defineModel('currentCountry')
</script>

<template>
	<div class="select-wrapper">
		<select name="countries" v-model="model">
			<option
					v-for="country in countries"
					:key="country"
					:value="country"
			>
				{{ country }}
			</option>
		</select>
	</div>
</template>

<style scoped>
.select-wrapper {
	position: relative;
}

.select-wrapper select {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 15px;
	cursor: pointer;
	-webkit-user-select: none;
	user-select: none;
	border-radius: 8px;
	border: 1px solid #D9D9D9;
	background: #fff;
	height: 38px;
	font-size: 16px;
	min-width: 176px;
	width: fit-content;

	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
}

.select-wrapper::after {
	content: "";
	position: absolute;
	background-image: url("data:image/svg+xml,%3Csvg data-v-744e0be7='' xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath data-v-744e0be7='' d='M10.9822 0.571411H9.97778C9.90948 0.571411 9.84519 0.604893 9.80501 0.659804L6.0001 5.90445L2.19519 0.659804C2.15501 0.604893 2.09072 0.571411 2.02242 0.571411H1.01796C0.930903 0.571411 0.880011 0.670518 0.930903 0.741501L5.65322 7.25177C5.82465 7.48748 6.17555 7.48748 6.34564 7.25177L11.068 0.741501C11.1202 0.670518 11.0693 0.571411 10.9822 0.571411Z' fill='black' fill-opacity='0.25'%3E%3C/path%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	width: 12px;
	height: 8px;
	top: 50%;
	transform: translateY(-50%);
	right: 16px;
}
</style>
