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
