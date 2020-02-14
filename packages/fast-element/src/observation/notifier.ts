import { ISubscriber, SubscriberCollection } from "./subscriber-collection";

export interface INotifier {
    notify(source: any, args: any): void;
    subscribe(subscriber: ISubscriber, context?: any): void;
    unsubscribe(subscriber: ISubscriber, context?: any): void;
}

export class PropertyChangeNotifier implements INotifier {
    private subscribers: Record<string, SubscriberCollection> = {};

    public notify(source: any, propertyName: string) {
        const subscribers = this.subscribers[propertyName];

        if (subscribers !== void 0) {
            subscribers.notifySubscribers(source, propertyName);
        }
    }

    public subscribe(subscriber: ISubscriber, propertyName: string) {
        const subscribers =
            this.subscribers[propertyName] ||
            (this.subscribers[propertyName] = new SubscriberCollection());

        subscribers.addSubscriber(subscriber);
    }

    public unsubscribe(subscriber: ISubscriber, propertyName: string): void {
        const subscribers = this.subscribers[propertyName];

        if (subscribers === void 0) {
            return;
        }

        subscribers.removeSubscriber(subscriber);
    }
}
