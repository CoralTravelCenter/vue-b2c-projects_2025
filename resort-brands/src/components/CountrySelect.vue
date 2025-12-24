<script setup>
/* ==========================
 *  Пропсы
 *  - countries: массив строк с названиями стран
 * ========================== */
const props = defineProps({
	countries: {
		type: Array,
		required: true,
		default: () => [],
		// Валидация: массив непустых строк
		validator: (arr) => Array.isArray(arr) && arr.every((v) => typeof v === 'string' && v.trim().length > 0),
	},
})

/* ==========================
 *  v-model (defineModel)
 *  - currentCountry: выбранная страна
 * ========================== */
const model = defineModel('currentCountry')
</script>

<template>
	<!-- Блок: country-select (BEM) -->
	<div class="country-select">
		<!-- Элемент: контрола -->
		<select
				class="country-select__control"
				name="countries"
				v-model="model"
				aria-label="Выбор страны"
		>
			<option
					v-for="country in props.countries"
					:key="country"
					:value="country"
			>
				{{ country }}
			</option>
		</select>

		<!-- Элемент: иконка-стрелка -->
		<span class="country-select__icon" aria-hidden="true"></span>
	</div>
</template>

<style scoped>
/* =============================================
 *  Блок: country-select (BEM)
 *  Назначение: селект выбора страны с кастомной стрелкой
 * ============================================= */

.country-select {
	position: relative; /* для позиционирования иконки */
	display: inline-block; /* чтобы ширина подстраивалась под контент */
}

/* Элемент: select-контрол */
.country-select__control {
	min-width: 176px;
	height: 38px;
	padding: 0 40px 0 15px; /* справа запас под иконку */
	font-size: 16px;
	line-height: 1;
	background: #fff;
	border: 1px solid #d9d9d9;
	border-radius: 8px;
	cursor: pointer;

	/* Сбрасываем нативные стрелки/стили */
	appearance: none;
	appearance: none;
	appearance: none;

	option {
		color: #000;
	}
}

/* Состояния наведения/фокуса/disabled */
.country-select__control:hover {
	border-color: #bfbfbf;
}

.country-select__control:focus {
	border-color: #0093d0;
	outline: none;
	box-shadow: 0 0 0 3px rgb(0 147 208 / 15%);
}

.country-select__control:disabled {
	cursor: not-allowed;
	opacity: 0.6;
}

/* Элемент: иконка-стрелка (поверх селекта) */
.country-select__icon {
	position: absolute;
	top: 50%;
	right: 16px;
	width: 12px;
	height: 8px;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M10.9822 0.571411H9.97778C9.90948 0.571411 9.84519 0.604893 9.80501 0.659804L6.0001 5.90445L2.19519 0.659804C2.15501 0.604893 2.09072 0.571411 2.02242 0.571411H1.01796C0.930903 0.571411 0.880011 0.670518 0.930903 0.741501L5.65322 7.25177C5.82465 7.48748 6.17555 7.48748 6.34564 7.25177L11.068 0.741501C11.1202 0.670518 11.0693 0.571411 10.9822 0.571411Z' fill='black' fill-opacity='0.25'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	transform: translateY(-50%);
	pointer-events: none; /* клики проходят к select */
}
</style>
