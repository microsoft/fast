/* eslint-disable @typescript-eslint/ban-ts-comment */
(function ensureGlobalThis() {
    if (typeof globalThis !== "undefined") {
        // We're running in a modern environment.
        return;
    }

    // @ts-ignore
    if (typeof global !== "undefined") {
        // We're running in NodeJS
        // @ts-ignore
        global.globalThis = global;
    } else if (typeof self !== "undefined") {
        (self as any).globalThis = self;
    } else if (typeof window !== "undefined") {
        // We're running in the browser's main thread.
        (window as any).globalThis = window;
    } else {
        // Hopefully we never get here...
        // Not all environments allow eval and Function. Use only as a last resort:
        // eslint-disable-next-line no-new-func
        const result = new Function("return this")();
        result.globalThis = result;
    }
})();

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
        options?: { timeout: number }
    ): ReturnType<typeof globalThis.requestIdleCallback | typeof setTimeout> {
        const start = Date.now();
        return setTimeout(() => {
            callback({
                didTimeout: options?.timeout
                    ? Date.now() - start >= options.timeout
                    : false,
                timeRemaining: () => 0,
            });
        }, 1);
    };

    /**
     * A polyfill for cancelIdleCallback that falls back to clearTimeout.
     *
     * @param id - The ID of the callback to cancel.
     * @public
     */
    globalThis.cancelIdleCallback = function cancelIdleCallback(
        id: ReturnType<typeof globalThis.requestIdleCallback | typeof setTimeout>
    ): void {
        clearTimeout(id);
    };
})();
