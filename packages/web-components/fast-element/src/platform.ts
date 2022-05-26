import type { FASTGlobal } from "./interfaces.js";

// ensure FAST global - duplicated in polyfills.ts and debug.ts
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

/**
 * The FAST global.
 * @internal
 */
export const FAST: FASTGlobal = globalThis.FAST;

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

if (FAST.error === void 0) {
    Object.assign(FAST, {
        warn() {},
        error(code: number) {
            return new Error(`Code ${code}`);
        },
        addMessages() {},
    });
}

/**
 * A readonly, empty array.
 * @remarks
 * Typically returned by APIs that return arrays when there are
 * no actual items to return.
 * @public
 */
export const emptyArray = Object.freeze([]);

/**
 * Do not change. Part of shared kernel contract.
 * @internal
 */
export interface TypeDefinition {
    type: Function;
}

/**
 * Do not change. Part of shared kernel contract.
 * @internal
 */
export interface TypeRegistry<TDefinition extends TypeDefinition> {
    register(definition: TDefinition): boolean;
    getByType(key: Function): TDefinition | undefined;
    getForInstance(object: any): TDefinition | undefined;
}

/**
 * Do not change. Part of shared kernel contract.
 * @internal
 */
export function createTypeRegistry<TDefinition extends TypeDefinition>(): TypeRegistry<
    TDefinition
> {
    const typeToDefinition = new Map<Function, TDefinition>();

    return Object.freeze({
        register(definition: TDefinition): boolean {
            if (typeToDefinition.has(definition.type)) {
                return false;
            }

            typeToDefinition.set(definition.type, definition);
            return true;
        },
        getByType<TType extends Function>(key: TType): TDefinition | undefined {
            return typeToDefinition.get(key);
        },
        getForInstance(object: any): TDefinition | undefined {
            return typeToDefinition.get(object.constructor);
        },
    });
}
