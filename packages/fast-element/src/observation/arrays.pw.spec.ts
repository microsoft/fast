import { expect, test } from "@playwright/test";
import { Observable } from "./observable.js";
import { ArrayObserver, lengthOf, Sort, Splice } from "./arrays.js";
import { SubscriberSet } from "./notifier.js";

const conditionalTimeout = function (
    condition: boolean,
    iteration = 0
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

        let array = [1, 3, 2, 4, 3];

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

            let array: any[] = [1, "hello", "world", 4];

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

            let array: string[] = ["bar", "foo"];

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

            let array: string[] = ["bar", "foo"];

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
