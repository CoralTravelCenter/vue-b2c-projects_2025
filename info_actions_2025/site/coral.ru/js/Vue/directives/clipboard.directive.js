export default {
  mounted(el, binding) {
    const getText = () => {
      const v = binding.value;
      if (typeof v === 'string') return v;
      if (v && typeof v === 'object' && 'text' in v) return v.text || '';
      return el.innerText || '';
    };

    const copyModern = async (text) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      return false;
    };

    const copyLegacy = (text) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', 'true');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      ta.style.pointerEvents = 'none';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (e) {
      }
      document.body.removeChild(ta);
      return ok;
    };

    const handler = async () => {
      const text = getText();
      let ok = false;
      let error = null;

      try {
        ok = (await copyModern(text)) || copyLegacy(text);
      } catch (e) {
        error = e;
        ok = copyLegacy(text);
      }

      el.dataset.copied = ok ? 'true' : 'false';

      el.dispatchEvent(
        new CustomEvent(ok ? 'clipboard:success' : 'clipboard:error', {
          bubbles: true,
          detail: {ok, text, error},
        })
      );

      const v = binding.value;
      if (v && typeof v === 'object') {
        if (ok && typeof v.onSuccess === 'function') v.onSuccess(text);
        if (!ok && typeof v.onError === 'function') v.onError(error);
      }
    };

    el.addEventListener('click', handler);
    el.__clipboardCleanup__ = () => {
      el.removeEventListener('click', handler);
      delete el.dataset.copied;
      delete el.__clipboardCleanup__;
    };
  },

  updated(el, binding) {
    const v = binding.value;
    const t = typeof v === 'string' ? v : (v && v.text) || el.innerText || '';
    el.dataset.clipboardText = t;
  },

  beforeUnmount(el) {
    if (el.__clipboardCleanup__) el.__clipboardCleanup__();
  },
};
