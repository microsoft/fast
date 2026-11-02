export interface MetadataReflection {
    decorate(
        decorators: readonly Function[],
        target: object,
        propertyKey?: PropertyKey,
        descriptor?: PropertyDescriptor | null,
    ): object | undefined;
    metadata(
        metadataKey: unknown,
        metadataValue: unknown,
    ): (target: object, propertyKey?: PropertyKey) => void;
    defineMetadata(
        metadataKey: unknown,
        metadataValue: unknown,
        target: object,
        propertyKey?: PropertyKey,
    ): void;
    hasMetadata(metadataKey: unknown, target: object, propertyKey?: PropertyKey): boolean;
    hasOwnMetadata(
        metadataKey: unknown,
        target: object,
        propertyKey?: PropertyKey,
    ): boolean;
    getMetadata(metadataKey: unknown, target: object, propertyKey?: PropertyKey): unknown;
    getOwnMetadata(
        metadataKey: unknown,
        target: object,
        propertyKey?: PropertyKey,
    ): unknown;
    getMetadataKeys(target: object, propertyKey?: PropertyKey): unknown[];
    getOwnMetadataKeys(target: object, propertyKey?: PropertyKey): unknown[];
    deleteMetadata(
        metadataKey: unknown,
        target: object,
        propertyKey?: PropertyKey,
    ): boolean;
}

const methodNames = [
    "decorate",
    "metadata",
    "defineMetadata",
    "hasMetadata",
    "hasOwnMetadata",
    "getMetadata",
    "getOwnMetadata",
    "getMetadataKeys",
    "getOwnMetadataKeys",
    "deleteMetadata",
] as const;

function isObject(value: unknown): value is object {
    return value !== null && (typeof value === "object" || typeof value === "function");
}

function assertTarget(target: unknown): asserts target is object {
    if (!isObject(target)) {
        throw new TypeError("Metadata target must be an object or function.");
    }
}

function toPropertyKey(value: unknown): string | symbol | undefined {
    if (value === void 0 || typeof value === "string" || typeof value === "symbol") {
        return value;
    }

    // Computed keys preserve boxed symbols and Symbol.toPrimitive's string hint.
    return Reflect.ownKeys({ [value as PropertyKey]: void 0 })[0];
}

function metadataPrototype(target: object): object | null {
    const parent = Object.getPrototypeOf(target);

    if (
        typeof target === "function" &&
        target !== Function.prototype &&
        parent === Function.prototype
    ) {
        // Legacy constructor inheritance can exist only on the instance prototype.
        const prototype: unknown = target.prototype;

        if (isObject(prototype)) {
            const instanceParent = Object.getPrototypeOf(prototype);

            if (instanceParent !== null && instanceParent !== Object.prototype) {
                const baseType: unknown = instanceParent.constructor;

                if (typeof baseType === "function" && baseType !== target) {
                    return baseType;
                }
            }
        }
    }

    return parent;
}

// TODO: Remove this legacy Reflect shim after the Context/DI decorator migration.
// https://github.com/microsoft/fast/issues/7210
export function initializeMetadataReflection(): MetadataReflection {
    const reflection = Reflect as typeof Reflect & MetadataReflection;

    if (methodNames.some(name => name in reflection)) {
        const missing = methodNames.filter(
            name => typeof reflection[name] !== "function",
        );

        if (missing.length !== 0) {
            throw new TypeError(
                `Cannot initialize metadata reflection over an incomplete API. Missing: ${missing.join(", ")}.`,
            );
        }

        return reflection;
    }

    const targets = new WeakMap<
        object,
        Map<string | symbol | undefined, Map<unknown, unknown>>
    >();

    function find(
        metadataKey: unknown,
        target: object,
        propertyKey: PropertyKey | undefined,
        inherited: boolean,
    ): Map<unknown, unknown> | undefined {
        assertTarget(target);
        const key = toPropertyKey(propertyKey);

        for (
            let current: object | null = target;
            current !== null;
            current = inherited ? metadataPrototype(current) : null
        ) {
            const values = targets.get(current)?.get(key);

            if (values?.has(metadataKey)) {
                return values;
            }
        }
    }

    function keys(
        target: object,
        propertyKey: PropertyKey | undefined,
        inherited: boolean,
    ): unknown[] {
        assertTarget(target);
        const key = toPropertyKey(propertyKey);
        const result = new Set<unknown>();

        for (
            let current: object | null = target;
            current !== null;
            current = inherited ? metadataPrototype(current) : null
        ) {
            const values = targets.get(current)?.get(key);

            if (values !== void 0) {
                for (const metadataKey of values.keys()) {
                    result.add(metadataKey);
                }
            }
        }

        return Array.from(result);
    }

    const implementation: MetadataReflection = {
        decorate(decorators, target, propertyKey, descriptor) {
            if (!Array.isArray(decorators)) {
                throw new TypeError("Decorators must be an array.");
            }

            assertTarget(target);
            const isClass = propertyKey === void 0;

            if (isClass && typeof target !== "function") {
                throw new TypeError("Class decorator target must be a function.");
            }

            const key = toPropertyKey(propertyKey);
            let result: object | undefined = isClass ? target : (descriptor ?? void 0);

            if (result !== void 0) {
                assertTarget(result);
            }

            for (let index = decorators.length - 1; index >= 0; index--) {
                const decorator = decorators[index];

                if (typeof decorator !== "function") {
                    throw new TypeError("Decorator must be a function.");
                }

                const decorated: unknown = isClass
                    ? decorator(result)
                    : decorator(target, key, result);

                if (decorated !== void 0 && decorated !== null) {
                    assertTarget(decorated);

                    if (isClass && typeof decorated !== "function") {
                        throw new TypeError("Class decorator must return a function.");
                    }

                    result = decorated;
                }
            }

            return result;
        },
        metadata(metadataKey, metadataValue) {
            return (target, propertyKey) => {
                assertTarget(target);

                if (
                    propertyKey !== void 0 &&
                    typeof propertyKey !== "string" &&
                    typeof propertyKey !== "symbol"
                ) {
                    throw new TypeError(
                        "Metadata decorator property key must be a string or symbol.",
                    );
                }

                reflection.defineMetadata(
                    metadataKey,
                    metadataValue,
                    target,
                    propertyKey,
                );
            };
        },
        defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            assertTarget(target);
            const key = toPropertyKey(propertyKey);
            let properties = targets.get(target);

            if (properties === void 0) {
                targets.set(target, (properties = new Map()));
            }

            let values = properties.get(key);

            if (values === void 0) {
                properties.set(key, (values = new Map()));
            }

            values.set(metadataKey, metadataValue);
        },
        hasMetadata: (metadataKey, target, propertyKey) =>
            find(metadataKey, target, propertyKey, true) !== void 0,
        hasOwnMetadata: (metadataKey, target, propertyKey) =>
            find(metadataKey, target, propertyKey, false) !== void 0,
        getMetadata: (metadataKey, target, propertyKey) =>
            find(metadataKey, target, propertyKey, true)?.get(metadataKey),
        getOwnMetadata: (metadataKey, target, propertyKey) =>
            find(metadataKey, target, propertyKey, false)?.get(metadataKey),
        getMetadataKeys: (target, propertyKey) => keys(target, propertyKey, true),
        getOwnMetadataKeys: (target, propertyKey) => keys(target, propertyKey, false),
        deleteMetadata(metadataKey, target, propertyKey) {
            assertTarget(target);
            const key = toPropertyKey(propertyKey);
            const properties = targets.get(target);
            const values = properties?.get(key);

            if (
                properties === void 0 ||
                values === void 0 ||
                !values.delete(metadataKey)
            ) {
                return false;
            }

            if (values.size === 0) {
                properties.delete(key);

                if (properties.size === 0) {
                    targets.delete(target);
                }
            }

            return true;
        },
    };

    for (const name of methodNames) {
        Object.defineProperty(reflection, name, {
            configurable: true,
            value: implementation[name],
            writable: true,
        });
    }

    return reflection;
}
