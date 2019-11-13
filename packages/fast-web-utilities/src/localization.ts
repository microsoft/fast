import { canUseDOM } from "exenv-es6";

/**
 * Expose ltr and rtl strings
 */
export enum Direction {
    ltr = "ltr",
    rtl = "rtl",
}

/**
 * Stardardize left scroll conversion when dirction is rtl
 * inspired by
 * https://github.com/alitaheri/normalize-scroll-left
 */
let GetRtlScrollLeft: (scrolledElement: Element) => number = initialGetRtlScrollConverter;
let SetRtlScrollLeft: (
    scrolledElement: Element,
    scrollValue: number
) => void = initialSetRtlScrollConverter;

/**
 *
 */
export function getScrollLeft(scrolledElement: Element, direction: Direction): number {
    if (direction === Direction.rtl) {
        return GetRtlScrollLeft(scrolledElement);
    }
    return scrolledElement.scrollLeft;
}

/**
 *
 */
export function setScrollLeft(
    scrolledElement: Element,
    scrollValue: number,
    direction: Direction
): void {
    if (direction === Direction.rtl) {
        SetRtlScrollLeft(scrolledElement, scrollValue);
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
        dummy.dir = "rtl";
        dummy.style.fontSize = "14px";
        dummy.style.width = "4px";
        dummy.style.height = "1px";
        dummy.style.position = "absolute";
        dummy.style.top = "-1000px";
        dummy.style.overflow = "scroll";
        document.body.appendChild(dummy);

        if (dummy.scrollLeft > 0) {
            SetRtlScrollLeft = reverseSetRtlScrollConverter;
            GetRtlScrollLeft = reverseGetRtlScrollConverter;
        } else {
            dummy.scrollLeft = 1;
            if (dummy.scrollLeft === 1) {
                SetRtlScrollLeft = invertedSetRtlScrollConverter;
                GetRtlScrollLeft = invertedGetRtlScrollConverter;
            } else {
                SetRtlScrollLeft = directSetRtlScrollConverter;
                GetRtlScrollLeft = directGetRtlScrollConverter;
            }
        }
        document.body.removeChild(dummy);
    } else {
        SetRtlScrollLeft = directSetRtlScrollConverter;
        GetRtlScrollLeft = directGetRtlScrollConverter;
    }
}

/**
 * Rtl scroll getter functions
 */
function initialGetRtlScrollConverter(scrolledElement: Element): number {
    initializeRtlScrollConverters();
    return GetRtlScrollLeft(scrolledElement);
}

function directGetRtlScrollConverter(scrolledElement: Element): number {
    return scrolledElement.scrollLeft;
}

function invertedGetRtlScrollConverter(scrolledElement: Element): number {
    return -Math.abs(scrolledElement.scrollLeft);
}

function reverseGetRtlScrollConverter(scrolledElement: Element): number {
    return -Math.abs(
        scrolledElement.scrollWidth -
            scrolledElement.clientWidth -
            scrolledElement.scrollLeft
    );
}

/**
 * Rtl scroll setter functions
 */
function initialSetRtlScrollConverter(
    scrolledElement: Element,
    newScrollValue: number
): void {
    initializeRtlScrollConverters();
    SetRtlScrollLeft(scrolledElement, newScrollValue);
}

function directSetRtlScrollConverter(
    scrolledElement: Element,
    newScrollValue: number
): void {
    scrolledElement.scrollLeft = newScrollValue;
}

function invertedSetRtlScrollConverter(
    scrolledElement: Element,
    newScrollValue: number
): void {
    scrolledElement.scrollLeft = Math.abs(newScrollValue);
}

function reverseSetRtlScrollConverter(
    scrolledElement: Element,
    newScrollValue: number
): void {
    scrolledElement.scrollLeft = Math.abs(
        scrolledElement.scrollWidth - scrolledElement.clientWidth - newScrollValue
    );
}
