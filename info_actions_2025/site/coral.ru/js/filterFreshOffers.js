import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const PROMOTION_TIMEZONE = 'Europe/Moscow';
const PROMOTION_DATE_FORMAT = 'YYYY-MM-DD HH:mm';

function parsePromotionDate(value) {
  return dayjs.tz(value, PROMOTION_DATE_FORMAT, PROMOTION_TIMEZONE);
}

/**
 * Фильтрует предложения, оставляя только те, которые являются "свежими" (действующими в данный момент).
 * @param {object} o Объект, представляющий предложение.  Должен содержать свойства promo_start и promo_end (необязательно).
 * @returns {boolean} true, если предложение "свежее", false - если нет.
 */
export function filterFreshOffers(promotion, currentTime = new Date()) {
  const start = promotion.promoStart
    ? parsePromotionDate(promotion.promoStart)
    : null;
  const end = promotion.promoEnd
    ? parsePromotionDate(promotion.promoEnd)
    : null;
  const now = dayjs(currentTime);

  if (start && !start.isValid()) return false;
  if (end && !end.isValid()) return false;

  return (!start || !start.isAfter(now)) && (!end || !end.isBefore(now));
}
