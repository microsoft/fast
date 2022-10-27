/**
 * Represents a callable type such as a function or an object with a "call" method.
 * @public
 */
export type Callable = typeof Function.prototype.call | { call(): void };

/**
 * Allows for the creation of Constructable mixin classes.
 *
 * @public
 */
export type Constructable<T = {}> = {
    new (...args: any[]): T;
};

/**
 * Represents a class.
 * @public
 */
export type Class<T, C = {}> = C & {
    /**
     * The class's prototype;
     */
    readonly prototype: T;

    /**
     * The class's constructor.
     */
    new (...args: any[]): T;
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
 * Reverses all readonly members, making them mutable.
 * @internal
 */
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

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
 * The FAST global.
 * @internal
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

/**
 * Core services shared across FAST instances.
 * @internal
 */
export const enum KernelServiceId {
    updateQueue = 1,
    observable = 2,
    contextEvent = 3,
    elementRegistry = 4,
}

/**
 * A node that can be targeted by styles.
 * @public
 */
export interface StyleTarget extends Pick<Node, "getRootNode"> {
    /**
     * Stylesheets to be adopted by the node.
     */
    adoptedStyleSheets?: CSSStyleSheet[];

    /**
     * Adds styles to the target by appending the styles.
     * @param styles - The styles element to add.
     */
    append(styles: HTMLStyleElement): void;

    /**
     * Removes styles from the target.
     * @param styles - The styles element to remove.
     */
    removeChild(styles: HTMLStyleElement): void;

    /**
     * Returns all element descendants of node that match selectors.
     * @param selectors - The CSS selector to use for the query.
     */
    querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
}
/**
 * Implemented to provide specific behavior when adding/removing styles
 * for elements.
 * @public
 */
export interface StyleStrategy {
    /**
     * Adds styles to the target.
     * @param target - The target to add the styles to.
     */
    addStylesTo(target: StyleTarget): void;

    /**
     * Removes styles from the target.
     * @param target - The target to remove the styles from.
     */
    removeStylesFrom(target: StyleTarget): void;
}

/**
 * Warning and error messages.
 * @internal
 */
export const enum Message {
    // 1000 - 1100 Kernel
    // 1101 - 1200 Observation
    needsArrayObservation = 1101,
    // 1201 - 1300 Templating
    onlySetHTMLPolicyOnce = 1201,
    bindingInnerHTMLRequiresTrustedTypes = 1202,
    twoWayBindingRequiresObservables = 1203,
    hostBindingWithoutHost = 1204,
    unsupportedBindingBehavior = 1205,
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
 * @internal
 */
export const isFunction = (object: any): object is Function =>
    typeof object === "function";

/**
 * @internal
 */
export const isString = (object: any): object is string => typeof object === "string";

/**
 * @internal
 */
export const noop = () => void 0;
