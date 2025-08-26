export default {
  mounted(el, binding) {
    // проверяем только на null/undefined
    const stockName = binding.value != null ? String(binding.value).trim() : null;
    if (!stockName) return; // пусто → не инициализируем

    const isCoral = location.host.includes('coral');
    const siteCfg = isCoral
      ? {counterId: 96674199, goal: 'entry-point'}
      : {counterId: 215233, goal: 'entry-point'};

    const namePoint = el.getAttribute?.('data-name-point') || 'promo_page';

    const params = {
      name_stock: {
        [stockName]: {name_point: namePoint},
      },
    };

    if (el.__entryCleanup__) el.__entryCleanup__();

    const onClick = () => {
      // отправляем Метрику (если доступна)
      if (typeof window.ym === 'function') {
        window.ym(siteCfg.counterId, 'reachGoal', siteCfg.goal, params);
      }

      // кидаем наружу событие redirect
      const href = el.getAttribute('href') || '';
      const target = (el.getAttribute('target') || '_self').toLowerCase();
      el.dispatchEvent(
        new CustomEvent('redirect', {
          bubbles: true,
          detail: {href, target, stock: stockName},
        })
      );
    };

    el.addEventListener('click', onClick, {passive: true});
    el.__entryCleanup__ = () => el.removeEventListener('click', onClick);
  },

  unmounted(el) {
    el.__entryCleanup__?.();
    el.__entryCleanup__ = undefined;
  },
};
