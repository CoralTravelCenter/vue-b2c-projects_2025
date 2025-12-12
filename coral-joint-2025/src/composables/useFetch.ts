export default async function useFetch<T>(
    url: string,
    data: unknown
): Promise<T | null> {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return (await response.json()) as T;
    } catch (error) {
        console.error("useFetch error:", error);
        return null;
    }
}
