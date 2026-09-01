const directiveState = Symbol('clipboard-state');

function getText(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && typeof value.text === 'string') {
    return value.text;
  }
  return '';
}

function dispatchResult(el, type, detail) {
  el.dispatchEvent(new CustomEvent(`clipboard:${type}`, {
    bubbles: true,
    detail,
  }));
}

export default {
  mounted(el, binding) {
    const state = {value: binding.value};

    const handler = async () => {
      const text = getText(state.value);

      try {
        if (!navigator.clipboard?.writeText) {
          throw new Error('Clipboard API недоступен в текущем контексте.');
        }

        await navigator.clipboard.writeText(text);
        dispatchResult(el, 'success', {text});
      } catch (error) {
        dispatchResult(el, 'error', {text, error});
      }
    };

    el.addEventListener('click', handler);
    el[directiveState] = {
      state,
      cleanup: () => el.removeEventListener('click', handler),
    };
  },

  updated(el, binding) {
    if (el[directiveState]) el[directiveState].state.value = binding.value;
  },

  beforeUnmount(el) {
    el[directiveState]?.cleanup();
    delete el[directiveState];
  },
};
