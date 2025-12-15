import {markRaw, shallowReactive} from "vue";

export type MountMode = "append" | "clear" | "replace";
export type TargetProps = Record<string, unknown>;

export type Target = {
    id: string;
    el: HTMLElement;          // host (плейсхолдер или оригинал)
    original?: HTMLElement;   // если replace
    props?: TargetProps;
    mode: MountMode;
};

export const targets = shallowReactive<Target[]>([]);

const genId = () =>
    (globalThis.crypto && "randomUUID" in globalThis.crypto)
        ? globalThis.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function upsertTarget(el: HTMLElement, props?: TargetProps, mode: MountMode = "append") {
    const id = el.dataset.coralBonusId ?? genId();
    el.dataset.coralBonusId = id;

    let host: HTMLElement = el;
    let original: HTMLElement | undefined;

    if (mode === "replace") {
        // уже заменяли — найдём существующий плейсхолдер
        const existingHostId = el.dataset.coralBonusHostId;
        const existingHost = existingHostId
            ? document.querySelector<HTMLElement>(`[data-coral-bonus-host="${existingHostId}"]`)
            : null;

        if (existingHost) {
            host = existingHost;
        } else {
            const placeholder = document.createElement("span");
            placeholder.dataset.coralBonusHost = id;
            el.dataset.coralBonusHostId = id;

            // опционально: переносим классы, чтобы стили не пропали
            placeholder.className = el.className;

            original = el;
            el.replaceWith(placeholder);
            host = placeholder;
        }
    }

    if (mode === "clear" && host.dataset.coralBonusCleared !== "1") {
        host.innerHTML = "";
        host.dataset.coralBonusCleared = "1";
    }

    const i = targets.findIndex(t => t.id === id);
    const item: Target = {id, el: markRaw(host), original: original ? markRaw(original) : undefined, props, mode};

    if (i === -1) targets.push(item);
    else targets[i] = item;
}
