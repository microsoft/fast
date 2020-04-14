import { Subscriber, SubscriberCollection } from "./subscriber-collection";

export interface Notifier {
    notify(source: any, args: any): void;
    subscribe(subscriber: Subscriber, context?: any): void;
    unsubscribe(subscriber: Subscriber, context?: any): void;
}

export class PropertyChangeNotifier implements Notifier {
    private subscribers: Record<string, SubscriberCollection> = {};

    public notify(source: any, propertyName: string): void {
        const subscribers = this.subscribers[propertyName];

        if (subscribers !== void 0) {
            subscribers.notifySubscribers(source, propertyName);
        }
    }

    public subscribe(subscriber: Subscriber, propertyName: string): void {
        const subscribers =
            this.subscribers[propertyName] ||
            (this.subscribers[propertyName] = new SubscriberCollection());

        subscribers.addSubscriber(subscriber);
    }

    public unsubscribe(subscriber: Subscriber, propertyName: string): void {
        const subscribers = this.subscribers[propertyName];

        if (subscribers === void 0) {
            return;
        }

        subscribers.removeSubscriber(subscriber);
    }
}
