/**
 *  A service to batch idle callbacks
 *
 * @public
 */
export class IdleCallbackQueue {
    /**
     * Timeout value used in idle callback requests (milliseconds)
     * (ie. max delay before a callback regardless of system load)
     *
     * @internal
     */
    public idleCallbackTimeout: number = 1000;

    /**
     * Interval in ms between getting an idle callback and requesting another.
     * (once per 60fps frame)
     *
     * @internal
     */
    private idleCallbackInterval: number = 20;

    private callbackQueue: Map<Element, () => void> = new Map<Element, () => void>();

    private currentCallbackId: number | undefined;
    private currentCallbackElement: Element | undefined;
    private currentCallback: (() => void) | undefined;

    /**
     * Request an idle callback
     *
     * @internal
     */
    public requestIdleCallback(target: Element, callback: () => void): void {
        if (this.callbackQueue.has(target)) {
            return;
        }
        this.callbackQueue.set(target, callback);
        this.nextCallback();
    }

    /**
     * Cancel an idle callback request
     *
     * @internal
     */
    public cancelIdleCallback(target: Element): void {
        if (this.callbackQueue.has(target)) {
            this.callbackQueue.delete(target);
            return;
        }

        if (this.currentCallbackElement === target && this.currentCallbackId) {
            ((window as unknown) as WindowWithIdleCallback).cancelIdleCallback(
                this.currentCallbackId
            );
            this.currentCallbackId = undefined;
            this.currentCallbackElement = undefined;
            this.currentCallback = undefined;
            this.nextCallback();
        }
    }

    /**
     * Queue up the next item
     */
    private nextCallback = (): void => {
        if (this.currentCallbackId || this.callbackQueue.size === 0) {
            return;
        }

        const [nextCallbackElement] = this.callbackQueue.keys();
        this.currentCallback = this.callbackQueue.get(nextCallbackElement);
        this.callbackQueue.delete(nextCallbackElement);
        this.currentCallbackElement = nextCallbackElement;

        this.currentCallbackId = ((window as unknown) as WindowWithIdleCallback).requestIdleCallback(
            this.handleIdleCallback,
            { timeout: this.idleCallbackTimeout }
        );
    };

    /**
     *  Handle callback
     */
    private handleIdleCallback = (): void => {
        if (this.currentCallback) {
            this.currentCallback();
        }
        this.currentCallbackId = undefined;
        this.currentCallbackElement = undefined;
        this.currentCallback = undefined;
        window.setTimeout(() => {
            this.nextCallback();
        }, this.idleCallbackInterval);
    };
}
