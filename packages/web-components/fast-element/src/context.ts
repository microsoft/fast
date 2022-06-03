import type { Constructable } from "./interfaces.js";
import { Metadata } from "./metadata.js";

/**
 * A Context object defines an optional initial value for a Context, as well as a name identifier for debugging purposes.
 * @public
 */
export type Context<T> = {
    name: string;
    initialValue?: T;
};

/**
 * A constant key that can be used to represent an interface to a dependency.
 * The key can be used for context or DI but also doubles as a decorator for
 * resolving the associated dependency.
 * @beta
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export type ContextDecorator<T = any> = Readonly<Context<T>> &
    ((target: Constructable, property: string, index?: number) => void);

/**
 * A Context object defines an optional initial value for a Context, as well as a name identifier for debugging purposes.
 * The FASTContext can also be used as a decorator to declare context dependencies or as a key for DI.
 * @beta
 */
export type FASTContext<T> = ContextDecorator<T> & {
    request(node: Node, callback: ContextCallback<T>, multiple?: boolean): void;
    handle(node: Node, callback: (event: ContextEvent<FASTContext<T>>) => void);
};

/**
 * A strategy that controls how all Context.request API calls are handled.
 * @remarks
 * By default this is handled via Context.dispatch, which dispatched a ContextEvent.
 * @beta
 */
export type FASTContextRequestStrategy = <T extends UnknownContext>(
    target: EventTarget,
    context: T,
    callback: ContextCallback<ContextType<T>>,
    multiple
) => void;

const contextEventType = "context-request";
let requestStrategy: FASTContextRequestStrategy;

/**
 * Enables using the W3C Community Context protocol.
 * @beta
 */
export const Context = Object.freeze({
    /**
     * The event type used for W3C Context Protocol requests.
     */
    eventType: contextEventType,

    /**
     * Creates a W3C Community Protocol-based Context object to use in requesting/providing
     * context through the DOM.
     */
    create<T = unknown>(name: string, initialValue?: T): FASTContext<T> {
        const Interface = function (
            target: Constructable<Node>,
            property: string,
            index: number
        ): void {
            if (target == null || new.target !== undefined) {
                throw new Error(`No registration for context: '${Interface.name}'`);
            }

            if (property) {
                Context.defineProperty(target, property, Interface);
            } else {
                const annotationParamtypes = Metadata.getOrCreateAnnotationParamTypes(
                    target
                );
                annotationParamtypes[index] = Interface;
            }
        } as FASTContext<T>;

        (Interface as any).$isInterface = true;
        (Interface as any).initialValue = initialValue;
        Reflect.defineProperty(Interface, "name", { value: name });

        Interface.handle = function (
            node: Node,
            callback: (event: ContextEvent<FASTContext<T>>) => void
        ) {
            Context.handle(node, callback, Interface);
        };

        Interface.request = function (
            node: Node,
            callback: ContextCallback<T>,
            multiple?: boolean
        ) {
            Context.request(node, Interface, callback, multiple);
        };

        Interface.toString = function toString(): string {
            return `Context<${Interface.name}>`;
        };

        return Interface;
    },

    setDefaultRequestStrategy(strategy: FASTContextRequestStrategy) {
        requestStrategy = strategy;
    },

    request<T extends UnknownContext>(
        target: EventTarget,
        context: T,
        callback: ContextCallback<ContextType<T>>,
        multiple = false
    ) {
        requestStrategy(target, context, callback, multiple);
    },

    dispatch<T extends UnknownContext>(
        target: EventTarget,
        context: T,
        callback: ContextCallback<ContextType<T>>,
        multiple = false
    ) {
        target.dispatchEvent(new ContextEvent(context, callback, multiple));
    },

    handle<T extends UnknownContext>(
        target: EventTarget,
        callback: (event: ContextEvent<T>) => void,
        context?: T
    ) {
        if (context) {
            target.addEventListener(contextEventType, (event: ContextEvent<T>) => {
                if (event.context === context) {
                    callback(event);
                }
            });
        } else {
            target.addEventListener(contextEventType, callback);
        }
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
                    Context.request(this, context, found => (value = found));
                }

                return value ?? context.initialValue;
            },
        });
    },
});

Context.setDefaultRequestStrategy(Context.dispatch);

/**
 * An unknown context type.
 * @public
 */
export type UnknownContext = Context<unknown>;

/**
 * A helper type which can extract a Context value type from a Context type
 * @public
 */
export type ContextType<T extends UnknownContext> = T extends Context<infer Y>
    ? Y
    : never;

/**
 * A callback which is provided by a context requester and is called with the value satisfying the request.
 * This callback can be called multiple times by context providers as the requested value is changed.
 * @public
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
 * @public
 */
export class ContextEvent<T extends UnknownContext> extends Event {
    public constructor(
        public readonly context: T,
        public readonly callback: ContextCallback<ContextType<T>>,
        public readonly multiple?: boolean
    ) {
        super(contextEventType, { bubbles: true, composed: true });
    }
}

declare global {
    interface HTMLElementEventMap {
        /**
         * A 'context-request' event can be emitted by any element which desires
         * a context value to be injected by an external provider.
         */
        [contextEventType]: ContextEvent<UnknownContext>;
    }
}
