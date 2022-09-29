import { StyleElementStrategy } from "./components/element-controller.js";
import type { FASTGlobal, TrustedTypesPolicy } from "./interfaces.js";

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

// ensure FAST global - duplicated in platform.ts
const propConfig = {
    configurable: false,
    enumerable: false,
    writable: false,
};

if (globalThis.FAST === void 0) {
    Reflect.defineProperty(globalThis, "FAST", {
        value: Object.create(null),
        ...propConfig,
    });
}

const FAST: FASTGlobal = globalThis.FAST;

if (FAST.getById === void 0) {
    const storage = Object.create(null);

    Reflect.defineProperty(FAST, "getById", {
        value<T>(id: string | number, initialize?: () => T): T | null {
            let found = storage[id];

            if (found === void 0) {
                found = initialize ? (storage[id] = initialize()) : null;
            }

            return found;
        },
        ...propConfig,
    });
}

// duplicated from DOM
const supportsAdoptedStyleSheets =
    Array.isArray((document as any).adoptedStyleSheets) &&
    "replace" in CSSStyleSheet.prototype;

if (!supportsAdoptedStyleSheets) {
    FAST.getById(/* KernelServiceId.styleSheetStrategy */ 5, () => StyleElementStrategy);
}
