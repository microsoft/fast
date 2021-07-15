import type { Notifier, Subscriber } from "./notifier";
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
 * Common Observable APIs.
 * @public
 */
export declare const Observable: Readonly<{
    /**
     * @internal
     * @param factory - The factory used to create array observers.
     */
    setArrayObserverFactory(factory: (collection: any[]) => Notifier): void;
    /**
     * Gets a notifier for an object or Array.
     * @param source - The object or Array to get the notifier for.
     */
    getNotifier(source: any): Notifier;
    /**
     * Records a property change for a source object.
     * @param source - The object to record the change against.
     * @param propertyName - The property to track as changed.
     */
    track(source: unknown, propertyName: string): void;
    /**
     * Notifies watchers that the currently executing property getter or function is volatile
     * with respect to its observable dependencies.
     */
    trackVolatile(): void;
    /**
     * Notifies subscribers of a source object of changes.
     * @param source - the object to notify of changes.
     * @param args - The change args to pass to subscribers.
     */
    notify(source: unknown, args: any): void;
    /**
     * Defines an observable property on an object or prototype.
     * @param target - The target object to define the observable on.
     * @param nameOrAccessor - The name of the property to define as observable;
     * or a custom accessor that specifies the property name and accessor implementation.
     */
    defineProperty(target: {}, nameOrAccessor: string | Accessor): void;
    /**
     * Finds all the observable accessors defined on the target,
     * including its prototype chain.
     * @param target - The target object to search for accessor on.
     */
    getAccessors(target: {}): Accessor[];
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
        isVolatileBinding?: boolean
    ): BindingObserver<TSource, TReturn, TParent>;
    /**
     * Determines whether a binding expression is volatile and needs to have its dependency list re-evaluated
     * on every evaluation of the value.
     * @param binding - The binding to inspect.
     */
    isVolatileBinding<TSource_1 = any, TReturn_1 = any, TParent_1 = any>(
        binding: Binding<TSource_1, TReturn_1, TParent_1>
    ): boolean;
}>;
/**
 * Decorator: Defines an observable property on the target.
 * @param target - The target to define the observable on.
 * @param nameOrAccessor - The property name or accessor to define the observable as.
 * @public
 */
export declare function observable(target: {}, nameOrAccessor: string | Accessor): void;
/**
 * Decorator: Marks a property getter as having volatile observable dependencies.
 * @param target - The target that the property is defined on.
 * @param name - The property name.
 * @param name - The existing descriptor.
 * @public
 */
export declare function volatile(
    target: {},
    name: string | Accessor,
    descriptor: PropertyDescriptor
): PropertyDescriptor;
/**
 * @param event - The event to set as current for the context.
 * @internal
 */
export declare function setCurrentEvent(event: Event | null): void;
/**
 * Provides additional contextual information available to behaviors and expressions.
 * @public
 */
export declare class ExecutionContext<TParent = any, TGrandparent = any> {
    /**
     * The index of the current item within a repeat context.
     */
    index: number;
    /**
     * The length of the current collection within a repeat context.
     */
    length: number;
    /**
     * The parent data object within a repeat context.
     */
    parent: TParent;
    /**
     * The parent execution context when in nested context scenarios.
     */
    parentContext: ExecutionContext<TGrandparent>;
    /**
     * The current event within an event handler.
     */
    get event(): Event;
    /**
     * Indicates whether the current item within a repeat context
     * has an even index.
     */
    get isEven(): boolean;
    /**
     * Indicates whether the current item within a repeat context
     * has an odd index.
     */
    get isOdd(): boolean;
    /**
     * Indicates whether the current item within a repeat context
     * is the first item in the collection.
     */
    get isFirst(): boolean;
    /**
     * Indicates whether the current item within a repeat context
     * is somewhere in the middle of the collection.
     */
    get isInMiddle(): boolean;
    /**
     * Indicates whether the current item within a repeat context
     * is the last item in the collection.
     */
    get isLast(): boolean;
}
/**
 * The default execution context used in binding expressions.
 * @public
 */
export declare const defaultExecutionContext: ExecutionContext<any, any>;
/**
 * The signature of an arrow function capable of being evaluated
 * as part of a template binding update.
 * @public
 */
export declare type Binding<TSource = any, TReturn = any, TParent = any> = (
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
    /**
     * Gets {@link ObservationRecord|ObservationRecords} that the {@link BindingObserver}
     * is observing.
     */
    records(): IterableIterator<ObservationRecord>;
}
