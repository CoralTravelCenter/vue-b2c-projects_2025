import {ShallowRef} from "vue";

export interface IProps {
    id: string
    autoShow?: string | undefined
    guardSelectors?: string | undefined
    ymMetrika?: string | undefined
}


export interface IPopupCtx {
    visible: ShallowRef<boolean>
    mounted: ShallowRef<boolean>
    ymMetrika?: string
}

export interface IGuards {
    floating: string[];
    requiredOnce: string[]
}
