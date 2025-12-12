export function setLocalStorageWithExpiry(key, value, expiryInDays) {
  const expiryTime = Date.now() + expiryInDays * 86400000; // 24*60*60*1000
  const item = {value, expiry: expiryTime};
  localStorage.setItem(key, JSON.stringify(item));
}

export function getLocalStorageWithExpiry(key) {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const {value, expiry} = JSON.parse(itemStr);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  } catch (e) {
    console.error(`Ошибка при чтении ключа "${key}" из localStorage:`, e);
    localStorage.removeItem(key);
    return null;
  }
}

export async function hostReactAppReady(
  selector = "#__next > div",
  timeout = 300,
) {
  return new Promise((resolve) => {
    const waiter = () => {
      const host_el = document.querySelector(selector);
      if (host_el?.getBoundingClientRect().height) {
        resolve();
      } else {
        setTimeout(waiter, timeout);
      }
    };
    waiter();
  });
}

export async function waiteSelector(
  selector,
  timeout = 200,
) {
  return new Promise((resolve) => {
    const waiter = () => {
      const host_el = document.querySelector(selector);
      if (host_el) {
        resolve();
      } else {
        setTimeout(waiter, timeout);
      }
    };
    waiter();
  });
}

export async function waitForLibrary(getterFn, timeout = 200) {
  return new Promise((resolve) => {
    const waiter = () => {
      const result = getterFn();
      if (result) {
        resolve(result);
      } else {
        setTimeout(waiter, timeout);
      }
    };
    waiter();
  });
}

export function getMobileOS() {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) return 'android';
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
  return 'other';
}

export function getBrand() {
  if (location.host.includes('sunmar')) return 'sunmar';
  if (location.host.includes('coral')) return 'coral';
  return null;
}

export function mediaMatcher(size, callback) {
  const mobileWidthMediaQuery = window.matchMedia(`(min-width: ${size}px)`);
  callback(mobileWidthMediaQuery.matches);
  mobileWidthMediaQuery.addEventListener("change", (e) =>
    callback(e.matches),
  );
}

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export function copyToClipboard(text) {
  try {
    navigator.clipboard.writeText(text);
  } catch {
    throw new Error(message);
  }
}

export function setYMTarget(selector, target_id, target) {
  selector.addEventListener("click", () => {
    ym(target_id, "reachGoal", target);
  });
}

export async function preloadScript(url, cb) {
  return new Promise(resolve => {
    const script_el = document.createElement('script');
    script_el.addEventListener('load', () => {
      script_el.remove();
      typeof cb === 'function' && cb();
      resolve();
    });
    script_el.src = url;
    document.head.append(script_el);
  });
}

export async function vimeoAutoPlay(observer_options = {}) {
  const vboxes = document.querySelectorAll('.vimeo-video-box [data-vimeo-vid]');
  if (vboxes.length) {
    await preloadScript('https://player.vimeo.com/api/player.js');
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const target = entry.target;
        if (entry.isIntersecting) {
          if (!target['vimeo-player']) {
            target['vimeo-player'] = new Vimeo.Player(target, {
              id: target.dataset.vimeoVid,
              background: 1,
              playsinline: 1,
              autopause: 0,
              title: 0,
              byline: 0,
              portrait: 0,
              autoplay: 1,
              muted: 1,
            });
            target['vimeo-player'].on('play', function () {
              this.element.parentElement.classList.add('playback');
            });
          }
          target['vimeo-player'].play();
        } else {
          target['vimeo-player']?.pause();
        }
      });
    }, Object.assign({}, {threshold: .33}, observer_options));
    vboxes.forEach(box => io.observe(box));
  }
}

export async function asap(cb) {
  if (['complete', 'interactive'].includes(document.readyState)) {
    cb && cb();
    return Promise.resolve();
  }
  return new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', () => {
      cb && cb();
      resolve();
    });
  });
}

export function queryParam(p, source) {
  source ||= location.href;
  let [url, query] = source.split('?');
  query ||= '';
  const params_kv = query.split('&');
  const params = {};
  for (const kv of params_kv) {
    let [k, v] = kv.split('=');
    try {
      v = decodeURIComponent(v);
      v = JSON.parse(v);
    } catch (ex) {
    }
    params[k] = v;
  }
  if (p) {
    return params[p];
  } else {
    return params;
  }
}

export function endpointUrl(endpoint) {
  const isLocalhost = location.hostname === "localhost";
  const host = isLocalhost
    ? "http://localhost:8010/proxy"
    : "//" + location.hostname.replace(/^(www|new)/, "b2capi");
  return `${host}${endpoint}`;
}

export function params2query(p) {
  const kv = [];
  for (let [k, v] of Object.entries(p)) {
    kv.push(`${k}=${encodeURIComponent(typeof v === 'object' ? JSON.stringify(v) : v)}`);
  }
  return kv.join('&');
}

export function getNextData() {
  const config_el = document.getElementById('__NEXT_DATA__');
  return config_el ? JSON.parse(config_el.textContent) : window.__NEXT_DATA__;
}

export function arrayOfNodesWith(what) {
  var nodes;
  if (what.jquery) {
    nodes = what.toArray();
  } else if (what instanceof Array) {
    nodes = what.map(item => arrayOfNodesWith(item)).flat(Infinity);
  } else if (what instanceof Node) {
    nodes = [what];
  } else if (what instanceof NodeList || what instanceof HTMLCollection) {
    nodes = Array.from(what);
  } else if (typeof what === 'string') {
    nodes = Array.from(document.querySelectorAll(what));
  } else {
    throw "*** arrayOfNodesWith: Got something unusable as 'what' param: " + what;
  }
  return nodes;
}

export function watchIntersection(targets, options, yes_handler, no_handler) {
  const io = new IntersectionObserver(function (entries, observer) {
    for (const entry of entries) {
      entry.isIntersecting ? yes_handler?.call(this, entry.target, observer) : no_handler?.call(this, entry.target, observer);
    }
  }, {
    threshold: 1,
    ...options
  });
  for (const node of arrayOfNodesWith(targets)) {
    io.observe(node);
  }
  return io;
}

export class ReactDomObserver {
  /**
   * @param {string|string[]} selectors
   * @param {Object} [config={}]
   * @param {boolean} [config.once=false]
   * @param {boolean} [config.debug=false]
   * @param {'any'|'all'} [config.mode='any']                 // any: реагировать на любой селектор; all: когда присутствуют все
   * @param {Node} [config.root=document.body]                // область наблюдения/поиска
   * @param {boolean} [config.watchChild=false]
   * @param {boolean} [config.watchAttributes=false]
   * @param {boolean} [config.watchCharacterData=false]
   * @param {string[]} [config.attributeFilter]
   * @param {number} [config.pollInterval=0]                  // >0 включает периодический опрос DOM (страховка)
   * @param {'sync'|'microtask'|'raf'} [config.defer='microtask'] // как вызывать колбэки
   * @param {(el: HTMLElement, selector: string) => void} [config.onAppear]
   * @param {(selector?: string) => void} [config.onDisappear]
   * @param {(els: HTMLElement[], selectors: string[]) => void} [config.onAllAppear]
   * @param {() => void} [config.onAllDisappear]
   * @param {(el: HTMLElement, mutations: MutationRecord[], count: number, selector: string) => void} [config.onChildMutate]
   * @param {(el: HTMLElement, mutations: MutationRecord[], count: number, selector: string) => void} [config.onAttributeMutation]
   * @param {(el: HTMLElement, mutations: MutationRecord[], count: number, selector: string) => void} [config.onCharacterData]
   */
  constructor(selectors, config = {}) {
    const {
      once = false,
      debug = false,
      mode = 'any',
      root = document.body,
      watchChild = false,
      watchAttributes = false,
      watchCharacterData = false,
      attributeFilter,
      pollInterval = 0,
      defer = 'microtask',

      onAppear = null,
      onDisappear = null,
      onAllAppear = null,
      onAllDisappear = null,

      onChildMutate = null,
      onAttributeMutation = null,
      onCharacterData = null,
    } = config;

    // нормализуем селекторы
    this.selectors = Array.isArray(selectors) ? selectors.filter(Boolean) : [selectors].filter(Boolean);
    if (!this.selectors.length) throw new Error('ReactDomObserver: пустой список селекторов');

    // базовые настройки
    this.once = !!once;
    this.debug = !!debug;
    this.mode = mode === 'all' ? 'all' : 'any';
    this.root = root && root.nodeType ? root : document.body;

    this.watchChild = !!watchChild;
    this.watchAttributes = !!watchAttributes;
    this.watchCharacterData = !!watchCharacterData;
    this.attributeFilter = Array.isArray(attributeFilter) && this.watchAttributes ? attributeFilter : undefined;

    // колбэки
    this.onAppear = onAppear;
    this.onDisappear = onDisappear;
    this.onAllAppear = onAllAppear;
    this.onAllDisappear = onAllDisappear;
    this.onChildMutate = onChildMutate;
    this.onAttributeMutation = onAttributeMutation;
    this.onCharacterData = onCharacterData;

    // дефер исполнения колбэков
    this._defer = defer; // 'sync' | 'microtask' | 'raf'
    this._queue = [];
    this._flushScheduled = false;

    // таймеры/флаги
    this._pollMs = Math.max(0, +pollInterval || 0);
    this.started = false;
    this._rafId = 0;
    this._pollId = 0;

    // агр. состояние 'all'
    this._allObserved = null;       // null = ещё не определено; true/false — текущее групповое состояние
    this._allTriggeredOnce = false;

    // по-селекторное состояние
    // { observed: boolean, triggeredOnce: boolean, elements: Set<HTMLElement>, elementObserver: MutationObserver|null, mutationCounter: number }
    this.perSelector = new Map(
      this.selectors.map(s => [s, {
        observed: false,
        triggeredOnce: false,
        elements: new Set(),
        elementObserver: null,
        mutationCounter: 0
      }])
    );

    this.globalObserver = null;
  }

  // публичное API
  start = () => {
    if (this.started) return;
    if (!this.root || !this.root.nodeType) {
      this._log('⚠️ Нет корректного root — отложенный старт');
      requestAnimationFrame(this.start);
      return;
    }

    this.started = true;
    this._log('▶️ Start observing', {mode: this.mode, selectors: this.selectors});

    this.globalObserver = new MutationObserver(this._handleGlobalMutations);
    this.globalObserver.observe(this.root, {childList: true, subtree: true});

    if (this._pollMs > 0) {
      this._pollId = setInterval(this._scanNow, this._pollMs);
    }

    this._scanNow();
  };

  stop = () => {
    if (!this.started) return;

    this._log('⏹️ Stop observing');
    this.started = false;

    this.globalObserver?.disconnect();
    this.globalObserver = null;

    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = 0;
    }
    if (this._pollId) {
      clearInterval(this._pollId);
      this._pollId = 0;
    }

    for (const [, st] of this.perSelector) {
      st.elementObserver?.disconnect();
      st.elementObserver = null;
    }
  };

  refresh = () => this._scanNow();

  // внутрянка
  _handleGlobalMutations = () => {
    if (this._rafId) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = 0;
      this._scanNow();
    });
  };

  _scanNow = () => {
    for (const sel of this.selectors) {
      const state = /** @type {{observed:boolean,triggeredOnce:boolean,elements:Set<HTMLElement>,elementObserver:MutationObserver|null,mutationCounter:number}} */ (this.perSelector.get(sel));
      const found = new Set(this.root.querySelectorAll(sel));

      // новые элементы → onAppear
      for (const el of found) {
        if (!state.elements.has(el)) {
          state.elements.add(el);
          this._handleAppear(sel, el, state);
        }
      }

      // исчезнувшие элементы
      for (const el of [...state.elements]) {
        if (!found.has(el) || !this.root.contains(el)) {
          state.elements.delete(el);
        }
      }

      const nowObserved = state.elements.size > 0;
      if (state.observed && !nowObserved) {
        state.observed = false;
        this._log(`⛔ Disappear: ${sel}`);
        this._emit(this.onDisappear, sel); // вызов только при переходе true -> false
      } else if (!state.observed && nowObserved) {
        state.observed = true;
      }

      // внутр. наблюдение (достаточно первого элемента)
      if ((this.watchChild || this.watchAttributes || this.watchCharacterData)
        && !state.elementObserver && state.elements.size) {
        const firstEl = state.elements.values().next().value;
        this._observeElementInternally(sel, firstEl, state);
      }
    }

    // ГРУППОВОЕ СОСТОЯНИЕ (патч против бесконечных событий):
    if (this.mode === 'all') {
      const allHere = this._allPresent();
      if (this._allObserved !== allHere) {           // вызываем только при смене состояния
        this._allObserved = allHere;

        if (allHere) {
          const allEls = this._collectFirstEls();
          this._log('✅ All selectors present');
          this._emit(this.onAllAppear, allEls, this.selectors);
          if (this.once) {
            this._allTriggeredOnce = true;
            this.stop();
          }
        } else {
          this._log('⛔ Not all selectors present');
          this._emit(this.onAllDisappear);
        }
      }
    }
  };

  _handleAppear = (selector, el, state) => {
    this._log(`✅ Appear: "${selector}"`, el);

    if (!this.once || !state.triggeredOnce) {
      this._emit(this.onAppear, el, selector);
      if (this.once) state.triggeredOnce = true;
    }

    if (this.once && this.mode === 'any') {
      this.stop();
    }
  };

  _observeElementInternally = (selector, el, state) => {
    if (state.elementObserver) return;

    const options = {
      attributes: this.watchAttributes,
      childList: this.watchChild,
      characterData: this.watchCharacterData,
      subtree: true,
      attributeFilter: this.attributeFilter
    };

    state.elementObserver = new MutationObserver((mutations) => {
      // временно отключаем, чтобы не ловить собственные эффекты
      state.elementObserver.disconnect();

      try {
        state.mutationCounter++;
        const hasChild = this.watchChild && mutations.some(m => m.type === 'childList');
        const hasAttr = this.watchAttributes && mutations.some(m => m.type === 'attributes');
        const hasChar = this.watchCharacterData && mutations.some(m => m.type === 'characterData');

        if (hasChild) this._emit(this.onChildMutate, el, mutations, state.mutationCounter, selector);
        if (hasAttr) this._emit(this.onAttributeMutation, el, mutations, state.mutationCounter, selector);
        if (hasChar) this._emit(this.onCharacterData, el, mutations, state.mutationCounter, selector);
      } finally {
        if (this.started && state.elements.size) {
          const firstEl = state.elements.values().next().value || el;
          state.elementObserver.observe(firstEl, options);
        } else {
          state.elementObserver = null;
        }
      }
    });

    state.elementObserver.observe(el, options);
    this._log('🔍 Internal observer set for', selector, el);
  };

  _allPresent = () => {
    for (const [, st] of this.perSelector) if (!st.observed) return false;
    return true;
    // эквивалент: return [...this.perSelector.values()].every(st => st.observed);
  };

  _collectFirstEls = () => {
    const arr = [];
    for (const [, st] of this.perSelector) {
      arr.push(st.elements.values().next().value || null);
    }
    return arr;
  };

  // безопасная выдача колбэков (дефер + try/catch)
  _emit = (cb, ...args) => {
    if (typeof cb !== 'function') return;

    const run = () => {
      try {
        cb(...args);
      } catch (e) {
        this._log('❌ Callback error:', e);
      }
    };

    if (this._defer === 'sync') {
      run();
    } else if (this._defer === 'raf') {
      this._queue.push(run);
      this._scheduleFlush('raf');
    } else {
      // 'microtask' по умолчанию
      this._queue.push(run);
      this._scheduleFlush('microtask');
    }
  };

  _scheduleFlush = (mode) => {
    if (this._flushScheduled) return;
    this._flushScheduled = true;

    const flush = () => {
      this._flushScheduled = false;
      const tasks = this._queue.splice(0);
      for (const fn of tasks) fn();
    };

    if (mode === 'raf') {
      requestAnimationFrame(flush);
    } else {
      queueMicrotask(flush);
    }
  };

  _log = (...args) => {
    if (this.debug) console.log('[DOMObserver]', ...args);
  };
}

function randomId(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';
  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
}

export function appendOnce(target, element) {
  if (!target.hasAttribute(`[data-appended="${randomId()}"]`)) {
    target.append(element);
    target.setAttribute('data-appended', randomId());
  }
}

export function prependOnce(target, element) {
  if (!target.hasAttribute(`[data-prepended="${randomId()}"]`)) {
    target.prepend(element);
    target.setAttribute('data-prepended', randomId());
  }
}

export function insertOnce(target, position, html) {
  const hasAttr = target.hasAttribute('data-inserted');
  const isInserted = hasAttr && target.getAttribute('data-inserted')
  const id = randomId()
  if (!hasAttr && isInserted !== id) {
    target.insertAdjacentHTML(position, html);
    target.setAttribute('data-inserted', id);
  }
}

export async function doRequestToServer(endpoint, data, method = "POST") {
  try {
    const url = endpointUrl(endpoint);
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText} for ${endpoint}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in doRequestToServer for endpoint ${endpoint}:`, error);
    throw error;
  }
}

export function filterUniqueMatchingHotels(responses, requestedNames) {
  if (!responses.length || !requestedNames.length) {
    return [];
  }

  const requestedSet = new Set(
    requestedNames.map(name => name.trim().toUpperCase()).filter(Boolean)
  );

  const uniqueMap = new Map();

  responses.forEach(response => {
    response.result?.locations?.forEach(location => {
      const normalizedName = location.name.trim().toUpperCase();
      if (requestedSet.has(normalizedName) && !uniqueMap.has(location.id)) {
        uniqueMap.set(location.id, location);
      }
    });
  });

  return Array.from(uniqueMap.values());
}

export function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall

    this.lastCall = Date.now()

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer)
    }

    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
  }
}

export function insertAfter(newNode, referenceNode) {
  referenceNode.replaceWith(newNode);
}

export function sendYandexEventOnce(eventName, ttlHours = 2, cb) {
  const key = `ym_event_${eventName}`;
  const now = Date.now();
  const ttl = ttlHours * 60 * 60 * 1000;
  const stored = JSON.parse(localStorage.getItem(key) || '{}');
  const age = now - (stored.timestamp || 0);

  if (age < ttl) return; // TTL не истёк — ничего не делаем

  cb(); // вызываем переданную функцию
  localStorage.setItem(key, JSON.stringify({timestamp: now}));
}

export class CoralCookieObserver {
  constructor(key, options = {}) {
    if (typeof key !== 'string' || !key) {
      throw new Error('CoralCookieObserver: cookie key must be a non-empty string.');
    }

    this.key = key;
    this.delay = options.delay || 1000;
    this.lastValue = this.getCookieValue();
    this.callbacks = [];
    this.timer = null;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.check(), this.delay);
  }

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  onChange(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
  }

  check() {
    const currentValue = this.getCookieValue();
    if (currentValue !== this.lastValue) {
      this.callbacks.forEach(cb => cb(currentValue, this.lastValue));
      this.lastValue = currentValue;
    }
  }

  getCookieValue() {
    const cookies = document.cookie.split(';');
    for (const c of cookies) {
      const [k, ...v] = c.trim().split('=');
      if (k === this.key) {
        return decodeURIComponent(v.join('='));
      }
    }
    return undefined;
  }
}

export function generateRandomId(length = 12) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';
  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
}

export function runOncePerSession(key = "codeExecuted") {
  if (sessionStorage.getItem(key)) {
    return false; // уже запускали в этой сессии
  }
  sessionStorage.setItem(key, "true");
  return true; // первый запуск
}

export class ClickOutside {
  /**
   * @param {string} selector                   - селектор элемента
   * @param {(evt: Event) => void} callback     - вызывается при клике вне
   * @param {Object} [options]
   * @param {(HTMLElement|string|((evt: Event)=>boolean))[]} [options.ignore=[]]
   * @param {boolean} [options.capture=true]
   * @param {boolean} [options.once=false]
   */
  constructor(selector, callback, {ignore = [], capture = true, once = false} = {}) {
    if (typeof selector !== 'string') {
      throw new TypeError('ClickOutside: "selector" должен быть строкой');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('ClickOutside: "callback" должен быть функцией');
    }

    this.selector = selector;
    this.element = document.querySelector(selector) || null;
    this.callback = callback;
    this.ignore = ignore;
    this.capture = capture;
    this.once = once;

    this._handler = this._handler.bind(this);
    document.addEventListener('click', this._handler, this.capture);
    this._listening = true;
  }

  /** Обновить селектор (например, если элемент заменили) */
  setSelector(selector) {
    this.selector = selector;
    this.element = document.querySelector(selector) || null;
  }

  /** Снять слушатель */
  destroy() {
    if (!this._listening) return;
    document.removeEventListener('click', this._handler, this.capture);
    this._listening = false;
  }

  _handler(evt) {
    if (!this.element) {
      this.element = document.querySelector(this.selector) || null;
      if (!this.element) return; // элемента ещё нет в DOM
    }

    if (!this._isOutside(evt)) return;

    this.callback(evt);
    if (this.once) this.destroy();
  }

  _isOutside(evt) {
    const el = this.element;
    if (!el) return false;

    const path = typeof evt.composedPath === 'function' ? evt.composedPath() : this._buildPath(evt);
    if (path.includes(el) || el.contains(evt.target)) return false;

    for (const ig of this.ignore) {
      if (typeof ig === 'function' && ig(evt)) return false;
      if (typeof ig === 'string' && evt.target?.closest?.(ig)) return false;
      if (ig instanceof HTMLElement && (path.includes(ig) || ig.contains(evt.target))) return false;
    }
    return true;
  }

  _buildPath(evt) {
    const path = [];
    let node = evt.target;
    while (node) {
      path.push(node);
      node = node.parentNode || node.host || null;
    }
    path.push(window);
    return path;
  }
}

export function waitForDLEvent(eventName, intervalMs = 300) {
  return new Promise((resolve) => {
    window.dataLayer = window.dataLayer || [];
    let cursor = 0;

    const timerId = setInterval(scan, intervalMs);

    function scan() {
      const dl = window.dataLayer || [];
      for (let i = cursor; i < dl.length; i++) {
        const item = dl[i];
        if (item?.event === eventName) {
          clearInterval(timerId);
          return resolve(item);
        }
      }
      cursor = dl.length; // сдвигаем указатель на конец
    }

    scan();
  });
}

export function waitForWindowVar(name, intervalMs = 300) {
  return new Promise((resolve) => {
    const check = () => {
      const val = window[name];
      if (val) {
        resolve(val);
      } else {
        setTimeout(check, intervalMs);
      }
    };
    check();
  });
}

export class SimpleReactDomObserver {
  /**
   * @param {string|string[]} selectors
   * @param {Object} [config={}]
   * @param {boolean} [config.once=false]
   * @param {boolean} [config.debug=false]
   * @param {'any'|'all'} [config.mode='any']                 // any: реагировать на любой селектор; all: когда присутствуют все
   * @param {Node} [config.root=document.body]                // корень наблюдения
   * @param {number} [config.pollInterval=0]                  // >0 включает периодический опрос DOM
   * @param {'sync'|'microtask'|'raf'} [config.defer='microtask'] // как вызывать колбэки
   * @param {(el: HTMLElement, selector: string) => void} [config.onAppear]
   * @param {(selector?: string) => void} [config.onDisappear]
   * @param {(els: HTMLElement[], selectors: string[]) => void} [config.onAllAppear]
   * @param {() => void} [config.onAllDisappear]
   */
  constructor(selectors, config = {}) {
    const {
      once = false,
      debug = false,
      mode = 'any',
      root = document.body,
      pollInterval = 0,
      defer = 'microtask',

      onAppear = null,
      onDisappear = null,
      onAllAppear = null,
      onAllDisappear = null,
    } = config;

    // нормализуем селекторы
    this.selectors = Array.isArray(selectors)
      ? selectors.filter(Boolean)
      : [selectors].filter(Boolean);

    if (!this.selectors.length) {
      throw new Error('SimpleReactDomObserver: пустой список селекторов');
    }

    // базовые настройки
    this.once = !!once;
    this.debug = !!debug;
    this.mode = mode === 'all' ? 'all' : 'any';
    this.root = root && root.nodeType ? root : document.body;

    // колбэки
    this.onAppear = onAppear;
    this.onDisappear = onDisappear;
    this.onAllAppear = onAllAppear;
    this.onAllDisappear = onAllDisappear;

    // дефер колбэков
    this._defer = defer; // 'sync' | 'microtask' | 'raf'
    this._queue = [];
    this._flushScheduled = false;

    // таймеры/флаги
    this._pollMs = Math.max(0, +pollInterval || 0);
    this.started = false;
    this._rafId = 0;
    this._pollId = 0;

    // состояние для режима 'all'
    this._allObserved = null;       // null = ещё не определено; true/false — текущее групповое состояние

    // по-селекторное состояние
    // { observed: boolean, triggeredOnce: boolean, elements: Set<HTMLElement> }
    this.perSelector = new Map(
      this.selectors.map(s => [s, {
        observed: false,
        triggeredOnce: false,
        elements: new Set(),
      }])
    );

    this.globalObserver = null;
  }

  // публичное API
  start = () => {
    if (this.started) return;

    if (!this.root || !this.root.nodeType) {
      this._log('⚠️ Нет корректного root — отложенный старт');
      requestAnimationFrame(this.start);
      return;
    }

    this.started = true;
    this._log('▶️ Start observing', {mode: this.mode, selectors: this.selectors});

    this.globalObserver = new MutationObserver(this._handleGlobalMutations);
    this.globalObserver.observe(this.root, {childList: true, subtree: true});

    if (this._pollMs > 0) {
      this._pollId = setInterval(this._scanNow, this._pollMs);
    }

    this._scanNow();
  };

  stop = () => {
    if (!this.started) return;

    this._log('⏹️ Stop observing');
    this.started = false;

    this.globalObserver?.disconnect();
    this.globalObserver = null;

    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = 0;
    }
    if (this._pollId) {
      clearInterval(this._pollId);
      this._pollId = 0;
    }
  };

  refresh = () => {
    if (!this.started) return;
    this._scanNow();
  };

  // внутрянка
  _handleGlobalMutations = () => {
    if (this._rafId) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = 0;
      if (this.started) this._scanNow();
    });
  };

  _scanNow = () => {
    if (!this.started) return;

    for (const sel of this.selectors) {
      const state = /** @type {{observed:boolean,triggeredOnce:boolean,elements:Set<HTMLElement>}} */ (
        this.perSelector.get(sel)
      );

      const found = new Set(this.root.querySelectorAll(sel));

      // новые элементы → onAppear
      for (const el of found) {
        if (!state.elements.has(el)) {
          state.elements.add(el);
          this._handleAppear(sel, el, state);
        }
      }

      // исчезнувшие элементы
      for (const el of [...state.elements]) {
        if (!found.has(el) || !this.root.contains(el)) {
          state.elements.delete(el);
        }
      }

      const nowObserved = state.elements.size > 0;

      if (state.observed && !nowObserved) {
        state.observed = false;
        this._log(`⛔ Disappear: ${sel}`);
        this._emit(this.onDisappear, sel); // вызов только при переходе true -> false
      } else if (!state.observed && nowObserved) {
        state.observed = true;
      }
    }

    // групповое состояние для mode='all'
    if (this.mode === 'all') {
      const allHere = this._allPresent();
      if (this._allObserved !== allHere) {
        this._allObserved = allHere;

        if (allHere) {
          const allEls = this._collectFirstEls();
          this._log('✅ All selectors present');
          this._emit(this.onAllAppear, allEls, this.selectors);
          if (this.once) {
            this.stop();
          }
        } else {
          this._log('⛔ Not all selectors present');
          this._emit(this.onAllDisappear);
        }
      }
    }
  };

  _handleAppear = (selector, el, state) => {
    this._log(`✅ Appear: "${selector}"`, el);

    if (!this.once || !state.triggeredOnce) {
      this._emit(this.onAppear, el, selector);
      if (this.once) state.triggeredOnce = true;
    }

    if (this.once && this.mode === 'any') {
      this.stop();
    }
  };

  _allPresent = () =>
    [...this.perSelector.values()].every(st => st.observed);

  _collectFirstEls = () => {
    const arr = [];
    for (const [, st] of this.perSelector) {
      arr.push(st.elements.values().next().value || null);
    }
    return arr;
  };

  // безопасная выдача колбэков (дефер + try/catch)
  _emit = (cb, ...args) => {
    if (typeof cb !== 'function') return;

    const run = () => {
      try {
        cb(...args);
      } catch (e) {
        this._log('❌ Callback error:', e);
      }
    };

    if (this._defer === 'sync') {
      run();
    } else if (this._defer === 'raf') {
      this._queue.push(run);
      this._scheduleFlush('raf');
    } else {
      // 'microtask' по умолчанию
      this._queue.push(run);
      this._scheduleFlush('microtask');
    }
  };

  _scheduleFlush = (mode) => {
    if (this._flushScheduled) return;
    this._flushScheduled = true;

    const flush = () => {
      this._flushScheduled = false;
      const tasks = this._queue.splice(0);
      for (const fn of tasks) fn();
    };

    if (mode === 'raf') {
      requestAnimationFrame(flush);
    } else {
      queueMicrotask(flush);
    }
  };

  _log = (...args) => {
    if (this.debug) console.log('[SimpleDOMObserver]', ...args);
  };
}

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
