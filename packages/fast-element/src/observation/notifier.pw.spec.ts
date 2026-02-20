import { expect, test } from "@playwright/test";
import { PropertyChangeNotifier, Subscriber, SubscriberSet } from "./notifier.js";

test.describe(`A SubscriberSet`, () => {
    const oneThroughTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (let i = 0; i < oneThroughTen.length; i++) {
        const x = oneThroughTen[i];
        test.describe(`${i}: for ${x} subscriber(s)`, () => {
            const subscriberCounts = oneThroughTen.filter(y => y <= x);
            const sourceValue = {};

            test(`can add each subscriber`, () => {
                const subscribers = new Array(x);
                const set = new SubscriberSet(sourceValue);

                subscriberCounts.forEach(y => {
                    const subscriber = (subscribers[y - 1] = { handleChange() {} });
                    set.subscribe(subscriber);
                    expect(set.has(subscriber)).toBe(true);
                });

                subscribers.forEach(y => {
                    expect(set.has(y)).toBe(true);
                });
            });

            test(`can remove each subscriber`, () => {
                const subscribers = new Array(x);
                const set = new SubscriberSet(sourceValue);

                subscriberCounts.forEach(y => {
                    set.subscribe((subscribers[y - 1] = { handleChange() {} }));
                });

                subscribers.forEach(y => {
                    expect(set.has(y)).toBe(true);
                });

                subscribers.forEach(y => {
                    set.unsubscribe(y);
                });

                subscribers.forEach(y => {
                    expect(set.has(y)).not.toBe(true);
                });
            });

            test(`can notify all subscribers`, () => {
                const subscribers = new Array(x);
                const set = new SubscriberSet(sourceValue);
                const notified: Subscriber[] = [];
                const argsValue = "someProperty";

                subscriberCounts.forEach(y => {
                    set.subscribe(
                        (subscribers[y - 1] = {
                            handleChange(source: any, args: any) {
                                expect(source).toBe(sourceValue);
                                expect(args).toBe(argsValue);
                                notified.push(this);
                            },
                        })
                    );
                });

                set.notify(argsValue);
                expect(notified).toEqual(subscribers);
            });

            test(`dedupes subscribers`, () => {
                const subscribers = new Array(x);
                const set = new SubscriberSet(sourceValue);
                const argsValue = "someProperty";

                subscriberCounts.forEach(y => {
                    const handler = (subscribers[y - 1] = {
                        invocationCount: 0,
                        handleChange() {
                            this.invocationCount++;
                        },
                    });

                    set.subscribe(handler);
                    set.subscribe(handler);
                });

                set.notify(argsValue);
                subscribers.forEach((sub: any) => expect(sub.invocationCount).toBe(1));
            });
        });
    }
});

test.describe(`A PropertyChangeNotifier`, () => {
    const possibleProperties = ["propertyOne", "propertyTwo", "propertyThree"];
    const oneThroughTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    function getNextProperty(name: string) {
        let index = possibleProperties.indexOf(name) + 1;

        if (index >= possibleProperties.length) {
            index = 0;
        }

        return possibleProperties[index];
    }

    for (let pi = 0; pi < possibleProperties.length; pi++) {
        const propertyName = possibleProperties[pi];
        for (let i = 0; i < oneThroughTen.length; i++) {
            const x = oneThroughTen[i];
            test.describe(`${pi}-${i}: for ${x} subscriber(s)`, () => {
                const subscriberCounts = oneThroughTen.filter(y => y <= x);
                const sourceValue = {};

                test(`can subscribe to a specific property`, () => {
                    const notifier = new PropertyChangeNotifier(sourceValue);
                    const subscribers = new Array(x);
                    const nextPropertyName = getNextProperty(propertyName);

                    subscriberCounts.forEach(y => {
                        const handler = (subscribers[y - 1] = {
                            invokedWith: [] as string[],
                            handleChange(source: any, propertyName: string) {
                                this.invokedWith.push(propertyName);
                            },
                        });

                        notifier.subscribe(handler, propertyName);
                    });

                    notifier.notify(propertyName);
                    notifier.notify(nextPropertyName);

                    subscribers.forEach((subscriber: any) => {
                        expect(subscriber.invokedWith).toContain(propertyName);
                        expect(subscriber.invokedWith).not.toContain(nextPropertyName);
                    });
                });

                test(`can subscribe to multiple properties`, () => {
                    const notifier = new PropertyChangeNotifier(sourceValue);
                    const subscribers = new Array(x);
                    const nextPropertyName = getNextProperty(propertyName);
                    const nextNextPropertyName = getNextProperty(nextPropertyName);

                    subscriberCounts.forEach(y => {
                        const handler = (subscribers[y - 1] = {
                            invokedWith: [] as string[],
                            handleChange(source: any, propertyName: string) {
                                this.invokedWith.push(propertyName);
                            },
                        });

                        notifier.subscribe(handler, propertyName);
                        notifier.subscribe(handler, nextPropertyName);
                    });

                    notifier.notify(propertyName);
                    notifier.notify(nextPropertyName);
                    notifier.notify(nextPropertyName);

                    subscribers.forEach((subscriber: any) => {
                        expect(subscriber.invokedWith).toContain(propertyName);
                        expect(subscriber.invokedWith).toContain(nextPropertyName);
                        expect(subscriber.invokedWith).not.toContain(
                            nextNextPropertyName
                        );
                    });
                });

                test(`can unsubscribe from a specific property`, () => {
                    const notifier = new PropertyChangeNotifier(sourceValue);
                    const subscribers = new Array(x);
                    const nextPropertyName = getNextProperty(propertyName);

                    subscriberCounts.forEach(y => {
                        const handler = (subscribers[y - 1] = {
                            invokedWith: [] as string[],
                            handleChange(source: any, propertyName: string) {
                                this.invokedWith.push(propertyName);
                            },
                        });

                        notifier.subscribe(handler, propertyName);
                        notifier.subscribe(handler, nextPropertyName);
                    });

                    notifier.notify(propertyName);
                    notifier.notify(nextPropertyName);

                    subscribers.forEach((subscriber: any) => {
                        expect(subscriber.invokedWith).toContain(propertyName);
                        expect(subscriber.invokedWith).toContain(nextPropertyName);
                    });

                    subscribers.forEach((subscriber: any) => {
                        subscriber.invokedWith = [];
                        notifier.unsubscribe(subscriber, propertyName);
                    });

                    notifier.notify(propertyName);
                    notifier.notify(nextPropertyName);

                    subscribers.forEach((subscriber: any) => {
                        expect(subscriber.invokedWith).not.toContain(propertyName);
                        expect(subscriber.invokedWith).toContain(nextPropertyName);
                    });
                });

                test(`can unsubscribe from multiple properties`, () => {
                    const notifier = new PropertyChangeNotifier(sourceValue);
                    const subscribers = new Array(x);
                    const nextPropertyName = getNextProperty(propertyName);

                    subscriberCounts.forEach(y => {
                        const handler = (subscribers[y - 1] = {
                            invokedWith: [] as string[],
                            handleChange(source: any, propertyName: string) {
                                this.invokedWith.push(propertyName);
                            },
                        });

                        notifier.subscribe(handler, propertyName);
                        notifier.subscribe(handler, nextPropertyName);
                    });

                    notifier.notify(propertyName);
                    notifier.notify(nextPropertyName);

                    subscribers.forEach((subscriber: any) => {
                        expect(subscriber.invokedWith).toContain(propertyName);
                        expect(subscriber.invokedWith).toContain(nextPropertyName);
                    });

                    subscribers.forEach((subscriber: any) => {
                        subscriber.invokedWith = [];
                        notifier.unsubscribe(subscriber, propertyName);
                        notifier.unsubscribe(subscriber, nextPropertyName);
                    });

                    notifier.notify(propertyName);
                    notifier.notify(nextPropertyName);

                    subscribers.forEach((subscriber: any) => {
                        expect(subscriber.invokedWith).not.toContain(propertyName);
                        expect(subscriber.invokedWith).not.toContain(nextPropertyName);
                    });
                });
            });
        }
    }
});
