export const PROMOTION_CLICK_EVENT = 'promotion-card:click';

/**
 * Публичный контракт между Vue-виджетом и внешним аналитическим скриптом.
 * Событие синхронное и не отменяет стандартный переход по ссылке.
 */
export function dispatchPromotionClick({promotion, brand, position, currentFilter, destination}) {
  window.dispatchEvent(new CustomEvent(PROMOTION_CLICK_EVENT, {
    detail: {
      version: 1,
      promotion: {
        id: promotion.id,
        name: promotion.nameText,
        url: promotion.url,
        filters: [...promotion.filters],
      },
      context: {
        brand,
        position,
        currentFilter,
        destination,
      },
    },
  }));
}
