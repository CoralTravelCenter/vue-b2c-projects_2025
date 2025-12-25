export type BreakdownItem = {
    code: string
    title: string
    amountRub: number
    meta?: Record<string, any>
}

export type CalcResult = {
    amountRub: number
    items: BreakdownItem[]
}
