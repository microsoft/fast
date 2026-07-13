import { type Disposable, isFunction, isString, Message } from "../interfaces.js";
import { createMetadataLocator, FAST, makeSerializationNoop } from "../platform.js";
import type { Notifier, Subscriber } from "./notifier.js";
import { PropertyChangeNotifier, SubscriberSet } from "./notifier.js";
import { Updates } from "./update-queue.js";

/**
 * Represents a getter/setter property accessor on an object.
 * @public
 */
export interface Accessor {
    /**
     * The name of the property.
     */
    name: string;

    /**
     * Gets the value of the property on the source object.
     * @param source - The source object to access.
     */
    getValue(source: any): any;

    /**
     * Sets the value of the property on the source object.
     * @param source - The source object to access.
     * @param value - The value to set the property to.
     */
    setValue(source: any, value: any): void;
}

/**
 * The signature of an arrow function capable of being evaluated
 * against source data and within an execution context.
 * @public
 */
export type Expression<TSource = any, TReturn = any, TParent = any> = (
    source: TSource,
    context: ExecutionContext<TParent>,
) => TReturn;

/**
 * A record of observable property access.
 * @public
 */
export interface ObservationRecord {
    /**
     * The source object with an observable property that was accessed.
     */
    propertySource: any;

    /**
     * The name of the observable property on {@link ObservationRecord.propertySource} that was accessed.
     */
    propertyName: string;
}

interface SubscriptionRecord extends Omit<ObservationRecord, "propertyName"> {
    /**
     * Undefined for the fallback subscription to the source itself,
     * which watches every observable property rather than a single one.
     */
    propertyName: string | undefined;
    notifier: Notifier;
    next: SubscriptionRecord | undefined;
}

/**
 * Describes how the source's lifetime relates to its controller's lifetime.
 * @public
 */
export const SourceLifetime = Object.freeze({
    /**
     * The source to controller lifetime relationship is unknown.
     */
    unknown: void 0,
    /**
     * The source and controller lifetimes are coupled to one another.
     * They can/will be GC'd together.
     */
    coupled: 1,
} as const);

/**
 * Describes how the source's lifetime relates to its controller's lifetime.
 * @public
 */
export type SourceLifetime = (typeof SourceLifetime)[keyof typeof SourceLifetime];

/**
 * Controls the lifecycle of an expression and provides relevant context.
 * @public
 */
export interface ExpressionController<TSource = any, TParent = any> {
    /**
     * The source the expression is evaluated against.
     */
    readonly source: TSource;

    /**
     * Indicates how the source's lifetime relates to the controller's lifetime.
     */
    readonly sourceLifetime?: SourceLifetime;

    /**
     * The context the expression is evaluated against.
     */
    readonly context: ExecutionContext<TParent>;

    /**
     * Indicates whether the controller is bound.
     */
    readonly isBound: boolean;

    /**
     * Registers an unbind handler with the controller.
     * @param behavior - An object to call when the controller unbinds.
     */
    onUnbind(behavior: {
        unbind(controller: ExpressionController<TSource, TParent>);
    }): void;
}

/**
 * Observes an expression for changes.
 * @public
 */
export interface ExpressionObserver<TSource = any, TReturn = any, TParent = any> {
    /**
     * Binds the expression to the source.
     * @param controller - The controller that manages the lifecycle and related
     * context for the expression.
     */
    bind(controller: ExpressionController<TSource, TParent>): TReturn;
}

/**
 * Enables evaluation of and subscription to a binding.
 * @public
 */
export interface ExpressionNotifier<TSource = any, TReturn = any, TParent = any>
    extends Notifier,
        ExpressionObserver<TSource, TReturn, TParent>,
        Disposable {
    /**
     * Observes the expression.
     * @param source - The source for the expression.
     * @param context - The context for the expression.
     */
    observe(source: TSource, context?: ExecutionContext): TReturn;

    /**
     * Gets {@link ObservationRecord|ObservationRecords} for the observable properties
     * that the {@link ExpressionNotifier} is observing.
     * @remarks
     * An expression that short-circuits before reading any observable property
     * observes its source as a whole rather than a property of it, and yields no
     * records.
     */
    records(): IterableIterator<ObservationRecord>;

    /**
     * Sets the update mode used by the observer.
     * @param isAsync - Indicates whether updates should be asynchronous.
     * @remarks
     * By default, the update mode is asynchronous, since that provides the best
     * performance for template rendering scenarios. Passing false to setMode will
     * instead cause the observer to notify subscribers immediately when changes occur.
     */
    setMode(isAsync: boolean): void;
}

/**
 * Common Observable APIs.
 * @public
 */
export const Observable = (() => {
    const queueUpdate = Updates.enqueue;
    const volatileRegex = /(:|&&|\|\||if|\?\.)/;
    const notifierLookup = new WeakMap<any, Notifier>();
    let watcher: ExpressionNotifierImplementation | undefined = void 0;
    let createArrayObserver = (array: any[]): Notifier => {
        throw FAST.error(Message.needsArrayObservation);
    };

    function getNotifier<T extends Notifier = Notifier>(source: any): T {
        let found = source.$fastController ?? notifierLookup.get(source);

        if (found === void 0) {
            Array.isArray(source)
                ? (found = createArrayObserver(source))
                : notifierLookup.set(
                      source,
                      (found = new PropertyChangeNotifier(source)),
                  );
        }

        return found;
    }

    /**
     * Gets the notifier used to watch a source in its entirety, or undefined
     * when the source cannot be watched.
     * @remarks
     * Primitives and null are not valid WeakMap keys, and an array would have to
     * be given an array observer, which is only available when array observation
     * is enabled. Every other source gets a notifier, creating one if needed: an
     * observable property that has never been written has no notifier yet either,
     * so requiring an existing one would leave the expression permanently unable
     * to re-evaluate, based on nothing more than whether some other property of
     * the source happened to be written or observed first.
     */
    function getSubjectNotifier(source: any): Notifier | undefined {
        return source === null ||
            (typeof source !== "object" && typeof source !== "function") ||
            Array.isArray(source)
            ? void 0
            : getNotifier(source);
    }

    const getAccessors = createMetadataLocator<Accessor>();

    class DefaultObservableAccessor implements Accessor {
        private field: string;
        private callback: string;

        constructor(public name: string) {
            this.field = `_${name}`;
            this.callback = `${name}Changed`;
        }

        getValue(source: any): any {
            if (watcher !== void 0) {
                watcher.watch(source, this.name);
            }

            return source[this.field];
        }

        setValue(source: any, newValue: any): void {
            const field = this.field;
            const oldValue = source[field];

            if (oldValue !== newValue) {
                source[field] = newValue;

                const callback = source[this.callback];

                if (isFunction(callback)) {
                    callback.call(source, oldValue, newValue);
                }

                getNotifier(source).notify(this.name);
            }
        }
    }

    class ExpressionNotifierImplementation<TSource = any, TReturn = any>
        extends SubscriberSet
        implements ExpressionNotifier<TSource, TReturn>
    {
        public needsRefresh: boolean = true;
        private needsQueue: boolean = true;
        private isAsync = true;

        private first: SubscriptionRecord = this as any;
        private last: SubscriptionRecord | null = null;
        private propertySource: any = void 0;
        private propertyName: string | undefined = void 0;
        private notifier: Notifier | undefined = void 0;
        private next: SubscriptionRecord | undefined = void 0;

        constructor(
            private expression: Expression<TSource, TReturn>,
            initialSubscriber?: Subscriber,
            private isVolatileBinding: boolean = false,
        ) {
            super(expression, initialSubscriber);
        }

        public setMode(isAsync: boolean): void {
            this.isAsync = this.needsQueue = isAsync;
        }

        public bind(controller: ExpressionController) {
            const value = this.observe(controller.source, controller.context);

            if (!controller.isBound && this.requiresUnbind(controller)) {
                controller.onUnbind(this);
            }

            return value;
        }

        private requiresUnbind(controller: ExpressionController) {
            return (
                controller.sourceLifetime !== SourceLifetime.coupled ||
                this.first !== this.last ||
                // A single property record on a coupled source is left subscribed,
                // because it is torn down with the source. The fallback record is a
                // subscription to *every* observable on the source, so it is worth
                // disposing: an unbound view should not keep re-evaluating the
                // expression on every change to the source it used to be bound to.
                this.first.propertyName === void 0 ||
                this.first.propertySource !== controller.source
            );
        }

        public unbind(controller: ExpressionController) {
            this.dispose();
        }

        public observe(source: TSource, context: ExecutionContext): TReturn {
            if (this.needsRefresh && this.last !== null) {
                this.dispose();
            }

            const isTracking = this.needsRefresh;
            const previousWatcher = watcher;
            watcher = isTracking ? this : void 0;
            this.needsRefresh = this.isVolatileBinding;
            let result;
            try {
                result = this.expression(source, context);
            } finally {
                watcher = previousWatcher;
            }

            // A volatile expression can short-circuit (&&, ||, ?., ternary) before
            // reading any observable, which would leave the expression with zero
            // subscriptions and therefore no way to ever be evaluated again. Watch
            // the source itself instead, so that any observable change on it
            // re-evaluates the expression.
            if (this.last === null && isTracking && this.needsRefresh) {
                const notifier = getSubjectNotifier(source);

                if (notifier !== void 0) {
                    this.watchSubject(source, notifier);
                }
            }

            return result;
        }

        // backwards compat with v1 kernel
        public disconnect() {
            this.dispose();
        }

        public dispose(): void {
            if (this.last !== null) {
                let current = this.first;

                while (current !== void 0) {
                    current.notifier.unsubscribe(this, current.propertyName);
                    current = current.next!;
                }

                this.last = null;
                // There are no subscriptions left, so the next evaluation must track again.
                this.needsRefresh = true;
                this.needsQueue = this.isAsync;
            }
        }

        /**
         * Subscribes to every observable change on the source.
         * @remarks
         * Only called when the expression tracked no dependencies, so the record
         * always reuses `first` and no record is allocated. The source is given a
         * notifier if it does not have one, which is the only allocation on this
         * path and happens at most once per source.
         */
        private watchSubject(propertySource: unknown, notifier: Notifier): void {
            const current = this.first;

            current.propertySource = propertySource;
            current.propertyName = void 0;
            current.notifier = notifier;
            current.next = void 0;

            notifier.subscribe(this);

            this.last = current;
        }

        public watch(propertySource: unknown, propertyName: string): void {
            const prev = this.last;
            const notifier = getNotifier(propertySource);
            const current: SubscriptionRecord = prev === null ? this.first : ({} as any);

            current.propertySource = propertySource;
            current.propertyName = propertyName;
            current.notifier = notifier;

            notifier.subscribe(this, propertyName);

            if (prev === null) {
                // Drop the records left behind by a previous, longer evaluation.
                current.next = void 0;
            } else {
                if (!this.needsRefresh) {
                    // Declaring the variable prior to assignment below circumvents
                    // a bug in Angular's optimization process causing infinite recursion
                    // of this watch() method. Details https://github.com/microsoft/fast/issues/4969
                    // biome-ignore lint/style/useConst: see above
                    let prevValue;
                    watcher = void 0;
                    // prev is a property record: the subject record is always last.
                    prevValue = prev.propertySource[prev.propertyName!];
                    watcher = this;

                    if (propertySource === prevValue) {
                        this.needsRefresh = true;
                    }
                }

                prev.next = current;
            }

            this.last = current!;
        }

        handleChange(): void {
            if (this.needsQueue) {
                this.needsQueue = false;
                queueUpdate(this);
            } else if (!this.isAsync) {
                this.call();
            }
        }

        call(): void {
            if (this.last !== null) {
                this.needsQueue = this.isAsync;
                this.notify(this);
            }
        }

        public *records(): IterableIterator<ObservationRecord> {
            // With no subscriptions, `first` holds either uninitialized fields
            // or the leftovers of an evaluation that has since been disposed.
            if (this.last === null) {
                return;
            }

            let next: SubscriptionRecord | undefined = this.first;

            while (next !== void 0) {
                // The fallback subscription to the source is not a property
                // observation, and ObservationRecord.propertyName is a string.
                if (next.propertyName !== void 0) {
                    yield next as ObservationRecord;
                }

                next = next.next;
            }
        }
    }

    makeSerializationNoop(ExpressionNotifierImplementation);

    return Object.freeze({
        /**
         * @internal
         * @param factory - The factory used to create array observers.
         */
        setArrayObserverFactory(factory: (collection: any[]) => Notifier): void {
            createArrayObserver = factory;
        },

        /**
         * Gets a notifier for an object or Array.
         * @param source - The object or Array to get the notifier for.
         */
        getNotifier,

        /**
         * Records a property change for a source object.
         * @param source - The object to record the change against.
         * @param propertyName - The property to track as changed.
         */
        track(source: unknown, propertyName: string): void {
            watcher && watcher.watch(source, propertyName);
        },

        /**
         * Notifies watchers that the currently executing property getter or function is volatile
         * with respect to its observable dependencies.
         */
        trackVolatile(): void {
            watcher && (watcher.needsRefresh = true);
        },

        /**
         * Notifies subscribers of a source object of changes.
         * @param source - the object to notify of changes.
         * @param args - The change args to pass to subscribers.
         */
        notify(source: unknown, args: any): void {
            /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
            getNotifier(source).notify(args);
        },

        /**
         * Defines an observable property on an object or prototype.
         * @param target - The target object to define the observable on.
         * @param nameOrAccessor - The name of the property to define as observable;
         * or a custom accessor that specifies the property name and accessor implementation.
         */
        defineProperty(target: {}, nameOrAccessor: string | Accessor): void {
            if (isString(nameOrAccessor)) {
                nameOrAccessor = new DefaultObservableAccessor(nameOrAccessor);
            }

            getAccessors(target).push(nameOrAccessor);

            Reflect.defineProperty(target, nameOrAccessor.name, {
                enumerable: true,
                get(this: any) {
                    return (nameOrAccessor as Accessor).getValue(this);
                },
                set(this: any, newValue: any) {
                    (nameOrAccessor as Accessor).setValue(this, newValue);
                },
            });
        },

        /**
         * Finds all the observable accessors defined on the target,
         * including its prototype chain.
         * @param target - The target object to search for accessor on.
         */
        getAccessors,

        /**
         * Creates a {@link ExpressionNotifier} that can watch the
         * provided {@link Expression} for changes.
         * @param expression - The binding to observe.
         * @param initialSubscriber - An initial subscriber to changes in the binding value.
         * @param isVolatileBinding - Indicates whether the binding's dependency list must be re-evaluated on every value evaluation.
         */
        binding<TSource = any, TReturn = any>(
            expression: Expression<TSource, TReturn>,
            initialSubscriber?: Subscriber,
            isVolatileBinding: boolean = this.isVolatileBinding(expression),
        ): ExpressionNotifier<TSource, TReturn> {
            return new ExpressionNotifierImplementation(
                expression,
                initialSubscriber,
                isVolatileBinding,
            );
        },

        /**
         * Determines whether a binding expression is volatile and needs to have its dependency list re-evaluated
         * on every evaluation of the value.
         * @param expression - The binding to inspect.
         */
        isVolatileBinding<TSource = any, TReturn = any>(
            expression: Expression<TSource, TReturn>,
        ): boolean {
            return volatileRegex.test(expression.toString());
        },
    });
})();

/**
 * Decorator: Defines an observable property on the target.
 * @param target - The target to define the observable on.
 * @param nameOrAccessor - The property name or accessor to define the observable as.
 * @public
 */
export function observable(target: {}, nameOrAccessor: string | Accessor): void {
    Observable.defineProperty(target, nameOrAccessor);
}

/**
 * Provides additional contextual information available to behaviors and expressions.
 * @public
 */
export interface ExecutionContext<TParent = any> {
    /**
     * The index of the current item within a repeat context.
     */
    index: number;

    /**
     * The length of the current collection within a repeat context.
     */
    length: number;

    /**
     * The parent data source within a nested context.
     */
    parent: TParent;

    /**
     * The parent execution context when in nested context scenarios.
     */
    parentContext: ExecutionContext<TParent>;

    /**
     * The current event within an event handler.
     */
    readonly event: Event;

    /**
     * Indicates whether the current item within a repeat context
     * has an even index.
     */
    readonly isEven: boolean;

    /**
     * Indicates whether the current item within a repeat context
     * has an odd index.
     */
    readonly isOdd: boolean;

    /**
     * Indicates whether the current item within a repeat context
     * is the first item in the collection.
     */
    readonly isFirst: boolean;

    /**
     * Indicates whether the current item within a repeat context
     * is somewhere in the middle of the collection.
     */
    readonly isInMiddle: boolean;

    /**
     * Indicates whether the current item within a repeat context
     * is the last item in the collection.
     */
    readonly isLast: boolean;

    /**
     * Returns the typed event detail of a custom event.
     */
    eventDetail<TDetail>(): TDetail;

    /**
     * Returns the typed event target of the event.
     */
    eventTarget<TTarget extends EventTarget>(): TTarget;
}

const contextEvent = (() => {
    let current: Event | null = null;

    return {
        get() {
            return current;
        },
        set(event: Event | null) {
            current = event;
        },
    };
})();

/**
 * Provides additional contextual information available to behaviors and expressions.
 * @public
 */
export const ExecutionContext = Object.freeze({
    /**
     * A default execution context.
     */
    default: {
        index: 0,
        length: 0,
        get event(): Event {
            return ExecutionContext.getEvent()!;
        },
        eventDetail<TDetail>(): TDetail {
            return (this.event as CustomEvent<TDetail>).detail;
        },
        eventTarget<TTarget extends EventTarget>(): TTarget {
            return this.event.target! as TTarget;
        },
    } as ExecutionContext,

    /**
     * Gets the current event.
     * @returns An event object.
     */
    getEvent(): Event | null {
        return contextEvent.get();
    },

    /**
     * Sets the current event.
     * @param event - An event object.
     */
    setEvent(event: Event | null): void {
        contextEvent.set(event);
    },
});
