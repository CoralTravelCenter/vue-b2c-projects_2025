export async function hostReactAppReady(selector: string = "#__next > div", timeout: number = 200): Promise<any> {
    return new Promise((resolve): void => {
        const checkReady = (): void => {
            const hostEl: HTMLElement | null = document?.querySelector(selector);
            if (hostEl && hostEl?.getBoundingClientRect().height) {
                resolve();
            } else {
                setTimeout(checkReady, timeout);
            }
        };
        checkReady();
    });
}

export function pluralizeNights(nightsCount: number): string {
    const nights = ['ночь', 'ночи', 'ночей'];

    if (nightsCount % 10 === 1 && nightsCount % 100 !== 11) {
        return nights[0]; // 1 ночь
    } else if (nightsCount % 10 >= 2 && nightsCount % 10 <= 4 && (nightsCount % 100 < 10 || nightsCount % 100 >= 20)) {
        return nights[1]; // 2, 3, 4 ночи
    } else {
        return nights[2]; // 0, 5-20, 25-30 и т.д. ночей
    }
}

export function formattedDates(datesArr: [string, string]) {
    return datesArr.map(date => {
        const [year, month, day] = date.split('-');
        return `${day}.${month}.${year}`;
    }).join(' - ');
}

export function findObjectByKey(targetKey: string, obj: any) {
    if (obj.hasOwnProperty(targetKey)) {
        for (const key of Object.keys(obj)) {
            if (key === targetKey) return obj[key];
        }
    }
}

export function cutBeforeBracket(str: string): string {
    const idx = str.indexOf('(');
    return idx === -1 ? str : str.slice(0, idx).trim();
}

export function formatPriceRub(
    value: number | string,
    withCurrency: boolean = true
): string {
    const num = Number(value)

    if (!Number.isFinite(num)) return ''

    return new Intl.NumberFormat('ru-RU', {
        style: withCurrency ? 'currency' : 'decimal',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(num)
}
