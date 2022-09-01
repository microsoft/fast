import {
    Disposable,
    isFunction,
    isString,
    KernelServiceId,
    Message,
} from "../interfaces.js";
import { FAST } from "../platform.js";
import { Updates } from "./update-queue.js";
import { PropertyChangeNotifier, SubscriberSet } from "./notifier.js";
import type { Notifier, Subscriber } from "./notifier.js";

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
    context: ExecutionContext<TParent>
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

interface SubscriptionRecord extends ObservationRecord {
    notifier: Notifier;
    next: SubscriptionRecord | undefined;
}

/**
 * Observes a binding for changes.
 *
 * @public
 */
export interface ExpressionObserver<TSource = any, TReturn = any, TParent = any>
    extends Disposable {
    /**
     * Begins observing the binding.
     * @param source - The source to pass to the binding.
     * @param context - The context to pass to the binding.
     */
    observe(source: TSource, context?: ExecutionContext<TParent>): TReturn;
}

/**
 * Enables evaluation of and subscription to a binding.
 * @public
 */
export interface ExpressionNotifier<TSource = any, TReturn = any, TParent = any>
    extends Notifier,
        ExpressionObserver<TSource, TReturn, TParent> {
    /**
     * Gets {@link ObservationRecord|ObservationRecords} that the {@link ExpressionNotifier}
     * is observing.
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
export const Observable = FAST.getById(KernelServiceId.observable, () => {
    const queueUpdate = Updates.enqueue;
    const volatileRegex = /(:|&&|\|\||if)/;
    const notifierLookup = new WeakMap<any, Notifier>();
    const accessorLookup = new WeakMap<any, Accessor[]>();
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
                      (found = new PropertyChangeNotifier(source))
                  );
        }

        return found;
    }

    function getAccessors(target: {}): Accessor[] {
        let accessors = accessorLookup.get(target);

        if (accessors === void 0) {
            let currentTarget = Reflect.getPrototypeOf(target);

            while (accessors === void 0 && currentTarget !== null) {
                accessors = accessorLookup.get(currentTarget);
                currentTarget = Reflect.getPrototypeOf(currentTarget);
            }

            accessors = accessors === void 0 ? [] : accessors.slice(0);

            accessorLookup.set(target, accessors);
        }

        return accessors;
    }

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
        implements ExpressionNotifier<TSource, TReturn> {
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
            private binding: Expression<TSource, TReturn>,
            initialSubscriber?: Subscriber,
            private isVolatileBinding: boolean = false
        ) {
            super(binding, initialSubscriber);
        }

        public setMode(isAsync: boolean): void {
            this.isAsync = this.needsQueue = isAsync;
        }

        public observe(source: TSource, context?: ExecutionContext): TReturn {
            if (this.needsRefresh && this.last !== null) {
                this.dispose();
            }

            const previousWatcher = watcher;
            watcher = this.needsRefresh ? this : void 0;
            this.needsRefresh = this.isVolatileBinding;
            let result;
            try {
                result = this.binding(source, context ?? ExecutionContext.default);
            } finally {
                watcher = previousWatcher;
            }

            return result;
        }

        public dispose(): void {
            if (this.last !== null) {
                let current = this.first;

                while (current !== void 0) {
                    current.notifier.unsubscribe(this, current.propertyName);
                    current = current.next!;
                }

                this.last = null;
                this.needsRefresh = this.needsQueue = this.isAsync;
            }
        }

        public watch(propertySource: unknown, propertyName: string): void {
            const prev = this.last;
            const notifier = getNotifier(propertySource);
            const current: SubscriptionRecord = prev === null ? this.first : ({} as any);

            current.propertySource = propertySource;
            current.propertyName = propertyName;
            current.notifier = notifier;

            notifier.subscribe(this, propertyName);

            if (prev !== null) {
                if (!this.needsRefresh) {
                    // Declaring the variable prior to assignment below circumvents
                    // a bug in Angular's optimization process causing infinite recursion
                    // of this watch() method. Details https://github.com/microsoft/fast/issues/4969
                    let prevValue;
                    watcher = void 0;
                    /* eslint-disable-next-line */
                    prevValue = prev.propertySource[prev.propertyName];
                    /* eslint-disable-next-line */
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
            let next = this.first;

            while (next !== void 0) {
                yield next;
                next = next.next!;
            }
        }
    }

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
         * @param binding - The binding to observe.
         * @param initialSubscriber - An initial subscriber to changes in the binding value.
         * @param isVolatileBinding - Indicates whether the binding's dependency list must be re-evaluated on every value evaluation.
         */
        binding<TSource = any, TReturn = any>(
            binding: Expression<TSource, TReturn>,
            initialSubscriber?: Subscriber,
            isVolatileBinding: boolean = this.isVolatileBinding(binding)
        ): ExpressionNotifier<TSource, TReturn> {
            return new ExpressionNotifierImplementation(
                binding,
                initialSubscriber,
                isVolatileBinding
            );
        },

        /**
         * Determines whether a binding expression is volatile and needs to have its dependency list re-evaluated
         * on every evaluation of the value.
         * @param binding - The binding to inspect.
         */
        isVolatileBinding<TSource = any, TReturn = any>(
            binding: Expression<TSource, TReturn>
        ): boolean {
            return volatileRegex.test(binding.toString());
        },
    });
});

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
 * Decorator: Marks a property getter as having volatile observable dependencies.
 * @param target - The target that the property is defined on.
 * @param name - The property name.
 * @param name - The existing descriptor.
 * @public
 */
export function volatile(
    target: {},
    name: string | Accessor,
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    return Object.assign({}, descriptor, {
        get(this: any) {
            Observable.trackVolatile();
            return descriptor.get!.apply(this);
        },
    });
}

const contextEvent = FAST.getById(KernelServiceId.contextEvent, () => {
    let current: Event | null = null;

    return {
        get() {
            return current;
        },
        set(event: Event | null) {
            current = event;
        },
    };
});

/**
 * Provides additional contextual information available to behaviors and expressions.
 * @public
 */
export class ExecutionContext<TParentSource = any> {
    /**
     * The default execution context.
     */
    public static readonly default = new ExecutionContext();

    /**
     * The index of the current item within a repeat context.
     */
    public index: number = 0;

    /**
     * The length of the current collection within a repeat context.
     */
    public length: number = 0;

    /**
     * The parent data source within a nested context.
     */
    public readonly parent: TParentSource;

    /**
     * The parent execution context when in nested context scenarios.
     */
    public readonly parentContext: ExecutionContext<TParentSource>;

    private constructor(
        parentSource: any = null,
        parentContext: ExecutionContext | null = null
    ) {
        this.parent = parentSource;
        this.parentContext = parentContext as any;
    }

    /**
     * The current event within an event handler.
     */
    public get event(): Event {
        return contextEvent.get()!;
    }

    /**
     * Indicates whether the current item within a repeat context
     * has an even index.
     */
    public get isEven(): boolean {
        return this.index % 2 === 0;
    }

    /**
     * Indicates whether the current item within a repeat context
     * has an odd index.
     */
    public get isOdd(): boolean {
        return this.index % 2 !== 0;
    }

    /**
     * Indicates whether the current item within a repeat context
     * is the first item in the collection.
     */
    public get isFirst(): boolean {
        return this.index === 0;
    }

    /**
     * Indicates whether the current item within a repeat context
     * is somewhere in the middle of the collection.
     */
    public get isInMiddle(): boolean {
        return !this.isFirst && !this.isLast;
    }

    /**
     * Indicates whether the current item within a repeat context
     * is the last item in the collection.
     */
    public get isLast(): boolean {
        return this.index === this.length - 1;
    }

    /**
     * Returns the typed event detail of a custom event.
     */
    public eventDetail<TDetail>(): TDetail {
        return (this.event as CustomEvent<TDetail>).detail;
    }

    /**
     * Returns the typed event target of the event.
     */
    public eventTarget<TTarget extends EventTarget>(): TTarget {
        return this.event.target! as TTarget;
    }

    /**
     * Updates the position/size on a context associated with a list item.
     * @param index - The new index of the item.
     * @param length - The new length of the list.
     */
    public updatePosition(index: number, length: number): void {
        this.index = index;
        this.length = length;
    }

    /**
     * Creates a new execution context descendent from the current context.
     * @param source - The source for the context if different than the parent.
     * @returns A child execution context.
     */
    public createChildContext<TParentSource>(
        parentSource: TParentSource
    ): ExecutionContext<TParentSource> {
        return new ExecutionContext(parentSource, this);
    }

    /**
     * Creates a new execution context descent suitable for use in list rendering.
     * @param item - The list item to serve as the source.
     * @param index - The index of the item in the list.
     * @param length - The length of the list.
     */
    public createItemContext(
        index: number,
        length: number
    ): ExecutionContext<TParentSource> {
        const childContext = Object.create(this);
        childContext.index = index;
        childContext.length = length;
        return childContext;
    }

    /**
     * Sets the event for the current execution context.
     * @param event - The event to set.
     * @internal
     */
    public static setEvent(event: Event | null): void {
        contextEvent.set(event);
    }

    /**
     * Creates a new root execution context.
     * @returns A new execution context.
     */
    public static create(): ExecutionContext {
        return new ExecutionContext();
    }
}

Observable.defineProperty(ExecutionContext.prototype, "index");
Observable.defineProperty(ExecutionContext.prototype, "length");
