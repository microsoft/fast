(function requestIdleCallbackPolyfill() {
    if ("requestIdleCallback" in globalThis) {
        return;
    }

    /**
     * A polyfill for requestIdleCallback that falls back to setTimeout.
     *
     * @param callback - The function to call when the browser is idle.
     * @param options - Options object that may contain a timeout property.
     * @returns An ID that can be used to cancel the callback.
     * @public
     */
    globalThis.requestIdleCallback = function requestIdleCallback(
        callback: (deadline: IdleDeadline) => void,
        options?: { timeout: number },
    ): number {
        const start = Date.now();
        return setTimeout(() => {
            callback({
                didTimeout: options?.timeout
                    ? Date.now() - start >= options.timeout
                    : false,
                timeRemaining: () => 0,
            });
        }, 1) as unknown as number;
    };

    /**
     * A polyfill for cancelIdleCallback that falls back to clearTimeout.
     *
     * @param id - The ID of the callback to cancel.
     * @public
     */
    globalThis.cancelIdleCallback = function cancelIdleCallback(
        id: ReturnType<typeof globalThis.requestIdleCallback | typeof setTimeout>,
    ): void {
        clearTimeout(id);
    };
})();
