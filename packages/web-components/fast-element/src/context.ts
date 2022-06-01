import type { Constructable } from "./interfaces.js";
import { Metadata } from "./metadata.js";

/**
 * A Context object defines an optional initial value for a Context, as well as a name identifier for debugging purposes.
 */
export type Context<T> = {
    name: string;
    initialValue?: T;
};

export type FASTContext<T> = Context<T> & {
    request(
        node: Node,
        callback: ContextCallback<FASTContext<T>>,
        multiple?: boolean
    ): void;
    handle(node: Node, callback: (event: ContextEvent<FASTContext<T>>) => void);
};

/**
 * A constant key that can be used to represent an interface to a dependency.
 * The key can be used for context or DI but also doubles as a decorator for
 * resolving the associated dependency.
 * @public
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export type InterfaceSymbol<T = any> = Readonly<Context<T>> &
    ((target: Constructable, property: string, index?: number) => void);

const contextEventName = "context-request";

let getValueForInjectedProperty = function <T>(object: Node, context: Context<T>) {
    let value;
    Context.request(object, context, found => (value = found));
    return value;
};

export const Context = Object.freeze({
    /**
     * Creates a W3C Community Protocol-based Context object to use in requesting/providing
     * context through the DOM.
     */
    create<T = unknown>(
        name: string,
        initialValue?: T
    ): InterfaceSymbol<T> & Readonly<FASTContext<T>> {
        const Interface = function (
            target: Constructable<Node>,
            property: string,
            index: number
        ): void {
            if (target == null || new.target !== undefined) {
                throw new Error(`No registration for interface: '${Interface.name}'`);
            }

            if (property) {
                Context.defineProperty(target, property, Interface);
            } else {
                const annotationParamtypes = Metadata.getOrCreateAnnotationParamTypes(
                    target
                );
                annotationParamtypes[index] = Interface;
            }
        };

        Interface.$isInterface = true;
        Interface.initialValue = initialValue;
        Reflect.defineProperty(Interface, "name", { value: name });

        Interface.handle = function (
            node: Node,
            callback: (event: ContextEvent<FASTContext<T>>) => void
        ) {
            Context.handle(node, callback);
        };

        Interface.request = function (
            node: Node,
            callback: ContextCallback<FASTContext<T>>,
            multiple?: boolean
        ) {
            Context.request(node, this, callback, multiple);
        };

        Interface.toString = function toString(): string {
            return `ContextInterfaceSymbol<${Interface.name}>`;
        };

        return Interface;
    },

    request<T extends UnknownContext>(
        node: Node,
        context: T,
        callback: ContextCallback<ContextType<T>>,
        multiple = false
    ) {
        node.dispatchEvent(new ContextEvent(context, callback, multiple));
    },

    handle<T extends UnknownContext>(
        node: Node,
        callback: (event: ContextEvent<T>) => void
    ) {
        node.addEventListener(contextEventName, callback);
    },

    defineProperty<T extends UnknownContext>(
        target: Constructable<Node> | Node,
        propertyName: string,
        context: T
    ) {
        const field = `$di_${propertyName}`;

        Reflect.defineProperty(target, propertyName, {
            get: function (this: Node) {
                let value = this[field];

                if (value === void 0) {
                    value = getValueForInjectedProperty(this, context);
                }

                return value ?? context.initialValue;
            },
        });
    },

    setDefaultPropertyInjectionStrategy(
        strategy: <T = unknown>(object: Node, context: Context<T>) => T
    ) {
        getValueForInjectedProperty = strategy;
    },
});

/**
 * An unknown context typeU
 */
export type UnknownContext = Context<unknown>;

/**
 * A helper type which can extract a Context value type from a Context type
 */
export type ContextType<T extends UnknownContext> = T extends Context<infer Y>
    ? Y
    : never;

/**
 * A callback which is provided by a context requester and is called with the value satisfying the request.
 * This callback can be called multiple times by context providers as the requested value is changed.
 */
export type ContextCallback<ValueType> = (value: ValueType, dispose?: () => void) => void;

/**
 * An event fired by a context requester to signal it desires a named context.
 *
 * A provider should inspect the `context` property of the event to determine if it has a value that can
 * satisfy the request, calling the `callback` with the requested value if so.
 *
 * If the requested context event contains a truthy `multiple` value, then a provider can call the callback
 * multiple times if the value is changed, if this is the case the provider should pass a `dispose`
 * method to the callback which requesters can invoke to indicate they no longer wish to receive these updates.
 */
export class ContextEvent<T extends UnknownContext> extends Event {
    public constructor(
        public readonly context: T,
        public readonly callback: ContextCallback<ContextType<T>>,
        public readonly multiple?: boolean
    ) {
        super(contextEventName, { bubbles: true, composed: true });
    }
}

declare global {
    interface HTMLElementEventMap {
        /**
         * A 'context-request' event can be emitted by any element which desires
         * a context value to be injected by an external provider.
         */
        [contextEventName]: ContextEvent<UnknownContext>;
    }
}
