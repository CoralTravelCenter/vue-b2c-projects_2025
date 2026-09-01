<script setup>
import {ALL_FILTER} from '../../../domain/promotions';

defineProps({
  filters: {
    type: Array,
    required: true,
  },
});

const model = defineModel({
  type: String,
  default: ALL_FILTER,
});
</script>

<template>
  <nav class="tabs-navigation" aria-label="Фильтр акций">
    <ul class="tabs-navigation__list no-scrollbar">
      <li v-for="filter in filters" :key="filter">
        <button
          class="tabs-navigation__item"
          :class="{'js-active': model === filter}"
          type="button"
          :aria-pressed="model === filter"
          @click="model = filter"
        >
          {{ filter }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
@use 'Tabs';
</style>
