const METRIKA_ID = 96674199;

/**
 * Безопасный вызов Yandex Metrika
 * @param goal - идентификатор цели
 * @param params - объект с параметрами
 */
export function track(goal: string, params: Record<string, any> = {}) {
    if (typeof window === 'undefined') return;

    const ymFn = (window as any).ym;
    if (typeof ymFn === 'function') {
        ymFn(METRIKA_ID, 'reachGoal', goal, params);
    } else {
        console.debug('[metrics] ym not found', goal, params);
    }
}
