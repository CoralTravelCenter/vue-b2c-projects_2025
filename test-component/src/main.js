// import {defineCustomElement} from "vue";
// import c from './MyComponent.ce.vue'
//
// const componentName = 'coral-test-component';
// const definedComponent = defineCustomElement(c)
// if (!customElements.get(componentName)) {
//   customElements.define(componentName, definedComponent)
// }

// (async () => {
//   await customElements.whenDefined(componentName)
//
//
//   document.querySelector('#monkey-app').insertAdjacentHTML('afterbegin', `
//     <coral-test-component></coral-test-component>
//   `)
// })()


(() => {
  if (window.__coralVueLoaderStarted) return;
  window.__coralVueLoaderStarted = true;

  const CONFIG = {
    waitTimeoutMs: 5000,
    tagPrefix: "CORAL-",
    globalDependencies: {
      Vue: [
        "https://b2ccdn.coral.ru/content/lib/common/vue/vueruntimeglobalprod.js",
      ],
    },
    runtimes: [
      "https://b2ccdn.coral.ru/content/user-scripts/test-component-2.js",
    ],
  };

  const loadedOnce = {value: false};
  const scriptPromises = new Map();

  const loadScript = (url) => {
    if (!url) return Promise.resolve();
    if (scriptPromises.has(url)) return scriptPromises.get(url);

    const p = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.async = false;
      s.onload = () => {
        s.remove();
        resolve();
      };
      s.onerror = () => {
        s.remove();
        reject(new Error(`Failed to load: ${url}`));
      };
      s.src = url;
      document.head.appendChild(s);
    });

    scriptPromises.set(url, p);
    return p;
  };

  const loadMany = async (urls, sequential = true) => {
    const list = (Array.isArray(urls) ? urls : [urls]).filter(Boolean);
    if (!list.length) return;

    if (!sequential) {
      await Promise.all(list.map(loadScript));
      return;
    }

    for (const u of list) await loadScript(u);
  };

  const ensureGlobal = async (globalName, urls) => {
    if (!globalName) {
      await loadMany(urls, true);
      return;
    }
    if (globalThis[globalName]) return;

    await loadMany(urls, true);

    if (!globalThis[globalName]) {
      console.warn(`[coral-vue loader] "${globalName}" still not found on window after load.`);
    }
  };

  const hasCoralTag = (node, tagPrefix) => {
    if (!node) return false;

    const w = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
    let n = w.currentNode;

    while (n) {
      if (n.tagName && n.tagName.startsWith(tagPrefix)) return true;
      n = w.nextNode();
    }
    return false;
  };

  const waitForCoralTag = (tagPrefix, timeoutMs) =>
    new Promise((resolve) => {
      const root = document.documentElement;
      if (!root) return resolve(false);

      if (hasCoralTag(root, tagPrefix)) return resolve(true);

      const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node && node.nodeType === 1 && hasCoralTag(node, tagPrefix)) {
              obs.disconnect();
              resolve(true);
              return;
            }
          }
        }
      });

      obs.observe(root, {childList: true, subtree: true});

      if (timeoutMs > 0) {
        setTimeout(() => {
          obs.disconnect();
          resolve(false);
        }, timeoutMs);
      }
    });

  (async () => {
    await hostReactAppReady();
    const found = await waitForCoralTag(CONFIG.tagPrefix, CONFIG.waitTimeoutMs);
    if (!found) return;
    if (loadedOnce.value) return;
    loadedOnce.value = true;
    for (const [globalName, urls] of Object.entries(CONFIG.globalDependencies || {})) {
      await ensureGlobal(globalName, urls);
    }
    await loadMany(CONFIG.runtimes || [], true);
  })().catch((e) => console.error("[coral-vue loader] error:", e));
})();
