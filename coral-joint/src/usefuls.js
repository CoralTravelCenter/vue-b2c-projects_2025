export function pluralizeNights(nightsCount) {
  const nights = ['ночь', 'ночи', 'ночей'];

  if (nightsCount % 10 === 1 && nightsCount % 100 !== 11) {
    return nights[0]; // 1 ночь
  } else if (nightsCount % 10 >= 2 && nightsCount % 10 <= 4 && (nightsCount % 100 < 10 || nightsCount % 100 >= 20)) {
    return nights[1]; // 2, 3, 4 ночи
  } else {
    return nights[2]; // 0, 5-20, 25-30 и т.д. ночей
  }
}

export function formatDate(date) {
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided to formatDate");
  }
  return date.toISOString().split("T")[0];
}

export function findObjectByKey(targetKey, obj) {
  if (obj.hasOwnProperty(targetKey)) {
    for (const key of Object.keys(obj)) {
      if (key === targetKey) return obj[key];
    }
  }
}

export function formattedDates(datesArr) {
  return datesArr.map(date => {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
  }).join(' - ');
}
