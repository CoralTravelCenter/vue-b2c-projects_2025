<script setup lang="ts">

</script>

<template>
	<span class="country">Турция</span>
	<span class="dates"><strong>Даты вылета: 09.09.2024-10.09.2024</strong></span>
	<span class="params"><strong>Ночей: 2 Взрослых: 2</strong></span>
	<span class="price">от 120 000 ₽</span>
</template>

<style scoped>
.country {
	grid-column: 1/2;
	grid-row: 1/2;
}

.dates {
	grid-column: 1/2;
	grid-row: 2/3;
}

.params {
	grid-column: 1/2;
	grid-row: 3/4;
}

.price {
	grid-column: 2/3;
	grid-row: 3/4;

	color: var(--Text-color_Text_Highlight, #0092D0);
	font-size: 14px;
	font-weight: 700;
	line-height: 15px
}
</style>
