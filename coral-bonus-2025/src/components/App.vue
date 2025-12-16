<script setup lang="ts">
import {computed, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {useMediaQuery} from "@vueuse/core";

import {DataLayerWatch, formatPriceRub} from "../../../usefuls";
import type {ICashbackData, IOverlayDetail} from "@/types";
import {readCashbackFromScript} from "@/helpers/dom-helpers";

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {PopoverArrow} from "reka-ui";

import type {TargetLike} from "@/helpers/coralBonus/targetMeta";
import {getYmLabel, resolveHotelId} from "@/helpers/coralBonus/targetMeta";
import {targets} from "@/helpers/coralBonus/targets";
import {makeCashbackLookups, promosForTarget, promoSumForTarget} from "@/helpers/coralBonus/cashback";
import {parseViewItemPrice, upsertPricesFromViewItemList} from "@/helpers/coralBonus/datalayer";
import {emitOverlay, pruneOpened} from "@/helpers/coralBonus/overlay";
import {toNum} from "@/helpers/coralBonus/number";
import BonusOverlayBody from "@/components/BonusOverlayBody.vue";
import Trigger from "@/components/ui/Trigger.vue";

const CASHBACK_SCRIPT_ID = "coral-bonus-cashback-json";

const isSmallScreen = useMediaQuery("(max-width: 993px)");
const cashbackData = ref<ICashbackData[]>([]);
const cashbackLookups = computed(() => makeCashbackLookups(cashbackData.value));

const priceByHotelId = reactive<Record<number, number>>({});
const fallbackId = Number((window as any).insider_object?.product?.id ?? NaN);

const aliveTargets = computed(() =>
		(targets as unknown as TargetLike[]).filter((t) => (t as any)?.el?.isConnected),
);

const currentPrice = ref<number | null>(null);
const opened = new Set<string>();

let off: null | (() => void) = null;
let DL: null | DataLayerWatch = null;

function calc(price: number, promoSum: number): string {
	return formatPriceRub(Math.round(price * 0.01 + promoSum));
}

function priceOf(t: TargetLike): number | null {
	const hid = resolveHotelId(t, fallbackId);
	if (!hid) return null;

	const p = priceByHotelId[hid];
	if (typeof p === "number") return p;

	return currentPrice.value;
}

function promosOf(t: TargetLike) {
	return promosForTarget(t, cashbackLookups.value, fallbackId);
}

function cashbackLabelOf(t: TargetLike): string {
	const price = priceOf(t);
	if (price == null) return "Кешбэк рассчитывается…";

	const sum = promoSumForTarget(t, cashbackLookups.value, fallbackId);
	return `Кешбэк до ${calc(price, sum)}`;
}

function onOverlayOpenChange(t: TargetLike, next: boolean, ui: IOverlayDetail["ui"]) {
	const targetId = String(t.id);
	const hotelId = resolveHotelId(t, fallbackId) ?? undefined;
	const promoCount = promosOf(t).length;

	if (next && !opened.has(targetId)) {
		opened.add(targetId);
		emitOverlay<IOverlayDetail>({
			action: "open",
			targetId,
			ui,
			hotelId,
			promoCount,
			label: getYmLabel(t),
		});
	}

	if (!next && opened.has(targetId)) {
		opened.delete(targetId);
		emitOverlay<IOverlayDetail>({
			action: "close",
			targetId,
			ui,
			hotelId,
			promoCount,
			label: getYmLabel(t),
		});
	}
}

onMounted(() => {
	const el = document.getElementById(CASHBACK_SCRIPT_ID) as HTMLScriptElement | null;
	cashbackData.value = el ? readCashbackFromScript(el) : [];

	DL = new DataLayerWatch();

	if (location.pathname.includes("hotels")) {
		off = DL.onEvent("view_item", (data: unknown) => {
			const price = parseViewItemPrice(data);
			if (price == null) return;

			currentPrice.value = price;
			const hid = toNum(fallbackId);
			if (hid != null) priceByHotelId[hid] = price;
		});
	}

	if (location.pathname.includes("packagetours") || location.pathname.includes("onlyhotel")) {
		off = DL.onEvent("view_item_list", (data: unknown) => {
			upsertPricesFromViewItemList(data, priceByHotelId);
		});
	}
});

watch(aliveTargets, (arr) => {
	const ids = new Set(arr.map((t) => String(t.id)));
	pruneOpened(opened, ids);
});

onUnmounted(() => {
	off?.();
	DL?.destroy();
});
</script>

<template>
	<TooltipProvider>
		<Teleport v-for="t in aliveTargets" :key="t.id" :to="t.el">
			<div class="w-full data-coral-bonus-target p-0" :data-coral-bonus-target="t.id">
				<div class="data-coral-bonus-target__card rounded-[6px] bg-[#FEEFCD] p-2 flex items-center gap-2">
					<div class="icon">
						<!-- cashback svg -->
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path
									d="M0.699938 10.866C0.423795 10.3877 0.587671 9.77614 1.06597 9.5L13.7242 2.19176C14.2025 1.91562 14.8141 2.07949 15.0902 2.55778L19.2829 9.81967C19.559 10.298 19.3952 10.9096 18.9169 11.1857L6.25862 18.4939C5.78033 18.7701 5.16873 18.6062 4.89259 18.1279L0.699938 10.866Z"
									fill="#E6F4FF"
									stroke="#0093D0"
									stroke-width="0.88"
									stroke-linejoin="round"
							/>
							<path d="M1.59851 12.4224L15.9888 4.11411" stroke="#0093D0" stroke-width="0.88" stroke-linejoin="round"/>
							<path d="M6.15161 15.3259L10.4687 12.8335" stroke="#0093D0" stroke-width="0.88" stroke-linecap="round"
										stroke-linejoin="round"/>
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
              {{ cashbackLabelOf(t) }}
            </span>
						<span class="data-coral-bonus-target__text text-[rgba(0,0,0,0.85)] text-[12px] leading-4">
              на карту CoralBonus
            </span>
					</div>

					<div class="flex items-center ml-auto">
						<!-- Desktop tooltip -->
						<Tooltip v-if="!isSmallScreen" @update:open="(v) => onOverlayOpenChange(t, v, 'tooltip')">
							<TooltipTrigger as-child>
								<Trigger/>
							</TooltipTrigger>

							<TooltipContent
									side="top"
									align="end"
									:align-offset="-24"
									class="flex flex-col px-3 py-0 rounded-[12px] bg-white shadow-xl"
							>
								<BonusOverlayBody :promos="promosOf(t)"/>
							</TooltipContent>
						</Tooltip>

						<!-- Mobile popover -->
						<Popover v-else @update:open="(v) => onOverlayOpenChange(t, v, 'popover')">
							<PopoverTrigger as-child>
								<Trigger/>
							</PopoverTrigger>

							<PopoverContent
									side="top"
									align="end"
									:align-offset="-16"
									:side-offset="8"
									class="flex w-fit flex-col px-3 py-0 rounded-[12px] bg-white shadow-xl border-none overflow-visible"
							>
								<PopoverArrow class="fill-white"/>

								<BonusOverlayBody :promos="promosOf(t)"/>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</div>
		</Teleport>
	</TooltipProvider>
</template>
