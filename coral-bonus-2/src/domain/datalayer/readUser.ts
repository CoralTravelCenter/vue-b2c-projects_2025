export function isNewUserFromDataLayer(): boolean {
    const dl = (window as any).dataLayer || []

    for (let i = dl.length - 1; i >= 0; i--) {
        const entry = dl[i]
        if (entry && Object.prototype.hasOwnProperty.call(entry, 'user_id')) {
            const id = entry.user_id
            return !(id && String(id).trim().length > 0)
        }
    }

    return true
}
