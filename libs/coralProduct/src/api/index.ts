export const PACKAGE_ENDPOINTS = {
	LIST_ARRIVAL_LOCATIONS: "/PackageTourHotelProduct/ListArrivalLocations",
	LIST_AVAILABLE_DATES: "/PackageTourHotelProduct/ListAvailableDates",
	LIST_AVAILABLE_NIGHTS: "/PackageTourHotelProduct/ListAvailableNights",
	PRICE_SEARCH_ENCRYPT: "/PackageTourHotelProduct/PriceSearchEncrypt",
};

export const ONLYHOTEL_ENDPOINTS = {
	LIST_ARRIVAL_LOCATIONS: "/PackageTourHotelProduct/ListArrivalLocations",
	PRICE_SEARCH_ENCRYPT: "/PackageTourHotelProduct/PriceSearchEncrypt",
};

function endpointUrl(endpoint: string): string {
	const isLocalhost = location.hostname === "localhost";
	const host = isLocalhost
		? "http://localhost:8010/proxy"
		: "//" + location.hostname.replace(/^(www|new)/, "b2capi");

	return `${host}${endpoint}`;
}

export async function doRequestToServer<T = any>(
	endpoint: string,
	data: any,
	method: string = "POST"
): Promise<T> {
	try {
		const url = endpointUrl(endpoint);

		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			console.error(`API Error: ${response.status} ${response.statusText} for ${endpoint}`);
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error(`Error in doRequestToServer for endpoint ${endpoint}:`, error);
		throw error;
	}
}

