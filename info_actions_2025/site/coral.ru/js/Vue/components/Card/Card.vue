<script setup>
import {CopyOutlined} from '@ant-design/icons-vue'
import {useMediaQuery} from '@vueuse/core'
import {ref} from 'vue'

const {
	visual = '',
	name = '',
	description = '',
	url = '',
	promo_end_text = '',
	erid = '',
	entry_point = '',
	ligal = '',
} = defineProps({
	visual: String,
	name: String,
	description: String,
	url: String,
	promo_end_text: String,
	erid: String,
	entry_point: String,
	ligal: String,
})

// не реактивно — отлично для статичного конфига
const isMobile = useMediaQuery('(hover: none), (pointer: coarse)')
const copied = ref(false)
let copiedTimer = null

function onCopySuccess() {
	copied.value = true
	clearTimeout(copiedTimer)
	copiedTimer = setTimeout(() => (copied.value = false), 1500)
}

function onRedirect() {
	if (!url) return
	window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
	<article class="promo-card">
		<a-tooltip
				placement="bottomRight"
				:overlay-inner-style="{ display: 'flex', alignItems: 'center', padding: 0 }"
				:trigger="isMobile ? 'click' : 'hover'"
		>
			<template #title>
				<span class="copy-status" v-if="copied">Скопировано!</span>
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

			<div class="promo-card__time">
        <span class="icon">
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

			<p class="promo-card__description" v-html="description"></p>

			<a
					v-if="!entry_point"
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
					@redirect="onRedirect"
					type="button"
					class="promo-card__link prime-btn"
			>
				Подробнее
			</button>
		</div>
	</article>
</template>

<style scoped lang="scss">
/* стили без изменений */
.promo-card {
	display: flex;
	flex-direction: column;
	border-radius: 20px;
	overflow: hidden;
	position: relative;

	&__visual {
		height: 220px;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}
	}

	&__content {
		display: flex;
		flex-direction: column;
		padding: 16px 20px 20px 20px;
		background: #ffffff;
		flex-grow: 1;
	}

	&__title {
		margin-bottom: 8px !important;
	}

	&__description {
		margin-bottom: 16px !important;
		font-weight: 400;
	}

	&__time {
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		font-weight: 400;

		.icon {
			width: 22px;
			height: 22px;
		}
	}

	&__link {
		margin-top: auto !important;
		width: fit-content;
	}

	.coral-icon {
		display: block;
	}

	.sunmar-icon {
		display: none;
	}
}

.promo-card.sunmar {
	border-radius: 16px;

	.promo-card__content {
		background: var(--Base-color_Base_Light_Gray, #f5f5f8);
		padding: 24px;
	}

	.promo-card__title {
		font-size: 28px;
		text-align: center;
		margin-bottom: 24px !important;
		order: 1;
	}

	.promo-card__description {
		order: 2;
		text-align: center;
	}

	.promo-card__time {
		order: 3;
		justify-content: center;
		margin-bottom: 20px !important;
	}

	.promo-card__link {
		order: 4;
		margin: 0 auto;
		border-radius: 40px;
		font-weight: 600;
		padding-inline: 32px;
		background: var(--gradient_Primary, linear-gradient(245deg, var(--Gradient-color_Gradinet_Primary_Second, #D8242A) 15.84%, var(--Gradient-color_Gradient_Primary_First, #E7317D) 84.16%));
	}

	.time-text {
		color: #2e3465;
	}

	.coral-icon {
		display: none;
	}

	.sunmar-icon {
		display: block;
	}
}

:deep(.tooltip-trigger.ant-btn) {
	position: absolute;
	top: 8px;
	right: 8px;
	border-radius: var(--radius-border_Radius_XXXL, 48px);
	opacity: 0.72;
	background: var(--Base-color_Base_Light, #fff);
	border: none;
	padding: 2px 8px;
	font-size: 12px;
	cursor: pointer;
	color: rgba(0, 0, 0, 0.85);
	height: auto;
	line-height: 20px;
}

.content,
.copy-status {
	padding: 8px;
	font-size: 12px;
	display: flex;
	align-items: center;
}

.copy {
	width: 32px;
	height: 32px;
	border: none;
	background: #fff;
	cursor: pointer;
	border-radius: 6px;
	padding: 0;

	&:hover {
		background: rgba(0, 0, 0, 0.06);
		filter: brightness(90%);
	}
}
</style>
