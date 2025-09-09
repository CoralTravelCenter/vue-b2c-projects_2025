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
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + depth);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + nights);

    return [formatDate(startDate), formatDate(endDate)];
}
