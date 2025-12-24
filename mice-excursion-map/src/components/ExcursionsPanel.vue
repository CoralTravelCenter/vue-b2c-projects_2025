<script setup lang="ts">
import {computed, onMounted, ref} from "vue"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {ScrollArea} from "@/components/ui/scroll-area"

type LinkItem = { label: string; url?: string; pdf?: string }
type Product = { name: string; list: LinkItem[] }
type Country = { country_name: string; capital_cords?: [number, number]; product: Product[] }

function getSettings(): Country[] {
	const raw = (window as any)._yamap_settings ?? []
	return Array.isArray(raw) ? raw : [raw]
}

const settings = ref<Country[]>(getSettings())
const selectedCountryName = ref(settings.value[0]?.country_name ?? "")

const selectedCountry = computed(() => {
	return settings.value.find(c => c.country_name === selectedCountryName.value) ?? null
})

// хочешь скрывать пустые секции — оставь фильтр; хочешь показывать все — убери filter(...)
const products = computed(() => {
	const p = selectedCountry.value?.product ?? []
	return p.filter(x => Array.isArray(x.list) && x.list.length > 0)
})

const defaultOpen = computed(() => {
	const corp = products.value.find(p => p.name === "Корпоративные программы")
	return corp?.name
})

function renderByName(name: string) {
	settings.value = getSettings()

	const exists = settings.value.some(c => c.country_name === name)
	if (exists) selectedCountryName.value = name
}

onMounted(() => {
	(window as any).ExcursionsUI = {
		renderByName,
		refresh() {
			settings.value = getSettings()
		},
	}
})
</script>

<template>
	<div class="w-full">
		<template v-if="selectedCountry">
			<h4 class="mb-2 text-sm font-medium">
				{{ selectedCountry.country_name }}
			</h4>

			<Accordion
					type="single"
					collapsible
					class="w-full"
					:default-value="defaultOpen"
			>
				<AccordionItem
						v-for="p in products"
						:key="p.name"
						:value="p.name"
				>
					<AccordionTrigger class="text-sm">
            <span class="flex items-center justify-between w-full">
              <span>{{ p.name }}</span>
              <span class="text-xs opacity-60 ml-3">{{ p.list.length }}</span>
            </span>
					</AccordionTrigger>

					<AccordionContent>
						<ScrollArea class="max-h-64 pr-2">
							<div class="flex flex-col gap-3 pl-2">
								<a
										v-for="item in p.list"
										:key="item.label"
										class="text-sm flex items-center justify-between hover:underline"
										:href="item.url || item.pdf || '#'"
										target="_blank"
										rel="noopener noreferrer"
								>
									<span class="truncate" :title="item.label">{{ item.label }}</span>
									<span v-if="item.pdf" class="text-xs opacity-60 ml-3">PDF</span>
								</a>
							</div>
						</ScrollArea>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</template>

		<template v-else>
			<div class="text-sm opacity-70">Нет данных</div>
		</template>
	</div>
</template>
