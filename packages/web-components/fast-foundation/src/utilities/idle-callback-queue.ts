/**
 *  A service to batch idle callbacks
 *
 * @public
 */
export class IdleCallbackQueue {
    /**
     *
     *
     * @internal
     */
    public idleCallbackTimeout: number = 200;

    private callBackQueue: Map<Element, () => void> = new Map<Element, () => void>();

    private currentCallbackId: number | undefined;
    private currentCallbackElement: Element | undefined;
    private currentCallback: (() => void) | undefined;

    /**
     * Request an idle callback
     *
     * @internal
     */
    public requestIdleCallback(target: Element, callback: () => void): void {
        if (this.callBackQueue.has(target)) {
            return;
        }
        this.callBackQueue.set(target, callback);
        this.nextCallback();
    }

    /**
     * Cancel an idle callback request
     *
     * @internal
     */
    public cancelIdleCallback(target: Element): void {
        if (this.callBackQueue.has(target)) {
            this.callBackQueue.delete(target);
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
     *
     *
     */
    private nextCallback = (): void => {
        if (this.currentCallbackId || this.callBackQueue.size === 0) {
            return;
        }

        const [nextCallbackElement] = this.callBackQueue.keys();
        this.currentCallback = this.callBackQueue.get(nextCallbackElement);
        this.callBackQueue.delete(nextCallbackElement);
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
        }, 20);
    };
}
