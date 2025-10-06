export function getParsedRating(rawRating) {
  if (rawRating.includes('*')) {
    const numeric = rawRating.replace('*', '').trim();
    const num = parseInt(numeric, 10);
    return isNaN(num) ? null : num;
  }
  return rawRating;
}
