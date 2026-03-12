<script lang="ts" setup>
import {shallowRef} from "vue";
import {useMediaQuery} from "@vueuse/core";

const isClosed = shallowRef(true);
const isClosedTrigger = shallowRef(false);
const isMobile = useMediaQuery('(max-width: 993px)');

const open = () => {
  isClosed.value = false;
  ym(215233, 'reachGoal', 'april_closed_sale_show_promocode')
};

const close = () => {
  isClosed.value = true;
};

defineExpose({open, close})
</script>

<template>
  <div
      class="aside-trigger"
      :class="{ 'out-of-view': isClosedTrigger }"
      part="trigger"
      @click="isMobile ? open() : undefined"
      @mouseenter="!isMobile ? open() : undefined"
      @mouseleave="!isMobile ? close() : undefined"
  >
    <button v-show="isMobile" class="close small" @click.stop="isClosedTrigger = true">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M14.6666 1.3335L1.33331 14.6668" stroke="#535353"></path>
        <path d="M1.33329 1.3335L14.6666 14.6668" stroke="#535353"></path>
      </svg>
    </button>
    <slot name="trigger"></slot>
  </div>

  <aside
      class="aside-widget-container"
      part="container"
      :class="{ 'out-of-view': isClosed }"
      @mouseenter="!isMobile ? open() : undefined"
      @mouseleave="!isMobile ? close() : undefined"
  >
    <div class="visual" part="visual">
      <button v-show="isMobile" class="close" @click.stop="close">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M14.6666 1.3335L1.33331 14.6668" stroke="#535353"></path>
          <path d="M1.33329 1.3335L14.6666 14.6668" stroke="#535353"></path>
        </svg>
      </button>
      <div class="poster">
        <slot name="erid" part="erid"></slot>
        <slot name="visual" part="visual"></slot>
      </div>
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
  position: fixed;
  top: unset;
  bottom: 16px;
  left: 16px;
  background: url("https://b2ccdn.sunmar.ru/content/secret.png"), linear-gradient(90deg, #41276D -48.93%, #4A3674 -11.48%, #53457B 26.04%, #876AAF 68.52%, #CF9CF5 103.79%);
  background-repeat: no-repeat;
  background-size: 40px, cover;
  background-position: 6px 60%, center;
  padding: 12px 15px 12px 53px;
  transform: translate3d(0, 0, 0);
  color: #FFFFFF;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  text-align: left;
  z-index: 1000;
}

.poster {
  position: relative;
}

.aside-widget-container {
  position: fixed;
  z-index: 1002;
  left: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  transform: translate3d(0, 0, 0);
  max-width: 343px;
  border-radius: 12px;
  overflow: clip;
  transition: transform 0.3s ease;
  background: linear-gradient(0deg, #41276D -65.06%, #53457B 3.53%, #CF9CF5 74.68%);
}

.aside-widget-container.out-of-view {
  transform: translate3d(-120%, 0, 0);
  pointer-events: none;
}

.aside-trigger.out-of-view {
  transform: translate3d(-120%, 0, 0);
  pointer-events: none;
}

.close {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  background: #fff;
  border: 1px solid #535353;
  border-radius: 4px;
  cursor: pointer;
  z-index: 200;

  > svg {
    width: 50%;
    height: 50%;
  }
}

.close.small {
  width: 20px;
  height: 20px;
  top: -8px;
  right: -8px;
}

.visual > img {
  width: 100%;
  height: calc(118px - 18px);
  object-fit: cover;
  display: block;
}

.content {
  padding: 8px 16px 16px 16px;
}

::slotted([slot='erid']) {
  position: absolute;
  color: #000000;
  bottom: 10px;
  left: 50%;
  font-size: 8px;
  width: 100%;
  transform: translateX(-50%);
  text-align: center;
}

::slotted([slot='headline']) {
  color: #FFFFFF;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: calc(20 / 16);
  margin: 0 0 8px 0;
}

::slotted([slot='subline']) {
  color: #FFFFFF;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  display: inline-block;
  line-height: calc(16 / 12);
  margin: 0 0 16px 0;
}

::slotted([slot='action']) {
  border-radius: 56px;
  display: block;
  color: #000000;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: calc(22 / 14);
  padding: 12px 32px;
  width: fit-content;
  text-align: center;
  background-color: #FFFFFF;
  transition: transfrom .3s ease;
}

::slotted([slot='action']:hover) {
  background-color: #F5F5F8;
}

::slotted([slot='action']:active) {
  background-color: #DFDFE8;
}
</style>
