// v-promo-impression.js
import {useIntersectionObserver} from '@vueuse/core';

const seen = new WeakSet();

function getSiteConfig() {
  const isCoral = location.host.includes('coral');
  return isCoral
    ? {site: 'coral', counterId: 96674199, goal: 'coral-bonus-show'}
    : {site: 'sunmar', counterId: 215233, goal: 'sunmar-bonus-show'};
}

export default {
  mounted(el, binding) {
    // ждём только строку — название акции
    const bannerName =
      typeof binding.value === 'string' ? binding.value.trim() : '';

    if (!bannerName || seen.has(el)) return;

    const {counterId, goal} = getSiteConfig();
    const threshold = 0.2; // фиксируем порог (можно поменять при желании)

    const {stop} = useIntersectionObserver(
      el,
      ([entry]) => {
        if (!entry.isIntersecting || seen.has(el)) return;

        seen.add(el);

        if (typeof window.ym === 'function') {
          const yaParams = {
            [location.pathname]: {banner: bannerName},
          };
          window.ym(counterId, 'reachGoal', goal, yaParams);
        }

        stop();
        el.__ymStop = undefined;
      },
      {threshold}
    );

    el.__ymStop = stop;
  },

  unmounted(el) {
    el.__ymStop?.();
    el.__ymStop = undefined;
    seen.delete(el);
  },
};
