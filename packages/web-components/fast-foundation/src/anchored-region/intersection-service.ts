/**
 *  A service to batch intersection event callbacks so multiple elements can share a single observer
 *
 * @public
 */
export class IntersectionService {
    private intersectionDetector: IntersectionObserver;

    private observedElements: Map<Element, any[]> = new Map<Element, any[]>();

    constructor() {
        this.initializeIntersectionDetector();
    }

    /**
     * Request the position of a target element
     *
     * @internal
     */
    public requestPosition = (
        target: Element,
        callback: (entries: IntersectionObserverEntry[]) => void
    ): void => {
        if (this.observedElements.has(target)) {
            this.observedElements.get(target)?.push(callback);
            return;
        }

        this.observedElements.set(target, [callback]);
        this.intersectionDetector.observe(target);
    };

    /**
     * Cancel a position request
     *
     * @internal
     */
    public cancelRequestPosition = (target: Element, callback: any): void => {
        const callbacks: any[] | undefined = this.observedElements.get(target);

        if (callbacks !== undefined) {
            const callBackIndex: number = callbacks.indexOf(callback);
            if (callBackIndex !== -1) {
                callbacks.splice(callBackIndex, 1);
            }
        }
    };

    /**
     * initialize intersection detector
     */
    private initializeIntersectionDetector = (): void => {
        this.intersectionDetector = new IntersectionObserver(this.handleIntersection, {
            root: null,
            rootMargin: "0px",
            threshold: [0, 1],
        });
    };

    /**
     *  Handle intersections
     */
    private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
        const pendingCallbacks: any[] = [];
        const pendingCallbackParams: any[] = [];

        // go through the entries to build a list of callbacks and params for each
        entries.forEach((entry: IntersectionObserverEntry) => {
            // stop watching this element until we get new update requests for it
            this.intersectionDetector.unobserve(entry.target);

            const thisElementCallbacks: any[] | undefined = this.observedElements.get(
                entry.target
            );
            if (thisElementCallbacks !== undefined) {
                thisElementCallbacks.forEach((callback: any) => {
                    let targetCallbackIndex: number = pendingCallbacks.indexOf(callback);
                    if (targetCallbackIndex === -1) {
                        targetCallbackIndex = pendingCallbacks.length;
                        pendingCallbacks.push(callback);
                        pendingCallbackParams.push([]);
                    }
                    pendingCallbackParams[targetCallbackIndex].push(entry);
                });
                this.observedElements.delete(entry.target);
            }
        });

        // execute callbacks
        pendingCallbacks.forEach((callback: any, index: number) => {
            callback(pendingCallbackParams[index]);
        });
    };
}
