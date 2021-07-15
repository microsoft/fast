/**
 *  A service to batch intersection event callbacks so multiple elements can share a single observer
 *
 * @public
 */
export declare class IntersectionService {
    private intersectionDetector;
    private observedElements;
    constructor();
    /**
     * Request the position of a target element
     *
     * @internal
     */
    requestPosition: (
        target: Element,
        callback: (entries: IntersectionObserverEntry[]) => void
    ) => void;
    /**
     * Cancel a position request
     *
     * @internal
     */
    cancelRequestPosition: (target: Element, callback: any) => void;
    /**
     * initialize intersection detector
     */
    private initializeIntersectionDetector;
    /**
     *  Handle intersections
     */
    private handleIntersection;
}
