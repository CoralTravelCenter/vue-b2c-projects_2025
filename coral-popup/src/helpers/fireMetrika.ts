export default function fireMetrika(ymMetrika) {
    if (!ymMetrika) return
    try {
        new Function(ymMetrika)()
    } catch (e) {
        console.warn('Ошибка выполнения ymMetrika:', e)
    }
}
