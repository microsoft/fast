/**
 *
 *
 * @public
 */
export class IntersectionService {
    private intersectionDetector: IntersectionObserver;

    private observedElements: Element[] = [];
    private callbacksByElement: any[] = [];

    private pendingCallbacks: any[] = [];
    private pendingCallbackParams: any[] = [];

    constructor() {
        this.initializeIntersectionDetector();
    }

    public requestPositionUpdate = (
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
                    let targetCallbackIndex: number = this.pendingCallbacks.indexOf(
                        callback
                    );
                    if (targetCallbackIndex === -1) {
                        targetCallbackIndex = this.pendingCallbacks.length;
                        pendingCallbacks.push(callback);
                        pendingCallbackParams.push([]);
                    }
                    pendingCallbackParams[targetCallbackIndex].push(entry);
                });
                this.observedElements.splice(targetElementIndex, 1);
                this.callbacksByElement.splice(targetElementIndex, 1);
            }

            // execute callbacks
            this.pendingCallbacks.forEach((callback: any, index: number) => {
                callback(pendingCallbackParams[index]);
            });
        });
    };
}
