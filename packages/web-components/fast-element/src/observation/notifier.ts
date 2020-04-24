/**
 * Implemented by objects that are interested in change notifications.
 */
export interface Subscriber {
    handleChange(source: any, args: any): void;
}

export interface Notifier {
    notify(source: any, args: any): void;
    subscribe(subscriber: Subscriber, context?: any): void;
    unsubscribe(subscriber: Subscriber, context?: any): void;
}

function spilloverSubscribe(this: SubscriberCollection, subscriber: Subscriber): void {
    const spillover = (this as any).spillover as Subscriber[];
    const index = spillover.indexOf(subscriber);

    if (index === -1) {
        spillover.push(subscriber);
    }
}

function spilloverUnsubscribe(this: SubscriberCollection, subscriber: Subscriber): void {
    const spillover = (this as any).spillover as Subscriber[];
    const index = spillover.indexOf(subscriber);

    if (index !== -1) {
        spillover.splice(index, 1);
    }
}

function spilloverNotifySubscribers(
    this: SubscriberCollection,
    source: any,
    args: any
): void {
    const spillover = (this as any).spillover as Subscriber[];

    for (let i = 0, ii = spillover.length; i < ii; ++i) {
        spillover[i].handleChange(source, args);
    }
}

/**
 * Efficiently keeps track of subscribers interested in change notifications.
 *
 * @remarks
 * This collection is optimized for the most common scenario of 1 or 2 subscribers.
 * With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array#push operations.
 * If the collection ever exceeds two subscribers, it upgrade to an array.
 */
export class SubscriberCollection implements Notifier {
    private sub1: Subscriber | undefined = void 0;
    private sub2: Subscriber | undefined = void 0;
    private spillover: Subscriber[] | undefined = void 0;

    public subscribe(subscriber: Subscriber): void {
        if (this.sub1 === subscriber || this.sub2 === subscriber) {
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

        this.spillover = [this.sub1, this.sub2];
        this.subscribe = spilloverSubscribe;
        this.unsubscribe = spilloverUnsubscribe;
        this.notify = spilloverNotifySubscribers;

        this.sub1 = void 0;
        this.sub2 = void 0;
    }

    public unsubscribe(subscriber: Subscriber): void {
        if (this.sub1 === subscriber) {
            this.sub1 = void 0;
            return;
        }

        if (this.sub2 === subscriber) {
            this.sub2 = void 0;
            return;
        }
    }

    public notify(source: any, args: any): void {
        const sub1 = this.sub1;
        const sub2 = this.sub2;

        if (sub1 !== void 0) {
            sub1.handleChange(source, args);
        }

        if (sub2 !== void 0) {
            sub2.handleChange(source, args);
        }
    }
}

export class PropertyChangeNotifier implements Notifier {
    private subscribers: Record<string, SubscriberCollection> = {};

    public notify(source: any, propertyName: string): void {
        const subscribers = this.subscribers[propertyName];

        if (subscribers !== void 0) {
            subscribers.notify(source, propertyName);
        }
    }

    public subscribe(subscriber: Subscriber, propertyName: string): void {
        let subscribers = this.subscribers[propertyName];

        if (subscribers === void 0) {
            this.subscribers[propertyName] = subscribers = new SubscriberCollection();
        }

        subscribers.subscribe(subscriber);
    }

    public unsubscribe(subscriber: Subscriber, propertyName: string): void {
        const subscribers = this.subscribers[propertyName];

        if (subscribers === void 0) {
            return;
        }

        subscribers.unsubscribe(subscriber);
    }
}
