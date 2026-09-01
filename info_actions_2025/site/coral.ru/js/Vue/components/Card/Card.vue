<script setup>
import {CopyOutlined} from '@ant-design/icons-vue';
import {refAutoReset, useMediaQuery} from '@vueuse/core';

defineProps({
  promotion: {
    type: Object,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  erid: {
    type: String,
    default: '',
  },
});

const emit = defineEmits({
  'promotion-click': destination => ['link', 'popup'].includes(destination),
});

const isMobile = useMediaQuery('(hover: none), (pointer: coarse)');
const copied = refAutoReset(false, 1500);

function onCopySuccess() {
  copied.value = true;
}

function emitPromotionClick(destination) {
  emit('promotion-click', destination);
}
</script>

<template>
  <li class="promo-card">
    <article>
      <a-tooltip
        v-if="erid"
        placement="bottomRight"
        :overlay-inner-style="{display: 'flex', alignItems: 'center', padding: 0}"
        :trigger="isMobile ? 'click' : 'hover'"
      >
        <template #title>
          <span v-if="copied" class="copy-status">Скопировано!</span>
          <div v-else class="content">
            <span class="legal">{{ promotion.legal }} erid:</span>&nbsp;
            <span class="erid">{{ erid }}</span>
          </div>
          <button
            v-clipboard="erid"
            class="copy"
            type="button"
            aria-label="Скопировать erid"
            @clipboard:success="onCopySuccess"
          >
            <CopyOutlined :style="{color: copied ? '#52c41a' : '#535353'}" />
          </button>
        </template>

        <a-button class="tooltip-trigger">Реклама</a-button>
      </a-tooltip>

      <div class="promo-card__visual">
        <img
          class="promo-card__image"
          :src="promotion.visual"
          :alt="promotion.nameText || 'Промо'"
          loading="lazy"
          decoding="async"
        >
      </div>

      <div class="promo-card__content">
        <h5 class="promo-card__title" v-html="promotion.nameHtml"></h5>
        <p class="promo-card__description" v-html="promotion.descriptionHtml"></p>

        <div class="promo-card__footer">
          <div v-if="promotion.promoEndText" class="promo-card__time">
            <span class="icon" aria-hidden="true">
              <svg
                v-if="brand === 'coral'"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <circle cx="11" cy="11" r="10" stroke="#535353" stroke-linejoin="round" />
                <path d="M11 4V11H16" stroke="#535353" stroke-linejoin="round" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="#2E3465"
                  fill-opacity="0.2"
                  stroke="#2E3465"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 5.69995V12H16.5"
                  stroke="#2E3465"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="time-text">{{ promotion.promoEndText }}</span>
          </div>

          <a
            v-if="promotion.url"
            class="promo-card__link prime-btn"
            :href="promotion.url"
            target="_blank"
            rel="noopener noreferrer"
            @click="emitPromotionClick('link')"
          >
            Подробнее
          </a>

          <button
            v-else
            class="promo-card__link prime-btn js-popup-trigger"
            type="button"
            @click="emitPromotionClick('popup')"
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  </li>
</template>

<style scoped lang="scss">@use './Card';</style>
