<script setup lang="ts">
import { formatPriceRub } from "../../../usefuls";

type Promo = { name: string; value: number };
defineProps<{ promos: Promo[] }>();
</script>

<template>
	<ul class="text-xs text-black">
		<li
			class="py-3 flex justify-between items-center gap-6 border-b border-b-[rgba(0,0,0,0.04)]"
		>
			<span class="text-left">1%</span>
			<span class="text-right">от стоимости тура на следующее путешествие</span>
		</li>

		<li
			v-for="promo in promos"
			:key="promo.name + ':' + promo.value"
			class="py-3 flex justify-between items-center gap-6 border-b border-b-[rgba(0,0,0,0.04)]"
		>
			<span class="text-left">{{ formatPriceRub(promo.value) }}</span>
			<span class="text-right" v-html="promo.name"></span>
		</li>

		<li class="py-3">
			<span>
				Нет карты CoralBonus?&nbsp;
				<a
					class="text-[#0092D0] no-underline hover:underline!"
					href="https://coralbonus.ru/registration?promo=R3R5VO93GKG8N1PGQC1UP0G6EICQLRWEN3Z64WZGC4YBYIKHFJV55IND5O20WUJ"
				>
					Получить прямо сейчас
				</a>
			</span>
		</li>
	</ul>
</template>
