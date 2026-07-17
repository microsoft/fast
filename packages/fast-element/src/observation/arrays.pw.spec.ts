import { expect, test } from "@playwright/test";
import { ArrayObserver, lengthOf, type Sort, type Splice } from "./arrays.js";
import { SubscriberSet } from "./notifier.js";
import { Observable } from "./observable.js";

const conditionalTimeout = function (
    condition: boolean,
    iteration = 0,
): Promise<boolean> {
    return new Promise(function (resolve) {
        setTimeout(() => {
            if (iteration === 10 || condition) {
                resolve(true);
            }

            conditionalTimeout(condition, iteration + 1);
        }, 5);
    });
};

test.describe("The ArrayObserver", () => {
    test.beforeEach(() => {
        ArrayObserver.enable();
    });

    test("can be retrieved through Observable.getNotifier()", () => {
        const array: any[] = [];
        const notifier = Observable.getNotifier(array);
        expect(notifier).toBeInstanceOf(SubscriberSet);
    });

    test("is the same instance for multiple calls to Observable.getNotifier() on the same array", () => {
        const array: any[] = [];
        const notifier = Observable.getNotifier(array);
        const notifier2 = Observable.getNotifier(array);
        expect(notifier).toBe(notifier2);
    });

    test("is different for different arrays", () => {
        const notifier = Observable.getNotifier([]);
        const notifier2 = Observable.getNotifier([]);
        expect(notifier).not.toBe(notifier2);
    });

    test("doesn't affect for/in loops on arrays when enabled", () => {
        const array = [1, 2, 3];
        const keys: string[] = [];

        for (const key in array) {
            keys.push(key);
        }

        expect(keys).toEqual(["0", "1", "2"]);
    });

    test("doesn't affect for/in loops on arrays when the array is observed", () => {
        const array = [1, 2, 3];
        const keys: string[] = [];
        const notifier = Observable.getNotifier(array);

        for (const key in array) {
            keys.push(key);
        }

        expect(notifier).toBeInstanceOf(SubscriberSet);
        expect(keys).toEqual(["0", "1", "2"]);
    });

    test("observes pops", async ({ page }) => {
        await page.goto("/");

        const array = ["foo", "bar", "hello", "world"];

        array.pop();
        expect(array).toEqual(["foo", "bar", "hello"]);

        Array.prototype.pop.call(array);
        expect(array).toEqual(["foo", "bar"]);

        array.pop();
        expect(array).toEqual(["foo"]);

        const {
            changeArgsLength,
            changeArgs0AddedCount,
            changeArgs0Removed,
            changeArgs0Index,
        } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            const array = ["foo", "bar"];
            const observer = Observable.getNotifier<ArrayObserver>(array);
            let changeArgs: Splice[] | null = null;

            observer.subscribe({
                handleChange(array, args) {
                    changeArgs = args;
                },
            });

            array.pop();

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            return {
                changeArgsLength: changeArgs!.length,
                changeArgs0AddedCount: changeArgs![0].addedCount,
                changeArgs0Removed: JSON.stringify(changeArgs![0].removed),
                changeArgs0Index: changeArgs![0].index,
            };
        });

        expect(changeArgsLength).toEqual(1);
        expect(changeArgs0AddedCount).toBe(0);
        expect(changeArgs0Removed).toEqual(`["bar"]`);
        expect(changeArgs0Index).toBe(1);
    });

    test("observes pushes", async ({ page }) => {
        await page.goto("/");

        const array: string[] = [];

        array.push("foo");
        expect(array).toEqual(["foo"]);

        Array.prototype.push.call(array, "bar");
        expect(array).toEqual(["foo", "bar"]);

        const {
            changeArgsLength,
            changeArgs0AddedCount,
            changeArgs0Removed,
            changeArgs0Index,
        } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            const array = ["foo", "bar"];
            const observer = Observable.getNotifier<ArrayObserver>(array);
            let changeArgs: Splice[] | null = null;

            observer.subscribe({
                handleChange(array, args) {
                    changeArgs = args;
                },
            });

            array.push("hello");

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            return {
                changeArgsLength: changeArgs!.length,
                changeArgs0AddedCount: changeArgs![0].addedCount,
                changeArgs0Removed: JSON.stringify(changeArgs![0].removed),
                changeArgs0Index: changeArgs![0].index,
            };
        });

        expect(changeArgsLength).toEqual(1);
        expect(changeArgs0AddedCount).toBe(1);
        expect(changeArgs0Removed).toEqual(`[]`);
        expect(changeArgs0Index).toBe(2);
    });

    test("observes reverses", async ({ page }) => {
        await page.goto("/");

        const array = [1, 2, 3, 4];
        array.reverse();

        expect(array).toEqual([4, 3, 2, 1]);

        Array.prototype.reverse.call(array);
        expect(array).toEqual([1, 2, 3, 4]);

        const { changeArgsLength, changeArgs0Sorted } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3, 4];
            const observer = Observable.getNotifier<ArrayObserver>(array);
            let changeArgs: Sort[] | null = null;

            observer.subscribe({
                handleChange(array, args) {
                    changeArgs = args;
                },
            });

            array.reverse();

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            return {
                changeArgsLength: changeArgs!.length,
                changeArgs0Sorted: JSON.stringify(changeArgs![0].sorted),
            };
        });

        expect(changeArgsLength).toEqual(1);
        expect(changeArgs0Sorted).toEqual("[3,2,1,0]");
    });

    test("observes shifts", async ({ page }) => {
        await page.goto("/");

        const array = ["foo", "bar", "hello", "world"];

        array.shift();
        expect(array).toEqual(["bar", "hello", "world"]);

        Array.prototype.shift.call(array);
        expect(array).toEqual(["hello", "world"]);

        const {
            changeArgsLength,
            changeArgs0AddedCount,
            changeArgs0Removed,
            changeArgs0Index,
        } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            const array = ["hello", "world"];
            const observer = Observable.getNotifier<ArrayObserver>(array);
            let changeArgs: Splice[] | null = null;

            observer.subscribe({
                handleChange(array, args) {
                    changeArgs = args;
                },
            });

            array.shift();

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            return {
                changeArgsLength: changeArgs!.length,
                changeArgs0AddedCount: changeArgs![0].addedCount,
                changeArgs0Removed: JSON.stringify(changeArgs![0].removed),
                changeArgs0Index: changeArgs![0].index,
            };
        });

        expect(changeArgsLength).toEqual(1);
        expect(changeArgs0AddedCount).toBe(0);
        expect(changeArgs0Removed).toEqual(`["hello"]`);
        expect(changeArgs0Index).toBe(0);
    });

    test("observes sorts", async ({ page }) => {
        await page.goto("/");

        const array = [1, 3, 2, 4, 3];

        array.sort((a, b) => b - a);
        expect(array).toEqual([4, 3, 3, 2, 1]);

        Array.prototype.sort.call(array, (a, b) => a - b);
        expect(array).toEqual([1, 2, 3, 3, 4]);

        const { changeArgsLength, changeArgs0Sorted } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 3, 2, 4, 3];
            const observer = Observable.getNotifier<ArrayObserver>(array);
            let changeArgs: Sort[] | null = null;

            observer.subscribe({
                handleChange(array, args) {
                    changeArgs = args;
                },
            });

            array.sort((a, b) => b - a);

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            return {
                changeArgsLength: changeArgs!.length,
                changeArgs0Sorted: JSON.stringify(changeArgs![0].sorted),
            };
        });

        expect(changeArgsLength).toEqual(1);
        expect(changeArgs0Sorted).toEqual("[3,1,4,2,0]");
    });

    test("observes splices", async ({ page }) => {
        await page.goto("/");

        const {
            changeArgsLength,
            changeArgs0AddedCount,
            changeArgs0Removed,
            changeArgs0Index,
        } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            const array: any[] = [1, "hello", "world", 4];

            const observer = Observable.getNotifier<ArrayObserver>(array);
            let changeArgs: Splice[] | null = null;

            observer.subscribe({
                handleChange(array, args) {
                    changeArgs = args;
                },
            });

            array.splice(1, 1, "foo");

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            return {
                changeArgsLength: changeArgs!.length,
                changeArgs0AddedCount: changeArgs![0].addedCount,
                changeArgs0Removed: JSON.stringify(changeArgs![0].removed),
                changeArgs0Index: changeArgs![0].index,
            };
        });

        expect(changeArgsLength).toEqual(1);
        expect(changeArgs0AddedCount).toBe(1);
        expect(changeArgs0Removed).toEqual(`["hello"]`);
        expect(changeArgs0Index).toBe(1);
    });

    test("observes unshifts", async ({ page }) => {
        await page.goto("/");

        const {
            changeArgsLength,
            changeArgs0AddedCount,
            changeArgs0Removed,
            changeArgs0Index,
        } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            const array: string[] = ["bar", "foo"];

            const observer = Observable.getNotifier<ArrayObserver>(array);
            let changeArgs: Splice[] | null = null;

            observer.subscribe({
                handleChange(array, args) {
                    changeArgs = args;
                },
            });

            array.unshift("hello");

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            return {
                changeArgsLength: changeArgs!.length,
                changeArgs0AddedCount: changeArgs![0].addedCount,
                changeArgs0Removed: JSON.stringify(changeArgs![0].removed),
                changeArgs0Index: changeArgs![0].index,
            };
        });

        expect(changeArgsLength).toEqual(1);
        expect(changeArgs0AddedCount).toBe(1);
        expect(changeArgs0Removed).toEqual("[]");
        expect(changeArgs0Index).toBe(0);
    });

    test("observes back to back array modification operations", async ({ page }) => {
        await page.goto("/");

        const {
            changeArgs0Length,
            changeArgs0AddedCount,
            changeArgs0Removed,
            changeArgs0Index,
            changeArgs1Length,
            changeArgs1AddedCount,
            changeArgs1Removed,
            changeArgs1Index,
            changeArgs2Length,
            changeArgs2AddedCount,
            changeArgs2Removed,
            changeArgs2Index,
            changeArgs3Length,
            changeArgs3AddedCount,
            changeArgs3Removed,
            changeArgs3Index,
            changeArgs4Length,
            changeArgs4AddedCount,
            changeArgs4Removed,
            changeArgs4Index,
            changeArgs5Length,
            changeArgs5AddedCount,
            changeArgs5Removed,
            changeArgs5Index,
        } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            const array: string[] = ["bar", "foo"];

            const observer = Observable.getNotifier<ArrayObserver>(array);
            let changeArgs: Splice[] | null = null;

            observer.subscribe({
                handleChange(array, args) {
                    changeArgs = args;
                },
            });

            array.unshift("hello");

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            const changeArgs0Length = changeArgs!.length,
                changeArgs0AddedCount = changeArgs![0].addedCount,
                changeArgs0Removed = JSON.stringify(changeArgs![0].removed),
                changeArgs0Index = changeArgs![0].index;

            changeArgs = null;

            Array.prototype.shift.call(array);

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            const changeArgs1Length = changeArgs!.length,
                changeArgs1AddedCount = changeArgs![0].addedCount,
                changeArgs1Removed = JSON.stringify(changeArgs![0].removed),
                changeArgs1Index = changeArgs![0].index;

            changeArgs = null;

            array.unshift("hello", "world");

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            const changeArgs2Length = changeArgs!.length,
                changeArgs2AddedCount = changeArgs![0].addedCount,
                changeArgs2Removed = JSON.stringify(changeArgs![0].removed),
                changeArgs2Index = changeArgs![0].index;

            changeArgs = null;

            Array.prototype.unshift.call(array, "hi", "there");

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            const changeArgs3Length = changeArgs!.length,
                changeArgs3AddedCount = changeArgs![0].addedCount,
                changeArgs3Removed = JSON.stringify(changeArgs![0].removed),
                changeArgs3Index = changeArgs![0].index;

            changeArgs = null;

            Array.prototype.splice.call(array, 2, 2, "bye", "foo");

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            const changeArgs4Length = changeArgs!.length,
                changeArgs4AddedCount = changeArgs![0].addedCount,
                changeArgs4Removed = JSON.stringify(changeArgs![0].removed),
                changeArgs4Index = changeArgs![0].index;

            changeArgs = null;

            Array.prototype.splice.call(array, 1, 0, "hello");

            await Promise.race([Updates.next(), conditionalTimeout(changeArgs !== null)]);

            const changeArgs5Length = changeArgs!.length,
                changeArgs5AddedCount = changeArgs![0].addedCount,
                changeArgs5Removed = JSON.stringify(changeArgs![0].removed),
                changeArgs5Index = changeArgs![0].index;

            return {
                changeArgs0Length,
                changeArgs0AddedCount,
                changeArgs0Removed,
                changeArgs0Index,
                changeArgs1Length,
                changeArgs1AddedCount,
                changeArgs1Removed,
                changeArgs1Index,
                changeArgs2Length,
                changeArgs2AddedCount,
                changeArgs2Removed,
                changeArgs2Index,
                changeArgs3Length,
                changeArgs3AddedCount,
                changeArgs3Removed,
                changeArgs3Index,
                changeArgs4Length,
                changeArgs4AddedCount,
                changeArgs4Removed,
                changeArgs4Index,
                changeArgs5Length,
                changeArgs5AddedCount,
                changeArgs5Removed,
                changeArgs5Index,
            };
        });

        expect(changeArgs0Length).toEqual(1);
        expect(changeArgs0AddedCount).toBe(1);
        expect(changeArgs0Removed).toEqual("[]");
        expect(changeArgs0Index).toBe(0);

        expect(changeArgs1Length).toEqual(1);
        expect(changeArgs1AddedCount).toBe(0);
        expect(changeArgs1Removed).toEqual(`["hello"]`);
        expect(changeArgs1Index).toBe(0);

        expect(changeArgs2Length).toEqual(1);
        expect(changeArgs2AddedCount).toBe(2);
        expect(changeArgs2Removed).toEqual("[]");
        expect(changeArgs2Index).toBe(0);

        expect(changeArgs3Length).toEqual(1);
        expect(changeArgs3AddedCount).toBe(2);
        expect(changeArgs3Removed).toEqual("[]");
        expect(changeArgs3Index).toBe(0);

        expect(changeArgs4Length).toEqual(1);
        expect(changeArgs4AddedCount).toBe(2);
        expect(changeArgs4Removed).toEqual(`["hello","world"]`);
        expect(changeArgs4Index).toBe(2);

        expect(changeArgs5Length).toEqual(1);
        expect(changeArgs5AddedCount).toBe(1);
        expect(changeArgs5Removed).toEqual("[]");
        expect(changeArgs5Index).toBe(1);
    });

    test("should not deliver splices for changes prior to subscription", async ({
        page,
    }) => {
        await page.goto("/");

        const wasCalled = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3, 4, 5];
            const observer = Observable.getNotifier(array);
            let wasCalled = false;

            array.push(6);
            observer.subscribe({
                handleChange() {
                    wasCalled = true;
                },
            });

            await Promise.race([Updates.next(), conditionalTimeout(wasCalled)]);

            return wasCalled;
        });

        expect(wasCalled).toBe(false);
    });

    test("should not deliver splices for .splice() when .splice() does not change the items in the array", async ({
        page,
    }) => {
        await page.goto("/");

        const splicesLength = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3, 4, 5];
            const observer = Observable.getNotifier(array);
            let splices: any;

            observer.subscribe({
                handleChange(source, args) {
                    splices = args;
                },
            });

            array.splice(0, array.length, ...array);

            await Promise.race([
                Updates.next(),
                conditionalTimeout(Array.isArray(splices)),
            ]);

            return splices.length;
        });

        expect(splicesLength).toBe(0);
    });
});

// An array's `length` is a non-configurable own property, so array observation cannot
// trap it. Mutations such as `array.length = 0` therefore record no splices. The
// observer detects the resulting length drift at flush time and converts the whole
// change set into a reset.
test.describe("The ArrayObserver with untracked length changes", () => {
    test("delivers a reset when the array is cleared with length = 0 and then refilled", async ({
        page,
    }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3, 4, 5];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            array.length = 0;
            array.push("new");

            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 0),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["RESET"]);
    });

    test("delivers a reset when an untracked truncation follows a tracked mutation", async ({
        page,
    }) => {
        await page.goto("/");

        const { notifications, length } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                lengthOf,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3, 4, 5];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            array.push("new");
            array.length = 0;

            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 0),
            ]);

            return { notifications, length: lengthOf(array) };
        });

        expect(notifications).toEqual(["RESET"]);
        expect(length).toBe(0);
    });

    test("delivers a reset when length is truncated to a non-zero value", async ({
        page,
    }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3, 4, 5];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            array.length = 2;
            array.push("new");

            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 0),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["RESET"]);
    });

    test("delivers a reset when length grows, creating holes", async ({ page }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            array.length = 5;
            array.push("new");

            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 0),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["RESET"]);
    });

    test("delivers a reset for an out-of-bounds index write", async ({ page }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3, 4, 5];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            array[10] = "x";
            array.push("new");

            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 0),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["RESET"]);
    });

    test("delivers a reset rather than a sort when a sort accompanies drift", async ({
        page,
    }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [3, 1, 2];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            array.length = 1;
            array.sort();

            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 0),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["RESET"]);
    });

    test("delivers exactly one reset for several untracked and tracked changes in a tick", async ({
        page,
    }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3, 4, 5];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            array.length = 3;
            array.push("a");
            array.length = 1;
            array.push("b");
            array.unshift("c");

            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 0),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["RESET"]);
    });

    test("returns to incremental splices on the ticks following a reset", async ({
        page,
    }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3, 4, 5];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            // Tick one: drift, so a reset.
            array.length = 1;
            array.push("a");
            await Updates.next();

            // Tick two: a plain tracked mutation, so an incremental splice. A broken
            // implementation leaves the baseline stale here and resets forever.
            array.push("b");
            await Updates.next();

            // Tick three: likewise.
            array.pop();
            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 2),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["RESET", "spl(i=2,-0,+1)", "spl(i=2,-1,+0)"]);
    });

    test("routes the reset through a custom SpliceStrategy's normalize", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                Splice,
                SpliceStrategy,
                Updates,
                // @ts-expect-error: Client module.
            } = await import("/main.js");

            ArrayObserver.enable();

            // A strategy that owns its own reset payload. `support: reset` strategies
            // are free to record splices purely as bookkeeping markers, so the drift
            // path must hand the reset back to normalize() rather than short-circuit
            // to the built-in reset splices.
            const customReset = new Splice(0, [], 0);
            customReset.reset = true;
            (customReset as any).customMarker = true;

            SpliceStrategy.setDefaultStrategy({
                support: 1,
                normalize(previous: any, current: any, changes: any) {
                    return previous === void 0 ? (changes ?? []) : [customReset];
                },
                pop: (array: any, o: any, pop: any, args: any) => pop.apply(array, args),
                push(array: any, observer: any, push: any, args: any) {
                    const result = push.apply(array, args);
                    observer.addSplice(
                        new Splice(array.length - args.length, [], args.length),
                    );
                    return result;
                },
                reverse: (array: any, o: any, reverse: any, args: any) =>
                    reverse.apply(array, args),
                shift: (array: any, o: any, shift: any, args: any) =>
                    shift.apply(array, args),
                sort: (array: any, o: any, sort: any, args: any) =>
                    sort.apply(array, args),
                splice: (array: any, o: any, splice: any, args: any) =>
                    splice.apply(array, args),
                unshift: (array: any, o: any, unshift: any, args: any) =>
                    unshift.apply(array, args),
            });

            const array = [1, 2, 3, 4, 5];
            const observer = Observable.getNotifier(array);
            let delivered: any;

            observer.subscribe({
                handleChange(source: any, args: any) {
                    delivered = args;
                },
            });

            array.length = 0;
            array.push("new");

            await Promise.race([
                Updates.next(),
                conditionalTimeout(delivered !== void 0),
            ]);

            return {
                count: delivered?.length ?? 0,
                isCustom: delivered?.[0]?.customMarker === true,
                isReset: delivered?.[0]?.reset === true,
            };
        });

        expect(result).toEqual({ count: 1, isCustom: true, isReset: true });
    });

    test("delivers a pending drift reset synchronously when lengthOf first subscribes", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, lengthOf, Observable, recordArrayChanges } =
                await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3, 4, 5];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            array.length = 0;
            array.push("new");

            // The lengthObserver getter subscribes, and DefaultArrayObserver.subscribe
            // flushes synchronously — so the pending drift is drained here, inside what
            // would be a binding evaluation.
            const length = lengthOf(array);

            return { notifications, length };
        });

        expect(result.notifications).toEqual(["RESET"]);
        expect(result.length).toBe(1);
    });

    test("does not reset when a subscriber mutates the array from handleChange", async ({
        page,
    }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);

                    // Re-entrant mutation: queues its own splice against the next flush.
                    // The baseline must already account for it or this looks like drift.
                    if (notifications.length === 1) {
                        array.push("re-entrant");
                    }
                },
            });

            array.push("first");

            await Updates.next();
            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 1),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["spl(i=3,-0,+1)", "spl(i=4,-0,+1)"]);
    });

    test("does not reset for an untracked change made before the observer existed", async ({
        page,
    }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3];
            array.length = 0;

            // The baseline is captured here, so the clear above is ancient history.
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            array.push("new");

            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 0),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["spl(i=0,-0,+1)"]);
    });

    test("does not reset when an observer is created on an empty array", async ({
        page,
    }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array: any[] = [];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            array.push("new");

            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 0),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["spl(i=0,-0,+1)"]);
    });

    test("delivers the same single reset to every subscriber", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3, 4, 5];
            const observer = Observable.getNotifier(array);
            const first: string[] = [];
            const second: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(first, args);
                },
            });
            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(second, args);
                },
            });

            array.length = 0;
            array.push("new");

            await Promise.race([Updates.next(), conditionalTimeout(first.length > 0)]);

            return { first, second };
        });

        expect(result.first).toEqual(["RESET"]);
        expect(result.second).toEqual(["RESET"]);
    });

    test("skips drift detection for an explicit reset but still refreshes the baseline", async ({
        page,
    }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array = [1, 2, 3];
            const observer = Observable.getNotifier(array) as any;
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            // An explicit reset already routes through normalize(); drift must not
            // hijack it, and the baseline must still be brought up to date.
            array.length = 1;
            observer.reset([1, 2, 3]);
            await Updates.next();

            // A plain tracked mutation now — proof the baseline was refreshed.
            array.push("b");
            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 1),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["RESET", "spl(i=1,-0,+1)"]);
    });

    // A false-positive drift is far more damaging than a missed one: it forces
    // repeat to tear down and rebuild every view. Every tracked mutation the default
    // strategy records must predict the array's real length exactly.
    for (const scenario of [
        { title: "a push", method: "push", args: [6] },
        { title: "a push with no arguments", method: "push", args: [] },
        { title: "a pop", method: "pop", args: [] },
        { title: "a shift", method: "shift", args: [] },
        { title: "an unshift", method: "unshift", args: [0] },
        { title: "a splice", method: "splice", args: [1, 2, "a"] },
        {
            title: "a splice with a deleteCount past the end",
            method: "splice",
            args: [1, 999],
        },
        {
            title: "a splice with a negative index",
            method: "splice",
            args: [-2, 1, "a", "b"],
        },
        { title: "a splice with no arguments", method: "splice", args: [] },
    ]) {
        test(`does not reset for ${scenario.title}`, async ({ page }) => {
            await page.goto("/");

            const notifications = await page.evaluate(
                async ({ method, args }) => {
                    // @ts-expect-error: Client module.
                    const {
                        ArrayObserver,
                        conditionalTimeout,
                        Observable,
                        recordArrayChanges,
                        Updates,
                    } = await import("/main.js");

                    ArrayObserver.enable();

                    const array: any[] = [1, 2, 3, 4, 5];
                    const observer = Observable.getNotifier(array);
                    const notifications: string[] = [];

                    observer.subscribe({
                        handleChange(source: any, args: any) {
                            recordArrayChanges(notifications, args);
                        },
                    });

                    (array as any)[method](...args);

                    await Promise.race([
                        Updates.next(),
                        conditionalTimeout(notifications.length > 0),
                    ]);

                    return notifications;
                },
                { method: scenario.method, args: scenario.args },
            );

            expect(notifications).not.toContain("RESET");
        });
    }

    for (const scenario of [
        { title: "a sort", method: "sort", args: [] },
        { title: "a reverse", method: "reverse", args: [] },
    ]) {
        test(`still delivers a sort, not a reset, for ${scenario.title}`, async ({
            page,
        }) => {
            await page.goto("/");

            const notifications = await page.evaluate(
                async ({ method, args }) => {
                    // @ts-expect-error: Client module.
                    const {
                        ArrayObserver,
                        conditionalTimeout,
                        Observable,
                        recordArrayChanges,
                        Updates,
                    } = await import("/main.js");

                    ArrayObserver.enable();

                    const array: any[] = [3, 1, 2];
                    const observer = Observable.getNotifier(array);
                    const notifications: string[] = [];

                    observer.subscribe({
                        handleChange(source: any, args: any) {
                            recordArrayChanges(notifications, args);
                        },
                    });

                    (array as any)[method](...args);

                    await Promise.race([
                        Updates.next(),
                        conditionalTimeout(notifications.length > 0),
                    ]);

                    return notifications;
                },
                { method: scenario.method, args: scenario.args },
            );

            expect(notifications).toEqual(["SORT"]);
        });
    }

    test("does not notify or drift when popping and shifting an empty array", async ({
        page,
    }) => {
        await page.goto("/");

        const notifications = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const {
                ArrayObserver,
                conditionalTimeout,
                Observable,
                recordArrayChanges,
                Updates,
            } = await import("/main.js");

            ArrayObserver.enable();

            const array: any[] = [];
            const observer = Observable.getNotifier(array);
            const notifications: string[] = [];

            observer.subscribe({
                handleChange(source: any, args: any) {
                    recordArrayChanges(notifications, args);
                },
            });

            // The strategy records no splice at all for these, so nothing enqueues.
            array.pop();
            array.shift();
            await Updates.next();

            // The next real mutation must still be an ordinary splice.
            array.push("new");
            await Promise.race([
                Updates.next(),
                conditionalTimeout(notifications.length > 0),
            ]);

            return notifications;
        });

        expect(notifications).toEqual(["spl(i=0,-0,+1)"]);
    });

    // Length-drift detection recovers the cases it can see: a mutation that changes
    // the array's length by an amount the queued splices do not account for. These
    // tests pin the cases it deliberately cannot see, so that the boundary is a
    // decision on record rather than an accident. Closing any of them requires a Proxy
    // or more method patching, and would turn one of these red.
    test.describe("the limits of length-drift detection", () => {
        test("stays silent for an untracked length change with nothing else queued", async ({
            page,
        }) => {
            await page.goto("/");

            const notifications = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    ArrayObserver,
                    conditionalTimeout,
                    Observable,
                    recordArrayChanges,
                    Updates,
                } = await import("/main.js");

                ArrayObserver.enable();

                const array = [1, 2, 3, 4, 5];
                const observer = Observable.getNotifier(array);
                const notifications: string[] = [];

                observer.subscribe({
                    handleChange(source: any, args: any) {
                        recordArrayChanges(notifications, args);
                    },
                });

                // Assigning length records no splice, so nothing enqueues a flush and
                // the length compare never gets to run. Drift is only ever noticed on
                // a flush some other, tracked mutation asked for.
                array.length = 0;

                await Promise.race([
                    Updates.next(),
                    conditionalTimeout(notifications.length > 0),
                ]);

                return notifications;
            });

            expect(notifications).toEqual([]);
        });

        test("delivers the tracked splice when untracked length changes cancel out in a tick", async ({
            page,
        }) => {
            await page.goto("/");

            const notifications = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    ArrayObserver,
                    conditionalTimeout,
                    Observable,
                    recordArrayChanges,
                    Updates,
                } = await import("/main.js");

                ArrayObserver.enable();

                const array = [1, 2, 3, 4, 5];
                const observer = Observable.getNotifier(array);
                const notifications: string[] = [];

                observer.subscribe({
                    handleChange(source: any, args: any) {
                        recordArrayChanges(notifications, args);
                    },
                });

                // The truncation and the regrowth cancel out, so the array's length
                // still matches what the queued push predicts and no drift is seen.
                // The five original items are gone — replaced by holes — but the
                // subscriber is told only about the push.
                array.length = 0;
                array.length = 5;
                array.push("x");

                await Promise.race([
                    Updates.next(),
                    conditionalTimeout(notifications.length > 0),
                ]);

                return notifications;
            });

            expect(notifications).toEqual(["spl(i=5,-0,+1)"]);
        });

        test("stays silent for delete, in-bounds index writes, and fill", async ({
            page,
        }) => {
            await page.goto("/");

            const notifications = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    ArrayObserver,
                    conditionalTimeout,
                    Observable,
                    recordArrayChanges,
                    Updates,
                } = await import("/main.js");

                ArrayObserver.enable();

                const array = [1, 2, 3, 4, 5];
                const observer = Observable.getNotifier(array);
                const notifications: string[] = [];

                observer.subscribe({
                    handleChange(source: any, args: any) {
                        recordArrayChanges(notifications, args);
                    },
                });

                // None of these are patched methods and none of them change the
                // array's length, so there is no splice to queue and no drift to see.
                delete array[1];
                array[0] = "x";
                array.fill(0);

                await Promise.race([
                    Updates.next(),
                    conditionalTimeout(notifications.length > 0),
                ]);

                return notifications;
            });

            expect(notifications).toEqual([]);
        });
    });
});

test.describe("The array length observer", () => {
    class Model {
        items: any[];
    }

    test("returns zero length if the array is undefined", async () => {
        const instance = new Model();
        const observer = Observable.binding<Model>(x => lengthOf(x.items));

        const value = observer.observe(instance);

        expect(value).toBe(0);

        observer.dispose();
    });

    test("returns zero length if the array is null", async () => {
        const instance = new Model();
        instance.items = null as any;
        const observer = Observable.binding<Model>(x => lengthOf(x.items));

        const value = observer.observe(instance);

        expect(value).toBe(0);

        observer.dispose();
    });

    test("returns length of an array", async () => {
        const instance = new Model();
        instance.items = [1, 2, 3, 4, 5];
        const observer = Observable.binding<Model>(x => lengthOf(x.items));

        const value = observer.observe(instance);

        expect(value).toBe(5);

        observer.dispose();
    });

    test("notifies when the array length changes", async ({ page }) => {
        await page.goto("/");

        const { changed, observedInstances } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, lengthOf, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            class Model {
                items: any[];
            }

            const instance = new Model();
            instance.items = [1, 2, 3, 4, 5];

            let changed = false;
            const observer = Observable.binding<Model>(x => lengthOf(x.items), {
                handleChange() {
                    changed = true;
                },
            });

            observer.observe(instance);

            instance.items.push(6);

            await Promise.race([Updates.next(), conditionalTimeout(changed)]);

            return {
                changed,
                observedInstances: observer.observe(instance),
            };
        });

        expect(changed).toBe(true);
        expect(observedInstances).toBe(6);
    });

    test("does not notify on changes that don't change the length", async ({ page }) => {
        await page.goto("/");

        const { changed, observedInstances } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { ArrayObserver, conditionalTimeout, lengthOf, Observable, Updates } =
                await import("/main.js");

            ArrayObserver.enable();

            class Model {
                items: any[];
            }

            const instance = new Model();
            instance.items = [1, 2, 3, 4, 5];

            let changed = false;
            const observer = Observable.binding<Model>(x => lengthOf(x.items), {
                handleChange() {
                    changed = true;
                },
            });

            observer.observe(instance);

            instance.items.splice(2, 1, 6);

            await Promise.race([Updates.next(), conditionalTimeout(changed)]);

            return {
                changed,
                observedInstances: observer.observe(instance),
            };
        });

        expect(changed).toBe(false);
        expect(observedInstances).toBe(5);
    });
});
