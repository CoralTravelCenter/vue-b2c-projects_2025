export interface CoralProduct {
	mode: string,
	hotels: string[],
	nights: number,
	lookup: number,
	getArrivalLocations: () => Promise<any[]>
}