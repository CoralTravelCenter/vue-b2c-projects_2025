<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, shallowReactive} from "vue";
import {useMediaQuery} from "@vueuse/core";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {targets} from "@/targets";
import {DataLayerWatch, formatPriceRub} from "../../../usefuls";

const isSmallScreen = useMediaQuery("(max-width: 993px)");

const cashbackData: CashbackData[] = (window as any)._coralBonusCashback ?? [];
const currentId = Number((window as any).insider_object?.product?.id ?? NaN);

const itemById = computed(() => cashbackData.find((i) => i.id === currentId));
const promos = computed(() => itemById.value?.promotions ?? []);
const promoValues = computed(() => promos.value.map((p) => p.value));
const aliveTargets = computed(() => targets.filter((t) => t.el?.isConnected));

const cashbackLabel = ref("");
const openById = shallowReactive<Record<string, boolean>>({});


let off: null | (() => void) = null;
let DL: null | DataLayerWatch = null;


function calc(price: number, arr: number[]): string {
	const sum = arr.reduce((acc, n) => acc + n, 0);
	return formatPriceRub(Math.round(price * 0.01 + sum));
}

function isOpen(id: string) {
	return openById[id] ?? false
}

function setOpen(id: string, v: boolean) {
	return openById[id] = v
}

function closeAll() {
	Object.keys(openById).forEach((k) => (openById[k] = false));
}

function onTriggerClick(id: string) {
	console.log(id)
	setOpen(id, !isOpen(id));
}

function onDocClick() {
	if (isSmallScreen.value) closeAll();
}

onMounted(() => {
	DL = new DataLayerWatch();
	off = DL.onEvent("view_item", (data: any) => {
		const raw = data?.ecommerce?.value;
		const price = typeof raw === "number" ? raw : Number(raw);
		if (!Number.isFinite(price)) return;
		cashbackLabel.value = `Кешбэк до ${calc(price, promoValues.value)}`;
	});
	document.addEventListener("click", onDocClick);
});

onUnmounted(() => {
	off?.();
	DL?.destroy();
	document.removeEventListener("click", onDocClick)
});
</script>

<template>
	<Teleport v-for="t in aliveTargets" :key="t.id" :to="t.el">
		<div class="w-full data-coral-bonus-target" :data-coral-bonus-target="t.id">
			<div class="data-coral-bonus-target__card rounded-[6px] bg-[#FEEFCD] p-2 flex items-center gap-2">
				<div class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path
								d="M0.699938 10.866C0.423795 10.3877 0.587671 9.77614 1.06597 9.5L13.7242 2.19176C14.2025 1.91562 14.8141 2.07949 15.0902 2.55778L19.2829 9.81967C19.559 10.298 19.3952 10.9096 18.9169 11.1857L6.25862 18.4939C5.78033 18.7701 5.16873 18.6062 4.89259 18.1279L0.699938 10.866Z"
								fill="#E6F4FF"
								stroke="#0093D0"
								stroke-width="0.88"
								stroke-linejoin="round"
						/>
						<path
								d="M1.59851 12.4224L15.9888 4.11411"
								stroke="#0093D0"
								stroke-width="0.88"
								stroke-linejoin="round"
						/>
						<path
								d="M6.15161 15.3259L10.4687 12.8335"
								stroke="#0093D0"
								stroke-width="0.88"
								stroke-linecap="round"
								stroke-linejoin="round"
						/>
						<path
								d="M15.9061 10.6187C16.5022 10.2745 16.7171 9.53092 16.3862 8.95778C16.0553 8.38464 15.3039 8.199 14.7078 8.54314C14.1117 8.88728 13.8968 9.63088 14.2277 10.204C14.5586 10.7772 15.31 10.9628 15.9061 10.6187Z"
								stroke="#0093D0"
								stroke-width="0.88"
								stroke-linejoin="round"
						/>
					</svg>
				</div>

				<div class="flex flex-col">
          <span class="data-coral-bonus-target__text text-[rgba(0,0,0,0.85)] text-sm font-bold leading-5.5">
            {{ cashbackLabel }}
          </span>
					<span class="data-coral-bonus-target__text text-[rgba(0,0,0,0.85)] text-[12px] leading-4">
            на карту CoralBonus
          </span>
				</div>

				<div class="flex items-center ml-auto">
					<TooltipProvider>
						<Tooltip
								:open="isSmallScreen ? isOpen(t.id) : false"
								@update:open="(v: boolean) => { if (isSmallScreen) setOpen(t.id, v) }"
								:delay-duration="isSmallScreen ? 0 : undefined"
						>
							<TooltipTrigger
									class="bg-transparent"
									@click.stop="onTriggerClick(t.id)"
							>
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
									:align-offset="isSmallScreen ? -16 : -24"
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
											v-for="promo in promos"
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
				</div>
			</div>
		</div>
	</Teleport>
</template>
