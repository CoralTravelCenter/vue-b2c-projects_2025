import {doRequestToServer, ONLYHOTEL_ENDPOINTS} from "@/api";
import {filterUniqueMatchingHotels} from "@/utils";

export class CoralProduct implements CoralProduct {
	mode: string;
	hotels: string[];
	nights: number;
	lookup: number;

	constructor(settings: CoralProduct) {
		this.mode = settings.mode;
		this.hotels = settings.hotels;
		this.nights = settings.nights;
		this.lookup = settings.lookup;
		this.fetchFromPriceSearch()
	}

	private async getArrivalLocations(): Promise<any[]> {
		if (!this.hotels.length) {
			throw new Error("Hotel names array cannot be empty");
		}

		const trimmedNames = this.hotels.map(name => name.trim());

		switch (this.mode) {
			case "onlyhotel":
				return await this.fetchFromOnlyHotel(trimmedNames);
			default:
				throw new Error(`Unsupported mode: ${this.mode}`);
		}
	}

	private async fetchFromPriceSearch(arrivalLocatios: ArrivalLocatios[]) {
		return await doRequestToServer(
			ONLYHOTEL_ENDPOINTS.LIST_ARRIVAL_LOCATIONS,
			{
				beginDates: dates,
				arrivalLocations: this.getArrivalLocations(),
				nights: [{value: this.nights}],
				roomCriterias: [
					{
						passengers: [
							{age: 20, passengerType: 0},
							{age: 20, passengerType: 0},
						]
					}
				],
				reservationType: 2,
				paging: {
					pageNumber: 1,
					pageSize: 20,
					sortType: 0,
				},
				additionalFilters: [],
				imageSizes: [0],
				categories: [],
			},
			"POST"
		)
	}


	private async fetchFromOnlyHotel(names: string[]): Promise<any[]> {
		const res = await Promise.all(
			names.map(name =>
				doRequestToServer(
					ONLYHOTEL_ENDPOINTS.LIST_ARRIVAL_LOCATIONS,
					{text: name},
					"POST"
				)
			)
		);

		const filteredRes = filterUniqueMatchingHotels(res, names)
		filteredRes.forEach(res => {
			console.log({
				name: res.name,
				type: res.type,
				friendlyUrl: res.friendlyUrl
			})
		})
	}
}