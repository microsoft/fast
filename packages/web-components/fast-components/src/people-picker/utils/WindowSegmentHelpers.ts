/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * An object containing width, height, top and left properties (aka segment's bounding rects)
 *
 * @interface IWindowSegment
 */
export interface IWindowSegment {
    // tslint:disable-next-line: completed-docs
    top: number;
    // tslint:disable-next-line: completed-docs
    left: number;
    // tslint:disable-next-line: completed-docs
    width: number;
    // tslint:disable-next-line: completed-docs
    height: number;
}

/**
 * An interface that defines the Window Segments Enumeration API.
 *
 * @interface SegmentAwareWindow
 */
export interface ISegmentAwareWindow extends Window {
    /**
     * Returns an array of screen segments.
     *
     * @returns {*}
     * @memberof SegmentAwareWindow
     */
    getWindowSegments(): IWindowSegment[];
}

/**
 * Responds whether or not the Window object supports the Window Segments Enumeration API.
 *
 * @export
 * @returns {boolean}
 */
export function isWindowSegmentAware(): boolean {
    return ((window as unknown) as ISegmentAwareWindow).getWindowSegments !== undefined;
}

/**
 * Returns an ISegmentAwareWindow instance of the Window object, or null if the API is not supported.
 *
 * @export
 * @returns {ISegmentAwareWindow}
 */
export function getSegmentAwareWindow(): ISegmentAwareWindow {
    return isWindowSegmentAware() ? ((window as unknown) as ISegmentAwareWindow) : null;
}
