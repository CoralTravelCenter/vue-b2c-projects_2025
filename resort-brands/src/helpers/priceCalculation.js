export default function priceCalculation(price) {
  const value = Math.floor(price / 7 / 2)
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(value)
}
