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

export function mediaMatcher(size, callback) {
    const mobileWidthMediaQuery = window.matchMedia(`(max-width: ${size}px)`);
    callback(mobileWidthMediaQuery.matches);
    mobileWidthMediaQuery.addEventListener("change", (e) =>
        callback(e.matches),
    );
}
