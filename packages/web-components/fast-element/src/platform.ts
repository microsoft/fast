import { FASTGlobal, noop } from "./interfaces.js";
import "./polyfills.js";

// ensure FAST global - duplicated debug.ts
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
 * @public
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
            return new Error(`Error ${code}`);
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
export function createTypeRegistry<
    TDefinition extends TypeDefinition
>(): TypeRegistry<TDefinition> {
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
            if (object === null || object === void 0) {
                return void 0;
            }

            return typeToDefinition.get(object.constructor);
        },
    });
}

/**
 * Creates a function capable of locating metadata associated with a type.
 * @returns A metadata locator function.
 * @internal
 */
export function createMetadataLocator<TMetadata>(): (target: {}) => TMetadata[] {
    const metadataLookup = new WeakMap<any, TMetadata[]>();

    return function (target: {}): TMetadata[] {
        let metadata = metadataLookup.get(target);

        if (metadata === void 0) {
            let currentTarget = Reflect.getPrototypeOf(target);

            while (metadata === void 0 && currentTarget !== null) {
                metadata = metadataLookup.get(currentTarget);
                currentTarget = Reflect.getPrototypeOf(currentTarget);
            }

            metadata = metadata === void 0 ? [] : metadata.slice(0);

            metadataLookup.set(target, metadata);
        }

        return metadata;
    };
}

/**
 * Makes a type noop for JSON serialization.
 * @param type - The type to make noop for JSON serialization.
 * @internal
 */
export function makeSerializationNoop(type: { readonly prototype: any }) {
    type.prototype.toJSON = noop;
}
