import type { ShallowRef } from 'vue'

export interface IProps {
	id: string
	autoShow?: string | undefined
	guardSelectors?: string | undefined
	ymMetrika?: string | undefined
}

export interface ICtx {
	visible: ShallowRef<boolean>
	mounted: ShallowRef<boolean>
	ymMetrika?: string
}

export type IGuards = string[]

export interface AutoshowArgs {
	autoShowAttr?: string
	autoDelay: false | number
	wasAutoShown: { value: boolean }
}
