export const OVERLAY_EVENT = "coral-bonus:overlay" as const;

export function emitOverlay<T>(detail: T) {
    document.dispatchEvent(
        new CustomEvent<T>(OVERLAY_EVENT, {detail, bubbles: true, composed: true}),
    );
}

export function pruneOpened(opened: Set<string>, aliveIds: Set<string>) {
    for (const id of opened) {
        if (!aliveIds.has(id)) opened.delete(id);
    }
}
