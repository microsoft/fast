/**
 * A policy for use with the standard trustedTypes platform API.
 * @public
 */
export type TrustedTypesPolicy = {
    /**
     * Creates trusted HTML.
     * @param html - The HTML to clear as trustworthy.
     */
    createHTML(html: string): string;
};

/**
 * Enables working with trusted types.
 * @public
 */
export type TrustedTypes = {
    /**
     * Creates a trusted types policy.
     * @param name - The policy name.
     * @param rules - The policy rules implementation.
     */
    createPolicy(name: string, rules: TrustedTypesPolicy): TrustedTypesPolicy;
};

/**
 * The platform global type.
 * @public
 */
export type Global = typeof globalThis & {
    /**
     * Enables working with trusted types.
     */
    trustedTypes: TrustedTypes;

    /**
     * The FAST global.
     * @internal
     */
    readonly FAST: {
        /**
         * Gets a cross FAST instance shared value.
         * @param id - The id to get the value for.
         * @param initialize - Creates the initial value for the id if not already existing.
         * @internal
         */
        get<T>(id: string, initialize: () => T): T;
    };
};

declare const global: any;

/**
 * A reference to globalThis, with support
 * for browsers that don't yet support the spec.
 * @public
 */
export const $global: Global = (function () {
    if (typeof globalThis !== "undefined") {
        // We're running in a modern environment.
        return globalThis;
    }

    if (typeof global !== "undefined") {
        // We're running in NodeJS
        return global;
    }

    if (typeof self !== "undefined") {
        // We're running in a worker.
        return self;
    }

    if (typeof window !== "undefined") {
        // We're running in the browser's main thread.
        return window;
    }

    try {
        // Hopefully we never get here...
        // Not all environments allow eval and Function. Use only as a last resort:
        // eslint-disable-next-line no-new-func
        return new Function("return this")();
    } catch {
        // If all fails, give up and create an object.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return {};
    }
})();

// API-only Polyfill for trustedTypes
if ($global.trustedTypes === void 0) {
    $global.trustedTypes = { createPolicy: (n: string, r: TrustedTypesPolicy) => r };
}

if ($global.FAST === void 0) {
    const storage = Object.create(null);
    const FAST = Object.create(null);
    const settings = {
        configurable: false,
        enumerable: false,
        writable: false,
    };

    Reflect.defineProperty(FAST, "get", {
        value<T>(id: string, initialize: () => T): T {
            return storage[id] ?? (storage[id] = initialize());
        },
        ...settings,
    });

    Reflect.defineProperty($global, "FAST", {
        value: FAST,
        ...settings,
    });
}

/**
 * A readonly, empty array.
 * @remarks
 * Typically returned by APIs that return arrays when there are
 * no actual items to return.
 * @internal
 */
export const emptyArray = Object.freeze([]);
