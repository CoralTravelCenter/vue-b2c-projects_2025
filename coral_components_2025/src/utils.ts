export async function hostReactAppReady(
    selector: string = "#__next > div",
    timeout: number = 300
): Promise<void> {
    return new Promise((resolve) => {
        const waiter = (): void => {
            const hostEl = document.querySelector<HTMLElement>(selector);
            if (hostEl?.getBoundingClientRect().height) {
                resolve();
            } else {
                setTimeout(waiter, timeout);
            }
        };
        waiter();
    });
}

function formatDate(date: Date): string {
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date provided to formatDate");
    }
    return date.toISOString().split("T")[0];
}

export function calculateDates(depth: number, nights: number): [string, string] {
    const today = new Date();
    const startDate = new Date(today.getTime());
    startDate.setDate(today.getDate() + depth);
    const endDate = new Date(startDate.getTime());
    endDate.setDate(startDate.getDate() + nights);
    return [formatDate(startDate), formatDate(endDate)];
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

export function findObjectByKey(targetKey: string, obj: any) {
    if (obj.hasOwnProperty(targetKey)) {
        for (const key of Object.keys(obj)) {
            if (key === targetKey) return obj[key];
        }
    }
}

export function formattedDates(datesArr: string[]) {
    return datesArr.map(date => {
        const [year, month, day] = date.split('-');
        return `${day}.${month}.${year}`;
    }).join(' - ');
}

export function mediaMatcher(
    size: number,
    callback: (isMatch: boolean) => void
): void {
    const mediaQuery = window.matchMedia(`(max-width: ${size}px)`)
    callback(mediaQuery.matches)
    mediaQuery.addEventListener('change', (e: MediaQueryListEvent) => {
        callback(e.matches)
    })
}
