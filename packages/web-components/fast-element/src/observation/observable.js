import { DOM } from "../dom";
import { PropertyChangeNotifier, SubscriberSet } from "./notifier";
const volatileRegex = /(:|&&|\|\||if)/;
const notifierLookup = new WeakMap();
const accessorLookup = new WeakMap();
let watcher = void 0;
let createArrayObserver = array => {
    throw new Error("Must call enableArrayObservation before observing arrays.");
};
class DefaultObservableAccessor {
    constructor(name) {
        this.name = name;
        this.field = `_${name}`;
        this.callback = `${name}Changed`;
    }
    getValue(source) {
        if (watcher !== void 0) {
            watcher.watch(source, this.name);
        }
        return source[this.field];
    }
    setValue(source, newValue) {
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
    setArrayObserverFactory(factory) {
        createArrayObserver = factory;
    },
    /**
     * Gets a notifier for an object or Array.
     * @param source - The object or Array to get the notifier for.
     */
    getNotifier(source) {
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
    track(source, propertyName) {
        if (watcher !== void 0) {
            watcher.watch(source, propertyName);
        }
    },
    /**
     * Notifies watchers that the currently executing property getter or function is volatile
     * with respect to its observable dependencies.
     */
    trackVolatile() {
        if (watcher !== void 0) {
            watcher.needsRefresh = true;
        }
    },
    /**
     * Notifies subscribers of a source object of changes.
     * @param source - the object to notify of changes.
     * @param args - The change args to pass to subscribers.
     */
    notify(source, args) {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        getNotifier(source).notify(args);
    },
    /**
     * Defines an observable property on an object or prototype.
     * @param target - The target object to define the observable on.
     * @param nameOrAccessor - The name of the property to define as observable;
     * or a custom accessor that specifies the property name and accessor implementation.
     */
    defineProperty(target, nameOrAccessor) {
        if (typeof nameOrAccessor === "string") {
            nameOrAccessor = new DefaultObservableAccessor(nameOrAccessor);
        }
        this.getAccessors(target).push(nameOrAccessor);
        Reflect.defineProperty(target, nameOrAccessor.name, {
            enumerable: true,
            get: function () {
                return nameOrAccessor.getValue(this);
            },
            set: function (newValue) {
                nameOrAccessor.setValue(this, newValue);
            },
        });
    },
    /**
     * Finds all the observable accessors defined on the target,
     * including its prototype chain.
     * @param target - The target object to search for accessor on.
     */
    getAccessors(target) {
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
    binding(
        binding,
        initialSubscriber,
        isVolatileBinding = this.isVolatileBinding(binding)
    ) {
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
    isVolatileBinding(binding) {
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
export function observable(target, nameOrAccessor) {
    Observable.defineProperty(target, nameOrAccessor);
}
/**
 * Decorator: Marks a property getter as having volatile observable dependencies.
 * @param target - The target that the property is defined on.
 * @param name - The property name.
 * @param name - The existing descriptor.
 * @public
 */
export function volatile(target, name, descriptor) {
    return Object.assign({}, descriptor, {
        get: function () {
            trackVolatile();
            return descriptor.get.apply(this);
        },
    });
}
let currentEvent = null;
/**
 * @param event - The event to set as current for the context.
 * @internal
 */
export function setCurrentEvent(event) {
    currentEvent = event;
}
/**
 * Provides additional contextual information available to behaviors and expressions.
 * @public
 */
export class ExecutionContext {
    constructor() {
        /**
         * The index of the current item within a repeat context.
         */
        this.index = 0;
        /**
         * The length of the current collection within a repeat context.
         */
        this.length = 0;
        /**
         * The parent data object within a repeat context.
         */
        this.parent = null;
        /**
         * The parent execution context when in nested context scenarios.
         */
        this.parentContext = null;
    }
    /**
     * The current event within an event handler.
     */
    get event() {
        return currentEvent;
    }
    /**
     * Indicates whether the current item within a repeat context
     * has an even index.
     */
    get isEven() {
        return this.index % 2 === 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * has an odd index.
     */
    get isOdd() {
        return this.index % 2 !== 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is the first item in the collection.
     */
    get isFirst() {
        return this.index === 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is somewhere in the middle of the collection.
     */
    get isInMiddle() {
        return !this.isFirst && !this.isLast;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is the last item in the collection.
     */
    get isLast() {
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
class BindingObserverImplementation extends SubscriberSet {
    constructor(binding, initialSubscriber, isVolatileBinding = false) {
        super(binding, initialSubscriber);
        this.binding = binding;
        this.isVolatileBinding = isVolatileBinding;
        this.needsRefresh = true;
        this.needsQueue = true;
        this.first = this;
        this.last = null;
        this.propertySource = void 0;
        this.propertyName = void 0;
        this.notifier = void 0;
        this.next = void 0;
    }
    observe(source, context) {
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
    disconnect() {
        if (this.last !== null) {
            let current = this.first;
            while (current !== void 0) {
                current.notifier.unsubscribe(this, current.propertyName);
                current = current.next;
            }
            this.last = null;
            this.needsRefresh = this.needsQueue = true;
        }
    }
    /** @internal */
    watch(propertySource, propertyName) {
        const prev = this.last;
        const notifier = getNotifier(propertySource);
        const current = prev === null ? this.first : {};
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
        this.last = current;
    }
    /** @internal */
    handleChange() {
        if (this.needsQueue) {
            this.needsQueue = false;
            queueUpdate(this);
        }
    }
    /** @internal */
    call() {
        if (this.last !== null) {
            this.needsQueue = true;
            this.notify(this);
        }
    }
    records() {
        let next = this.first;
        return {
            next: () => {
                const current = next;
                if (current === undefined) {
                    return { value: void 0, done: true };
                } else {
                    next = next.next;
                    return {
                        value: current,
                        done: false,
                    };
                }
            },
            [Symbol.iterator]: function () {
                return this;
            },
        };
    }
}
