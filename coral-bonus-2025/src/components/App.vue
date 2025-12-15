<script setup lang="ts">
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {computed, ComputedRef, onMounted, shallowRef} from "vue";
import {DataLayerWatch} from "@/DataLayerWatch";

interface Promo {
	name: string,
	value: number
}

interface CashbackData {
	name: string;
	promotions: Promo[];
	id: number;
}

const cashbackData: CashbackData[] = (window as any)._coralBonusCashback;
const currentId: number = Number((window as any).insider_object?.product?.id)
const itemById: ComputedRef<CashbackData> = computed(() =>
		cashbackData?.find(item => item.id === currentId)
)
const currentPromoValues: ComputedRef<[]> = computed(() =>
		itemById.value.promotions.map(item => item.value)
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
	const arrSum = arr.reduce((sum, n) => sum + n, 0)
	const onePercent = value * 0.01
	const res = Math.round(onePercent + arrSum)
	return formatPriceRub(res)
}


onMounted(() => {
	const DL = new DataLayerWatch();
	DL.onEvent("view_item", (data: any) => {
		const cashbackSum: HTMLElement | null = document?.querySelector('#coral-bonus-cashback-result');
		if (cashbackSum) {
			cashbackSum.textContent = `Кешбэк до ${calc(data?.ecommerce?.value, currentPromoValues.value)}`
		}
	})
})
</script>

<template>
	<div id="coral-bonus-cashback">
		<div class="rounded-[6px] bg-[#FEEFCD] p-2 flex items-center gap-2">
			<div class="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path
							d="M0.699938 10.866C0.423795 10.3877 0.587671 9.77614 1.06597 9.5L13.7242 2.19176C14.2025 1.91562 14.8141 2.07949 15.0902 2.55778L19.2829 9.81967C19.559 10.298 19.3952 10.9096 18.9169 11.1857L6.25862 18.4939C5.78033 18.7701 5.16873 18.6062 4.89259 18.1279L0.699938 10.866Z"
							fill="#E6F4FF" stroke="#0093D0" stroke-width="0.88" stroke-linejoin="round"/>
					<path d="M1.59851 12.4224L15.9888 4.11411" stroke="#0093D0" stroke-width="0.88"
								stroke-linejoin="round"/>
					<path d="M6.15161 15.3259L10.4687 12.8335" stroke="#0093D0" stroke-width="0.88" stroke-linecap="round"
								stroke-linejoin="round"/>
					<path
							d="M15.9061 10.6187C16.5022 10.2745 16.7171 9.53092 16.3862 8.95778C16.0553 8.38464 15.3039 8.199 14.7078 8.54314C14.1117 8.88728 13.8968 9.63088 14.2277 10.204C14.5586 10.7772 15.31 10.9628 15.9061 10.6187Z"
							stroke="#0093D0" stroke-width="0.88" stroke-linejoin="round"/>
				</svg>
			</div>
			<div class="flex flex-col">
            <span id="coral-bonus-cashback-result"
									class="text-[rgba(0,0,0,0.85)] text-sm font-bold leading-[22px]"></span>
				<span class="text-[rgba(0,0,0,0.85)] text-[12px] leading-[16px]">на карту CoralBonus</span>
			</div>
			<div id="coral-bonus-cashback-calculator" class="flex items-center ml-auto ">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger class="bg-transparent">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path
										d="M9.99934 18.9186C14.6017 18.9186 18.3327 15.1877 18.3327 10.5853C18.3327 5.98291 14.6017 2.25195 9.99934 2.25195C5.39697 2.25195 1.66602 5.98291 1.66602 10.5853C1.66602 15.1877 5.39697 18.9186 9.99934 18.9186Z"
										stroke="#535353" stroke-width="0.833333"/>
								<path d="M10 16.14V7.80664" stroke="#535353" stroke-width="0.833333" stroke-linejoin="round"/>
								<path d="M10 6.88122V5.02936" stroke="#535353" stroke-width="0.833333" stroke-linejoin="round"/>
							</svg>
						</TooltipTrigger>
						<TooltipContent
								side="top"
								align="end"
								:align-offset="-24"
								class="flex flex-col px-[12px] rounded-[12px] bg-white shadow-xl"
						>
							<ul class="text-xs text-black">
								<li class="py-[12px] flex justify-between items-center gap-[24px] border-b border-b-[rgba(0,0,0,0.04)]">
									<span class="text-left">1%</span>
									<span class="text-right">от стоимости тура на следующее путешествие</span>
								</li>
								<li class="py-[12px] flex justify-between items-center gap-[24px] border-b border-b-[rgba(0,0,0,0.04)]"
										v-for="promo in itemById.promotions" :key="promo.name">
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
			</div>
		</div>
	</div>
</template>
