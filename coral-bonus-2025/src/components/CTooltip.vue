<script setup lang="ts">
import {inject} from "vue";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import {formatPriceRub} from "../../../usefuls";

const currentItem = inject("itemById")
</script>
<template>
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger class="bg-transparent">
				<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
				>
					<path
							d="M9.99934 18.9186C14.6017 18.9186 18.3327 15.1877 18.3327 10.5853C18.3327 5.98291 14.6017 2.25195 9.99934 2.25195C5.39697 2.25195 1.66602 5.98291 1.66602 10.5853C1.66602 15.1877 5.39697 18.9186 9.99934 18.9186Z"
							stroke="#535353"
							stroke-width="0.833333"
					/>
					<path
							d="M10 16.14V7.80664"
							stroke="#535353"
							stroke-width="0.833333"
							stroke-linejoin="round"
					/>
					<path
							d="M10 6.88122V5.02936"
							stroke="#535353"
							stroke-width="0.833333"
							stroke-linejoin="round"
					/>
				</svg>
			</TooltipTrigger>
			<TooltipContent
					side="top"
					align="end"
					:align-offset="-24"
					class="flex flex-col px-3 rounded-[12px] bg-white shadow-xl"
			>
				<ul class="text-xs text-black">
					<li
							class="py-3 flex justify-between items-center gap-6 border-b border-b-[rgba(0,0,0,0.04)]"
					>
						<span class="text-left">1%</span>
						<span class="text-right"
						>от стоимости тура на следующее путешествие</span
						>
					</li>
					<li
							class="py-3 flex justify-between items-center gap-6 border-b border-b-[rgba(0,0,0,0.04)]"
							v-for="promo in currentItem.promotions"
							:key="promo.name"
					>
						<span class="text-left">{{
								formatPriceRub(promo.value)
							}}</span>
						<span class="text-right" v-html="promo.name"></span>
					</li>
					<li class="py-3">
						<span>
							Нет карты CoralBonus?&nbsp;
							<a
									class="text-[#0092D0] no-underline hover:underline!"
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
