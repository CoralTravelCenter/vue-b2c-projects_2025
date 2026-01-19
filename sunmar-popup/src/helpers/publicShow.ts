// helpers/publicShow.ts
import { nextTick, type ShallowRef } from 'vue'
import type { ICtx } from '../types'
import fireMetrika from './fireMetrika'

export default async function publicShow(
	ctx: ICtx,
	isPageScrollDisabled: ShallowRef,
) {
	if (ctx.visible.value) return

	ctx.mounted.value = true
	await nextTick()

	ctx.visible.value = true
	isPageScrollDisabled.value = true
	fireMetrika(ctx.ymMetrika)
}
