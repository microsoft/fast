/**
 * Implemented by objects that are interested in change notifications.
 */
export interface Subscriber {
    /**
     * Called when a source this instance has subscribed to changes.
     * @param source The source of the change.
     * @param args The event args detailing the change that occurred.
     */
    handleChange(source: any, args: any): void;
}

/**
 * Provides change notification for a source object.
 */
export interface Notifier {
    /**
     * The source object that this notifier provides change notification for.
     */
    readonly source: any;

    /**
     * Notifies all subscribers, based on the args.
     * @param args Data passed along to subscribers during notification.
     * @remarks
     * In some implementations, the args may be used to target specific subscribers.
     * This is usually in the case where a propertyName was passed during subscription.
     */
    notify(args: any): void;

    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber The object that is subscribing for change notification.
     * @param propertyToWatch The name of the property that the subscriber is interested in watching for changes.
     * @remarks
     * Some implementation may or may not require the propertyToWatch.
     */
    subscribe(subscriber: Subscriber, propertyToWatch?: any): void;

    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber The object that is unsubscribing from change notification.
     * @param propertyToUnwatch The name of the property that the subscriber is no longer interested in watching.
     * @remarks
     * Some implementation may or may not require the propertyToUnwatch.
     */
    unsubscribe(subscriber: Subscriber, propertyToUnwatch?: any): void;
}

function spilloverSubscribe(this: SubscriberSet, subscriber: Subscriber): void {
    const spillover = (this as any).spillover as Subscriber[];
    const index = spillover.indexOf(subscriber);

    if (index === -1) {
        spillover.push(subscriber);
    }
}

function spilloverUnsubscribe(this: SubscriberSet, subscriber: Subscriber): void {
    const spillover = (this as any).spillover as Subscriber[];
    const index = spillover.indexOf(subscriber);

    if (index !== -1) {
        spillover.splice(index, 1);
    }
}

function spilloverNotifySubscribers(this: SubscriberSet, args: any): void {
    const spillover = (this as any).spillover as Subscriber[];
    const source = this.source;

    for (let i = 0, ii = spillover.length; i < ii; ++i) {
        spillover[i].handleChange(source, args);
    }
}

function spilloverHas(this: SubscriberSet, subscriber: Subscriber): boolean {
    return ((this as any).spillover as Subscriber[]).indexOf(subscriber) !== -1;
}

/**
 * An implementation of Notifier that efficiently keeps track of subscribers interested
 * in a specific change notification on an observable source.
 *
 * @remarks
 * This set is optimized for the most common scenario of 1 or 2 subscribers.
 * With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array#push operations.
 * If the set ever exceeds two subscribers, it upgrades to an array automatically.
 */
export class SubscriberSet implements Notifier {
    private sub1: Subscriber | undefined = void 0;
    private sub2: Subscriber | undefined = void 0;
    private spillover: Subscriber[] | undefined = void 0;

    /**
     * Creates an instance of SubscriberSet for the specified source.
     * @param source The object source that subscribers will receive notifications from.
     */
    public constructor(public readonly source: any) {}

    /**
     * Checks whether the provided subscriber has been added to this set.
     * @param subscriber The subscriber to test for inclusion in this set.
     */
    public has(subscriber: Subscriber): boolean {
        return this.sub1 === subscriber || this.sub2 === subscriber;
    }

    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber The object that is subscribing for change notification.
     */
    public subscribe(subscriber: Subscriber): void {
        if (this.has(subscriber)) {
            return;
        }

        if (this.sub1 === void 0) {
            this.sub1 = subscriber;
            return;
        }

        if (this.sub2 === void 0) {
            this.sub2 = subscriber;
            return;
        }

        this.spillover = [this.sub1, this.sub2, subscriber];
        this.subscribe = spilloverSubscribe;
        this.unsubscribe = spilloverUnsubscribe;
        this.notify = spilloverNotifySubscribers;
        this.has = spilloverHas;

        this.sub1 = void 0;
        this.sub2 = void 0;
    }

    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber The object that is unsubscribing from change notification.
     */
    public unsubscribe(subscriber: Subscriber): void {
        if (this.sub1 === subscriber) {
            this.sub1 = void 0;
        } else if (this.sub2 === subscriber) {
            this.sub2 = void 0;
        }
    }

    /**
     * Notifies all subscribers.
     * @param args Data passed along to subscribers during notification.
     */
    public notify(args: any): void {
        const sub1 = this.sub1;
        const sub2 = this.sub2;
        const source = this.source;

        if (sub1 !== void 0) {
            sub1.handleChange(source, args);
        }

        if (sub2 !== void 0) {
            sub2.handleChange(source, args);
        }
    }
}

/**
 * An implementation of Notifier that allows subscribers to be notified of individual property changes on an object.
 */
export class PropertyChangeNotifier implements Notifier {
    private subscribers: Record<string, SubscriberSet> = {};

    /**
     * Creates an instance of PropertyChangeNotifier for the specified source.
     * @param source The object source that subscribers will receive notifications from.
     */
    public constructor(public readonly source: any) {}

    /**
     * Notifies all subscribers, based on the specified property.
     * @param propertyName The property name, passed along to subscribers during notification.
     */
    public notify(propertyName: string): void {
        const subscribers = this.subscribers[propertyName];

        if (subscribers !== void 0) {
            subscribers.notify(propertyName);
        }
    }

    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber The object that is subscribing for change notification.
     * @param propertyToWatch The name of the property that the subscriber is interested in watching for changes.
     */
    public subscribe(subscriber: Subscriber, propertyToWatch: string): void {
        let subscribers = this.subscribers[propertyToWatch];

        if (subscribers === void 0) {
            this.subscribers[propertyToWatch] = subscribers = new SubscriberSet(
                this.source
            );
        }

        subscribers.subscribe(subscriber);
    }

    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber The object that is unsubscribing from change notification.
     * @param propertyToUnwatch The name of the property that the subscriber is no longer interested in watching.
     */
    public unsubscribe(subscriber: Subscriber, propertyToUnwatch: string): void {
        const subscribers = this.subscribers[propertyToUnwatch];

        if (subscribers === void 0) {
            return;
        }

        subscribers.unsubscribe(subscriber);
    }
}
