import { expect, test } from "@playwright/test";
import { computedState, ownedState, state } from "./state.js";

test.describe("State", () => {
    test("can get and set the value", () => {
        const sut = state(1);

        expect(sut()).toBe(1);
        expect(sut.current).toBe(1);

        sut.set(2);

        expect(sut()).toBe(2);
        expect(sut.current).toBe(2);

        sut.current = 3;

        expect(sut()).toBe(3);
        expect(sut.current).toBe(3);
    });

    test("transfers its 2nd arg to the function name", () => {
        const name =
            "Answer to the Ultimate Question of Life, the Universe, and Everything";
        const sut = state(42, name);

        expect(sut.name).toBe(name);
    });

    test("transfers its name option to the function name", () => {
        const name =
            "Answer to the Ultimate Question of Life, the Universe, and Everything";
        const sut = state(42, { name });

        expect(sut.name).toBe(name);
    });

    test("can have its value observed", async ({ page }) => {
        await page.goto("/");

        const wasCalled = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { Observable, state, Updates } = await import("/main.js");

            const sut = state(1);
            let wasCalled = false;

            Observable.binding(sut, {
                handleChange() {
                    wasCalled = true;
                },
            }).observe({});

            sut.set(2);

            await Updates.next();

            return wasCalled;
        });

        expect(wasCalled).toBe(true);
    });

    test("can be deeply observed", async ({ page }) => {
        await page.goto("/");

        const callCount = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { Observable, state, Updates } = await import("/main.js");

            const sut = state(
                {
                    a: {
                        b: 1,
                        c: 2,
                    },
                },
                { deep: true }
            );

            let callCount = 0;
            const subscriber = {
                handleChange(binding: any, observer: any) {
                    callCount++;
                },
            };

            Observable.binding(() => sut().a.b, subscriber).observe({});
            Observable.binding(() => sut().a.c, subscriber).observe({});

            sut().a.b = 2;
            sut().a.c = 3;

            await Updates.next();

            return callCount;
        });

        expect(callCount).toBe(2);
    });

    test("can create a readonly version of the state", () => {
        const writable = state(1);
        const readable = writable.asReadonly();

        expect(readable()).toBe(1);
        expect(readable.current).toBe(1);

        writable.set(2);

        expect(readable()).toBe(2);
        expect(readable.current).toBe(2);

        expect("set" in readable).toBe(false);
        expect(() => ((readable as any).current = 2)).toThrow();
    });
});

test.describe("OwnedState", () => {
    test("can get and set the value for different owners", () => {
        const sut = ownedState(1);
        const owner1 = {};
        const owner2 = {};

        expect(sut(owner1)).toBe(1);
        expect(sut(owner2)).toBe(1);

        sut.set(owner1, 2);
        sut.set(owner2, 3);

        expect(sut(owner1)).toBe(2);
        expect(sut(owner2)).toBe(3);
    });

    test("transfers its 2nd arg to the function name", () => {
        const name =
            "Answer to the Ultimate Question of Life, the Universe, and Everything";
        const sut = ownedState(42, name);

        expect(sut.name).toBe(name);
    });

    test("transfers its name option to the function name", () => {
        const name =
            "Answer to the Ultimate Question of Life, the Universe, and Everything";
        const sut = ownedState(42, { name });

        expect(sut.name).toBe(name);
    });

    test("can have its value observed", async ({ page }) => {
        await page.goto("/");

        const wasCalled = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { Observable, ownedState, Updates } = await import("/main.js");

            const sut = ownedState(1);
            const owner1 = {};
            let wasCalled = false;

            Observable.binding(sut, {
                handleChange() {
                    wasCalled = true;
                },
            }).observe(owner1);

            sut.set(owner1, 2);

            await Updates.next();

            return wasCalled;
        });

        expect(wasCalled).toBe(true);
    });

    test("can be deeply observed", async ({ page }) => {
        await page.goto("/");

        const callCount = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { Observable, ownedState, Updates } = await import("/main.js");

            const sut = ownedState(
                {
                    a: {
                        b: 1,
                        c: 2,
                    },
                },
                { deep: true }
            );
            const owner1 = {};

            let callCount = 0;
            const subscriber = {
                handleChange(binding: any, observer: any) {
                    callCount++;
                },
            };

            Observable.binding((x: any) => sut(x).a.b, subscriber).observe(owner1);
            Observable.binding((x: any) => sut(x).a.c, subscriber).observe(owner1);

            sut(owner1).a.b = 2;
            sut(owner1).a.c = 3;

            await Updates.next();

            return callCount;
        });

        expect(callCount).toBe(2);
    });

    test("can create a readonly version of the state", () => {
        const writable = ownedState(1);
        const owner1 = {};
        const readable = writable.asReadonly();

        expect(readable(owner1)).toBe(1);

        writable.set(owner1, 2);

        expect(readable(owner1)).toBe(2);

        expect("set" in readable).toBe(false);
    });
});

test.describe("ComputedState", () => {
    test("can get the latest value", () => {
        const sut = computedState(x => {
            return () => 42;
        });

        expect(sut()).toBe(42);
        expect(sut.current).toBe(42);
    });

    test("transfers its 2nd arg to the function name", () => {
        const name =
            "Answer to the Ultimate Question of Life, the Universe, and Everything";
        const sut = computedState(x => {
            return () => 42;
        }, name);

        expect(sut.name).toBe(name);
    });

    test("updates in response to computation dependencies", () => {
        const dep = state(1);
        const sut = computedState(x => {
            return () => dep() * 2;
        });

        expect(sut()).toBe(2);

        dep.set(2);

        expect(sut()).toBe(4);

        dep.set(3);

        expect(sut()).toBe(6);
    });

    test("notifies subscribers when the computation changes", () => {
        const dep = state(1);
        const sut = computedState(x => {
            return () => dep() * 2;
        });

        expect(sut()).toBe(2);

        let calledCount = 0;
        const subscriber = {
            handleChange() {
                calledCount++;
            },
        };

        sut.subscribe(subscriber);

        dep.set(2);

        expect(sut()).toBe(4);
        expect(calledCount).toBe(1);

        dep.set(3);

        expect(sut()).toBe(6);
        expect(calledCount).toBe(2);

        sut.unsubscribe(subscriber);

        dep.set(4);

        expect(sut()).toBe(8);
        expect(calledCount).toBe(2);
    });

    test("unsubscribes and runs shutdown logic on dispose", () => {
        const dep = state(1);
        let shutdown = false;
        const sut = computedState(x => {
            x.on.setup(() => {
                return () => {
                    shutdown = true;
                };
            });

            return () => dep() * 2;
        });

        expect(sut()).toBe(2);

        let calledCount = 0;
        const subscriber = {
            handleChange() {
                calledCount++;
            },
        };

        sut.subscribe(subscriber);

        dep.set(2);

        expect(sut()).toBe(4);
        expect(calledCount).toBe(1);

        dep.set(3);

        expect(sut()).toBe(6);
        expect(calledCount).toBe(2);

        sut.dispose();

        dep.set(4);

        expect(sut()).toBe(6);
        expect(shutdown).toBe(true);
        expect(calledCount).toBe(2);
    });

    test("cleans up and restarts when dependencies in setup change", () => {
        const dep = state(1);
        const startupDep = state(1);

        let startup = 0;
        let shutdown = 0;
        const sut = computedState(x => {
            x.on.setup(() => {
                startupDep();
                startup++;

                return () => {
                    shutdown++;
                };
            });

            return () => dep() * 2;
        });

        expect(sut()).toBe(2);
        expect(startup).toBe(1);
        expect(shutdown).toBe(0);

        let calledCount = 0;
        const subscriber = {
            handleChange() {
                calledCount++;
            },
        };

        sut.subscribe(subscriber);

        dep.set(2);

        expect(sut()).toBe(4);
        expect(calledCount).toBe(1);

        startupDep.set(2);
        expect(shutdown).toBe(1);
        expect(startup).toBe(2);

        dep.set(3);

        expect(sut()).toBe(6);
        expect(calledCount).toBe(2);

        sut.dispose();

        dep.set(4);

        expect(sut()).toBe(6);
        expect(shutdown).toBe(2);
        expect(calledCount).toBe(2);
    });
});
