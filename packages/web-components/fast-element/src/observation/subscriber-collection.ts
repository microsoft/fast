/**
 * Implemented by objects that are interested in change notifications.
 */
export interface Subscriber {
    handleChange(source: any, args: any): void;
}

function spilloverAddSubscriber(
    this: SubscriberCollection,
    subscriber: Subscriber
): void {
    (this as any).spillover.push(subscriber);
}

function spilloverRemoveSubscriber(
    this: SubscriberCollection,
    subscriber: Subscriber
): void {
    const index = (this as any).spillover.indexOf(subscriber);

    if (index !== -1) {
        (this as any).spillover.splice(index, 1);
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
 * This collection is optimized for the most common scenario of 1 - 3 subscribers.
 * With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array#push operations.
 * If the collection ever exceeds three subscribers, it will spill over into an array.
 */
export class SubscriberCollection {
    private sub1: Subscriber | undefined = void 0;
    private sub2: Subscriber | undefined = void 0;
    private spillover: Subscriber[] | undefined = void 0;

    public hasSubscriber(subscriber: Subscriber): boolean {
        return this.sub1 === subscriber || this.sub2 === subscriber;
    }

    public addSubscriber(subscriber: Subscriber): void {
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
        this.addSubscriber = spilloverAddSubscriber;
        this.removeSubscriber = spilloverRemoveSubscriber;
        this.notifySubscribers = spilloverNotifySubscribers;

        this.sub1 = void 0;
        this.sub2 = void 0;
    }

    public removeSubscriber(subscriber: Subscriber): void {
        if (this.sub1 === subscriber) {
            this.sub1 = void 0;
            return;
        }

        if (this.sub2 === subscriber) {
            this.sub2 = void 0;
            return;
        }
    }

    public notifySubscribers(source: any, args: any): void {
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
