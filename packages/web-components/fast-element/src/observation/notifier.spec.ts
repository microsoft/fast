/* eslint-disable */
import chai from "chai";
import { PropertyChangeNotifier, Subscriber, SubscriberSet } from "./notifier.js";
const { expect } = chai;

describe(`A SubscriberSet`, () => {
    const oneThroughTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    oneThroughTen.forEach(x => {
        context(`for ${x} subscriber(s)`, () => {
            const subscriberCounts = oneThroughTen.filter(y => y <= x);
            const sourceValue = {};

            it(`can add each subscriber`, () => {
                const subscribers = new Array(x);
                const set = new SubscriberSet(sourceValue);

                subscriberCounts.forEach(y => {
                    const subscriber = (subscribers[y - 1] = { handleChange() {} });
                    set.subscribe(subscriber);
                    expect(set.has(subscriber)).to.be.true;
                });

                subscribers.forEach(y => {
                    expect(set.has(y)).to.be.true;
                });
            });

            it(`can remove each subscriber`, () => {
                const subscribers = new Array(x);
                const set = new SubscriberSet(sourceValue);

                subscriberCounts.forEach(y => {
                    set.subscribe((subscribers[y - 1] = { handleChange() {} }));
                });

                subscribers.forEach(y => {
                    expect(set.has(y)).to.be.true;
                });

                subscribers.forEach(y => {
                    set.unsubscribe(y);
                });

                subscribers.forEach(y => {
                    expect(set.has(y)).to.not.be.true;
                });
            });

            it(`can notify all subscribers`, () => {
                const subscribers = new Array(x);
                const set = new SubscriberSet(sourceValue);
                const notified: Subscriber[] = [];
                const argsValue = "someProperty";

                subscriberCounts.forEach(y => {
                    set.subscribe(
                        (subscribers[y - 1] = {
                            handleChange(source, args) {
                                expect(source).to.equal(sourceValue);
                                expect(args).to.equal(argsValue);
                                notified.push(this);
                            },
                        })
                    );
                });

                set.notify(argsValue);
                expect(notified).to.eql(subscribers);
            });

            it(`dedupes subscribers`, () => {
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
                subscribers.forEach(sub => expect(sub.invocationCount).to.equal(1));
            });
        });
    });
});

describe(`A PropertyChangeNotifier`, () => {
    const possibleProperties = ["propertyOne", "propertyTwo", "propertyThree"];
    const oneThroughTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    function getNextProperty(name: string) {
        let index = possibleProperties.indexOf(name) + 1;

        if (index >= possibleProperties.length) {
            index = 0;
        }

        return possibleProperties[index];
    }

    possibleProperties.forEach(propertyName => {
        oneThroughTen.forEach(x => {
            context(`for ${x} subscriber(s)`, () => {
                const subscriberCounts = oneThroughTen.filter(y => y <= x);
                const sourceValue = {};

                it(`can subscribe to a specific property`, () => {
                    const notifier = new PropertyChangeNotifier(sourceValue);
                    const subscribers = new Array(x);
                    const nextPropertyName = getNextProperty(propertyName);

                    subscriberCounts.forEach(y => {
                        const handler = (subscribers[y - 1] = {
                            invokedWith: [],
                            handleChange(source: any, propertyName: string) {
                                this.invokedWith.push(propertyName);
                            },
                        });

                        notifier.subscribe(handler, propertyName);
                    });

                    notifier.notify(propertyName);
                    notifier.notify(nextPropertyName);

                    subscribers.forEach(subscriber => {
                        expect(subscriber.invokedWith).to.contain(propertyName);
                        expect(subscriber.invokedWith).to.not.contain(nextPropertyName);
                    });
                });

                it(`can subscribe to multiple properties`, () => {
                    const notifier = new PropertyChangeNotifier(sourceValue);
                    const subscribers = new Array(x);
                    const nextPropertyName = getNextProperty(propertyName);
                    const nextNextPropertyName = getNextProperty(nextPropertyName);

                    subscriberCounts.forEach(y => {
                        const handler = (subscribers[y - 1] = {
                            invokedWith: [],
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

                    subscribers.forEach(subscriber => {
                        expect(subscriber.invokedWith).to.contain(propertyName);
                        expect(subscriber.invokedWith).to.contain(nextPropertyName);
                        expect(subscriber.invokedWith).to.not.contain(
                            nextNextPropertyName
                        );
                    });
                });

                it(`can unsubscribe from a specific property`, () => {
                    const notifier = new PropertyChangeNotifier(sourceValue);
                    const subscribers = new Array(x);
                    const nextPropertyName = getNextProperty(propertyName);

                    subscriberCounts.forEach(y => {
                        const handler = (subscribers[y - 1] = {
                            invokedWith: [],
                            handleChange(source: any, propertyName: string) {
                                this.invokedWith.push(propertyName);
                            },
                        });

                        notifier.subscribe(handler, propertyName);
                        notifier.subscribe(handler, nextPropertyName);
                    });

                    notifier.notify(propertyName);
                    notifier.notify(nextPropertyName);

                    subscribers.forEach(subscriber => {
                        expect(subscriber.invokedWith).to.contain(propertyName);
                        expect(subscriber.invokedWith).to.contain(nextPropertyName);
                    });

                    subscribers.forEach(subscriber => {
                        subscriber.invokedWith = [];
                        notifier.unsubscribe(subscriber, propertyName);
                    });

                    notifier.notify(propertyName);
                    notifier.notify(nextPropertyName);

                    subscribers.forEach(subscriber => {
                        expect(subscriber.invokedWith).to.not.contain(propertyName);
                        expect(subscriber.invokedWith).to.contain(nextPropertyName);
                    });
                });

                it(`can unsubscribe from multiple properties`, () => {
                    const notifier = new PropertyChangeNotifier(sourceValue);
                    const subscribers = new Array(x);
                    const nextPropertyName = getNextProperty(propertyName);

                    subscriberCounts.forEach(y => {
                        const handler = (subscribers[y - 1] = {
                            invokedWith: [],
                            handleChange(source: any, propertyName: string) {
                                this.invokedWith.push(propertyName);
                            },
                        });

                        notifier.subscribe(handler, propertyName);
                        notifier.subscribe(handler, nextPropertyName);
                    });

                    notifier.notify(propertyName);
                    notifier.notify(nextPropertyName);

                    subscribers.forEach(subscriber => {
                        expect(subscriber.invokedWith).to.contain(propertyName);
                        expect(subscriber.invokedWith).to.contain(nextPropertyName);
                    });

                    subscribers.forEach(subscriber => {
                        subscriber.invokedWith = [];
                        notifier.unsubscribe(subscriber, propertyName);
                        notifier.unsubscribe(subscriber, nextPropertyName);
                    });

                    notifier.notify(propertyName);
                    notifier.notify(nextPropertyName);

                    subscribers.forEach(subscriber => {
                        expect(subscriber.invokedWith).to.not.contain(propertyName);
                        expect(subscriber.invokedWith).to.not.contain(nextPropertyName);
                    });
                });
            });
        });
    });
});
