import type {Country} from './countries';

const CORAL_API_BASE = '/endpoints/PackageTourHotelProduct';
const MOSCOW_DEPARTURE = {
    id: '2671-5',
    name: 'Москва',
    friendlyUrl: 'moskva',
    type: 5,
};

interface TourItem {
    name: string;
    dates: string[];
    nights: number;
    stars?: string[];
    adults?: number;
}

interface FetchResult {
    price: number | null;
    link: string | null;
}

/**
 * Сборка payload для Coral API
 */
function buildPayload(item: TourItem, country: Country, reservationType = 0) {
    const stars = Array.isArray(item.stars) ? item.stars : [];
    const adultsCount = Number.isFinite(item.adults) && item.adults! > 0 ? item.adults! : 2;

    return {
        additionalFilters: [
            {type: 21, values: [{id: '2', value: '2'}]},
            {type: 4, values: [{id: country.id, value: country.id}]},
            {type: 2, values: stars.map((s) => ({id: s, value: s}))},
        ],
        arrivalLocations: [{
            id: country.id,
            name: country.name,
            friendlyUrl: country.friendlyUrl,
            type: country.type,
        }],
        beginDates: item.dates,
        datePickerMode: 0,
        departureLocations: [MOSCOW_DEPARTURE],
        flightType: 2,
        nights: [{value: item.nights}],
        paging: {
            hasNextPage: false,
            hasPreviousPage: false,
            pageNumber: 1,
            pageSize: 20,
            sortType: 0,
        },
        reservationType,
        roomCriterias: [{
            passengers: Array.from({length: adultsCount}, () => ({
                age: 20,
                passengerType: 0,
            })),
        }],
    };
}

/**
 * Безопасный JSON-фетч с обработкой ошибок
 */
async function safeJson(url: string, options: RequestInit) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            console.warn('[api] bad status', res.status, url);
            return null;
        }
        return await res.json();
    } catch (e) {
        console.warn('[api] network error', e);
        return null;
    }
}

/**
 * Основная функция — получает цену и ссылку для тура
 */
export async function fetchPriceData(item: TourItem, country: Country): Promise<FetchResult> {
    const [listJson, encryptJson] = await Promise.all([
        safeJson(`${CORAL_API_BASE}/PriceSearchList`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                searchSource: 1,
                searchCriterias: buildPayload(item, country, 0),
            }),
        }),
        safeJson(`${CORAL_API_BASE}/PriceSearchEncrypt`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(buildPayload(item, country, 1)),
        }),
    ]);

    const price =
        listJson?.result?.products?.[0]?.offers?.[0]?.price?.amount ?? null;

    let link: string | null = null;
    if (encryptJson?.result?.queryParam && encryptJson?.result?.redirectionUrl) {
        const qp = encryptJson.result.queryParam;
        const baseUrl = encryptJson.result.redirectionUrl;
        link = `${baseUrl}?qp=${qp}&p=1&w=0&s=0&ws=10`;
    }

    return {price, link};
}
