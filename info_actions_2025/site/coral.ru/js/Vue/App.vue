<script setup>
import {computed, ref} from 'vue';
import {useNow, useUrlSearchParams} from '@vueuse/core';
import {dispatchPromotionClick} from '../analytics/promotion-events';
import {detectBrand, getDisplayBrand} from '../domain/brand';
import {ALL_FILTER, normalizePromotions} from '../domain/promotions';
import {filterFreshOffers} from '../filterFreshOffers';
import Card from './components/Card/Card.vue';
import Tabs from './components/Tabs/Tabs.vue';

const currentFilter = ref(ALL_FILTER);
const now = useNow({interval: 60_000});
const params = useUrlSearchParams('history');
const brand = getDisplayBrand();
const analyticsBrand = detectBrand();
const promotions = normalizePromotions(window._promotion_settings);

const freshPromotions = computed(() =>
  promotions.filter(promotion => filterFreshOffers(promotion, now.value)),
);

const filters = computed(() => [
  ALL_FILTER,
  ...new Set(freshPromotions.value.flatMap(promotion => promotion.filters)),
]);

const filteredPromotions = computed(() => {
  if (currentFilter.value === ALL_FILTER) return freshPromotions.value;

  return freshPromotions.value.filter(promotion =>
    promotion.filters.includes(currentFilter.value),
  );
});

const isApplication = computed(() => params.mw === 'true');

function getErid(promotion) {
  return isApplication.value ? promotion.appErid : promotion.erid;
}

function handlePromotionClick(promotion, position, destination) {
  dispatchPromotionClick({
    promotion,
    brand,
    position,
    currentFilter: currentFilter.value,
    destination,
  });
}
</script>

<template>
  <div class="promotions-app" :data-brand="brand">
    <Tabs v-model="currentFilter" :filters="filters" />

    <ul v-if="filteredPromotions.length" class="cards-container">
      <Card
        v-for="(promotion, index) in filteredPromotions"
        :key="promotion.id"
        v-bonus="{
          id: promotion.id,
          name: promotion.nameText,
          enabled: promotion.analytics.bonusImpression,
          brand: analyticsBrand,
        }"
        class="card"
        :brand="brand"
        :erid="getErid(promotion)"
        :promotion="promotion"
        @promotion-click="destination => handlePromotionClick(promotion, index + 1, destination)"
      />
    </ul>

    <p v-else class="promotions-empty" role="status">
      Сейчас нет активных акций
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '../../../common/css/mixins';

.cards-container {
  margin: 0;
  padding: 0;
  list-style: none;

  @include mixins.flex-grid(1, 24px, center);

  @media (width >= 768px) {
    @include mixins.flex-grid(2, 24px, start);
  }

  @media (width >= 1280px) {
    @include mixins.flex-grid(4, 24px, start);
  }
}

[data-brand='sunmar'] .cards-container {
  @media (width >= 1280px) {
    @include mixins.flex-grid(3, 24px, start);
  }
}

.promotions-empty {
  margin: 32px 0;
  text-align: center;
}
</style>
