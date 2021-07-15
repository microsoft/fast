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
    static getScrollLeft(scrolledElement, direction) {
        if (direction === Direction.rtl) {
            return RtlScrollConverter.getRtlScrollLeftConverter(scrolledElement);
        }
        return scrolledElement.scrollLeft;
    }
    /**
     * Sets the scrollLeft value of the provided element
     */
    static setScrollLeft(scrolledElement, scrollValue, direction) {
        if (direction === Direction.rtl) {
            RtlScrollConverter.setRtlScrollLeftConverter(scrolledElement, scrollValue);
            return;
        }
        scrolledElement.scrollLeft = scrollValue;
    }
    /**
     * The initial rtl scroll converter getter function, it calls the browser test to set the correct converter
     * functions and then invokes the getter
     */
    static initialGetRtlScrollConverter(scrolledElement) {
        RtlScrollConverter.initializeRtlScrollConverters();
        return RtlScrollConverter.getRtlScrollLeftConverter(scrolledElement);
    }
    /**
     * The "direct" rtl get scroll converter does not need to tamper with the scrollLeft
     * values as the browser is already doing the right thing.  Content start = 0 and
     * scrolling left goes negative.
     */
    static directGetRtlScrollConverter(scrolledElement) {
        return scrolledElement.scrollLeft;
    }
    /**
     * The "inverted" get scroll converter is used when the browser reports scroll left
     * as a positive maximum scroll value at content start and then goes to zero as content
     * is scrolled left
     */
    static invertedGetRtlScrollConverter(scrolledElement) {
        return -Math.abs(scrolledElement.scrollLeft);
    }
    /**
     * The "reverse" get scroll converter is used when the browser reports scroll left
     * as 0 at content start and then goes positive as content is scrolled left
     */
    static reverseGetRtlScrollConverter(scrolledElement) {
        return (
            scrolledElement.scrollLeft -
            (scrolledElement.scrollWidth - scrolledElement.clientWidth)
        );
    }
    /**
     * The initial rtl scroll converter setter function, it calls the browser test to set the correct converter
     * functions and then invokes the setter
     */
    static initialSetRtlScrollConverter(scrolledElement, newScrollValue) {
        RtlScrollConverter.initializeRtlScrollConverters();
        RtlScrollConverter.setRtlScrollLeftConverter(scrolledElement, newScrollValue);
    }
    /**
     * The "direct" rtl set scroll converter does not need to tamper with the scrollLeft
     * values as the browser is already doing the right thing.  Content start = 0 and
     * scrolling left goes negative.
     */
    static directSetRtlScrollConverter(scrolledElement, newScrollValue) {
        scrolledElement.scrollLeft = newScrollValue;
    }
    /**
     * The "inverted" set scroll converter is used when the browser reports scroll left
     * as a positive maximum scroll value at content start and then goes to zero as content
     * is scrolled left
     */
    static invertedSetRtlScrollConverter(scrolledElement, newScrollValue) {
        scrolledElement.scrollLeft = Math.abs(newScrollValue);
    }
    /**
     * The "reverse" set scroll converter is used when the browser reports scroll left
     * as 0 at content start and then goes positive as content is scrolled left
     */
    static reverseSetRtlScrollConverter(scrolledElement, newScrollValue) {
        const maxScroll = scrolledElement.scrollWidth - scrolledElement.clientWidth;
        scrolledElement.scrollLeft = maxScroll + newScrollValue;
    }
    /**
     * detects the appropriate rtl scroll converter functions and assigns them
     * should only run once
     */
    static initializeRtlScrollConverters() {
        if (!canUseDOM()) {
            RtlScrollConverter.applyDirectScrollConverters();
            return;
        }
        const testElement = RtlScrollConverter.getTestElement();
        document.body.appendChild(testElement);
        RtlScrollConverter.checkForScrollType(testElement);
        document.body.removeChild(testElement);
    }
    /**
     * checks the provided test element to determine scroll type
     * and apply appropriate converters
     */
    static checkForScrollType(testElement) {
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
    static isReverse(testElement) {
        return testElement.scrollLeft > 0;
    }
    /**
     * checks test element for rtl "direct" mode
     */
    static isDirect(testElement) {
        testElement.scrollLeft = -1;
        return testElement.scrollLeft < 0;
    }
    /**
     * apply direct scroll conververters
     */
    static applyDirectScrollConverters() {
        RtlScrollConverter.setRtlScrollLeftConverter =
            RtlScrollConverter.directSetRtlScrollConverter;
        RtlScrollConverter.getRtlScrollLeftConverter =
            RtlScrollConverter.directGetRtlScrollConverter;
    }
    /**
     * apply inverted scroll conververters
     */
    static applyInvertedScrollConverters() {
        RtlScrollConverter.setRtlScrollLeftConverter =
            RtlScrollConverter.invertedSetRtlScrollConverter;
        RtlScrollConverter.getRtlScrollLeftConverter =
            RtlScrollConverter.invertedGetRtlScrollConverter;
    }
    /**
     * apply reverse scroll conververters
     */
    static applyReverseScrollConverters() {
        RtlScrollConverter.setRtlScrollLeftConverter =
            RtlScrollConverter.reverseSetRtlScrollConverter;
        RtlScrollConverter.getRtlScrollLeftConverter =
            RtlScrollConverter.reverseGetRtlScrollConverter;
    }
    /**
     * generate a test element for rtl testing
     */
    static getTestElement() {
        const testElement = document.createElement("div");
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
/**
 * This variable holds the appropriate converter function to get the scrollLeft value
 * The functions initially assigned triggers a browser check when called which sets
 * the correct converter based on browser and then invokes it
 */
RtlScrollConverter.getRtlScrollLeftConverter =
    RtlScrollConverter.initialGetRtlScrollConverter;
/**
 * This variable holds the appropriate converter function to set the scrollLeft value
 * The functions initially assigned triggers a browser check when called which sets
 * the correct function based on browser and then invokes it
 */
RtlScrollConverter.setRtlScrollLeftConverter =
    RtlScrollConverter.initialSetRtlScrollConverter;
