/**
 * An idle loading queue
 *
 * @public
 */
export class idleLoadQueue {
    /**
     * Defines the idle callback timeout value.
     * Defaults to 1000
     *
     * @public
     * @remarks
     */
    public idleCallbackTimeout: number = 1000;
    private idleCallbackInterval: number = 20;
    private callbackQueue: Map<Element, () => void> = new Map<Element, () => void>();

    private currentCallbackId: number | undefined;
    private currentCallbackElement: Element | undefined;
    private currentCallback: (() => void) | undefined;

    /**
     * Suspends idle loading
     *
     *
     * @public
     */
    public idleLoadingSuspended: boolean = false;

    /**
     * Request an idle callback
     *
     * @public
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
     * @public
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
     * Clear the callback queue
     *
     * @public
     */
    public clearCallbackQueue(): void {
        this.callbackQueue.clear();
        if (this.currentCallbackElement) {
            this.currentCallbackElement = undefined;
        }
    }

    /**
     * Queue up the next item
     */
    private nextCallback = (): void => {
        if (
            this.idleLoadingSuspended ||
            this.currentCallbackId ||
            this.callbackQueue.size === 0
        ) {
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
