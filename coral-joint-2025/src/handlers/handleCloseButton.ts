export function handleCloseButton() {
    const wasOpen = !activeRef.value;
    activeRef.value = true;

    if (wasOpen && notLargeScreen.value) {
        setScrollLock(false);
    }
}
