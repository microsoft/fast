/**
 *
 *
 * @public
 */
export class IntersectionService {
    private intersectionDetector: IntersectionObserver;

    private observedElements: Element[] = [];
    private callbacksByElement: any[] = [];

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
        let targetIndex: number = this.observedElements.indexOf(target);

        if (targetIndex === -1) {
            targetIndex = this.observedElements.length;
            this.observedElements.push(target);
            this.callbacksByElement.push([]);
            this.intersectionDetector.observe(target);
        }

        this.callbacksByElement[targetIndex].push(callback);
    };

    /**
     * Cancel a position request
     *
     * @internal
     */
    public cancelRequestPosition = (target: Element, callback: any): void => {
        const targetIndex: number = this.observedElements.indexOf(target);
        if (targetIndex === -1) {
            return;
        }

        // remove the callback associated with the request
        const callbacks: any[] = this.callbacksByElement[targetIndex];
        const callBackIndex: number = callbacks.indexOf(callback);
        callbacks.splice(callBackIndex, 1);
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

            const targetElementIndex: number = this.observedElements.indexOf(
                entry.target
            );
            if (targetElementIndex !== -1) {
                this.callbacksByElement[targetElementIndex].forEach((callback: any) => {
                    let targetCallbackIndex: number = pendingCallbacks.indexOf(callback);
                    if (targetCallbackIndex === -1) {
                        targetCallbackIndex = pendingCallbacks.length;
                        pendingCallbacks.push(callback);
                        pendingCallbackParams.push([]);
                    }
                    pendingCallbackParams[targetCallbackIndex].push(entry);
                });
                this.observedElements.splice(targetElementIndex, 1);
                this.callbacksByElement.splice(targetElementIndex, 1);
            }
        });

        // execute callbacks
        pendingCallbacks.forEach((callback: any, index: number) => {
            callback(pendingCallbackParams[index]);
        });
    };
}
