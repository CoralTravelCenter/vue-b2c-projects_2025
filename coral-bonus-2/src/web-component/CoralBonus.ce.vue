<script setup lang="ts">
import {onBeforeUnmount, onMounted, shallowRef, useTemplateRef} from 'vue'
import {setupAutoRecalcByDataLayer} from "@/domain";
import {formatPriceRub} from "../../../usefuls";
import tippy, {roundArrow} from 'tippy.js';
import {BreakdownItem} from "@/domain/types";

const props = defineProps<{
	rules: string
	hotelRules?: string
}>()

const trigger = useTemplateRef('trigger')
const items = shallowRef<BreakdownItem[]>([])
let stop: null | (() => void) = null
const amountRub = shallowRef<number>(0)

function setTotlipMarkup() {
	return items.value.map(el => {
		return `
			<li>
				<span>${el.amountRub}</span>
				<a>${el.title}</a>
			</li>
		`
	}).join('')
}

onMounted(() => {
	stop = setupAutoRecalcByDataLayer(
			() => props.rules,
			() => props.hotelRules,
			async (result) => {
				amountRub.value = result.amountRub
				items.value = result.items
			},
	)
	tippy(trigger.value, {
		content: `<ul>${setTotlipMarkup()}</ul>`,
		trigger: 'click',
		allowHTML: true,
		interactive: true,
		arrow: roundArrow,
		theme: 'coral',
		animation: 'scale',
		easing: 'cubic-bezier(.2,.8,.2,1)',
	});
})

onBeforeUnmount(() => {
	stop?.()
	stop = null
})
</script>

<template>
	<div class="cb" part="cb-container">
		<div class="cb__icon" aria-hidden="true">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
						d="M0.699938 10.866C0.423795 10.3877 0.587671 9.77614 1.06597 9.5L13.7242 2.19176C14.2025 1.91562 14.8141 2.07949 15.0902 2.55778L19.2829 9.81967C19.559 10.298 19.3952 10.9096 18.9169 11.1857L6.25862 18.4939C5.78033 18.7701 5.16873 18.6062 4.89259 18.1279L0.699938 10.866Z"
						fill="#E6F4FF" stroke="#0093D0" stroke-width="0.88" stroke-linejoin="round"
				/>
				<path d="M1.59851 12.4224L15.9888 4.11411" stroke="#0093D0" stroke-width="0.88" stroke-linejoin="round"/>
				<path
						d="M6.15161 15.3259L10.4687 12.8335"
						stroke="#0093D0" stroke-width="0.88" stroke-linecap="round" stroke-linejoin="round"
				/>
				<path
						d="M15.9061 10.6187C16.5022 10.2745 16.7171 9.53092 16.3862 8.95778C16.0553 8.38464 15.3039 8.199 14.7078 8.54314C14.1117 8.88728 13.8968 9.63088 14.2277 10.204C14.5586 10.7772 15.31 10.9628 15.9061 10.6187Z"
						stroke="#0093D0" stroke-width="0.88" stroke-linejoin="round"
				/>
			</svg>
		</div>

		<div class="cb__text">
			<span class="cb__title">{{ formatPriceRub(amountRub) }} Кешбэк</span>
			<span class="cb__subtitle">на карту CoralBonus</span>
		</div>

		<div class="cb__actions">
			<button class="cb__info-btn" type="button" ref="trigger" aria-label="Подробнее о начислениях">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
							d="M9.99934 18.9182C14.6017 18.9182 18.3327 15.1873 18.3327 10.5849C18.3327 5.98252 14.6017 2.25156 9.99934 2.25156C5.39697 2.25156 1.66602 5.98252 1.66602 10.5849C1.66602 15.1873 5.39697 18.9182 9.99934 18.9182Z"
							stroke="#535353" stroke-width="0.833333"
					/>
					<path d="M10 16.1404V7.80704" stroke="#535353" stroke-width="0.833333" stroke-linejoin="round"/>
					<path d="M10 6.88122V5.02936" stroke="#535353" stroke-width="0.833333" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>
	</div>
</template>
