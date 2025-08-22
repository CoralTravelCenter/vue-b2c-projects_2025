<script setup>
import { CopyOutlined } from '@ant-design/icons-vue';
import {useMediaQuery} from "@vueuse/core";

const isMobile = useMediaQuery('(hover: none), (pointer: coarse)')

const {
		visual, name, description, url, promo_end_text, erid
	} = defineProps({
		visual: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		url: {
			type: String,
			required: true
		},
		promo_end_text: {
			type: String,
			required: true
		},
		erid: {
			type: String,
			required: true
		},
	})
</script>

<template>
	<article class="promo-card">
		<a-tooltip placement='bottomRight' overlayClassName="custom-tip" :trigger="isMobile ? 'click' : 'hover'">
			<template #title>
				<div class="content">
					<span class="ligal">
						ООО "Центрбронь" erid:
					</span>
					<span class="erid">{{erid}}</span>
				</div>
				<button class="copy">
					<CopyOutlined/>
				</button>
			</template>
			<a-button class="tooltip-trigger">Реклама</a-button>
		</a-tooltip>
		<div class="promo-card__visual">
			<img
				class="promo-card__image"
				:src="visual"
				:alt="name"
			>
		</div>
		<div class="promo-card__content">
			<h5 class="promo-card__title">{{name}}</h5>
			<div class="promo-card__time">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
						<circle cx="11" cy="11" r="10" stroke="#535353" stroke-linejoin="round"/>
						<path d="M11 4V11H16" stroke="#535353" stroke-linejoin="round"/>
					</svg>
				</span>
				{{promo_end_text}}
			</div>
			<p class="promo-card__description">
				{{description}}
			</p>
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
		margin-top: auto !important;
		width: fit-content;
	}
}

:deep(.tooltip-trigger).ant-btn {
	position: absolute;
	top: 8px;
	right: 8px;
	border-radius: var(--radius-border_Radius_XXXL, 48px);
	opacity: 0.72;
	background: var(--Base-color_Base_Light, #FFF);
	border: none;
	padding: 3px 8px;
	font-size: 12px;
	cursor: pointer;
	color: rgba(0, 0, 0, 0.85);
	height: auto;
	line-height: 1.4;
}

.ant-tooltip.custom-tip .ant-tooltip-inner {
	display: flex;
	padding: 0;

	.content {
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

		&:hover {
			background: rgba(0, 0, 0, 0.06);
			filter: brightness(90%);
		}
	}
}
</style>