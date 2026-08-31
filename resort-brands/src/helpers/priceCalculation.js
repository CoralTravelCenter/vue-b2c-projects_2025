export default function priceCalculation(price, tourists = 2) {
  const numericPrice = Number(price)

  if (!Number.isFinite(numericPrice) || numericPrice <= 0 ||
      !Number.isFinite(tourists) || tourists <= 0) {
    return null
  }

  const value = Math.floor(numericPrice / tourists)
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(value)
}
