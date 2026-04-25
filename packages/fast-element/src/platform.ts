import { noop } from "./interfaces.js";

const debugMessages: Record<number, string> = Object.create(null);

/**
 * The FAST messaging API for warnings and errors.
 * @public
 */
export const FAST = {
    /**
     * Sends a warning to the developer.
     * @param code - The warning code to send.
     * @param values - Values relevant for the warning message.
     */
    warn(_code: number, _values?: Record<string, any>): void {},

    /**
     * Creates an error from a code.
     * @param code - The error code.
     * @param values - Values relevant for the error message.
     */
    error(code: number, _values?: Record<string, any>): Error {
        return new Error(`Error ${code}`);
    },

    /**
     * Adds debug messages for errors and warnings.
     * @param messages - The message dictionary to add.
     */
    addMessages(messages: Record<number, string>): void {
        Object.assign(debugMessages, messages);
    },
};

/**
 * Gets the shared debug message lookup.
 * @internal
 */
export function getDebugMessageLookup(): Record<number, string> {
    return debugMessages;
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
    TDefinition extends TypeDefinition,
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
