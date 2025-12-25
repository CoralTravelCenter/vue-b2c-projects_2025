export type AnyObject = Record<string, unknown>;
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
    | JsonPrimitive
    | JsonValue[]
    | { [k: string]: JsonValue };

export type NodeLike =
    | string
    | Node
    | NodeListOf<Element>
    | HTMLCollectionOf<Element>
    | Array<NodeLike>
    | { jquery: true; toArray(): Element[] };

export type WaitForOptions = {
    intervalMs?: number;
    timeoutMs?: number; // 0/undefined = без таймаута
};

export type DeferMode = "sync" | "microtask" | "raf";

export function randomId(prefix = "id"): string {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

/* ========================= Clipboard ========================= */

// @ts-ignore
export async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        throw new Error("Не удалось скопировать текст в буфер обмена.");
    }
}

/* ========================= Query params ========================= */

export function queryParam<T = unknown>(
    key?: string,
    source: string = location.href,
): T | Record<string, T> {
    const queryString = source.split("?")[1] ?? "";
    const params: Record<string, T> = {};

    for (const kv of queryString.split("&")) {
        if (!kv) continue;
        const [kRaw, vRaw = ""] = kv.split("=");
        if (!kRaw) continue;

        const k = decodeURIComponent(kRaw);
        const decoded = decodeURIComponent(vRaw);

        let v: unknown = decoded;
        try {
            v = JSON.parse(decoded);
        } catch {
        }

        params[k] = v as T;
    }

    return key ? params[key] : params;
}

export function params2query(params: Record<string, unknown>): string {
    return Object.entries(params)
        .map(([k, v]) => {
            const val =
                v !== null && typeof v === "object"
                    ? JSON.stringify(v)
                    : String(v);
            return `${encodeURIComponent(k)}=${encodeURIComponent(val)}`;
        })
        .join("&");
}

/* ========================= DOM ready ========================= */

export function asap(cb?: () => void): Promise<void> {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        cb?.();
        return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
        document.addEventListener(
            "DOMContentLoaded",
            () => {
                cb?.();
                resolve();
            },
            {once: true},
        );
    });
}

/* ========================= Nodes normalize ========================= */

export function arrayOfNodesWith(what: NodeLike): Element[] {
    if (!what) return [];

    // jquery-like
    if (typeof what === "object" && (what as any).jquery) {
        return (what as any).toArray();
    }

    if (Array.isArray(what)) {
        return what.flatMap((item) => arrayOfNodesWith(item));
    }

    if (typeof what === "string") {
        return Array.from(document.querySelectorAll(what));
    }

    if (what instanceof Node) {
        return what.nodeType === Node.ELEMENT_NODE ? [what as Element] : [];
    }

    return Array.from(what as any);
}

/* ========================= Waiters ========================= */

function withTimeout<T>(
    executor: (resolve: (v: T) => void, reject: (e: Error) => void) => void,
    timeoutMs = 0,
    timeoutMessage = "Timeout",
): Promise<T> {
    if (!timeoutMs) {
        return new Promise<T>(executor);
    }
    return new Promise<T>((resolve, reject) => {
        const t = window.setTimeout(
            () => reject(new Error(timeoutMessage)),
            timeoutMs,
        );
        executor(
            (v) => {
                clearTimeout(t);
                resolve(v);
            },
            (e) => {
                clearTimeout(t);
                reject(e);
            },
        );
    });
}

export async function hostReactAppReady(
    selector = "#__next > div",
    intervalMs = 300,
    timeoutMs = 0,
): Promise {
    return withTimeout<Element>(
        (resolve) => {
            const tick = () => {
                const el = document.querySelector(selector);
                if (
                    el &&
                    (el as HTMLElement).getBoundingClientRect().height > 0
                ) {
                    resolve(el);
                    return;
                }
                setTimeout(tick, intervalMs);
            };
            tick();
        },
        timeoutMs,
        `hostReactAppReady timeout: ${selector}`,
    );
}

export async function waitSelector(
    selector: string,
    {intervalMs = 200, timeoutMs = 0}: WaitForOptions = {},
): Promise<Element> {
    return withTimeout<Element>(
        (resolve) => {
            const tick = () => {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                setTimeout(tick, intervalMs);
            };
            tick();
        },
        timeoutMs,
        `waitSelector timeout: ${selector}`,
    );
}

export async function waitForLibrary<T>(
    getterFn: () => T | null | undefined,
    {intervalMs = 200, timeoutMs = 0}: WaitForOptions = {},
): Promise<T> {
    return withTimeout<T>(
        (resolve) => {
            const tick = () => {
                const v = getterFn();
                if (v) return resolve(v);
                setTimeout(tick, intervalMs);
            };
            tick();
        },
        timeoutMs,
        "waitForLibrary timeout",
    );
}

export async function waitForWindowVar<T = unknown>(
    name: string,
    opts: WaitForOptions = {},
): Promise<T> {
    return waitForLibrary<T>(() => (window as any)[name], opts);
}

export async function waitForDLEvent<
    T extends { event?: string } = AnyObject & { event?: string },
>(
    eventName: string,
    {intervalMs = 300, timeoutMs = 0}: WaitForOptions = {},
): Promise<T> {
    (window as any).dataLayer = (window as any).dataLayer || [];
    let cursor = 0;

    return withTimeout<T>(
        (resolve) => {
            const tick = () => {
                const dl: T[] = (window as any).dataLayer || [];
                for (let i = cursor; i < dl.length; i++) {
                    const item = dl[i];
                    if ((item as any)?.event === eventName)
                        return resolve(item);
                }
                cursor = dl.length;
                setTimeout(tick, intervalMs);
            };
            tick();
        },
        timeoutMs,
        `waitForDLEvent timeout: ${eventName}`,
    );
}

/* ========================= Media ========================= */

export function mediaMatcherMaxWidth(
    px: number,
    callback: (matches: boolean, mq: MediaQueryList) => void,
): () => void {
    const mq = window.matchMedia(`(max-width:${px}px)`);
    const handler = (e: MediaQueryListEvent) => callback(e.matches, mq);

    callback(mq.matches, mq);
    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
}

export function mediaMatcherMinWidth(
    px: number,
    callback: (matches: boolean, mq: MediaQueryList) => void,
): () => void {
    const mq = window.matchMedia(`(min-width:${px}px)`);
    const handler = (e: MediaQueryListEvent) => callback(e.matches, mq);

    callback(mq.matches, mq);
    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
}

/* ========================= YM ========================= */

export type YM = (
    counterId: number,
    method: "reachGoal",
    target: string,
) => void;

export function setYMTarget(
    el: Element,
    counterId: number,
    target: string,
): () => void {
    const handler = () => {
        const ymFn = (window as any).ym as YM | undefined;
        ymFn?.(counterId, "reachGoal", target);
    };
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
}

/* ========================= Scripts ========================= */

export function preloadScript(url: string, cb?: () => void): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.async = true;
        s.src = url;

        s.addEventListener("load", () => {
            s.remove();
            cb?.();
            resolve();
        });
        s.addEventListener("error", () => {
            s.remove();
            reject(new Error(`Не удалось загрузить скрипт: ${url}`));
        });

        document.head.append(s);
    });
}

/* ========================= Vimeo ========================= */

declare global {
    interface Window {
        Vimeo?: {
            Player: new (
                el: Element,
                options: Record<string, any>,
            ) => {
                play: () => Promise<void> | void;
                pause: () => Promise<void> | void;
                on: (event: string, cb: (...args: any[]) => void) => void;
                element: Element;
            };
        };
    }
}

export async function vimeoAutoPlay(
    observerOptions: IntersectionObserverInit = {},
): Promise<void> {
    const vboxes = document.querySelectorAll<HTMLElement>(
        ".vimeo-video-box [data-vimeo-vid]",
    );
    if (!vboxes.length) return;

    await preloadScript("https://player.vimeo.com/api/player.js");

    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                const target = entry.target as HTMLElement & {
                    ["vimeo-player"]?: any;
                };

                if (entry.isIntersecting) {
                    if (!target["vimeo-player"]) {
                        target["vimeo-player"] = new window.Vimeo!.Player(
                            target,
                            {
                                id: target.dataset.vimeoVid,
                                background: 1,
                                playsinline: 1,
                                autopause: 0,
                                title: 0,
                                byline: 0,
                                portrait: 0,
                                autoplay: 1,
                                muted: 1,
                            },
                        );
                        target["vimeo-player"].on("play", () => {
                            // @ts-ignore
                            (this as any).element?.parentElement?.classList.add(
                                "playback",
                            );
                        });
                    }
                    target["vimeo-player"].play?.();
                } else {
                    target["vimeo-player"]?.pause?.();
                }
            }
        },
        {threshold: 0.33, ...observerOptions},
    );

    vboxes.forEach((el) => io.observe(el));
}

export async function insertVimeoBox(
    ids: { desktopId: string | number; mobileId: string | number },
    container: Element,
): Promise<void> {
    const tpl = document.getElementById(
        "vimeoVideoBox",
    ) as HTMLTemplateElement | null;
    if (!tpl?.content) return;

    const clone = tpl.content.cloneNode(true) as DocumentFragment;

    const desktop = clone.querySelector<HTMLElement>(".hidden-on-mobile");
    const mobile = clone.querySelector<HTMLElement>(".hidden-on-desktop");

    if (desktop) desktop.dataset.vimeoVid = String(ids.desktopId);
    if (mobile) mobile.dataset.vimeoVid = String(ids.mobileId);

    container.prepend(clone);
}

/* ========================= Next.js ========================= */

export function getNextData<T = unknown>(): T | null {
    const el = document.getElementById("__NEXT_DATA__");
    try {
        if (el?.textContent) return JSON.parse(el.textContent) as T;
        return ((window as any).__NEXT_DATA__ as T) ?? null;
    } catch {
        return null;
    }
}

/* ========================= IntersectionObserver wrapper ========================= */

export function watchIntersection(
    targets: NodeLike,
    options: IntersectionObserverInit,
    yesHandler?: (el: Element, observer: IntersectionObserver) => void,
    noHandler?: (el: Element, observer: IntersectionObserver) => void,
): IntersectionObserver {
    const io = new IntersectionObserver(
        (entries, observer) => {
            for (const entry of entries) {
                (entry.isIntersecting ? yesHandler : noHandler)?.(
                    entry.target,
                    observer,
                );
            }
        },
        {threshold: 0.1, ...options},
    );

    arrayOfNodesWith(targets).forEach((node) => io.observe(node));
    return io;
}

/* ========================= localStorage expiry ========================= */

export type StorageWithExpiry<T> = { value: T; expiry: number };

export function setLocalStorageWithExpiry<T>(
    key: string,
    value: T,
    expiryInDays: number,
): void {
    const expiry = Date.now() + expiryInDays * 86400000;
    const item: StorageWithExpiry<T> = {value, expiry};
    localStorage.setItem(key, JSON.stringify(item));
}

export function getLocalStorageWithExpiry<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        const item = JSON.parse(raw) as StorageWithExpiry<T>;
        if (!item || typeof item !== "object") return null;

        if (Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    } catch {
        localStorage.removeItem(key);
        return null;
    }
}

/* ========================= Once helpers ========================= */

export function appendOnce(
    target: Element,
    element: Element,
    key = "default",
): void {
    const attr = `data-appended-${key}`;
    if (target.hasAttribute(attr)) return;
    target.append(element);
    target.setAttribute(attr, "1");
}

export function prependOnce(
    target: Element,
    element: Element,
    key = "default",
): void {
    const attr = `data-prepended-${key}`;
    if (target.hasAttribute(attr)) return;
    target.prepend(element);
    target.setAttribute(attr, "1");
}

export function insertOnce(
    target: Element,
    position: InsertPosition,
    html: string,
    key = "default",
): void {
    const attr = `data-inserted-${key}`;
    if (target.hasAttribute(attr)) return;
    target.insertAdjacentHTML(position, html);
    target.setAttribute(attr, "1");
}

/* ========================= Network ========================= */

export function endpointUrl(endpoint: string): string {
    const isLocalhost = location.hostname === "localhost";
    const host = isLocalhost
        ? "http://localhost:8010/proxy"
        : "//" + location.hostname.replace(/^(www|new)/, "b2capi");
    return `${host}${endpoint}`;
}

export async function doRequestToServer<TResp = unknown, TBody = unknown>(
    endpoint: string,
    data: TBody,
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE" = "POST",
): Promise<TResp> {
    const url = endpointUrl(endpoint);

    const resp = await fetch(url, {
        method,
        headers: {"Content-Type": "application/json;charset=utf-8"},
        body: method === "GET" ? undefined : JSON.stringify(data),
    });

    if (!resp.ok) {
        throw new Error(`API Error: ${resp.status} ${resp.statusText}`);
    }

    return (await resp.json()) as TResp;
}

/* ========================= Utils ========================= */

export function filterUniqueMatchingHotels<
    T extends { id: string | number; name: string },
>(
    responses: Array<{ result?: { locations?: T[] } }>,
    requestedNames: string[],
): T[] {
    if (!responses.length || !requestedNames.length) return [];

    const requestedSet = new Set(
        requestedNames.map((n) => n.trim().toUpperCase()).filter(Boolean),
    );

    const unique = new Map<T["id"], T>();

    for (const r of responses) {
        for (const loc of r.result?.locations ?? []) {
            const norm = loc.name.trim().toUpperCase();
            if (requestedSet.has(norm) && !unique.has(loc.id))
                unique.set(loc.id, loc);
        }
    }
    return [...unique.values()];
}

export function debounce<TArgs extends unknown[]>(
    fn: (...args: TArgs) => void,
    timeoutMs: number,
): (...args: TArgs) => void {
    let t: number | undefined;
    return (...args: TArgs) => {
        if (t) window.clearTimeout(t);
        t = window.setTimeout(() => fn(...args), timeoutMs);
    };
}

export function insertAfter(newNode: Node, referenceNode: Node): void {
    referenceNode.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
}

export function sendYandexEventOnce(
    eventName: string,
    ttlHours = 2,
    cb: () => void,
): void {
    const key = `ym_event_${eventName}`;
    const now = Date.now();
    const ttl = ttlHours * 3600_000;

    const stored = JSON.parse(localStorage.getItem(key) || "{}") as {
        timestamp?: number;
    };
    const age = now - (stored.timestamp ?? 0);
    if (age < ttl) return;

    cb();
    localStorage.setItem(key, JSON.stringify({timestamp: now}));
}

/* ========================= DataLayerWatch ========================= */

export class DataLayerWatch<
    T extends { event?: string } = AnyObject & { event?: string },
> {
    layerName: string;
    pollMs: number;
    eventHandlers: Map<string, Set<(item: T) => void>>;
    seen: number;

    private layer!: T[];
    private originalPush?: (...items: T[]) => number;
    private stopPoll?: () => void;

    constructor({layerName = "dataLayer", pollMs = 300} = {}) {
        this.layerName = layerName;
        this.pollMs = pollMs;
        this.eventHandlers = new Map();
        this.seen = 0;

        this._init();
    }

    onEvent(name: string, handler: (item: T) => void): () => void {
        if (!this.eventHandlers.has(name)) this.eventHandlers.set(name, new Set());
        this.eventHandlers.get(name)!.add(handler);

        // replay: отдать уже накопленные события этого типа
        const arr = this.layer;
        if (Array.isArray(arr) && arr.length) {
            for (const item of arr) {
                if ((item as any)?.event === name) handler(item);
            }
        }

        return () => this.eventHandlers.get(name)!.delete(handler);
    }

    destroy() {
        this.stopPoll?.();
    }

    private _init() {
        this._ensureArray();
        this._hook(this.layer);
        this._consumeExisting(); // обработаем то, что уже было (seen=0)
        this._watchReassign();
    }

    private _ensureArray() {
        const w = window as any;
        if (!Array.isArray(w[this.layerName])) w[this.layerName] = w[this.layerName] ?? [];
        this.layer = w[this.layerName] as T[];
    }

    private _hook(arr: T[]) {
        const anyArr = arr as any;
        if (!arr || anyArr.__dlwHooked) return;

        this.originalPush = arr.push.bind(arr);
        arr.push = (...items: T[]) => {
            const res = this.originalPush!(...items);
            this._consume(items);
            return res;
        };

        Object.defineProperty(arr, "__dlwHooked", {
            value: true,
            enumerable: false,
        });
    }

    private _consume(items: T[]) {
        for (const item of items) {
            const name = (item as any)?.event as string | undefined;
            if (name && this.eventHandlers.has(name)) {
                for (const h of this.eventHandlers.get(name)!) h(item);
            }
        }
        this.seen += items.length;
    }

    private _consumeExisting() {
        const arr = this.layer;
        if (Array.isArray(arr) && arr.length) this._consume(arr.slice(this.seen));
    }

    private _watchReassign() {
        const w = window as any;
        const desc = Object.getOwnPropertyDescriptor(w, this.layerName);
        const configurable = !desc || desc.configurable;

        if (configurable) {
            let current = this.layer;
            Object.defineProperty(w, this.layerName, {
                configurable: true,
                get: () => current,
                set: (next: T[]) => {
                    current = next;
                    if (!Array.isArray(next)) return;

                    this.layer = next;
                    this.seen = 0; // важно: новый массив — новый счётчик
                    this._hook(next);
                    this._consumeExisting();
                },
            });
        }

        let stopped = false;
        const tick = () => {
            if (stopped) return;

            const next = (window as any)[this.layerName];
            if (next !== this.layer && Array.isArray(next)) {
                this.layer = next;
                this.seen = 0; // важно: новый массив — новый счётчик
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


/* ========================= CoralCookieObserver ========================= */

export class CoralCookieObserver {
    key: string;
    delay: number;
    lastValue: string | null;
    callbacks: Array<
        (newValue: string | null, oldValue: string | null) => void
    >;
    private timer: number | null;

    constructor(key: string, options: { delay?: number } = {}) {
        if (!key)
            throw new Error(
                "CoralCookieObserver: cookie key must be a non-empty string.",
            );
        this.key = key;
        this.delay = options.delay ?? 1000;
        this.lastValue = this.getCookieValue();
        this.callbacks = [];
        this.timer = null;
    }

    start() {
        if (this.timer) return;
        this.timer = window.setInterval(() => this.check(), this.delay);
    }

    stop() {
        if (!this.timer) return;
        clearInterval(this.timer);
        this.timer = null;
    }

    onChange(
        callback: (newValue: string | null, oldValue: string | null) => void,
    ) {
        if (typeof callback === "function") this.callbacks.push(callback);
    }

    check() {
        const currentValue = this.getCookieValue();
        if (currentValue !== this.lastValue) {
            for (const cb of this.callbacks) cb(currentValue, this.lastValue);
            this.lastValue = currentValue;
        }
    }

    getCookieValue(): string | null {
        const cookies = document.cookie ? document.cookie.split(";") : [];
        for (const c of cookies) {
            const [k, ...rest] = c.trim().split("=");
            if (k === this.key) return decodeURIComponent(rest.join("="));
        }
        return null;
    }
}

/* ========================= ReactDomObserver (расширенный) ========================= */

export class ReactDomObserver {
    selectors: string[];
    once: boolean;
    debug: boolean;
    mode: "any" | "all";
    root: ParentNode;

    watchChild: boolean;
    watchAttributes: boolean;
    watchCharacterData: boolean;
    attributeFilter?: string[];

    onAppear: ((el: HTMLElement, selector: string) => void) | null;
    onDisappear: ((selector?: string) => void) | null;
    onAllAppear:
        | ((els: Array<HTMLElement | null>, selectors: string[]) => void)
        | null;
    onAllDisappear: (() => void) | null;

    onChildMutate:
        | ((
        el: HTMLElement,
        muts: MutationRecord[],
        n: number,
        sel: string,
    ) => void)
        | null;
    onAttributeMutation:
        | ((
        el: HTMLElement,
        muts: MutationRecord[],
        n: number,
        sel: string,
    ) => void)
        | null;
    onCharacterData:
        | ((
        el: HTMLElement,
        muts: MutationRecord[],
        n: number,
        sel: string,
    ) => void)
        | null;

    private _defer: DeferMode;
    private _queue: Array<() => void> = [];
    private _flushScheduled = false;

    private _pollMs: number;
    private _rafId = 0;
    private _pollId = 0;

    started = false;

    private _allObserved: boolean | null = null;

    private perSelector: Map<
        string,
        {
            observed: boolean;
            triggeredOnce: boolean;
            elements: Set<HTMLElement>;
            elementObserver: MutationObserver | null;
            mutationCounter: number;
        }
    >;

    private globalObserver: MutationObserver | null = null;

    constructor(
        selectors: string | string[],
        config: {
            once?: boolean;
            debug?: boolean;
            mode?: "any" | "all";
            root?: ParentNode;
            watchChild?: boolean;
            watchAttributes?: boolean;
            watchCharacterData?: boolean;
            attributeFilter?: string[];
            pollInterval?: number;
            defer?: DeferMode;

            onAppear?: (el: HTMLElement, selector: string) => void;
            onDisappear?: (selector?: string) => void;
            onAllAppear?: (
                els: Array<HTMLElement | null>,
                selectors: string[],
            ) => void;
            onAllDisappear?: () => void;

            onChildMutate?: (
                el: HTMLElement,
                muts: MutationRecord[],
                n: number,
                sel: string,
            ) => void;
            onAttributeMutation?: (
                el: HTMLElement,
                muts: MutationRecord[],
                n: number,
                sel: string,
            ) => void;
            onCharacterData?: (
                el: HTMLElement,
                muts: MutationRecord[],
                n: number,
                sel: string,
            ) => void;
        } = {},
    ) {
        const {
            once = false,
            debug = false,
            mode = "any",
            root = document.body,
            watchChild = false,
            watchAttributes = false,
            watchCharacterData = false,
            attributeFilter,
            pollInterval = 0,
            defer = "microtask",

            onAppear = null,
            onDisappear = null,
            onAllAppear = null,
            onAllDisappear = null,

            onChildMutate = null,
            onAttributeMutation = null,
            onCharacterData = null,
        } = config;

        this.selectors = Array.isArray(selectors)
            ? selectors.filter(Boolean)
            : [selectors].filter(Boolean);
        if (!this.selectors.length)
            throw new Error("ReactDomObserver: пустой список селекторов");

        this.once = !!once;
        this.debug = !!debug;
        this.mode = mode === "all" ? "all" : "any";
        this.root =
            root && (root as any).querySelectorAll ? root : document.body;

        this.watchChild = !!watchChild;
        this.watchAttributes = !!watchAttributes;
        this.watchCharacterData = !!watchCharacterData;
        this.attributeFilter =
            Array.isArray(attributeFilter) && this.watchAttributes
                ? attributeFilter
                : undefined;

        this.onAppear = onAppear;
        this.onDisappear = onDisappear;
        this.onAllAppear = onAllAppear;
        this.onAllDisappear = onAllDisappear;

        this.onChildMutate = onChildMutate;
        this.onAttributeMutation = onAttributeMutation;
        this.onCharacterData = onCharacterData;

        this._defer = defer;
        this._pollMs = Math.max(0, +pollInterval || 0);

        this.perSelector = new Map(
            this.selectors.map((s) => [
                s,
                {
                    observed: false,
                    triggeredOnce: false,
                    elements: new Set<HTMLElement>(),
                    elementObserver: null,
                    mutationCounter: 0,
                },
            ]),
        );
    }

    start = () => {
        if (this.started) return;
        this.started = true;

        this.globalObserver = new MutationObserver(this._handleGlobalMutations);
        this.globalObserver.observe(this.root, {
            childList: true,
            subtree: true,
        });

        if (this._pollMs > 0)
            this._pollId = window.setInterval(this._scanNow, this._pollMs);

        this._scanNow();
    };

    stop = () => {
        if (!this.started) return;
        this.started = false;

        this.globalObserver?.disconnect();
        this.globalObserver = null;

        if (this._rafId) cancelAnimationFrame(this._rafId);
        this._rafId = 0;

        if (this._pollId) clearInterval(this._pollId);
        this._pollId = 0;

        for (const [, st] of this.perSelector) {
            st.elementObserver?.disconnect();
            st.elementObserver = null;
        }
    };

    private _handleGlobalMutations = () => {
        if (this._rafId) return;
        this._rafId = requestAnimationFrame(() => {
            this._rafId = 0;
            this._scanNow();
        });
    };

    private _scanNow = () => {
        if (!this.started) return;

        for (const sel of this.selectors) {
            const state = this.perSelector.get(sel)!;
            const found = new Set(
                Array.from(
                    (this.root as any).querySelectorAll(sel),
                ) as HTMLElement[],
            );

            // новые элементы
            for (const el of found) {
                if (!state.elements.has(el)) {
                    state.elements.add(el);
                    this._handleAppear(sel, el, state);
                }
            }

            // удалённые элементы
            for (const el of Array.from(state.elements)) {
                if (!found.has(el) || !(this.root as any).contains(el)) {
                    state.elements.delete(el);
                }
            }

            const nowObserved = state.elements.size > 0;

            if (state.observed && !nowObserved) {
                state.observed = false;
                this._emit(this.onDisappear, sel);
            } else if (!state.observed && nowObserved) {
                state.observed = true;
            }

            // внутренний observer на первый элемент
            if (
                (this.watchChild ||
                    this.watchAttributes ||
                    this.watchCharacterData) &&
                !state.elementObserver &&
                state.elements.size
            ) {
                const firstEl = state.elements.values().next().value!;
                this._observeElementInternally(sel, firstEl, state);
            }
        }

        if (this.mode === "all") {
            const allHere = this._allPresent();
            if (this._allObserved !== allHere) {
                this._allObserved = allHere;

                if (allHere) {
                    const allEls = this._collectFirstEls();
                    this._emit(this.onAllAppear, allEls, this.selectors);
                    if (this.once) this.stop();
                } else {
                    this._emit(this.onAllDisappear);
                }
            }
        }
    };

    private _handleAppear = (
        selector: string,
        el: HTMLElement,
        state: {
            observed: boolean;
            triggeredOnce: boolean;
            elements: Set<HTMLElement>;
            elementObserver: MutationObserver | null;
            mutationCounter: number;
        },
    ) => {
        if (!this.once || !state.triggeredOnce) {
            this._emit(this.onAppear, el, selector);
            if (this.once) state.triggeredOnce = true;
        }

        if (this.once && this.mode === "any") this.stop();
    };

    private _observeElementInternally = (
        selector: string,
        el: HTMLElement,
        state: {
            observed: boolean;
            triggeredOnce: boolean;
            elements: Set<HTMLElement>;
            elementObserver: MutationObserver | null;
            mutationCounter: number;
        },
    ) => {
        if (state.elementObserver) return;

        const options: MutationObserverInit = {
            attributes: this.watchAttributes,
            childList: this.watchChild,
            characterData: this.watchCharacterData,
            subtree: true,
            attributeFilter: this.attributeFilter,
        };

        const observer = new MutationObserver((mutations) => {
            state.mutationCounter++;

            const hasChild =
                this.watchChild &&
                mutations.some((m) => m.type === "childList");
            const hasAttr =
                this.watchAttributes &&
                mutations.some((m) => m.type === "attributes");
            const hasChar =
                this.watchCharacterData &&
                mutations.some((m) => m.type === "characterData");

            if (hasChild)
                this._emit(
                    this.onChildMutate,
                    el,
                    mutations,
                    state.mutationCounter,
                    selector,
                );
            if (hasAttr)
                this._emit(
                    this.onAttributeMutation,
                    el,
                    mutations,
                    state.mutationCounter,
                    selector,
                );
            if (hasChar)
                this._emit(
                    this.onCharacterData,
                    el,
                    mutations,
                    state.mutationCounter,
                    selector,
                );
        });

        observer.observe(el, options);
        state.elementObserver = observer;
    };

    private _allPresent = () => {
        for (const [, st] of this.perSelector) if (!st.observed) return false;
        return true;
    };

    private _collectFirstEls = (): Array<HTMLElement | null> => {
        const arr: Array<HTMLElement | null> = [];
        for (const [, st] of this.perSelector)
            arr.push(st.elements.values().next().value ?? null);
        return arr;
    };

    private _emit = (cb: any, ...args: any[]) => {
        if (typeof cb !== "function") return;

        const run = () => {
            try {
                cb(...args);
            } catch (e) {
                if (this.debug)
                    console.log("[ReactDomObserver] callback error", e);
            }
        };

        if (this._defer === "sync") run();
        else {
            this._queue.push(run);
            this._scheduleFlush(this._defer);
        }
    };

    private _scheduleFlush = (mode: Exclude<DeferMode, "sync">) => {
        if (this._flushScheduled) return;
        this._flushScheduled = true;

        const flush = () => {
            this._flushScheduled = false;
            const tasks = this._queue.splice(0);
            for (const fn of tasks) fn();
        };

        if (mode === "raf") requestAnimationFrame(flush);
        else queueMicrotask(flush);
    };
}

/* ========================= SimpleReactDomObserver (упрощённый) ========================= */

export class SimpleReactDomObserver {
    selectors: string[];
    once: boolean;
    debug: boolean;
    mode: "any" | "all";
    root: ParentNode;

    onAppear: ((el: HTMLElement, selector: string) => void) | null;
    onDisappear: ((selector?: string) => void) | null;
    onAllAppear:
        | ((els: Array<HTMLElement | null>, selectors: string[]) => void)
        | null;
    onAllDisappear: (() => void) | null;

    private _defer: DeferMode;
    private _queue: Array<() => void> = [];
    private _flushScheduled = false;

    private _pollMs: number;
    private _rafId = 0;
    private _pollId = 0;

    started = false;

    private _allObserved: boolean | null = null;

    private perSelector: Map<
        string,
        {
            observed: boolean;
            triggeredOnce: boolean;
            elements: Set<HTMLElement>;
        }
    >;

    private globalObserver: MutationObserver | null = null;

    constructor(
        selectors: string | string[],
        config: {
            once?: boolean;
            debug?: boolean;
            mode?: "any" | "all";
            root?: ParentNode;
            pollInterval?: number;
            defer?: DeferMode;

            onAppear?: (el: HTMLElement, selector: string) => void;
            onDisappear?: (selector?: string) => void;
            onAllAppear?: (
                els: Array<HTMLElement | null>,
                selectors: string[],
            ) => void;
            onAllDisappear?: () => void;
        } = {},
    ) {
        const {
            once = false,
            debug = false,
            mode = "any",
            root = document.body,
            pollInterval = 0,
            defer = "microtask",

            onAppear = null,
            onDisappear = null,
            onAllAppear = null,
            onAllDisappear = null,
        } = config;

        this.selectors = Array.isArray(selectors)
            ? selectors.filter(Boolean)
            : [selectors].filter(Boolean);
        if (!this.selectors.length)
            throw new Error("SimpleReactDomObserver: пустой список селекторов");

        this.once = !!once;
        this.debug = !!debug;
        this.mode = mode === "all" ? "all" : "any";
        this.root =
            root && (root as any).querySelectorAll ? root : document.body;

        this.onAppear = onAppear;
        this.onDisappear = onDisappear;
        this.onAllAppear = onAllAppear;
        this.onAllDisappear = onAllDisappear;

        this._defer = defer;
        this._pollMs = Math.max(0, +pollInterval || 0);

        this.perSelector = new Map(
            this.selectors.map((s) => [
                s,
                {
                    observed: false,
                    triggeredOnce: false,
                    elements: new Set<HTMLElement>(),
                },
            ]),
        );
    }

    start = () => {
        if (this.started) return;
        this.started = true;

        this.globalObserver = new MutationObserver(this._handleGlobalMutations);
        this.globalObserver.observe(this.root, {
            childList: true,
            subtree: true,
        });

        if (this._pollMs > 0)
            this._pollId = window.setInterval(this._scanNow, this._pollMs);

        this._scanNow();
    };

    stop = () => {
        if (!this.started) return;
        this.started = false;

        this.globalObserver?.disconnect();
        this.globalObserver = null;

        if (this._rafId) cancelAnimationFrame(this._rafId);
        this._rafId = 0;

        if (this._pollId) clearInterval(this._pollId);
        this._pollId = 0;
    };

    refresh = () => {
        if (!this.started) return;
        this._scanNow();
    };

    private _handleGlobalMutations = () => {
        if (this._rafId) return;
        this._rafId = requestAnimationFrame(() => {
            this._rafId = 0;
            if (this.started) this._scanNow();
        });
    };

    private _scanNow = () => {
        if (!this.started) return;

        for (const sel of this.selectors) {
            const state = this.perSelector.get(sel)!;
            const found = new Set(
                Array.from(
                    (this.root as any).querySelectorAll(sel),
                ) as HTMLElement[],
            );

            for (const el of found) {
                if (!state.elements.has(el)) {
                    state.elements.add(el);
                    this._handleAppear(sel, el, state);
                }
            }

            for (const el of Array.from(state.elements)) {
                if (!found.has(el) || !(this.root as any).contains(el))
                    state.elements.delete(el);
            }

            const nowObserved = state.elements.size > 0;

            if (state.observed && !nowObserved) {
                state.observed = false;
                this._emit(this.onDisappear, sel);
            } else if (!state.observed && nowObserved) {
                state.observed = true;
            }
        }

        if (this.mode === "all") {
            const allHere = [...this.perSelector.values()].every(
                (st) => st.observed,
            );
            if (this._allObserved !== allHere) {
                this._allObserved = allHere;

                if (allHere) {
                    const els = [...this.perSelector.values()].map(
                        (st) => st.elements.values().next().value ?? null,
                    );
                    this._emit(this.onAllAppear, els, this.selectors);
                    if (this.once) this.stop();
                } else {
                    this._emit(this.onAllDisappear);
                }
            }
        }
    };

    private _handleAppear = (
        selector: string,
        el: HTMLElement,
        state: { triggeredOnce: boolean },
    ) => {
        if (!this.once || !state.triggeredOnce) {
            this._emit(this.onAppear, el, selector);
            if (this.once) state.triggeredOnce = true;
        }
        if (this.once && this.mode === "any") this.stop();
    };

    private _emit = (cb: any, ...args: any[]) => {
        if (typeof cb !== "function") return;

        const run = () => {
            try {
                cb(...args);
            } catch (e) {
                if (this.debug)
                    console.log("[SimpleReactDomObserver] callback error", e);
            }
        };

        if (this._defer === "sync") run();
        else {
            this._queue.push(run);
            this._scheduleFlush(this._defer);
        }
    };

    private _scheduleFlush = (mode: Exclude<DeferMode, "sync">) => {
        if (this._flushScheduled) return;
        this._flushScheduled = true;

        const flush = () => {
            this._flushScheduled = false;
            const tasks = this._queue.splice(0);
            for (const fn of tasks) fn();
        };

        if (mode === "raf") requestAnimationFrame(flush);
        else queueMicrotask(flush);
    };
}

export function formatPriceRub(
    value: number | string,
    withCurrency: boolean = true,
): string {
    const num = Number(value);

    // @ts-ignore
    if (!Number.isFinite(num)) return "";

    return new Intl.NumberFormat("ru-RU", {
        style: withCurrency ? "currency" : "decimal",
        currency: "RUB",
        maximumFractionDigits: 0,
    }).format(num);
}

export function observeElement(
    selector: string,
    onFound: (el: Element) => void,
    {
        root = document,
        once = true,
        subtree = true,
    }: { root?: ParentNode; once?: boolean; subtree?: boolean } = {}
) {
    const find = () => root.querySelector?.(selector);

    // сразу, если уже есть
    const el = find();
    if (el) {
        onFound(el);
        if (once) return () => {
        };
    }

    const observer = new MutationObserver(() => {
        const el = find();
        if (!el) return;
        onFound(el);
        if (once) observer.disconnect();
    });

    observer.observe(root as Node, {childList: true, subtree});

    return () => observer.disconnect();
}
