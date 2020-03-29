import { Observable, observable } from "@microsoft/fast-element";
import { Subscriber } from "@microsoft/fast-element/dist/observation/subscriber-collection";

export interface Consumer extends Subscriber {
    isConsumer: boolean;
    connect(): void;
}

export interface Provider<T> {
    subscribe(item: Consumer): void;
    unsubscribe(item: Consumer): void;
    isProvider: boolean;
    context: T;
}

function isProvider<T>(val: any): val is Provider<T> {
    return val.isProvider;
}

/* tslint:disable */
export function provider<T extends { new (...args: any[]): any }>(value: T) {
    class Provider extends value {
        @observable
        public context; // How do we make this more... generic?

        public get isProvider() {
            return true;
        }

        public subscribe(consumer: Consumer) {
            Observable.getNotifier(this).subscribe(consumer, "context");
        }

        public disconnect(consumer: Consumer) {
            Observable.getNotifier(this).unsubscribe(consumer, "context");
        }
    }

    return Provider;
}

export function consumer<T extends { new (...args: any[]): any }>(value: T) {
    return class Consumer extends value {
        public eventName = "consumer::connect";

        public get isConsumer() {
            return true;
        }

        constructor(...args: any[]) {
            super(args);

            this.addEventListener(this.eventName, this.connectionHandler);
        }

        public connectedCallback() {
            super.connectedCallback();
            this.connect();
        }

        /**
         * Connect the consumer to the nearest provider
         */
        public connect() {
            this.dispatchEvent(new CustomEvent(this.eventName, { composed: true }));
        }

        public handleChange(value: Provider<unknown>) {
            console.log("context", value.context);
        }

        public connectionHandler = (e: CustomEvent) => {
            if ((e.target as any) === this) {
                const path = e.composedPath();

                for (let i = 0, ii = path.length; i < ii; i++) {
                    const item = path[i];

                    if (isProvider(item)) {
                        item.subscribe(this);

                        // TODO The handle change doesn't get triggered on instantiation
                        // so we need to fire this manually. Ask Rob.
                        this.handleChange(item);
                        break;
                    }
                }
            }
        };
    };
}
