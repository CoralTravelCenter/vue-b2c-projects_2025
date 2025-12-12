export interface Country {
    friendlyUrl: string;
    id: string;
    name: string;
    type: number;
}

// Массив из твоего оригинального скрипта
export const COUNTRIES: Country[] = [
    {friendlyUrl: 'abhaziya', id: '278-0', name: 'Абхазия', type: 0},
    {friendlyUrl: 'azerbaydjan', id: '7-0', name: 'Азербайджан', type: 0},
    {friendlyUrl: 'andorra', id: '72-0', name: 'Андорра', type: 0},
    {friendlyUrl: 'armeniya', id: '5-0', name: 'Армения', type: 0},
    {friendlyUrl: 'bahreyn', id: '282-0', name: 'Бахрейн', type: 0},
    {friendlyUrl: 'belarus', id: '8-0', name: 'Беларусь', type: 0},
    {friendlyUrl: 'vyetnam', id: '41-0', name: 'Вьетнам', type: 0},
    {friendlyUrl: 'gruziya', id: '15-0', name: 'Грузия', type: 0},
    {friendlyUrl: 'egipet', id: '12-0', name: 'Египет', type: 0},
    {friendlyUrl: 'indiya', id: '52-0', name: 'Индия', type: 0},
    {friendlyUrl: 'indoneziya', id: '38-0', name: 'Индонезия', type: 0},
    {friendlyUrl: 'ispaniya', id: '42-0', name: 'Испания', type: 0},
    {friendlyUrl: 'katar', id: '51-0', name: 'Катар', type: 0},
    {friendlyUrl: 'kuba', id: '48-0', name: 'Куба', type: 0},
    {friendlyUrl: 'mavrikiy', id: '63-0', name: 'Маврикий', type: 0},
    {friendlyUrl: 'malydivy', id: '35-0', name: 'Мальдивы', type: 0},
    {friendlyUrl: 'marokko', id: '45-0', name: 'Марокко', type: 0},
    {friendlyUrl: 'oae', id: '31-0', name: 'ОАЭ', type: 0},
    {friendlyUrl: 'rossiya', id: '3-0', name: 'Россия', type: 0},
    {friendlyUrl: 'seyshely', id: '39-0', name: 'Сейшелы', type: 0},
    {friendlyUrl: 'tailand', id: '33-0', name: 'Таиланд', type: 0},
    {friendlyUrl: 'tanzaniya', id: '60-0', name: 'Танзания', type: 0},
    {friendlyUrl: 'tunis', id: '34-0', name: 'Тунис', type: 0},
    {friendlyUrl: 'turtsiya', id: '1-0', name: 'Турция', type: 0},
    {friendlyUrl: 'uzbekistan', id: '49-0', name: 'Узбекистан', type: 0},
    {friendlyUrl: 'shrilanka', id: '40-0', name: 'Шри-Ланка', type: 0},
];

const countriesByName = new Map(COUNTRIES.map(c => [c.name, c]));

export function findCountryByName(name: string) {
    return countriesByName.get(name) || null;
}
