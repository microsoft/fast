import { $global } from "@microsoft/fast-element";
/**
 *  A service to batch intersection event callbacks so multiple elements can share a single observer
 *
 * @public
 */
export class IntersectionService {
    constructor() {
        this.intersectionDetector = null;
        this.observedElements = new Map();
        /**
         * Request the position of a target element
         *
         * @internal
         */
        this.requestPosition = (target, callback) => {
            var _a;
            if (this.intersectionDetector === null) {
                return;
            }
            if (this.observedElements.has(target)) {
                (_a = this.observedElements.get(target)) === null || _a === void 0
                    ? void 0
                    : _a.push(callback);
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
        this.cancelRequestPosition = (target, callback) => {
            const callbacks = this.observedElements.get(target);
            if (callbacks !== undefined) {
                const callBackIndex = callbacks.indexOf(callback);
                if (callBackIndex !== -1) {
                    callbacks.splice(callBackIndex, 1);
                }
            }
        };
        /**
         * initialize intersection detector
         */
        this.initializeIntersectionDetector = () => {
            if (!$global.IntersectionObserver) {
                //intersection observer not supported
                return;
            }
            this.intersectionDetector = new IntersectionObserver(
                this.handleIntersection,
                {
                    root: null,
                    rootMargin: "0px",
                    threshold: [0, 1],
                }
            );
        };
        /**
         *  Handle intersections
         */
        this.handleIntersection = entries => {
            if (this.intersectionDetector === null) {
                return;
            }
            const pendingCallbacks = [];
            const pendingCallbackParams = [];
            // go through the entries to build a list of callbacks and params for each
            entries.forEach(entry => {
                var _a;
                // stop watching this element until we get new update requests for it
                (_a = this.intersectionDetector) === null || _a === void 0
                    ? void 0
                    : _a.unobserve(entry.target);
                const thisElementCallbacks = this.observedElements.get(entry.target);
                if (thisElementCallbacks !== undefined) {
                    thisElementCallbacks.forEach(callback => {
                        let targetCallbackIndex = pendingCallbacks.indexOf(callback);
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
            pendingCallbacks.forEach((callback, index) => {
                callback(pendingCallbackParams[index]);
            });
        };
        this.initializeIntersectionDetector();
    }
}
