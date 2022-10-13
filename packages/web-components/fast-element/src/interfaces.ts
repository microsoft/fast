import { FAST } from "./platform.js";

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

/**
 * The type of HTML aspect to target.
 * @public
 */
export const Aspect = Object.freeze({
    /**
     * Not aspected.
     */
    none: 0 as const,

    /**
     * An attribute.
     */
    attribute: 1 as const,

    /**
     * A boolean attribute.
     */
    booleanAttribute: 2 as const,

    /**
     * A property.
     */
    property: 3 as const,

    /**
     * Content
     */
    content: 4 as const,

    /**
     * A token list.
     */
    tokenList: 5 as const,

    /**
     * An event.
     */
    event: 6 as const,
} as const);

/**
 * The type of HTML aspect to target.
 * @public
 */
export type Aspect = typeof Aspect[Exclude<keyof typeof Aspect, "none">];

export type DOMSink = (
    target: Node,
    aspectName: string,
    value: any,
    ...args: any[]
) => void;

export interface SecurityPolicy {
    createHTML(value: string): string;
    protect<T extends DOMSink = DOMSink>(
        tagName: string | null,
        aspect: Aspect,
        aspectName: string,
        sink: T
    ): T;
}

let defaultPolicy: SecurityPolicy = {
    createHTML(value: string): string {
        return value;
    },

    protect<T extends DOMSink = DOMSink>(
        tagName: string | null,
        aspect: Aspect,
        aspectName: string,
        sink: T
    ): T {
        return sink;
    },
};

const fastPolicy = defaultPolicy;

export const SecurityPolicy = {
    get default() {
        return defaultPolicy;
    },

    /**
     * Sets the security policy used by the templating system.
     * @param policy - The policy to set.
     * @remarks
     * This API can only be called once, for security reasons. It should be
     * called by the application developer at the start of their program.
     */
    set default(value: SecurityPolicy) {
        if (defaultPolicy !== fastPolicy) {
            // TODO: fix error message
            throw FAST.error(Message.onlySetHTMLPolicyOnce);
        }

        defaultPolicy = value;
    },
};
