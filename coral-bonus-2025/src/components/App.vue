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
	<TooltipProvider>
		<Tooltip v-model:open="open">
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
</template>
