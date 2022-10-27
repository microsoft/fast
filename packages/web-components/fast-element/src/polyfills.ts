import type { TrustedTypesPolicy } from "./interfaces.js";

// GlobalThis goes to platform
declare const global: any;

(function ensureGlobalThis() {
    if (typeof globalThis !== "undefined") {
        // We're running in a modern environment.
        return;
    }

    if (typeof global !== "undefined") {
        // We're running in NodeJS
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

// API-only Polyfill for trustedTypes
if (!globalThis.trustedTypes) {
    globalThis.trustedTypes = {
        createPolicy: (n: string, r: TrustedTypesPolicy) => r,
    };
}
