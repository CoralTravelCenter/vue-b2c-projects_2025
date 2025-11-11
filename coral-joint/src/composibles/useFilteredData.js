export default function useFilteredData(hotelNames, serverData) {
  const names = hotelNames.map(s => s.trim().toLowerCase());
  const nameSet = new Set(names);
  return serverData.filter(item => {
    const fieldValue = item.name;
    return fieldValue != null && nameSet.has(String(fieldValue).trim().toLowerCase());
  })
}
