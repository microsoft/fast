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
    parameterIndex: number,
) => void;



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
    invalidHydrationAttributeMarker = 1210,
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
