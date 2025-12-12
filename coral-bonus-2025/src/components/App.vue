<script setup lang="ts">
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {computed, onMounted, shallowRef} from "vue";

const cashbackData = window._coralBonusCashback;
const currentId = Number(window.insider_object?.product?.id)
const itemById = computed(() =>
		cashbackData.find(item => item.id === currentId)
)
const open = shallowRef(true)

function formatPriceRub(
		value: number | string,
		withCurrency: boolean = true
): string {
	const num = Number(value)

	if (!Number.isFinite(num)) return ''

	return new Intl.NumberFormat('ru-RU', {
		style: withCurrency ? 'currency' : 'decimal',
		currency: 'RUB',
		maximumFractionDigits: 0,
	}).format(num)
}

function calc(value: number, arr: number[]): number {
	const onePercent = value * 0.01
	return value + onePercent + arr.reduce((sum, n) => sum + n, 0)
}

onMounted(() => {
	const cashbackSum = document.querySelector('.coral-bonus > div span:nth-child(2) span:nth-child(1)');
	new Dta
	console.log(cashbackSum)
})
</script>

<template>
	<TooltipProvider>
		<Tooltip v-model:open="open">
			<TooltipTrigger>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path
							d="M9.99934 18.9186C14.6017 18.9186 18.3327 15.1877 18.3327 10.5853C18.3327 5.98291 14.6017 2.25195 9.99934 2.25195C5.39697 2.25195 1.66602 5.98291 1.66602 10.5853C1.66602 15.1877 5.39697 18.9186 9.99934 18.9186Z"
							stroke="#535353" stroke-width="0.833333"/>
					<path d="M10 16.14V7.80664" stroke="#535353" stroke-width="0.833333" stroke-linejoin="round"/>
					<path d="M10 6.88122V5.02936" stroke="#535353" stroke-width="0.833333" stroke-linejoin="round"/>
				</svg>
			</TooltipTrigger>
			<TooltipContent class="flex flex-col px-[12px] rounded-[12px] bg-white shadow-xl">
				<ul class="text-xs text-black">
					<li class="py-[12px] flex justify-between items-center gap-[24px] border-b border-b-[rgba(0, 0, 0, 0.04)]">
						<span class="text-left">1%</span>
						<span class="text-right">от стоимости тура на следующее путешествие</span>
					</li>
					<li class="py-[12px] flex justify-between items-center gap-[24px] border-b border-b-[rgba(0, 0, 0, 0.04)]"
							v-for="promo in itemById.promotions" :key="promo.id">
						<span class="text-left">{{ formatPriceRub(promo.value) }}</span>
						<span class="text-right" v-html="promo.name"></span>
					</li>
					<li class="py-[12px]">
						<span>
							Нет карты CoralBonus?&nbsp;
							<a
									class="text-[#0092D0] no-underline hover:!underline"
									href="https://coralbonus.ru/registration?promo=R3R5VO93GKG8N1PGQC1UP0G6EICQLRWEN3Z64WZGC4YBYIKHFJV55IND5O20WUJ"
							>Получить прямо сейчас
							</a>
						</span>
					</li>
				</ul>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
</template>
