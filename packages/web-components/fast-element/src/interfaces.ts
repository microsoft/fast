/**
 * Represents a callable type such as a function or an object with a "call" method.
 * @public
 */
export type Callable = typeof Function.prototype.call | { call(): void };

/**
 * Represents a type which can be constructed with the new operator.
 *
 * @public
 */
export type Constructable<T = {}> = {
    new (...args: any[]): T;
};

/**
 * Represents a constructable class with a prototype.
 * @public
 */
export type Class<T, C = {}> = C &
    Constructable<T> & {
        /**
         * The class's prototype;
         */
        readonly prototype: T;
    };

/**
 * Provides a mechanism for releasing resources.
 * @public
 */
export interface Disposable {
    /**
     * Disposes the resources.
     */
    dispose(): void;
}

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
 * Reverses all readonly members, making them mutable.
 * @public
 */
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

/**
 * A temporary type as a workaround for the TS compiler's erroneous built-in ParameterDecorator type.
 * @public
 */
export type ParameterDecorator = (
    target: Object,
    propertyKey: string | undefined,
    parameterIndex: number
) => void;

/**
 * The FAST global.
 * @public
 */
export interface FASTGlobal {
    /**
     * The list of loaded versions.
     */
    readonly versions: string[];

    /**
     * Gets a kernel value.
     * @param id - The id to get the value for.
     * @param initialize - Creates the initial value for the id if not already existing.
     */
    getById<T>(id: string | number): T | null;
    getById<T>(id: string | number, initialize: () => T): T;

    /**
     * Sends a warning to the developer.
     * @param code - The warning code to send.
     * @param values - Values relevant for the warning message.
     */
    warn(code: number, values?: Record<string, any>): void;

    /**
     * Creates an error.
     * @param code - The error code to send.
     * @param values - Values relevant for the error message.
     */
    error(code: number, values?: Record<string, any>): Error;

    /**
     * Adds debug messages for errors and warnings.
     * @param messages - The message dictionary to add.
     * @remarks
     * Message can include placeholders like $\{name\} which can be
     * replaced by values passed at runtime.
     */
    addMessages(messages: Record<number, string>): void;
}

let kernelMode;
const kernelAttr = "fast-kernel";

try {
    if (document.currentScript) {
        kernelMode = document.currentScript.getAttribute(kernelAttr);
    } else {
        const scripts = document.getElementsByTagName("script");
        const currentScript = scripts[scripts.length - 1];
        kernelMode = currentScript.getAttribute(kernelAttr);
    }
} catch (e) {
    kernelMode = "isolate";
}

/**
 * Core services that can be shared across FAST instances.
 * @internal
 */
type KernelServiceId = {
    readonly updateQueue: string | number;
    readonly observable: string | number;
    readonly contextEvent: string | number;
    readonly elementRegistry: string | number;
};

let KernelServiceId: KernelServiceId;

switch (kernelMode) {
    case "share": // share the kernel across major versions
        KernelServiceId = Object.freeze({
            updateQueue: 1,
            observable: 2,
            contextEvent: 3,
            elementRegistry: 4,
        });
        break;
    case "share-v2": // only share the kernel with other v2 instances
        KernelServiceId = Object.freeze({
            updateQueue: 1.2,
            observable: 2.2,
            contextEvent: 3.2,
            elementRegistry: 4.2,
        });
        break;
    default:
        // fully isolate the kernel from all other FAST instances
        const postfix = `-${Math.random().toString(36).substring(2, 8)}`;
        KernelServiceId = Object.freeze({
            updateQueue: `1.2${postfix}`,
            observable: `2.2${postfix}`,
            contextEvent: `3.2${postfix}`,
            elementRegistry: `4.2${postfix}`,
        });
        break;
}

export { KernelServiceId };

/**
 * Warning and error messages.
 * @internal
 */
export const enum Message {
    // 1000 - 1100 Kernel
    // 1101 - 1200 Observation
    needsArrayObservation = 1101,
    // 1201 - 1300 Templating
    onlySetDOMPolicyOnce = 1201,
    bindingInnerHTMLRequiresTrustedTypes = 1202,
    twoWayBindingRequiresObservables = 1203,
    hostBindingWithoutHost = 1204,
    unsupportedBindingBehavior = 1205,
    directCallToHTMLTagNotAllowed = 1206,
    onlySetTemplatePolicyOnce = 1207,
    cannotSetTemplatePolicyAfterCompilation = 1208,
    blockedByDOMPolicy = 1209,
    // 1301 - 1400 Styles
    // 1401 - 1500 Components
    missingElementDefinition = 1401,
    // 1501 - 1600 Context and Dependency Injection
    noRegistrationForContext = 1501,
    noFactoryForResolver = 1502,
    invalidResolverStrategy = 1503,
    cannotAutoregisterDependency = 1504,
    cannotResolveKey = 1505,
    cannotConstructNativeFunction = 1506,
    cannotJITRegisterNonConstructor = 1507,
    cannotJITRegisterIntrinsic = 1508,
    cannotJITRegisterInterface = 1509,
    invalidResolver = 1510,
    invalidKey = 1511,
    noDefaultResolver = 1512,
    cyclicDependency = 1513,
    connectUpdateRequiresController = 1514,
}

/**
 * Determines whether or not an object is a function.
 * @public
 */
export const isFunction = (object: any): object is Function =>
    typeof object === "function";

/**
 * Determines whether or not an object is a string.
 * @public
 */
export const isString = (object: any): object is string => typeof object === "string";

/**
 * A function which does nothing.
 * @public
 */
export const noop = () => void 0;
