import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/**
 * Фильтрует предложения, оставляя только те, которые являются "свежими" (действующими в данный момент).
 * @param {object} o Объект, представляющий предложение.  Должен содержать свойства promo_start и promo_end (необязательно).
 * @returns {boolean} true, если предложение "свежее", false - если нет.
 */
export function filterFreshOffers(o) {
  const now = dayjs(); // Получаем текущую дату и время

  // Если нет ни даты начала, ни даты окончания, считаем предложение действующим
  if (!o.promo_start && !o.promo_end) return true;

  // Пытаемся разобрать строки promo_start и promo_end в объекты dayjs.
  // Если свойство отсутствует, присваиваем null.
  const start = o.promo_start ? dayjs(o.promo_start, 'YYYY-MM-DD HH:mm') : null;
  const end = o.promo_end ? dayjs(o.promo_end, 'YYYY-MM-DD HH:mm') : null;

  // Если дата начала указана, но недействительна, считаем предложение устаревшим
  if (start && !start.isValid()) return false;

  // Если дата окончания указана, но недействительна, считаем предложение устаревшим
  if (end && !end.isValid()) return false;

  // Определяем, началась ли акция:
  // - Если дата начала не указана, то акция считается начавшейся.
  // - Иначе, акция считается начавшейся, если текущее время совпадает с временем начала ИЛИ текущее время позже времени начала.
  const isStarted = !start || start.isSame(now, "minute") || start.isBefore(now, "minute");

  // Определяем, не закончилась ли акция:
  // - Если дата окончания не указана, то акция считается не закончившейся.
  // - Иначе, акция считается не закончившейся, если текущее время совпадает с временем окончания ИЛИ текущее время раньше времени окончания.
  const isNotEnded = !end || end.isSame(now, "minute") || end.isAfter(now, "minute");

  // Предложение считается "свежим" только если оно уже началось И еще не закончилось.
  return isStarted && isNotEnded;
}
