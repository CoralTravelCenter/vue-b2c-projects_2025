<script setup>
import {CopyOutlined} from '@ant-design/icons-vue'
import {useMediaQuery} from '@vueuse/core'
import {onBeforeUnmount, ref} from 'vue'

const {
	toggle,
	visual,
	name,
	description,
	url,
	promo_end_text,
	erid,
	entry_point,
	ligal,
} = defineProps({
	toggle: String,
	visual: String,
	name: String,
	description: String,
	url: String,
	promo_end_text: String,
	erid: String,
	entry_point: String,
	ligal: {type: String, default: 'Реклама'},
})

const isMobile = useMediaQuery('(hover: none), (pointer: coarse)')

const copied = ref(false)
const COPY_RESET_MS = 1500
let copiedTimer = null

function onCopySuccess() {
	copied.value = true
	if (copiedTimer) clearTimeout(copiedTimer)
	copiedTimer = setTimeout(() => {
		copied.value = false
		copiedTimer = null
	}, COPY_RESET_MS)
}

function handleButtonClick() {
	if (toggle) {
		const popup = document?.querySelector('coral-popup', 'sunmar-popup')
		if (popup && typeof popup.show === 'function') popup.show()
	} else {
		window.open(url, '_blank')
	}
}

function handleLinkClick() {

}

onBeforeUnmount(() => {
	if (copiedTimer) {
		clearTimeout(copiedTimer)
		copiedTimer = null
	}
})
</script>


<template>
	<li class="promo-card">
		<article>
			<a-tooltip
					placement="bottomRight"
					:overlay-inner-style="{ display: 'flex', alignItems: 'center', padding: 0 }"
					:trigger="isMobile ? 'click' : 'hover'"
			>
				<template #title>
					<span class="copy-status" v-if="copied" :style="{ color: copied ? '#52c41a' : '#000000' }">Скопировано!</span>
					<div v-else class="content">
						<span class="ligal">{{ ligal }} erid:</span>&nbsp;
						<span class="erid">{{ erid }}</span>
					</div>
					<button
							class="copy"
							type="button"
							aria-label="Скопировать erid"
							v-clipboard="erid"
							@clipboard:success="onCopySuccess"
					>
						<CopyOutlined :style="{ color: copied ? '#52c41a' : '#535353' }"/>
					</button>
				</template>

				<a-button class="tooltip-trigger">Реклама</a-button>
			</a-tooltip>

			<div class="promo-card__visual">
				<img class="promo-card__image" :src="visual" :alt="name || 'Промо'" loading="lazy" decoding="async"/>
			</div>

			<div class="promo-card__content">
				<h5 class="promo-card__title" v-html="name"></h5>
				<p class="promo-card__description" v-html="description"></p>
				<div class="promo-card__footer">
					<div class="promo-card__time">
          <span class="icon">
            <!-- твои иконки -->
            <svg class="coral-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"
								 fill="none">
              <circle cx="11" cy="11" r="10" stroke="#535353" stroke-linejoin="round"/>
              <path d="M11 4V11H16" stroke="#535353" stroke-linejoin="round"/>
            </svg>
            <svg class="sunmar-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
								 fill="none">
              <circle cx="12" cy="12" r="9" fill="#2E3465" fill-opacity="0.2" stroke="#2E3465" stroke-width="1.5"
											stroke-linejoin="round"/>
              <path d="M12 5.69995V12H16.5" stroke="#2E3465" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </span>
						<span class="time-text">{{ promo_end_text }}</span>
					</div>
					<a
							v-if="!toggle && !entry_point"
							class="promo-card__link prime-btn"
							:href="url"
							target="_blank"
							rel="noopener noreferrer"
					>
						Подробнее
					</a>
					<button
							v-else
							v-entry="entry_point"
							@click="handleButtonClick"
							type="button"
							class="promo-card__link prime-btn"
					>
						Подробнее
					</button>
				</div>
			</div>
		</article>
	</li>
</template>


<style scoped lang="scss">@use "./Card";</style>
