import {ShallowRef} from "vue";

export interface IProps {
    id: string
    autoShow?: string
    guardSelectors: {
        floating: string[],
        requiredOnce: string[]
    },
    ymMetrika?: string
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
