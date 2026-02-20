import { expect, test } from "@playwright/test";
import { ChildModel, DerivedModel, Model } from "../testing/models.js";
import { PropertyChangeNotifier, SubscriberSet } from "./notifier.js";
import { Expression, Observable } from "./observable.js";

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
                "child"
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
                }
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
