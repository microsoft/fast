import { canUseDOM } from "exenv-es6";
import { Direction } from "./localization";

/**
 * Standardize left scroll conversion when direction is rtl
 * inspired by
 * https://github.com/alitaheri/normalize-scroll-left
 */

/**
 * These variables hold the appropriate function to get/set the scrollLeft value
 * The functions initially assigned trigger a browser check when called which sets
 * the correct function based on browser and then invokes it
 */
let getRtlScrollLeft: (scrolledElement: Element) => number = initialGetRtlScrollConverter;
let setRtlScrollLeft: (
    scrolledElement: Element,
    scrollValue: number
) => void = initialSetRtlScrollConverter;

/**
 *  Gets the scrollLeft value of the provided element
 */
export function getScrollLeft(scrolledElement: Element, direction: Direction): number {
    if (direction === Direction.rtl) {
        return getRtlScrollLeft(scrolledElement);
    }
    return scrolledElement.scrollLeft;
}

/**
 * Sets the scrollLeft value of the provided element
 */
export function setScrollLeft(
    scrolledElement: Element,
    scrollValue: number,
    direction: Direction
): void {
    if (direction === Direction.rtl) {
        setRtlScrollLeft(scrolledElement, scrollValue);
        return;
    }
    scrolledElement.scrollLeft = scrollValue;
}

/**
 * detects the appropriate rtl scroll converter functions and assigns them
 * should only run once
 */
function initializeRtlScrollConverters(): void {
    if (canUseDOM()) {
        const dummy = document.createElement("div");
        dummy.appendChild(document.createTextNode("ABCD"));
        dummy.dir = Direction.rtl;
        dummy.style.fontSize = "14px";
        dummy.style.width = "4px";
        dummy.style.height = "1px";
        dummy.style.position = "absolute";
        dummy.style.top = "-1000px";
        dummy.style.overflow = "scroll";
        document.body.appendChild(dummy);

        if (dummy.scrollLeft > 0) {
            setRtlScrollLeft = reverseSetRtlScrollConverter;
            getRtlScrollLeft = reverseGetRtlScrollConverter;
        } else {
            dummy.scrollLeft = 1;
            if (dummy.scrollLeft === 1) {
                setRtlScrollLeft = invertedSetRtlScrollConverter;
                getRtlScrollLeft = invertedGetRtlScrollConverter;
            } else {
                setRtlScrollLeft = directSetRtlScrollConverter;
                getRtlScrollLeft = directGetRtlScrollConverter;
            }
        }
        document.body.removeChild(dummy);
    } else {
        setRtlScrollLeft = directSetRtlScrollConverter;
        getRtlScrollLeft = directGetRtlScrollConverter;
    }
}

/**
 * The initial rtl scroll converter getter function, it calls the browser test to set the correct converter
 * functions and then invokes the getter
 */
function initialGetRtlScrollConverter(scrolledElement: Element): number {
    initializeRtlScrollConverters();
    return getRtlScrollLeft(scrolledElement);
}

/**
 * The "direct" rtl get scroll converter does not need to tamper with the scrollLeft
 * values as the browser is already doing the right thing.  Content start = 0 and
 * scrolling left goes negative.
 */
function directGetRtlScrollConverter(scrolledElement: Element): number {
    return scrolledElement.scrollLeft;
}

/**
 * The "inverted" get scroll converter is used when the browser reports scroll left
 * as a positive maximum scroll value at content start and then goes to zero as content
 * is scrolled left
 */
function invertedGetRtlScrollConverter(scrolledElement: Element): number {
    return -Math.abs(scrolledElement.scrollLeft);
}

/**
 * The "reverse" get scroll converter is used when the browser reports scroll left
 * as 0 at content start and then goes positive as content is scrolled left
 */
function reverseGetRtlScrollConverter(scrolledElement: Element): number {
    return (
        scrolledElement.scrollLeft -
        (scrolledElement.scrollWidth - scrolledElement.clientWidth)
    );
}

/**
 * The initial rtl scroll converter setter function, it calls the browser test to set the correct converter
 * functions and then invokes the setter
 */
function initialSetRtlScrollConverter(
    scrolledElement: Element,
    newScrollValue: number
): void {
    initializeRtlScrollConverters();
    setRtlScrollLeft(scrolledElement, newScrollValue);
}

/**
 * The "direct" rtl set scroll converter does not need to tamper with the scrollLeft
 * values as the browser is already doing the right thing.  Content start = 0 and
 * scrolling left goes negative.
 */
function directSetRtlScrollConverter(
    scrolledElement: Element,
    newScrollValue: number
): void {
    scrolledElement.scrollLeft = newScrollValue;
}

/**
 * The "inverted" set scroll converter is used when the browser reports scroll left
 * as a positive maximum scroll value at content start and then goes to zero as content
 * is scrolled left
 */
function invertedSetRtlScrollConverter(
    scrolledElement: Element,
    newScrollValue: number
): void {
    scrolledElement.scrollLeft = Math.abs(newScrollValue);
}

/**
 * The "reverse" set scroll converter is used when the browser reports scroll left
 * as 0 at content start and then goes positive as content is scrolled left
 */
function reverseSetRtlScrollConverter(
    scrolledElement: Element,
    newScrollValue: number
): void {
    const maxScroll: number = scrolledElement.scrollWidth - scrolledElement.clientWidth;
    scrolledElement.scrollLeft = maxScroll + newScrollValue;
}
