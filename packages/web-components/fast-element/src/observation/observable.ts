import { DOM } from "../dom";
import { PropertyChangeNotifier, SubscriberSet } from "./notifier";
import type { Notifier, Subscriber } from "./notifier";

const volatileRegex = /(:|&&|\|\||if)/;
const notifierLookup = new WeakMap<any, Notifier>();
const accessorLookup = new WeakMap<any, Accessor[]>();
let watcher: BindingObserverImplementation | undefined = void 0;
let createArrayObserver = (array: any[]): Notifier => {
    throw new Error("Must call enableArrayObservation before observing arrays.");
};

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

            if (typeof callback === "function") {
                callback.call(source, oldValue, newValue);
            }

            /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
            getNotifier(source).notify(this.name);
        }
    }
}

/**
 * Common Observable APIs.
 * @public
 */
export const Observable = Object.freeze({
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
    getNotifier(source: any): Notifier {
        let found = source.$fastController || notifierLookup.get(source);

        if (found === void 0) {
            if (Array.isArray(source)) {
                found = createArrayObserver(source);
            } else {
                notifierLookup.set(source, (found = new PropertyChangeNotifier(source)));
            }
        }

        return found;
    },

    /**
     * Records a property change for a source object.
     * @param source - The object to record the change against.
     * @param propertyName - The property to track as changed.
     */
    track(source: unknown, propertyName: string): void {
        if (watcher !== void 0) {
            watcher.watch(source, propertyName);
        }
    },

    /**
     * Notifies watchers that the currently executing property getter or function is volatile
     * with respect to its observable dependencies.
     */
    trackVolatile(): void {
        if (watcher !== void 0) {
            watcher.needsRefresh = true;
        }
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
        if (typeof nameOrAccessor === "string") {
            nameOrAccessor = new DefaultObservableAccessor(nameOrAccessor);
        }

        this.getAccessors(target).push(nameOrAccessor);

        Reflect.defineProperty(target, nameOrAccessor.name, {
            enumerable: true,
            get: function (this: any) {
                return (nameOrAccessor as Accessor).getValue(this);
            },
            set: function (this: any, newValue: any) {
                (nameOrAccessor as Accessor).setValue(this, newValue);
            },
        });
    },

    /**
     * Finds all the observable accessors defined on the target,
     * including its prototype chain.
     * @param target - The target object to search for accessor on.
     */
    getAccessors(target: {}): Accessor[] {
        let accessors = accessorLookup.get(target);

        if (accessors === void 0) {
            let currentTarget = Reflect.getPrototypeOf(target);

            while (accessors === void 0 && currentTarget !== null) {
                accessors = accessorLookup.get(currentTarget);
                currentTarget = Reflect.getPrototypeOf(currentTarget);
            }

            if (accessors === void 0) {
                accessors = [];
            } else {
                accessors = accessors.slice(0);
            }

            accessorLookup.set(target, accessors);
        }

        return accessors;
    },

    /**
     * Creates a {@link BindingObserver} that can watch the
     * provided {@link Binding} for changes.
     * @param binding - The binding to observe.
     * @param initialSubscriber - An initial subscriber to changes in the binding value.
     * @param isVolatileBinding - Indicates whether the binding's dependency list must be re-evaluated on every value evaluation.
     */
    binding<TSource = any, TReturn = any, TParent = any>(
        binding: Binding<TSource, TReturn, TParent>,
        initialSubscriber?: Subscriber,
        isVolatileBinding: boolean = this.isVolatileBinding(binding)
    ): BindingObserver<TSource, TReturn, TParent> {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        return new BindingObserverImplementation(
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
    isVolatileBinding<TSource = any, TReturn = any, TParent = any>(
        binding: Binding<TSource, TReturn, TParent>
    ): boolean {
        return volatileRegex.test(binding.toString());
    },
});

const getNotifier = Observable.getNotifier;
const trackVolatile = Observable.trackVolatile;
const queueUpdate = DOM.queueUpdate;

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
        get: function (this: any) {
            trackVolatile();
            return descriptor.get!.apply(this);
        },
    });
}

let currentEvent: Event | null = null;

/**
 * @param event - The event to set as current for the context.
 * @internal
 */
export function setCurrentEvent(event: Event | null): void {
    currentEvent = event;
}

/**
 * Provides additional contextual information available to behaviors and expressions.
 * @public
 */
export class ExecutionContext<TParent = any, TGrandparent = any> {
    /**
     * The index of the current item within a repeat context.
     */
    public index: number = 0;

    /**
     * The length of the current collection within a repeat context.
     */
    public length: number = 0;

    /**
     * The parent data object within a repeat context.
     */
    public parent: TParent = null as any;

    /**
     * The parent execution context when in nested context scenarios.
     */
    public parentContext: ExecutionContext<TGrandparent> = null as any;

    /**
     * The current event within an event handler.
     */
    public get event(): Event {
        return currentEvent!;
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
}

Observable.defineProperty(ExecutionContext.prototype, "index");
Observable.defineProperty(ExecutionContext.prototype, "length");

/**
 * The default execution context used in binding expressions.
 * @public
 */
export const defaultExecutionContext = Object.seal(new ExecutionContext());

/**
 * The signature of an arrow function capable of being evaluated
 * as part of a template binding update.
 * @public
 */
export type Binding<TSource = any, TReturn = any, TParent = any> = (
    source: TSource,
    context: ExecutionContext<TParent>
) => TReturn;

interface SubscriptionRecord {
    propertySource: any;
    propertyName: string;
    notifier: Notifier;
    next: SubscriptionRecord | undefined;
}

/**
 * Enables evaluation of and subscription to a binding.
 * @public
 */
export interface BindingObserver<TSource = any, TReturn = any, TParent = any>
    extends Notifier {
    /**
     * Begins observing the binding for the source and returns the current value.
     * @param source - The source that the binding is based on.
     * @param context - The execution context to execute the binding within.
     * @returns The value of the binding.
     */
    observe(source: TSource, context: ExecutionContext): TReturn;

    /**
     * Unsubscribe from all dependent observables of the binding.
     */
    disconnect(): void;
}

class BindingObserverImplementation<TSource = any, TReturn = any, TParent = any>
    extends SubscriberSet
    implements BindingObserver<TSource, TReturn, TParent> {
    public needsRefresh: boolean = true;
    private needsQueue: boolean = true;

    private first: SubscriptionRecord = this as any;
    private last: SubscriptionRecord | null = null;
    private propertySource: any = void 0;
    private propertyName: string | undefined = void 0;
    private notifier: Notifier | undefined = void 0;
    private next: SubscriptionRecord | undefined = void 0;

    constructor(
        private binding: Binding<TSource, TReturn, TParent>,
        initialSubscriber?: Subscriber,
        private isVolatileBinding: boolean = false
    ) {
        super(binding, initialSubscriber);
    }

    public observe(source: TSource, context: ExecutionContext): TReturn {
        if (this.needsRefresh && this.last !== null) {
            this.disconnect();
        }

        const previousWatcher = watcher;
        watcher = this.needsRefresh ? this : void 0;
        this.needsRefresh = this.isVolatileBinding;
        const result = this.binding(source, context);
        watcher = previousWatcher;

        return result;
    }

    public disconnect(): void {
        if (this.last !== null) {
            let current = this.first;

            while (current !== void 0) {
                current.notifier.unsubscribe(this, current.propertyName);
                current = current.next!;
            }

            this.last = null;
            this.needsRefresh = true;
        }
    }

    /** @internal */
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
                watcher = void 0;
                const prevValue = prev.propertySource[prev.propertyName];
                watcher = this;

                if (propertySource === prevValue) {
                    this.needsRefresh = true;
                }
            }

            prev.next = current;
        }

        this.last = current!;
    }

    /** @internal */
    handleChange(): void {
        if (this.needsQueue) {
            this.needsQueue = false;
            queueUpdate(this);
        }
    }

    /** @internal */
    call(): void {
        if (this.last !== null) {
            this.needsQueue = true;
            this.notify(this);
        }
    }
}
