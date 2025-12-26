export type UiLine = {
    title: string
    amountRub?: number
    percent?: number
    url?: string
}


export type CalcResult = {
    amountRub: number
    lines: UiLine[]
}
