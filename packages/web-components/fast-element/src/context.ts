import { Constructable, Message, ParameterDecorator } from "./interfaces.js";
import { Metadata } from "./metadata.js";
import { FAST } from "./platform.js";

/**
 * A Context object defines an optional initial value for a Context, as well as a name identifier for debugging purposes.
 * @public
 */
export type Context<T> = {
    readonly name: string;
    readonly initialValue?: T;
};

/**
 * A constant key that can be used to represent a Context dependency.
 * The key can be used for context or DI but also doubles as a decorator for
 * resolving the associated dependency.
 * @public
 */
export type ContextDecorator<T = any> = Readonly<Context<T>> &
    PropertyDecorator &
    ParameterDecorator;

/**
 * A Context object defines an optional initial value for a Context, as well as a name identifier for debugging purposes.
 * The FASTContext can also be used as a decorator to declare context dependencies or as a key for DI.
 * @public
 */
export type FASTContext<T> = ContextDecorator<T> & {
    get(target: EventTarget): T;
    provide(target: EventTarget, value: T): void;
    request(target: EventTarget, callback: ContextCallback<T>, multiple?: boolean): void;
    handle(
        target: EventTarget,
        callback: (event: ContextEvent<FASTContext<T>>) => void
    ): void;
};

/**
 * A strategy that controls how all Context.request API calls are handled.
 * @remarks
 * By default this is handled via Context.dispatch, which dispatches a ContextEvent.
 * @public
 */
export type FASTContextRequestStrategy = <T extends UnknownContext>(
    target: EventTarget,
    context: T,
    callback: ContextCallback<ContextType<T>>,
    multiple
) => void;

const contextsByName = new Map<string, FASTContext<unknown>>();
const contextEventType = "context-request";
let requestStrategy: FASTContextRequestStrategy;

/**
 * Enables using the {@link https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md | W3C Community Context protocol.}
 * @public
 */
export const Context = Object.freeze({
    /**
     * The event type used for W3C Context Protocol requests.
     */
    eventType: contextEventType,

    /**
     * Returns a FASTContext object from the global context registry matching the given name if found.
     * Otherwise, returns a new FASTContext with this name.
     * @param name - The name of the FASTContext to get or create.
     * @returns A FASTContext object.
     */
    for<T = unknown>(name: string): FASTContext<T> {
        let c = contextsByName.get(name) as FASTContext<T>;

        if (c === void 0) {
            c = Context.create<T>(name);
            contextsByName.set(name, c);
        }

        return c;
    },

    /**
     * Creates a W3C Community Protocol-based Context object to use in requesting/providing
     * context through the DOM.
     * @param name - The name to use for the connext. Useful in debugging.
     * @param initialValue - An optional initial value to use if a context handler isn't found.
     */
    create<T = unknown>(name: string, initialValue?: T): FASTContext<T> {
        const Interface = function (
            target: Constructable<Node>,
            property: string,
            index: number
        ): void {
            if (target == null || new.target !== undefined) {
                throw FAST.error(Message.noRegistrationForContext, {
                    name: Interface.name,
                });
            }

            if (property) {
                Context.defineProperty(target, property, Interface);
            } else {
                const types = Metadata.getOrCreateAnnotationParamTypes(target);
                types[index] = Interface;
            }
        } as FASTContext<T>;

        (Interface as any).$isInterface = true;
        (Interface as any).initialValue = initialValue;
        Reflect.defineProperty(Interface, "name", { value: name });

        Interface.handle = (
            target: EventTarget,
            callback: (event: ContextEvent<FASTContext<T>>) => void
        ) => Context.handle(target, callback, Interface);

        Interface.provide = (target: EventTarget, value: T) =>
            Context.provide(target, Interface, value);

        Interface.get = (target: EventTarget) => Context.get(target, Interface);

        Interface.request = (
            target: EventTarget,
            callback: ContextCallback<T>,
            multiple?: boolean
        ) => Context.request(target, Interface, callback, multiple);

        Interface.toString = () => `Context<${Interface.name}>`;

        return Interface;
    },

    /**
     * Sets the strategy used by all FAST-specific context requests made through the
     * Context.request, Context.get, Context.defineProperty, and ContextDecorator APIs.
     * @param strategy - The strategy to use. By default, the strategy is Context.dispatch.
     */
    setDefaultRequestStrategy(strategy: FASTContextRequestStrategy) {
        requestStrategy = strategy;
    },

    /**
     * Gets the context value for the target node or returns the initial value if
     * a context handler is not found.
     * @param target - The target to get the context for.
     * @param context - The context to locate.
     * @returns The context value.
     * @remarks
     * Uses the default request strategy to locate the context. If no context is found
     * then the initial value of the context is returned.
     */
    get<T extends UnknownContext>(target: EventTarget, context: T): ContextType<T> {
        let value: ContextType<T>;
        requestStrategy(target, context, found => (value = found), false);
        return value! ?? (context.initialValue as ContextType<T>);
    },

    /**
     * Requests the context value for the target node.
     * @param target - The target to request the context for.
     * @param context - The context to locate.
     * @param callback - A callback to invoke with the context value.
     * @param multiple - Whether the context requestor expects to handle updates
     * to the context value after the initial request.
     * @remarks
     * Uses the default request strategy to locate the context.
     */
    request<T extends UnknownContext>(
        target: EventTarget,
        context: T,
        callback: ContextCallback<ContextType<T>>,
        multiple = false
    ): void {
        requestStrategy(target, context, callback, multiple);
    },

    /**
     *
     * @param target - The target to dispatch the context event on.
     * @param context - The context to locate.
     * @param callback - The callback to invoke with the context value.
     * @param multiple - Whether the context requestor expects to handle updates
     * to the context value after the initial request.
     * @remarks
     * This API does NOT use the default request strategy. It always dispatches
     * an event through the DOM.
     */
    dispatch<T extends UnknownContext>(
        target: EventTarget,
        context: T,
        callback: ContextCallback<ContextType<T>>,
        multiple = false
    ) {
        target.dispatchEvent(new ContextEvent(context, callback, multiple));
    },

    /**
     * Enables an event target to provide a context value.
     * @param target The target to provide the context value for.
     * @param context The context to provide the value for.
     * @param value The value to provide for the context.
     */
    provide<T extends UnknownContext>(
        target: EventTarget,
        context: T,
        value: ContextType<T>
    ) {
        Context.handle(
            target,
            (event: ContextEvent<T>) => {
                event.stopImmediatePropagation();
                event.callback(value);
            },
            context
        );
    },

    /**
     *
     * @param target - The target on which to handle context requests.
     * @param callback - The callback to invoke when a context request is received.
     * @param context - The context to handle requests for.
     * @remarks
     * If a context is not provided then the callback will be invoked for all context
     * requests that are received on the target.
     */
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

    /**
     * Defines a getter-only property on the target that will return the context
     * value for the target.
     * @param target The target to define the property on.
     * @param propertyName The name of the property to define.
     * @param context The context that will be used to retrieve the property value.
     * @remarks
     * Uses the default request strategy to locate the context and will return the
     * initialValue if the context isn't handled.
     */
    defineProperty<T extends UnknownContext>(
        target: Constructable<EventTarget> | EventTarget,
        propertyName: string,
        context: T
    ) {
        const field = Symbol.for(`fast:di:${propertyName}`);

        Reflect.defineProperty(target, propertyName, {
            get: function (this: EventTarget) {
                return this[field] ?? (this[field] = Context.get(this, context));
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
