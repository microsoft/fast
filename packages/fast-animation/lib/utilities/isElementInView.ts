/**
 * Checks to see if any part of an element is within the viewport
 */
export default function isElementInView(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();

    return (
        rect.bottom >= 0
        && rect.right >= 0
        && rect.top <= window.innerHeight
        && rect.left <= window.innerWidth
    );
}