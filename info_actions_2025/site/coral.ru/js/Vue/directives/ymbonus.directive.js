import {useIntersectionObserver} from '@vueuse/core';
import {trackBonusImpression} from '../../analytics/metrika';

const viewedPromotionIds = new Set();
const directiveState = Symbol('bonus-impression-state');
const METRIKA_RETRY_INTERVAL = 500;
const METRIKA_RETRY_LIMIT = 60;

function normalizeBinding(binding) {
  const value = binding.value ?? {};

  return {
    id: typeof value.id === 'string' ? value.id.trim() : '',
    name: typeof value.name === 'string' ? value.name.trim() : '',
    enabled: value.enabled === true,
    brand: value.brand,
  };
}

export default {
  mounted(el, binding) {
    const promotion = normalizeBinding(binding);
    if (!promotion.enabled || !promotion.id || !promotion.name || !promotion.brand) return;
    if (viewedPromotionIds.has(promotion.id)) return;

    let isVisible = false;
    let retryCount = 0;
    let retryTimer = null;
    let stopObserver = () => {};

    const clearRetry = () => {
      if (retryTimer === null) return;
      clearInterval(retryTimer);
      retryTimer = null;
    };

    const markAsViewed = () => {
      viewedPromotionIds.add(promotion.id);
      clearRetry();
      stopObserver();
    };

    const tryToTrack = () => {
      if (!isVisible || viewedPromotionIds.has(promotion.id)) return;

      const sent = trackBonusImpression({
        brand: promotion.brand,
        promotionId: promotion.id,
        promotionName: promotion.name,
      });

      if (sent) markAsViewed();
    };

    const startRetry = () => {
      if (retryTimer !== null) return;

      retryTimer = setInterval(() => {
        retryCount += 1;
        tryToTrack();

        if (retryCount >= METRIKA_RETRY_LIMIT) clearRetry();
      }, METRIKA_RETRY_INTERVAL);
    };

    const observer = useIntersectionObserver(
      el,
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (!isVisible) {
          clearRetry();
          return;
        }

        tryToTrack();
        if (!viewedPromotionIds.has(promotion.id)) startRetry();
      },
      {threshold: 0.2},
    );
    stopObserver = observer.stop;
    if (viewedPromotionIds.has(promotion.id)) stopObserver();

    el[directiveState] = () => {
      clearRetry();
      stopObserver();
      delete el[directiveState];
    };
  },

  beforeUnmount(el) {
    el[directiveState]?.();
  },
};
