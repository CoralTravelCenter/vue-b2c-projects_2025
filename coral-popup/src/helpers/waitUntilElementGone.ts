export default function waitUntilElementsGone(config: {
    required?: string[];
    floating?: string[];
}): Promise<void> {
    const requiredSelectors = config.required ?? [];
    const floatingSelectors = config.floating ?? [];

    const hasAny = (selectors: string[]) =>
        selectors.some(sel => document.querySelector(sel));

    const allGone = (selectors: string[]) =>
        selectors.every(sel => !document.querySelector(sel));

    return new Promise<void>((resolve) => {
        let observer: MutationObserver | null = null;

        const finish = () => {
            observer?.disconnect();
            resolve();
        };

        const tryFinish = () => {
            if (!allGone(requiredSelectors)) return;
            if (!allGone(floatingSelectors)) return;
            finish();
        };

        const anyRequiredNow = hasAny(requiredSelectors);

        // required не появились — считаем, что их нет
        if (requiredSelectors.length > 0 && !anyRequiredNow) {
            resolve();
            return;
        }

        // всё уже исчезло
        if (allGone(requiredSelectors) && allGone(floatingSelectors)) {
            resolve();
            return;
        }

        observer = new MutationObserver(tryFinish);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}
