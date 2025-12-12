export function setScrollLock(locked: boolean) {
    if (locked) {
        document.body.classList.add('js-scroll-lock');
    } else {
        document.body.classList.remove('js-scroll-lock');
    }
}
