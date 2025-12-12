export function handleCopyErid(idx: number) {
    const list = isStatic.value ? vipHotelsList.value : hotelErids.value;
    const erid = isStatic.value ? list[idx]?.erid : list[idx];

    if (!erid) return;

    copy(erid);
    copiedIndex.value = idx;
}
