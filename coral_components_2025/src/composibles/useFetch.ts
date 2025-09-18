export default async function useFetch(
    url: string,
    data: any
): Promise<any> {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
        }
        return await res.json()
    } catch (error) {
        console.error("Fetch error:", error)
        return null
    }
}
