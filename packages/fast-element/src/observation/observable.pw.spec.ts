import { expect, test } from "@playwright/test";
import { ChildModel, DerivedModel, Model } from "../testing/models.js";
import { PropertyChangeNotifier, SubscriberSet } from "./notifier.js";
import { type Expression, Observable } from "./observable.js";

test.describe("The Observable", () => {
    test.describe("facade", () => {
        test("can get a notifier for an object", () => {
            const instance = new Model();
            const notifier = Observable.getNotifier(instance);

            expect(notifier).toBeInstanceOf(PropertyChangeNotifier);
        });

        test("gets the same notifier for the same object", () => {
            const instance = new Model();
            const notifier = Observable.getNotifier(instance);
            const notifier2 = Observable.getNotifier(instance);

            expect(notifier).toBe(notifier2);
        });

        test("gets different notifiers for different objects", () => {
            const notifier = Observable.getNotifier(new Model());
            const notifier2 = Observable.getNotifier(new Model());

            expect(notifier).not.toBe(notifier2);
        });

        test("can notify a change on an object", () => {
            const instance = new Model();
            const notifier = Observable.getNotifier(instance);
            let wasNotified = false;

            notifier.subscribe(
                {
                    handleChange() {
                        wasNotified = true;
                    },
                },
                "child",
            );

            expect(wasNotified).toBe(false);
            Observable.notify(instance, "child");
            expect(wasNotified).toBe(true);
        });

        test("can define a property on an object", () => {
            const obj = {} as any;
            expect("value" in obj).toBe(false);

            Observable.defineProperty(obj, "value");
            expect("value" in obj).toBe(true);
        });

        test("can list all accessors for an object", () => {
            const accessors = Observable.getAccessors(new Model());

            expect(accessors.length).toBe(4);
            expect(accessors[0].name).toBe("child");
            expect(accessors[1].name).toBe("child2");
        });

        test("can list accessors for an object, including the prototype chain", () => {
            const accessors = Observable.getAccessors(new DerivedModel());

            expect(accessors.length).toBe(5);
            expect(accessors[0].name).toBe("child");
            expect(accessors[1].name).toBe("child2");
            expect(accessors[4].name).toBe("derivedChild");
        });

        test("can create a binding observer", () => {
            const binding = (x: Model) => x.child;
            const observer = Observable.binding(binding);

            expect(observer).toBeInstanceOf(SubscriberSet);
        });
    });

    test.describe("BindingObserver", () => {
        test("notifies on changes in a simple binding", async ({ page }) => {
            await page.goto("/");

            const { valueBefore, valueAfter, wasNotifiedBefore, wasNotifiedAfter } =
                await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const { Observable, Fake, Model, ChildModel, Updates } = await import(
                        "/main.js"
                    );

                    const binding = (x: Model) => x.child;
                    let wasNotified = false;
                    const observer = Observable.binding(binding, {
                        handleChange() {
                            wasNotified = true;
                        },
                    });

                    const model = new Model();
                    let value = observer.observe(model, Fake.executionContext());
                    const valueBefore = value === model.child;
                    const wasNotifiedBefore = wasNotified;

                    model.child = new ChildModel();

                    await Updates.next();

                    const wasNotifiedAfter = wasNotified;

                    value = observer.observe(model, Fake.executionContext());

                    const valueAfter = value === model.child;

                    return {
                        valueBefore,
                        valueAfter,
                        wasNotifiedBefore,
                        wasNotifiedAfter,
                    };
                });

            expect(valueBefore).toBe(true);
            expect(wasNotifiedBefore).toBe(false);
            expect(wasNotifiedAfter).toBe(true);
            expect(valueAfter).toBe(true);
        });

        test("notifies on changes in a sub-property binding", async ({ page }) => {
            await page.goto("/");

            const { valueBefore, valueAfter, wasNotifiedBefore, wasNotifiedAfter } =
                await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const { Observable, Fake, Model, Updates } = await import("/main.js");

                    const binding = (x: Model) => x.child.value;
                    let wasNotified = false;
                    const observer = Observable.binding(binding, {
                        handleChange() {
                            wasNotified = true;
                        },
                    });

                    const model = new Model();

                    let value = observer.observe(model, Fake.executionContext());

                    const valueBefore = value === model.child.value;
                    const wasNotifiedBefore = wasNotified;

                    model.child.value = "something completely different";

                    await Updates.next();

                    const wasNotifiedAfter = wasNotified;

                    value = observer.observe(model, Fake.executionContext());

                    const valueAfter = value === model.child.value;

                    return {
                        valueBefore,
                        valueAfter,
                        wasNotifiedBefore,
                        wasNotifiedAfter,
                    };
                });

            expect(valueBefore).toBe(true);
            expect(wasNotifiedBefore).toBe(false);
            expect(wasNotifiedAfter).toBe(true);
            expect(valueAfter).toBe(true);
        });

        test("notifies on changes in a sub-property binding after disconnecting before notification has been processed", async ({
            page,
        }) => {
            await page.goto("/");

            const { valueBefore, valueAfter, calledBefore, calledAfter } =
                await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const { Observable, Fake, Model, Updates } = await import("/main.js");

                    const binding = (x: Model) => x.child.value;
                    let called = false;
                    const observer = Observable.binding(binding, {
                        handleChange() {
                            called = true;
                        },
                    });

                    const model = new Model();
                    let value = observer.observe(model, Fake.executionContext());
                    const valueBefore = value === model.child.value;

                    const calledBefore = called;

                    model.child.value = "something completely different";
                    observer.dispose();

                    await Updates.next();

                    const calledAfter = called;

                    value = observer.observe(model, Fake.executionContext());
                    const valueAfter = value === model.child.value;

                    model.child.value = "another completely different thing";

                    await Updates.next();

                    return {
                        valueBefore,
                        valueAfter,
                        calledBefore,
                        calledAfter,
                    };
                });

            expect(calledBefore).toBe(false);
            expect(calledAfter).toBe(false);
            expect(valueBefore).toBe(true);
            expect(valueAfter).toBe(true);
        });

        test("notifies on changes in a multi-property binding", async ({ page }) => {
            await page.goto("/");

            const {
                initialValue,
                wasNotifiedBefore,
                wasNotifiedAfterChildValue,
                valueAfterChildValue,
                wasNotifiedAfterChild2Value,
                valueAfterChild2Value,
                wasNotifiedAfterChild,
                valueAfterChild,
                wasNotifiedAfterChild2,
                valueAfterChild2,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Model, ChildModel, Updates } = await import(
                    "/main.js"
                );

                const binding = (x: Model) => x.child.value + x.child2.value;

                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });

                const model = new Model();
                let value = observer.observe(model, Fake.executionContext());
                const initialValue = value === model.child.value + model.child2.value;
                // change child.value
                const wasNotifiedBefore = wasNotified;
                model.child.value = "something completely different";

                await Updates.next();

                const wasNotifiedAfterChildValue = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterChildValue =
                    value === model.child.value + model.child2.value;

                // change child2.value
                wasNotified = false;
                model.child2.value = "another thing";

                await Updates.next();

                const wasNotifiedAfterChild2Value = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterChild2Value =
                    value === model.child.value + model.child2.value;

                // change child
                wasNotified = false;
                model.child = new ChildModel();

                await Updates.next();

                const wasNotifiedAfterChild = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterChild = value === model.child.value + model.child2.value;

                // change child 2
                wasNotified = false;
                model.child2 = new ChildModel();

                await Updates.next();

                const wasNotifiedAfterChild2 = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterChild2 = value === model.child.value + model.child2.value;

                return {
                    initialValue,
                    wasNotifiedBefore,
                    wasNotifiedAfterChildValue,
                    valueAfterChildValue,
                    wasNotifiedAfterChild2Value,
                    valueAfterChild2Value,
                    wasNotifiedAfterChild,
                    valueAfterChild,
                    wasNotifiedAfterChild2,
                    valueAfterChild2,
                };
            });

            expect(initialValue).toBe(true);
            expect(wasNotifiedBefore).toBe(false);
            expect(wasNotifiedAfterChildValue).toBe(true);
            expect(valueAfterChildValue).toBe(true);
            expect(wasNotifiedAfterChild2Value).toBe(true);
            expect(valueAfterChild2Value).toBe(true);
            expect(wasNotifiedAfterChild).toBe(true);
            expect(valueAfterChild).toBe(true);
            expect(wasNotifiedAfterChild2).toBe(true);
            expect(valueAfterChild2).toBe(true);
        });

        test("notifies on changes in a ternary expression", async ({ page }) => {
            await page.goto("/");

            const {
                initialValue,
                wasNotifiedBefore,
                wasNotifiedAfterTrigger,
                valueAfterTrigger,
                wasNotifiedAfterValue,
                valueAfterValue,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Model, Updates } = await import("/main.js");

                const binding = (x: Model) => (x.trigger < 1 ? 42 : x.value);

                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });

                const model = new Model();
                let value = observer.observe(model, Fake.executionContext());
                const initialValue = value === binding(model);

                const wasNotifiedBefore = wasNotified;
                model.incrementTrigger();

                await Updates.next();

                const wasNotifiedAfterTrigger = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterTrigger = value === binding(model);

                wasNotified = false;
                model.value = 20;

                await Updates.next();

                const wasNotifiedAfterValue = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterValue = value === binding(model);

                return {
                    initialValue,
                    wasNotifiedBefore,
                    wasNotifiedAfterTrigger,
                    valueAfterTrigger,
                    wasNotifiedAfterValue,
                    valueAfterValue,
                };
            });

            expect(initialValue).toBe(true);
            expect(wasNotifiedBefore).toBe(false);
            expect(wasNotifiedAfterTrigger).toBe(true);
            expect(valueAfterTrigger).toBe(true);
            expect(wasNotifiedAfterValue).toBe(true);
            expect(valueAfterValue).toBe(true);
        });

        test("notifies on changes in a computed ternary expression", async ({ page }) => {
            await page.goto("/");

            const {
                initialValue,
                wasNotifiedBefore,
                wasNotifiedAfterTrigger,
                valueAfterTrigger,
                wasNotifiedAfterValue,
                valueAfterValue,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Model, Updates } = await import("/main.js");

                const binding = (x: Model) => x.ternaryConditional;

                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });

                const model = new Model();
                let value = observer.observe(model, Fake.executionContext());
                const initialValue = value === binding(model);

                const wasNotifiedBefore = wasNotified;
                model.incrementTrigger();

                await Updates.next();

                const wasNotifiedAfterTrigger = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterTrigger = value === binding(model);

                wasNotified = false;
                model.value = 20;

                await Updates.next();

                const wasNotifiedAfterValue = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterValue = value === binding(model);

                return {
                    initialValue,
                    wasNotifiedBefore,
                    wasNotifiedAfterTrigger,
                    valueAfterTrigger,
                    wasNotifiedAfterValue,
                    valueAfterValue,
                };
            });

            expect(initialValue).toBe(true);
            expect(wasNotifiedBefore).toBe(false);
            expect(wasNotifiedAfterTrigger).toBe(true);
            expect(valueAfterTrigger).toBe(true);
            expect(wasNotifiedAfterValue).toBe(true);
            expect(valueAfterValue).toBe(true);
        });

        test("notifies on changes in an if expression", async ({ page }) => {
            await page.goto("/");

            const {
                initialValue,
                wasNotifiedBefore,
                wasNotifiedAfterTrigger,
                valueAfterTrigger,
                wasNotifiedAfterValue,
                valueAfterValue,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Model, Updates } = await import("/main.js");

                const binding = (x: Model) => {
                    if (x.trigger < 1) {
                        return 42;
                    }

                    return x.value;
                };

                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });

                const model = new Model();
                let value = observer.observe(model, Fake.executionContext());
                const initialValue = value === binding(model);

                const wasNotifiedBefore = wasNotified;
                model.incrementTrigger();

                await Updates.next();

                const wasNotifiedAfterTrigger = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterTrigger = value === binding(model);

                wasNotified = false;
                model.value = 20;

                await Updates.next();

                const wasNotifiedAfterValue = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterValue = value === binding(model);

                return {
                    initialValue,
                    wasNotifiedBefore,
                    wasNotifiedAfterTrigger,
                    valueAfterTrigger,
                    wasNotifiedAfterValue,
                    valueAfterValue,
                };
            });

            expect(initialValue).toBe(true);
            expect(wasNotifiedBefore).toBe(false);
            expect(wasNotifiedAfterTrigger).toBe(true);
            expect(valueAfterTrigger).toBe(true);
            expect(wasNotifiedAfterValue).toBe(true);
            expect(valueAfterValue).toBe(true);
        });

        test("notifies on changes in a computed if expression", async ({ page }) => {
            await page.goto("/");

            const {
                initialValue,
                wasNotifiedBefore,
                wasNotifiedAfterTrigger,
                valueAfterTrigger,
                wasNotifiedAfterValue,
                valueAfterValue,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Model, Updates } = await import("/main.js");

                const binding = (x: Model) => x.ifConditional;

                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });

                const model = new Model();
                let value = observer.observe(model, Fake.executionContext());
                const initialValue = value === binding(model);

                const wasNotifiedBefore = wasNotified;
                model.incrementTrigger();

                await Updates.next();

                const wasNotifiedAfterTrigger = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterTrigger = value === binding(model);

                wasNotified = false;
                model.value = 20;

                await Updates.next();

                const wasNotifiedAfterValue = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterValue = value === binding(model);

                return {
                    initialValue,
                    wasNotifiedBefore,
                    wasNotifiedAfterTrigger,
                    valueAfterTrigger,
                    wasNotifiedAfterValue,
                    valueAfterValue,
                };
            });

            expect(initialValue).toBe(true);
            expect(wasNotifiedBefore).toBe(false);
            expect(wasNotifiedAfterTrigger).toBe(true);
            expect(valueAfterTrigger).toBe(true);
            expect(wasNotifiedAfterValue).toBe(true);
            expect(valueAfterValue).toBe(true);
        });

        test("notifies on changes in an && expression", async ({ page }) => {
            await page.goto("/");

            const {
                initialValue,
                wasNotifiedBefore,
                wasNotifiedAfterTrigger,
                valueAfterTrigger,
                wasNotifiedAfterValue,
                valueAfterValue,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Model, Updates } = await import("/main.js");

                const binding = (x: Model) => x.trigger && x.value;

                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });

                const model = new Model();
                let value = observer.observe(model, Fake.executionContext());
                const initialValue = value === binding(model);

                const wasNotifiedBefore = wasNotified;
                model.incrementTrigger();

                await Updates.next();

                const wasNotifiedAfterTrigger = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterTrigger = value === binding(model);

                wasNotified = false;
                model.value = 20;

                await Updates.next();

                const wasNotifiedAfterValue = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterValue = value === binding(model);

                return {
                    initialValue,
                    wasNotifiedBefore,
                    wasNotifiedAfterTrigger,
                    valueAfterTrigger,
                    wasNotifiedAfterValue,
                    valueAfterValue,
                };
            });

            expect(initialValue).toBe(true);
            expect(wasNotifiedBefore).toBe(false);
            expect(wasNotifiedAfterTrigger).toBe(true);
            expect(valueAfterTrigger).toBe(true);
            expect(wasNotifiedAfterValue).toBe(true);
            expect(valueAfterValue).toBe(true);
        });

        test("notifies on changes in a computed && expression", async ({ page }) => {
            await page.goto("/");

            const {
                initialValue,
                wasNotifiedBefore,
                wasNotifiedAfterTrigger,
                valueAfterTrigger,
                wasNotifiedAfterValue,
                valueAfterValue,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Model, Updates } = await import("/main.js");

                const binding = (x: Model) => x.trigger && x.value;

                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });

                const model = new Model();
                let value = observer.observe(model, Fake.executionContext());
                const initialValue = value === binding(model);

                const wasNotifiedBefore = wasNotified;
                model.incrementTrigger();

                await Updates.next();

                const wasNotifiedAfterTrigger = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterTrigger = value === binding(model);

                wasNotified = false;
                model.value = 20;

                await Updates.next();

                const wasNotifiedAfterValue = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterValue = value === binding(model);

                return {
                    initialValue,
                    wasNotifiedBefore,
                    wasNotifiedAfterTrigger,
                    valueAfterTrigger,
                    wasNotifiedAfterValue,
                    valueAfterValue,
                };
            });

            expect(initialValue).toBe(true);
            expect(wasNotifiedBefore).toBe(false);
            expect(wasNotifiedAfterTrigger).toBe(true);
            expect(valueAfterTrigger).toBe(true);
            expect(wasNotifiedAfterValue).toBe(true);
            expect(valueAfterValue).toBe(true);
        });

        test("notifies on changes in an || expression", async ({ page }) => {
            await page.goto("/");

            const {
                initialValue,
                wasNotifiedBefore,
                wasNotifiedAfterDecrement,
                valueAfterDecrement,
                wasNotifiedAfterValue,
                valueAfterValue,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Model, Updates } = await import("/main.js");

                const binding = (x: Model) => x.trigger || x.value;

                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });

                const model = new Model();
                model.incrementTrigger();

                let value = observer.observe(model, Fake.executionContext());
                const initialValue = value === binding(model);

                const wasNotifiedBefore = wasNotified;
                model.decrementTrigger();

                await Updates.next();

                const wasNotifiedAfterDecrement = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterDecrement = value === binding(model);

                wasNotified = false;
                model.value = 20;

                await Updates.next();

                const wasNotifiedAfterValue = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterValue = value === binding(model);

                return {
                    initialValue,
                    wasNotifiedBefore,
                    wasNotifiedAfterDecrement,
                    valueAfterDecrement,
                    wasNotifiedAfterValue,
                    valueAfterValue,
                };
            });

            expect(initialValue).toBe(true);
            expect(wasNotifiedBefore).toBe(false);
            expect(wasNotifiedAfterDecrement).toBe(true);
            expect(valueAfterDecrement).toBe(true);
            expect(wasNotifiedAfterValue).toBe(true);
            expect(valueAfterValue).toBe(true);
        });

        test("notifies on changes in a switch/case expression", async ({ page }) => {
            await page.goto("/");

            const {
                initialValue,
                wasNotifiedBefore,
                wasNotifiedAfterTrigger,
                valueAfterTrigger,
                wasNotifiedAfterValue,
                valueAfterValue,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Model, Updates } = await import("/main.js");

                const binding = (x: Model) => {
                    switch (x.trigger) {
                        case 0:
                            return 42;
                        default:
                            return x.value;
                    }
                };

                let wasNotified = false;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        wasNotified = true;
                    },
                });

                const model = new Model();
                let value = observer.observe(model, Fake.executionContext());
                const initialValue = value === binding(model);

                const wasNotifiedBefore = wasNotified;
                model.incrementTrigger();

                await Updates.next();

                const wasNotifiedAfterTrigger = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterTrigger = value === binding(model);

                wasNotified = false;
                model.value = 20;

                await Updates.next();

                const wasNotifiedAfterValue = wasNotified;

                value = observer.observe(model, Fake.executionContext());
                const valueAfterValue = value === binding(model);

                return {
                    initialValue,
                    wasNotifiedBefore,
                    wasNotifiedAfterTrigger,
                    valueAfterTrigger,
                    wasNotifiedAfterValue,
                    valueAfterValue,
                };
            });

            expect(initialValue).toBe(true);
            expect(wasNotifiedBefore).toBe(false);
            expect(wasNotifiedAfterTrigger).toBe(true);
            expect(valueAfterTrigger).toBe(true);
            expect(wasNotifiedAfterValue).toBe(true);
            expect(valueAfterValue).toBe(true);
        });

        test("does not notify if disconnected", async ({ page }) => {
            await page.goto("/");

            const { valueMatches, wasCalledBefore, wasCalledAfter } = await page.evaluate(
                async () => {
                    // @ts-expect-error: Client module.
                    const { Observable, Fake, Model, Updates } = await import("/main.js");

                    const binding = (x: Model) => x.value;
                    let wasCalled = false;
                    const observer = Observable.binding(binding, {
                        handleChange() {
                            wasCalled = true;
                        },
                    });

                    const model = new Model();

                    const value = observer.observe(model, Fake.executionContext());
                    const valueMatches = value === model.value;
                    const wasCalledBefore = wasCalled;

                    model.value++;
                    observer.dispose();

                    await Updates.next();

                    const wasCalledAfter = wasCalled;

                    return {
                        valueMatches,
                        wasCalledBefore,
                        wasCalledAfter,
                    };
                },
            );

            expect(valueMatches).toBe(true);
            expect(wasCalledBefore).toBe(false);
            expect(wasCalledAfter).toBe(false);
        });

        test("allows inspection of subscription records of used observables after observation", async ({
            page,
        }) => {
            await page.goto("/");

            const { recordCount, allSourcesMatch } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake } = await import("/main.js");

                const observed = [{}, {}, {}].map((x: any, i) => {
                    Observable.defineProperty(x, "value");
                    x.value = i;
                    return x;
                });

                function binding() {
                    return observed[0].value + observed[1].value + observed[2].value;
                }

                const bindingObserver = Observable.binding(binding);
                bindingObserver.observe({}, Fake.executionContext());

                let i = 0;
                let allSourcesMatch = true;
                for (const record of bindingObserver.records()) {
                    if (record.propertySource !== observed[i]) {
                        allSourcesMatch = false;
                    }
                    i++;
                }

                return {
                    recordCount: i,
                    allSourcesMatch,
                };
            });

            expect(recordCount).toBe(3);
            expect(allSourcesMatch).toBe(true);
        });
    });

    test.describe("BindingObserver with short-circuited dependencies", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/");
        });

        test("notifies when an observable short-circuited by && changes", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Updates } = await import("/main.js");

                const model: any = { plainGuard: false };
                Observable.defineProperty(model, "value");
                model.value = 0;

                const binding = (x: any) => x.plainGuard && x.value;

                let notifyCount = 0;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        notifyCount++;
                    },
                });

                const initialValue = observer.observe(model, Fake.executionContext());
                const initialRecordCount = [...observer.records()].length;

                model.value = 1;
                await Updates.next();

                const notifyCountAfterValue = notifyCount;

                model.plainGuard = true;
                model.value = 2;
                await Updates.next();

                const valueAfterGuard = observer.observe(model, Fake.executionContext());
                const recordCountAfterGuard = [...observer.records()].length;

                return {
                    initialValue,
                    initialRecordCount,
                    notifyCountAfterValue,
                    valueAfterGuard,
                    recordCountAfterGuard,
                };
            });

            expect(result.initialValue).toBe(false);
            expect(result.initialRecordCount).toBe(0);
            expect(result.notifyCountAfterValue).toBe(1);
            expect(result.valueAfterGuard).toBe(2);
            expect(result.recordCountAfterGuard).toBe(1);
        });

        test("recovers when a healthy binding evaluates to zero dependencies", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Updates } = await import("/main.js");

                const model: any = { plainGuard: true };
                Observable.defineProperty(model, "a");
                Observable.defineProperty(model, "b");
                model.a = 1;
                model.b = 2;

                const binding = (x: any) => (x.plainGuard ? x.a + x.b : 0);

                let notifyCount = 0;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        notifyCount++;
                    },
                });

                observer.observe(model, Fake.executionContext());
                const healthyRecordCount = [...observer.records()].length;

                model.plainGuard = false;
                observer.observe(model, Fake.executionContext());
                const deadRecordCount = [...observer.records()].length;

                model.a = 10;
                await Updates.next();

                const notifyCountAfterA = notifyCount;

                model.plainGuard = true;
                const valueAfterRecovery = observer.observe(
                    model,
                    Fake.executionContext(),
                );

                notifyCount = 0;
                model.b = 20;
                await Updates.next();

                return {
                    healthyRecordCount,
                    deadRecordCount,
                    notifyCountAfterA,
                    valueAfterRecovery,
                    notifyCountAfterRecovery: notifyCount,
                };
            });

            expect(result.healthyRecordCount).toBe(2);
            expect(result.deadRecordCount).toBe(0);
            expect(result.notifyCountAfterA).toBe(1);
            expect(result.valueAfterRecovery).toBe(12);
            expect(result.notifyCountAfterRecovery).toBe(1);
        });

        test("drops records left behind by a longer previous evaluation", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake } = await import("/main.js");

                const model: any = { plainGuard: true };
                Observable.defineProperty(model, "a");
                Observable.defineProperty(model, "b");
                model.a = 1;
                model.b = 2;

                const binding = (x: any) => (x.plainGuard ? x.a + x.b : x.a);
                const observer = Observable.binding(binding);

                observer.observe(model, Fake.executionContext());
                const twoDepRecords = [...observer.records()].map(
                    (r: any) => r.propertyName,
                );

                model.plainGuard = false;
                observer.observe(model, Fake.executionContext());
                const oneDepRecords = [...observer.records()].map(
                    (r: any) => r.propertyName,
                );

                return { twoDepRecords, oneDepRecords };
            });

            expect(result.twoDepRecords).toEqual(["a", "b"]);
            expect(result.oneDepRecords).toEqual(["a"]);
        });

        test("does not subject-watch a binding that collected a dependency", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Updates } = await import("/main.js");

                const model: any = { plainGuard: "yes" };
                Observable.defineProperty(model, "value");
                model.value = 1;

                const binding = (x: any) => x.value && x.plainGuard;

                let notifyCount = 0;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        notifyCount++;
                    },
                });

                const value = observer.observe(model, Fake.executionContext());
                const records = [...observer.records()].map((r: any) => r.propertyName);
                const notifier: any = Observable.getNotifier(model);
                const hasSubjectSubscribers = notifier.subjectSubscribers !== null;

                model.value = 2;
                await Updates.next();

                return {
                    value,
                    records,
                    hasSubjectSubscribers,
                    notifyCount,
                };
            });

            expect(result.value).toBe("yes");
            expect(result.records).toEqual(["value"]);
            expect(result.hasSubjectSubscribers).toBe(false);
            expect(result.notifyCount).toBe(1);
        });

        test("notifies for ||, ternary and optional chaining short-circuits", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Updates } = await import("/main.js");

                async function observeZeroDep(binding: any) {
                    const model: any = { plainGuard: true, maybeNull: null };
                    Observable.defineProperty(model, "value");
                    model.value = 0;

                    let notifyCount = 0;
                    const observer = Observable.binding(binding, {
                        handleChange() {
                            notifyCount++;
                        },
                    });

                    observer.observe(model, Fake.executionContext());
                    const recordCount = [...observer.records()].length;

                    model.value = 1;
                    await Updates.next();

                    return { recordCount, notifyCount };
                }

                return {
                    or: await observeZeroDep((x: any) => x.plainGuard || x.value),
                    ternary: await observeZeroDep((x: any) =>
                        x.plainGuard ? 1 : x.value,
                    ),
                    optional: await observeZeroDep((x: any) => x.maybeNull?.value),
                };
            });

            expect(result.or).toEqual({ recordCount: 0, notifyCount: 1 });
            expect(result.ternary).toEqual({ recordCount: 0, notifyCount: 1 });
            expect(result.optional).toEqual({ recordCount: 0, notifyCount: 1 });
        });

        test("notifies when a trackVolatile getter reads no observables", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Updates } = await import("/main.js");

                const model: any = { plainGuard: false };
                Observable.defineProperty(model, "value");
                model.value = 0;
                Object.defineProperty(model, "guarded", {
                    get(this: any) {
                        Observable.trackVolatile();
                        return this.plainGuard ? this.value : 42;
                    },
                });

                const binding = (x: any) => x.guarded;

                let notifyCount = 0;
                const observer = Observable.binding(binding, {
                    handleChange() {
                        notifyCount++;
                    },
                });

                const isVolatileBinding = Observable.isVolatileBinding(binding);
                const initialValue = observer.observe(model, Fake.executionContext());
                const recordCount = [...observer.records()].length;

                model.value = 1;
                await Updates.next();

                return {
                    isVolatileBinding,
                    initialValue,
                    recordCount,
                    notifyCount,
                };
            });

            expect(result.isVolatileBinding).toBe(false);
            expect(result.initialValue).toBe(42);
            expect(result.recordCount).toBe(0);
            expect(result.notifyCount).toBe(1);
        });

        test("does not subscribe non-volatile bindings that read no observables", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Updates } = await import("/main.js");

                async function observeConstant(binding: any) {
                    const model: any = { plainField: "plain" };
                    Observable.defineProperty(model, "value");
                    model.value = 0;

                    let notifyCount = 0;
                    const observer = Observable.binding(binding, {
                        handleChange() {
                            notifyCount++;
                        },
                    });

                    observer.observe(model, Fake.executionContext());
                    const notifier: any = Observable.getNotifier(model);

                    model.value = 1;
                    await Updates.next();

                    return {
                        recordCount: [...observer.records()].length,
                        hasSubjectSubscribers: notifier.subjectSubscribers !== null,
                        notifyCount,
                    };
                }

                return {
                    text: await observeConstant(() => "hello"),
                    number: await observeConstant(() => 42),
                    field: await observeConstant((x: any) => x.plainField),
                };
            });

            const expected = {
                recordCount: 0,
                hasSubjectSubscribers: false,
                notifyCount: 0,
            };

            expect(result.text).toEqual(expected);
            expect(result.number).toEqual(expected);
            expect(result.field).toEqual(expected);
        });

        test("watches an object source that does not have a notifier yet", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake } = await import("/main.js");

                const binding = (x: any) => (x.selected ? "danger" : "");

                const plainSource: any = { selected: false };
                const plainObserver = Observable.binding(binding);
                plainObserver.observe(plainSource, Fake.executionContext());

                const plainNotifier: any = Observable.getNotifier(plainSource);

                const notifiedSource: any = { selected: false };
                Observable.defineProperty(notifiedSource, "value");
                notifiedSource.value = 0;

                const notifiedObserver = Observable.binding(binding);
                notifiedObserver.observe(notifiedSource, Fake.executionContext());

                const notifiedNotifier: any = Observable.getNotifier(notifiedSource);

                return {
                    plainHasController: "$fastController" in plainSource,
                    plainIsSubscribed:
                        plainNotifier.subjectSubscribers.has(plainObserver),
                    notifiedIsSubscribed:
                        notifiedNotifier.subjectSubscribers.has(notifiedObserver),
                };
            });

            expect(result.plainHasController).toBe(false);
            expect(result.plainIsSubscribed).toBe(true);
            expect(result.notifiedIsSubscribed).toBe(true);
        });

        test("notifies for an observable that was never written before binding", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Updates } = await import("/main.js");

                // an observable that is declared but never assigned has no
                // notifier: the accessor creates one on the first write.
                class Item {
                    // a plain field, so the expression below short-circuits
                    // before it ever reads the observable.
                    isVisible = false;
                }

                Observable.defineProperty(Item.prototype, "selected");

                const item: any = new Item();

                let notifyCount = 0;
                const observer = Observable.binding(
                    (x: any) => x.isVisible && x.selected,
                    {
                        handleChange() {
                            notifyCount++;
                        },
                    },
                );

                const initialValue = observer.observe(item, Fake.executionContext());

                // the first write is what creates the notifier for the item.
                item.selected = true;
                await Updates.next();

                const notifyCountAfterWrite = notifyCount;

                item.isVisible = true;
                const valueAfterWrite = observer.observe(item, Fake.executionContext());

                return { initialValue, notifyCountAfterWrite, valueAfterWrite };
            });

            expect(result.initialValue).toBe(false);
            expect(result.notifyCountAfterWrite).toBe(1);
            expect(result.valueAfterWrite).toBe(true);
        });

        test("does not throw or mutate when the source is an array", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake } = await import("/main.js");

                let arrayObservationEnabled = true;

                try {
                    Observable.getNotifier([]);
                } catch {
                    arrayObservationEnabled = false;
                }

                const source: any = [1, 2, 3];
                const observer = Observable.binding((x: any) =>
                    x[0] ? "first" : "none",
                );

                let error: string | null = null;
                let value: any;

                try {
                    value = observer.observe(source, Fake.executionContext());
                } catch (e: any) {
                    error = e.message;
                }

                return {
                    arrayObservationEnabled,
                    error,
                    value,
                    hasController: "$fastController" in source,
                    recordCount: [...observer.records()].length,
                };
            });

            expect(result.arrayObservationEnabled).toBe(false);
            expect(result.error).toBe(null);
            expect(result.value).toBe("first");
            expect(result.hasController).toBe(false);
            expect(result.recordCount).toBe(0);
        });

        test("does not throw for primitive, null or function sources", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake } = await import("/main.js");

                const observer = Observable.binding((x: any, c: any) =>
                    c.isFirst && x ? "yes" : "no",
                );

                const sources = ["a", 1, true, null, void 0, () => "fn"];
                const errors: string[] = [];

                for (const source of sources) {
                    try {
                        observer.observe(source, Fake.executionContext());
                    } catch (e: any) {
                        errors.push(`${String(source)}: ${e.message}`);
                    }
                }

                return { errors, recordCount: [...observer.records()].length };
            });

            expect(result.errors).toEqual([]);
            expect(result.recordCount).toBe(0);
        });

        test("does not accumulate subject subscribers across evaluations", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake } = await import("/main.js");

                const model: any = { plainGuard: false };
                Observable.defineProperty(model, "value");
                model.value = 0;

                const observer = Observable.binding((x: any) => x.plainGuard && x.value);

                for (let i = 0; i < 10; i++) {
                    observer.observe(model, Fake.executionContext());
                }

                const subscribers: any = (Observable.getNotifier(model) as any)
                    .subjectSubscribers;

                if (subscribers === null) {
                    return { subscriberCount: 0, isSubscribed: false };
                }

                const subscriberCount = subscribers.spillover
                    ? subscribers.spillover.length
                    : (subscribers.sub1 ? 1 : 0) + (subscribers.sub2 ? 1 : 0);

                return { subscriberCount, isSubscribed: subscribers.has(observer) };
            });

            expect(result.subscriberCount).toBe(1);
            expect(result.isSubscribed).toBe(true);
        });

        test("stops notifying a zero dependency binding once disposed", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, Fake, Updates } = await import("/main.js");

                const model: any = { plainGuard: false };
                Observable.defineProperty(model, "value");
                model.value = 0;

                let notifyCount = 0;
                const observer = Observable.binding((x: any) => x.plainGuard && x.value, {
                    handleChange() {
                        notifyCount++;
                    },
                });

                observer.observe(model, Fake.executionContext());
                observer.dispose();

                model.value = 1;
                await Updates.next();

                const subscribers: any = (Observable.getNotifier(model) as any)
                    .subjectSubscribers;

                return {
                    notifyCount,
                    isSubscribed:
                        subscribers === null ? false : subscribers.has(observer),
                };
            });

            expect(result.notifyCount).toBe(0);
            expect(result.isSubscribed).toBe(false);
        });
    });

    test.describe("DefaultObservableAccessor", () => {
        test("calls its own change callback", () => {
            const model = new Model();
            model.child = new ChildModel();
            expect(model.childChangedCalled).toBe(true);
        });

        test("calls a derived change callback", () => {
            const model = new DerivedModel();
            model.child2 = new ChildModel();
            expect(model.child2ChangedCalled).toBe(true);
        });
    });

    test.describe("isVolatileBinding", () => {
        test("should return true when expression uses ternary operator", () => {
            const expression = (a: any) => (a !== undefined ? a : undefined);

            expect(Observable.isVolatileBinding(expression)).toBe(true);
        });

        test("should return true when expression uses 'if' condition", () => {
            const expression = (a: any) => {
                if (a !== undefined) {
                    return a;
                }
            };

            expect(Observable.isVolatileBinding(expression)).toBe(true);
        });

        test("should return true when expression uses '&&' operator", () => {
            const expression = (a: any) => {
                a && true;
            };

            expect(Observable.isVolatileBinding(expression)).toBe(true);
        });

        test("should return true when expression uses '||' operator", () => {
            const expression = (a: any) => {
                a || true;
            };

            expect(Observable.isVolatileBinding(expression)).toBe(true);
        });

        test("should return true when when expression uses JavaScript optional chaining", () => {
            // Avoid TS Compiling Optional property syntax away into ternary
            // by using Function constructor
            const expression = Function("(a) => a?.b") as Expression;

            expect(Observable.isVolatileBinding(expression)).toBe(true);
        });
    });
});
