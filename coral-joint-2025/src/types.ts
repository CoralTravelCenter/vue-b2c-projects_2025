interface ParentLocation {
	id: string;
	type: number;
	name: string;
	countryId: string;
}

export interface ArrivalLocation {
	id: string;
	type: number;
	name: string;
	friendlyUrl: string;
	parent?: ParentLocation;
	children?: unknown[];
}

export interface Hotel {
	name: string;
	location: string;
	benefits: string[];
	erid: string;
	ligal: string;
}

declare global {
	function ym(
		counterId: number,
		action: string,
		target?: string,
		params?: Record<string, unknown>,
	): void;
}

type MealNames = string[];

type PriceAmount = number | string | null | undefined;

interface HotelCategory {
	key: string;
	name: string;
}

interface HotelImageSize {
	url: string;
}

interface HotelImage {
	sizes: HotelImageSize[];
}

interface HotelInfo {
	name: string;
	locationSummary: string;
	images: HotelImage[];
	eliteHotel?: boolean;
	categoryKey?: string;
}

interface HotelOfferPrice {
	amount?: PriceAmount;
}

interface HotelOffer {
	price?: HotelOfferPrice;
}

interface RoomAlternatives {
	mealNames: MealNames;
}

export interface PriceSearchListResult {
	hotel: HotelInfo;
	offers?: HotelOffer[];
	hotelCategories?: HotelCategory[];
	roomAlternatives: RoomAlternatives;
}

export interface PriceSearchListResult {
	searchCriterias: SearchCriterias;

	rooms: Record<string, { name: string }>;
	meals: Record<string, { name: string }>;
	accommodations: Record<string, { name: string }>;

	departureLocations: Record<
		string,
		{
			id: string;
			type: number;
			name: string;
			friendlyUrl: string;
		}
	>;

	countries: Record<string, { name: string }>;
	regions: Record<string, { name: string }>;
	places: Record<string, { name: string }>;
	areas: Record<string, { name: string }>;

	hotelFeatures: Record<
		string,
		{
			name: string;
			iconUrl: string;
		}
	>;

	hotelConcepts: Record<
		string,
		{
			name: string;
			iconUrl: string;
		}
	>;

	hotelCategories: Record<
		string,
		{
			name: string;
			starCount: number;
			isHalfStar: boolean;
		}
	>;

	topProducts: unknown[];

	products: Array<{
		hotel: unknown; // не углубляемся
		offers: unknown[]; // не углубляемся
		roomAlternatives: unknown; // не углубляемся
	}>;

	filter: unknown;

	availableSortTypes: Array<{
		sortType: number;
		name: string;
	}>;
}

export interface SearchCriterias {
	flightType: number;
	reservationType: number;
	beginDates: string[];
	datePickerMode: number;

	nights: Array<{
		value: number;
	}>;

	roomCriterias: unknown[];

	departureLocations: Array<{
		id: string;
		type: number;
		name: string;
		friendlyUrl: string;
		parent?: unknown;
	}>;

	arrivalLocations: Array<{
		id: string;
		type: number;
		name: string;
		friendlyUrl: string;
		parent?: unknown;
	}>;

	paging: {
		hasPreviousPage: boolean;
		hasNextPage: boolean;
		pageNumber: number;
		pageSize: number;
		sortType: number;
	};

	imageSizes: number[];
	additionalFilters: unknown[];
}

export interface EncryptResult {
	redirectionUrl: string;
	queryParam: string;
}
