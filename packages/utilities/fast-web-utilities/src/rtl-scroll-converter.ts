import { canUseDOM } from "exenv-es6";
import { Direction } from "./localization";

/**
 * Standardize left scroll conversion when direction is rtl
 * inspired by
 * https://github.com/alitaheri/normalize-scroll-left
 */
export class RtlScrollConverter {
    /**
     *  Gets the scrollLeft value of the provided element
     */
    public static getScrollLeft(scrolledElement: Element, direction: Direction): number {
        if (direction === Direction.rtl) {
            return RtlScrollConverter.getRtlScrollLeftConverter(scrolledElement);
        }
        return scrolledElement.scrollLeft;
    }

    /**
     * Sets the scrollLeft value of the provided element
     */
    public static setScrollLeft(
        scrolledElement: Element,
        scrollValue: number,
        direction: Direction
    ): void {
        if (direction === Direction.rtl) {
            RtlScrollConverter.setRtlScrollLeftConverter(scrolledElement, scrollValue);
            return;
        }
        scrolledElement.scrollLeft = scrollValue;
    }

    /**
     * This variable holds the appropriate converter function to get the scrollLeft value
     * The functions initially assigned triggers a browser check when called which sets
     * the correct converter based on browser and then invokes it
     */
    private static getRtlScrollLeftConverter: (scrolledElement: Element) => number =
        RtlScrollConverter.initialGetRtlScrollConverter;

    /**
     * This variable holds the appropriate converter function to set the scrollLeft value
     * The functions initially assigned triggers a browser check when called which sets
     * the correct function based on browser and then invokes it
     */
    private static setRtlScrollLeftConverter: (
        scrolledElement: Element,
        scrollValue: number
    ) => void = RtlScrollConverter.initialSetRtlScrollConverter;

    /**
     * The initial rtl scroll converter getter function, it calls the browser test to set the correct converter
     * functions and then invokes the getter
     */
    private static initialGetRtlScrollConverter(scrolledElement: Element): number {
        RtlScrollConverter.initializeRtlScrollConverters();
        return RtlScrollConverter.getRtlScrollLeftConverter(scrolledElement);
    }

    /**
     * The "direct" rtl get scroll converter does not need to tamper with the scrollLeft
     * values as the browser is already doing the right thing.  Content start = 0 and
     * scrolling left goes negative.
     */
    private static directGetRtlScrollConverter(scrolledElement: Element): number {
        return scrolledElement.scrollLeft;
    }

    /**
     * The "inverted" get scroll converter is used when the browser reports scroll left
     * as a positive maximum scroll value at content start and then goes to zero as content
     * is scrolled left
     */
    private static invertedGetRtlScrollConverter(scrolledElement: Element): number {
        return -Math.abs(scrolledElement.scrollLeft);
    }

    /**
     * The "reverse" get scroll converter is used when the browser reports scroll left
     * as 0 at content start and then goes positive as content is scrolled left
     */
    private static reverseGetRtlScrollConverter(scrolledElement: Element): number {
        return (
            scrolledElement.scrollLeft -
            (scrolledElement.scrollWidth - scrolledElement.clientWidth)
        );
    }

    /**
     * The initial rtl scroll converter setter function, it calls the browser test to set the correct converter
     * functions and then invokes the setter
     */
    private static initialSetRtlScrollConverter(
        scrolledElement: Element,
        newScrollValue: number
    ): void {
        RtlScrollConverter.initializeRtlScrollConverters();
        RtlScrollConverter.setRtlScrollLeftConverter(scrolledElement, newScrollValue);
    }

    /**
     * The "direct" rtl set scroll converter does not need to tamper with the scrollLeft
     * values as the browser is already doing the right thing.  Content start = 0 and
     * scrolling left goes negative.
     */
    private static directSetRtlScrollConverter(
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
    private static invertedSetRtlScrollConverter(
        scrolledElement: Element,
        newScrollValue: number
    ): void {
        scrolledElement.scrollLeft = Math.abs(newScrollValue);
    }

    /**
     * The "reverse" set scroll converter is used when the browser reports scroll left
     * as 0 at content start and then goes positive as content is scrolled left
     */
    private static reverseSetRtlScrollConverter(
        scrolledElement: Element,
        newScrollValue: number
    ): void {
        const maxScroll: number =
            scrolledElement.scrollWidth - scrolledElement.clientWidth;
        scrolledElement.scrollLeft = maxScroll + newScrollValue;
    }

    /**
     * detects the appropriate rtl scroll converter functions and assigns them
     * should only run once
     */
    private static initializeRtlScrollConverters(): void {
        if (!canUseDOM()) {
            RtlScrollConverter.applyDirectScrollConverters();
            return;
        }
        const testElement: HTMLDivElement = RtlScrollConverter.getTestElement();
        document.body.appendChild(testElement);

        RtlScrollConverter.checkForScrollType(testElement);

        document.body.removeChild(testElement);
    }

    /**
     * checks the provided test element to determine scroll type
     * and apply appropriate converters
     */
    private static checkForScrollType(testElement: HTMLDivElement): void {
        if (RtlScrollConverter.isReverse(testElement)) {
            RtlScrollConverter.applyReverseScrollConverters();
        } else {
            if (RtlScrollConverter.isDirect(testElement)) {
                RtlScrollConverter.applyDirectScrollConverters();
            } else {
                RtlScrollConverter.applyInvertedScrollConverters();
            }
        }
    }

    /**
     * checks test element initial state for rtl "reverse" mode
     */
    private static isReverse(testElement: HTMLDivElement): boolean {
        return testElement.scrollLeft > 0;
    }

    /**
     * checks test element for rtl "direct" mode
     */
    private static isDirect(testElement: HTMLDivElement): boolean {
        testElement.scrollLeft = -1;
        return testElement.scrollLeft < 0;
    }

    /**
     * apply direct scroll conververters
     */
    private static applyDirectScrollConverters(): void {
        RtlScrollConverter.setRtlScrollLeftConverter =
            RtlScrollConverter.directSetRtlScrollConverter;
        RtlScrollConverter.getRtlScrollLeftConverter =
            RtlScrollConverter.directGetRtlScrollConverter;
    }

    /**
     * apply inverted scroll conververters
     */
    private static applyInvertedScrollConverters(): void {
        RtlScrollConverter.setRtlScrollLeftConverter =
            RtlScrollConverter.invertedSetRtlScrollConverter;
        RtlScrollConverter.getRtlScrollLeftConverter =
            RtlScrollConverter.invertedGetRtlScrollConverter;
    }

    /**
     * apply reverse scroll conververters
     */
    private static applyReverseScrollConverters(): void {
        RtlScrollConverter.setRtlScrollLeftConverter =
            RtlScrollConverter.reverseSetRtlScrollConverter;
        RtlScrollConverter.getRtlScrollLeftConverter =
            RtlScrollConverter.reverseGetRtlScrollConverter;
    }

    /**
     * generate a test element for rtl testing
     */
    private static getTestElement(): HTMLDivElement {
        const testElement: HTMLDivElement = document.createElement("div");
        testElement.appendChild(document.createTextNode("ABCD"));
        testElement.dir = "rtl";
        testElement.style.fontSize = "14px";
        testElement.style.width = "4px";
        testElement.style.height = "1px";
        testElement.style.position = "absolute";
        testElement.style.top = "-1000px";
        testElement.style.overflow = "scroll";
        return testElement;
    }
}
