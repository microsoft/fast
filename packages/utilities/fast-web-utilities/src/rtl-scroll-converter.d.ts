import { Direction } from "./localization";
/**
 * Standardize left scroll conversion when direction is rtl
 * inspired by
 * https://github.com/alitaheri/normalize-scroll-left
 */
export declare class RtlScrollConverter {
    /**
     *  Gets the scrollLeft value of the provided element
     */
    static getScrollLeft(scrolledElement: Element, direction: Direction): number;
    /**
     * Sets the scrollLeft value of the provided element
     */
    static setScrollLeft(
        scrolledElement: Element,
        scrollValue: number,
        direction: Direction
    ): void;
    /**
     * This variable holds the appropriate converter function to get the scrollLeft value
     * The functions initially assigned triggers a browser check when called which sets
     * the correct converter based on browser and then invokes it
     */
    private static getRtlScrollLeftConverter;
    /**
     * This variable holds the appropriate converter function to set the scrollLeft value
     * The functions initially assigned triggers a browser check when called which sets
     * the correct function based on browser and then invokes it
     */
    private static setRtlScrollLeftConverter;
    /**
     * The initial rtl scroll converter getter function, it calls the browser test to set the correct converter
     * functions and then invokes the getter
     */
    private static initialGetRtlScrollConverter;
    /**
     * The "direct" rtl get scroll converter does not need to tamper with the scrollLeft
     * values as the browser is already doing the right thing.  Content start = 0 and
     * scrolling left goes negative.
     */
    private static directGetRtlScrollConverter;
    /**
     * The "inverted" get scroll converter is used when the browser reports scroll left
     * as a positive maximum scroll value at content start and then goes to zero as content
     * is scrolled left
     */
    private static invertedGetRtlScrollConverter;
    /**
     * The "reverse" get scroll converter is used when the browser reports scroll left
     * as 0 at content start and then goes positive as content is scrolled left
     */
    private static reverseGetRtlScrollConverter;
    /**
     * The initial rtl scroll converter setter function, it calls the browser test to set the correct converter
     * functions and then invokes the setter
     */
    private static initialSetRtlScrollConverter;
    /**
     * The "direct" rtl set scroll converter does not need to tamper with the scrollLeft
     * values as the browser is already doing the right thing.  Content start = 0 and
     * scrolling left goes negative.
     */
    private static directSetRtlScrollConverter;
    /**
     * The "inverted" set scroll converter is used when the browser reports scroll left
     * as a positive maximum scroll value at content start and then goes to zero as content
     * is scrolled left
     */
    private static invertedSetRtlScrollConverter;
    /**
     * The "reverse" set scroll converter is used when the browser reports scroll left
     * as 0 at content start and then goes positive as content is scrolled left
     */
    private static reverseSetRtlScrollConverter;
    /**
     * detects the appropriate rtl scroll converter functions and assigns them
     * should only run once
     */
    private static initializeRtlScrollConverters;
    /**
     * checks the provided test element to determine scroll type
     * and apply appropriate converters
     */
    private static checkForScrollType;
    /**
     * checks test element initial state for rtl "reverse" mode
     */
    private static isReverse;
    /**
     * checks test element for rtl "direct" mode
     */
    private static isDirect;
    /**
     * apply direct scroll conververters
     */
    private static applyDirectScrollConverters;
    /**
     * apply inverted scroll conververters
     */
    private static applyInvertedScrollConverters;
    /**
     * apply reverse scroll conververters
     */
    private static applyReverseScrollConverters;
    /**
     * generate a test element for rtl testing
     */
    private static getTestElement;
}
