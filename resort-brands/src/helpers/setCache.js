/** Первый бренд по стране из _resortBrands */
export function defaultBrandFor(resortBrands, country) {
  const c = resortBrands.countries.find(x => x.name === country);
  return (c && c.brands && c.brands[0] && c.brands[0].name) || "";
}

/** Инициализация фильтров, если пусто */
export function ensureFiltersInit(filtersRef, defaultCountry, defaultBrand) {
  const v = filtersRef.value;
  if (!v || typeof v !== "object") {
    filtersRef.value = {country: defaultCountry, brand: defaultBrand};
    return;
  }
  const country = v.country || defaultCountry;
  const brand = v.brand || defaultBrand;
  filtersRef.value = {country, brand};
}

/** Геттеры */
export function readCountry(filtersRef, fallback) {
  return (filtersRef.value && filtersRef.value.country) || fallback;
}

export function readBrand(filtersRef, fallback) {
  return (filtersRef.value && filtersRef.value.brand) || fallback;
}

/** Сеттеры */
export function writeCountry(filtersRef, country) {
  const prev = filtersRef.value || {};
  filtersRef.value = {...prev, country};
}

export function writeBrand(filtersRef, brand) {
  const prev = filtersRef.value || {};
  filtersRef.value = {...prev, brand};
}
