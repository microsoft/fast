/**
 * Implemented by objects that are interested in change notifications.
 * @public
 */
export interface Subscriber {
    /**
     * Called when a subject this instance has subscribed to changes.
     * @param subject - The subject of the change.
     * @param args - The event args detailing the change that occurred.
     */
    handleChange(subject: any, args: any): void;
}

/**
 * Provides change notifications for an observed subject.
 * @public
 */
export interface Notifier {
    /**
     * The object that subscribers will receive notifications for.
     */
    readonly subject: any;

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
 * observable subject.
 *
 * @remarks
 * This set is optimized for the most common scenario of 1 or 2 subscribers.
 * With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array#push operations.
 * If the set ever exceeds two subscribers, it upgrades to an array automatically.
 * @public
 */
export class SubscriberSet implements Notifier {
    private sub1: Subscriber | undefined = void 0;
    private sub2: Subscriber | undefined = void 0;
    private spillover: Subscriber[] | undefined = void 0;

    /**
     * The object that subscribers will receive notifications for.
     */
    public readonly subject: any;

    /**
     * Creates an instance of SubscriberSet for the specified subject.
     * @param subject - The subject that subscribers will receive notifications from.
     * @param initialSubscriber - An initial subscriber to changes.
     */
    public constructor(subject: any, initialSubscriber?: Subscriber) {
        this.subject = subject;
        this.sub1 = initialSubscriber;
    }

    /**
     * Checks whether the provided subscriber has been added to this set.
     * @param subscriber - The subscriber to test for inclusion in this set.
     */
    public has(subscriber: Subscriber): boolean {
        return this.spillover === void 0
            ? this.sub1 === subscriber || this.sub2 === subscriber
            : this.spillover.indexOf(subscriber) !== -1;
    }

    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     */
    public subscribe(subscriber: Subscriber): void {
        const spillover = this.spillover;

        if (spillover === void 0) {
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
            this.sub1 = void 0;
            this.sub2 = void 0;
        } else {
            const index = spillover.indexOf(subscriber);
            if (index === -1) {
                spillover.push(subscriber);
            }
        }
    }

    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     */
    public unsubscribe(subscriber: Subscriber): void {
        const spillover = this.spillover;

        if (spillover === void 0) {
            if (this.sub1 === subscriber) {
                this.sub1 = void 0;
            } else if (this.sub2 === subscriber) {
                this.sub2 = void 0;
            }
        } else {
            const index = spillover.indexOf(subscriber);
            if (index !== -1) {
                spillover.splice(index, 1);
            }
        }
    }

    /**
     * Notifies all subscribers.
     * @param args - Data passed along to subscribers during notification.
     */
    public notify(args: any): void {
        const spillover = this.spillover;
        const subject = this.subject;

        if (spillover === void 0) {
            const sub1 = this.sub1;
            const sub2 = this.sub2;

            if (sub1 !== void 0) {
                sub1.handleChange(subject, args);
            }

            if (sub2 !== void 0) {
                sub2.handleChange(subject, args);
            }
        } else {
            for (let i = 0, ii = spillover.length; i < ii; ++i) {
                spillover[i].handleChange(subject, args);
            }
        }
    }
}

/**
 * An implementation of Notifier that allows subscribers to be notified
 * of individual property changes on an object.
 * @public
 */
export class PropertyChangeNotifier implements Notifier {
    private subscribers: Record<string, SubscriberSet> = {};
    private subjectSubscribers: SubscriberSet | null = null;

    /**
     * The subject that property changes are being notified for.
     */
    public readonly subject: any;

    /**
     * Creates an instance of PropertyChangeNotifier for the specified subject.
     * @param subject - The object that subscribers will receive notifications for.
     */
    public constructor(subject: any) {
        this.subject = subject;
    }

    /**
     * Notifies all subscribers, based on the specified property.
     * @param propertyName - The property name, passed along to subscribers during notification.
     */
    public notify(propertyName: string): void {
        this.subscribers[propertyName]?.notify(propertyName);
        this.subjectSubscribers?.notify(propertyName);
    }

    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     * @param propertyToWatch - The name of the property that the subscriber is interested in watching for changes.
     */
    public subscribe(subscriber: Subscriber, propertyToWatch?: string): void {
        let subscribers: SubscriberSet;

        if (propertyToWatch) {
            subscribers =
                this.subscribers[propertyToWatch] ??
                (this.subscribers[propertyToWatch] = new SubscriberSet(this.subject));
        } else {
            subscribers =
                this.subjectSubscribers ??
                (this.subjectSubscribers = new SubscriberSet(this.subject));
        }

        subscribers.subscribe(subscriber);
    }

    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     * @param propertyToUnwatch - The name of the property that the subscriber is no longer interested in watching.
     */
    public unsubscribe(subscriber: Subscriber, propertyToUnwatch?: string): void {
        if (propertyToUnwatch) {
            this.subscribers[propertyToUnwatch]?.unsubscribe(subscriber);
        } else {
            this.subjectSubscribers?.unsubscribe(subscriber);
        }
    }
}
