/**
 * Implemented by objects that are interested in change notifications.
 * @public
 */
export interface Subscriber {
    /**
     * Called when a source this instance has subscribed to changes.
     * @param source - The source of the change.
     * @param args - The event args detailing the change that occurred.
     */
    handleChange(source: any, args: any): void;
}
/**
 * Provides change notification for a source object.
 * @public
 */
export interface Notifier {
    /**
     * The source object that this notifier provides change notification for.
     */
    readonly source: any;
    /**
     * Notifies all subscribers, based on the args.
     * @param args - Data passed along to subscribers during notification.
     * @remarks
     * In some implementations, the args may be used to target specific subscribers.
     * This is usually in the case where a propertyName was passed during subscription.
     */
    notify(args: any): void;
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     * @param propertyToWatch - The name of the property that the subscriber is interested in watching for changes.
     * @remarks
     * Some implementation may or may not require the propertyToWatch.
     */
    subscribe(subscriber: Subscriber, propertyToWatch?: any): void;
    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     * @param propertyToUnwatch - The name of the property that the subscriber is no longer interested in watching.
     * @remarks
     * Some implementation may or may not require the propertyToUnwatch.
     */
    unsubscribe(subscriber: Subscriber, propertyToUnwatch?: any): void;
}
/**
 * An implementation of {@link Notifier} that efficiently keeps track of
 * subscribers interested in a specific change notification on an
 * observable source.
 *
 * @remarks
 * This set is optimized for the most common scenario of 1 or 2 subscribers.
 * With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array#push operations.
 * If the set ever exceeds two subscribers, it upgrades to an array automatically.
 * @public
 */
export declare class SubscriberSet implements Notifier {
    private sub1;
    private sub2;
    private spillover;
    /**
     * The source that this subscriber set is reporting changes for.
     */
    readonly source: any;
    /**
     * Creates an instance of SubscriberSet for the specified source.
     * @param source - The object source that subscribers will receive notifications from.
     * @param initialSubscriber - An initial subscriber to changes.
     */
    constructor(source: any, initialSubscriber?: Subscriber);
    /**
     * Checks whether the provided subscriber has been added to this set.
     * @param subscriber - The subscriber to test for inclusion in this set.
     */
    has(subscriber: Subscriber): boolean;
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     */
    subscribe(subscriber: Subscriber): void;
    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     */
    unsubscribe(subscriber: Subscriber): void;
    /**
     * Notifies all subscribers.
     * @param args - Data passed along to subscribers during notification.
     */
    notify(args: any): void;
}
/**
 * An implementation of Notifier that allows subscribers to be notified
 * of individual property changes on an object.
 * @public
 */
export declare class PropertyChangeNotifier implements Notifier {
    private subscribers;
    /**
     * The source that property changes are being notified for.
     */
    readonly source: any;
    /**
     * Creates an instance of PropertyChangeNotifier for the specified source.
     * @param source - The object source that subscribers will receive notifications from.
     */
    constructor(source: any);
    /**
     * Notifies all subscribers, based on the specified property.
     * @param propertyName - The property name, passed along to subscribers during notification.
     */
    notify(propertyName: string): void;
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     * @param propertyToWatch - The name of the property that the subscriber is interested in watching for changes.
     */
    subscribe(subscriber: Subscriber, propertyToWatch: string): void;
    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     * @param propertyToUnwatch - The name of the property that the subscriber is no longer interested in watching.
     */
    unsubscribe(subscriber: Subscriber, propertyToUnwatch: string): void;
}
