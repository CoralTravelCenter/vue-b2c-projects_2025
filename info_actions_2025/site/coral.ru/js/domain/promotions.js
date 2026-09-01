const ALL_FILTER = 'Все акции';
const ALLOWED_LINE_BREAK = /<br\s*\/?>/gi;

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function sanitizePromotionHtml(value) {
  return normalizeString(value)
    .split(ALLOWED_LINE_BREAK)
    .map(escapeHtml)
    .join('<br>');
}

function htmlToText(value) {
  return normalizeString(value).replace(ALLOWED_LINE_BREAK, ' ');
}

function normalizeFilters(rawPromotion) {
  const rawFilters = rawPromotion?.filters ?? rawPromotion?.filter ?? [];
  const filters = Array.isArray(rawFilters)
    ? rawFilters
    : String(rawFilters).split(',');

  return [...new Set(filters.map(normalizeString).filter(Boolean))];
}

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function createPromotionId(rawPromotion) {
  const explicitId = normalizeString(rawPromotion?.id);
  if (explicitId) return explicitId;

  const identity = [rawPromotion?.name, rawPromotion?.url, rawPromotion?.visual]
    .map(normalizeString)
    .join('|');

  return `promotion-${hashString(identity)}`;
}

function isBonusPromotion(rawPromotion, filters) {
  const explicitValue = rawPromotion?.analytics?.bonusImpression;
  if (typeof explicitValue === 'boolean') return explicitValue;

  const legacyIdentity = [
    ...filters,
    rawPromotion?.name,
    rawPromotion?.url,
  ].map(normalizeString).join(' ');

  return /(coralbonus|sunmarbonus|(?:^|[/?&_-])cb(?:[/?&=_-]|$))/i.test(legacyIdentity);
}

function normalizePromotion(rawPromotion, sourceIndex) {
  const name = normalizeString(rawPromotion?.name);
  const visual = normalizeString(rawPromotion?.visual);
  const filters = normalizeFilters(rawPromotion);

  if (!name || !visual) {
    console.warn(
      `[promotions] Запись ${sourceIndex} пропущена: обязательные поля name/visual отсутствуют.`,
      rawPromotion,
    );
    return null;
  }

  const explicitId = normalizeString(rawPromotion?.id);
  const id = createPromotionId(rawPromotion);

  return Object.freeze({
    id,
    name,
    nameHtml: sanitizePromotionHtml(name),
    nameText: htmlToText(name),
    descriptionHtml: sanitizePromotionHtml(rawPromotion?.description),
    visual,
    url: normalizeString(rawPromotion?.url),
    filters,
    legal: normalizeString(rawPromotion?.legal ?? rawPromotion?.ligal),
    erid: normalizeString(rawPromotion?.erid),
    appErid: normalizeString(rawPromotion?.app_erid),
    promoStart: normalizeString(rawPromotion?.promo_start),
    promoEnd: normalizeString(rawPromotion?.promo_end),
    promoEndText: normalizeString(rawPromotion?.promo_end_text),
    analytics: Object.freeze({
      bonusImpression: isBonusPromotion(rawPromotion, filters),
    }),
  });
}

export function normalizePromotions(rawPromotions) {
  if (!Array.isArray(rawPromotions)) {
    console.warn('[promotions] Конфиг отсутствует или не является массивом.');
    return [];
  }

  const ids = new Set();
  let fallbackIdCount = 0;

  const promotions = rawPromotions.flatMap((rawPromotion, sourceIndex) => {
    const promotion = normalizePromotion(rawPromotion, sourceIndex);
    if (!promotion) return [];

    if (!normalizeString(rawPromotion?.id)) fallbackIdCount += 1;

    if (ids.has(promotion.id)) {
      console.warn(`[promotions] Дублирующийся id ${promotion.id}; запись ${sourceIndex} пропущена.`);
      return [];
    }

    ids.add(promotion.id);
    return [promotion];
  });

  if (fallbackIdCount > 0) {
    console.warn(
      `[promotions] У ${fallbackIdCount} записей отсутствует id; использованы детерминированные fallback ID.`,
    );
  }

  return promotions;
}

export {ALL_FILTER};
