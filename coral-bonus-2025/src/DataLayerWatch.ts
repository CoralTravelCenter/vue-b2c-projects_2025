export class DataLayerWatch {
    constructor({layerName = 'dataLayer', pollMs = 300} = {}) {
        this.layerName = layerName;
        this.pollMs = pollMs;
        this.eventHandlers = new Map();
        this.seen = 0;

        this._init();
    }

    onEvent(name, handler) {
        if (!this.eventHandlers.has(name)) this.eventHandlers.set(name, new Set());
        this.eventHandlers.get(name).add(handler);
        return () => this.eventHandlers.get(name).delete(handler);
    }

    // ===== внутреннее =====
    _init() {
        this._ensureArray();
        this._hook(this.layer);
        this._consumeExisting();
        this._watchReassign();
    }

    _ensureArray() {
        const w = window;
        if (!Array.isArray(w[this.layerName])) w[this.layerName] = w[this.layerName] ?? [];
        this.layer = w[this.layerName];
    }

    _hook(arr) {
        if (!arr || arr.__dlwHooked) return;
        this.originalPush = arr.push.bind(arr);
        arr.push = (...items) => {
            const res = this.originalPush(...items);
            this._consume(items);
            return res;
        };
        Object.defineProperty(arr, '__dlwHooked', {value: true, enumerable: false});
    }

    _consume(items) {
        for (const item of items) {
            const name = item?.event;
            if (name && this.eventHandlers.has(name)) {
                for (const h of this.eventHandlers.get(name)) h(item);
            }
        }
        this.seen += items.length;
    }

    _consumeExisting() {
        const arr = this.layer;
        if (Array.isArray(arr) && arr.length) this._consume(arr.slice(this.seen));
    }

    _watchReassign() {
        const w = window;
        const desc = Object.getOwnPropertyDescriptor(w, this.layerName);
        const configurable = !desc || desc.configurable;

        if (configurable) {
            let current = this.layer;
            Object.defineProperty(w, this.layerName, {
                configurable: true,
                get: () => current,
                set: (next) => {
                    current = next;
                    this.layer = next;
                    this._hook(next);
                    this._consumeExisting();
                }
            });
        }

        let stopped = false;
        const tick = () => {
            if (stopped) return;
            const next = window[this.layerName];
            if (next !== this.layer && Array.isArray(next)) {
                this.layer = next;
                this._hook(next);
                this._consumeExisting();
            }
            setTimeout(tick, this.pollMs);
        };
        tick();
        this.stopPoll = () => {
            stopped = true;
        };
    }
}
