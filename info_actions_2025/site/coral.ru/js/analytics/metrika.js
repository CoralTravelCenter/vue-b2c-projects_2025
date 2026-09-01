import {BRAND} from '../domain/brand';

const METRIKA_BY_BRAND = Object.freeze({
  [BRAND.CORAL]: Object.freeze({
    counterId: 96674199,
    bonusImpressionGoal: 'coral-bonus-show',
  }),
  [BRAND.SUNMAR]: Object.freeze({
    counterId: 215233,
    bonusImpressionGoal: 'sunmar-bonus-show',
  }),
});

export function trackBonusImpression({brand, promotionId, promotionName}) {
  const config = METRIKA_BY_BRAND[brand];
  if (!config || typeof window.ym !== 'function') return false;

  try {
    window.ym(config.counterId, 'reachGoal', config.bonusImpressionGoal, {
      [location.pathname]: {
        banner: promotionName,
        promotion_id: promotionId,
      },
    });
  } catch {
    return false;
  }

  return true;
}
