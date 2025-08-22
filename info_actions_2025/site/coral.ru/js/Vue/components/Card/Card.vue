<script setup>
import {CopyOutlined} from '@ant-design/icons-vue'
import {useClipboard, useMediaQuery} from '@vueuse/core'

const {
	visual, name, description, url, promo_end_text, erid,
} = defineProps({
	visual: String,
	name: String,
	description: String,
	url: String,
	promo_end_text: String,
	erid: String,
})

const {copy, copied, isSupported} = useClipboard()
const isMobile = useMediaQuery('(hover: none), (pointer: coarse)')

// опционально: helper для клика
function onCopy() {
	if (!isSupported) return
	copy(erid)
}
</script>

<template>
	<article class="promo-card">
		<a-tooltip
				placement="bottomRight"
				:overlay-inner-style="{display: 'flex', alignItems: 'center', padding: 0 }"
				:trigger="isMobile ? 'click' : 'hover'"
		>
			<template #title>
				<span class="copy-status" v-if="copied">Скопировано!</span>
				<div v-else class="content">
					<span class="ligal">ООО "Центрбронь" erid:</span>&nbsp;
					<span class="erid">{{ erid }}</span>
				</div>

				<!-- .stop чтобы клик по кнопке не закрывал тултип на мобиле (trigger='click') -->
				<button class="copy" @click.stop="onCopy" :disabled="!isSupported" aria-label="Скопировать erid">
					<CopyOutlined :style="{ color: copied ? '#52c41a' : '#535353'}"/>
				</button>
			</template>

			<a-button class="tooltip-trigger">Реклама</a-button>
		</a-tooltip>

		<div class="promo-card__visual">
			<img class="promo-card__image" :src="visual" :alt="name">
		</div>

		<div class="promo-card__content">
			<h5 class="promo-card__title" v-html="name"></h5>
			<div class="promo-card__time">
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#535353" stroke-linejoin="round"/>
            <path d="M11 4V11H16" stroke="#535353" stroke-linejoin="round"/>
          </svg>
        </span>
				{{ promo_end_text }}
			</div>
			<p class="promo-card__description" v-html="description"></p>
			<a :href="url" target="_blank" class="promo-card__link prime-btn">Подробнее</a>
		</div>
	</article>
</template>

<style scoped lang="scss">
.promo-card {
	display: flex;
	flex-direction: column;
	border-radius: 20px;
	overflow: hidden;
	position: relative;

	&__visual {
		height: 220px;
	}

	&__content {
		display: flex;
		flex-direction: column;
		padding: 16px 20px 20px 20px;
		background: #FFFFFF;
		flex-grow: 1;
	}

	&__title {
		margin-bottom: 8px !important;
	}

	&__description {
		margin-top: auto !important;
		margin-bottom: 16px !important;
	}

	&__time {
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;

		.icon {
			width: 22px;
			height: 22px;
		}
	}

	&__link {
		width: fit-content;
	}
}

:deep(.tooltip-trigger.ant-btn) {
	position: absolute;
	top: 8px;
	right: 8px;
	border-radius: var(--radius-border_Radius_XXXL, 48px);
	opacity: 0.72;
	background: var(--Base-color_Base_Light, #FFF);
	border: none;
	padding: 2px 8px;
	font-size: 12px;
	cursor: pointer;
	color: rgba(0, 0, 0, 0.85);
	height: auto;
	line-height: 20px;
}


.content {
	padding: 8px;
	font-size: 12px;
	display: flex;
	align-items: center;
}

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
