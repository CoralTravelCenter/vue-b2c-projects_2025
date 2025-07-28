export function filterUniqueMatchingHotels(
	responses: Array<OnlyHotelArrivalLocationResponse | PackageArrivalLocationResponse>,
	requestedNames: string[]
): ArrivalLocation[] {
	if (!responses.length || !requestedNames.length) return [];

	const requestedSet = new Set(
		requestedNames.map(name => name.trim().toUpperCase()).filter(Boolean)
	);
	if (requestedSet.size === 0) return [];

	const uniqueLocations = new Map<string, ArrivalLocation>();

	for (const {result} of responses) {
		const locations = result?.locations;
		if (!Array.isArray(locations)) continue;

		for (const location of locations) {
			const name = location?.name?.trim().toUpperCase();
			if (name && requestedSet.has(name)) {
				uniqueLocations.set(location.id, location);
			}
		}
	}

	return Array.from(uniqueLocations.values());
}
