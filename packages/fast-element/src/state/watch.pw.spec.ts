import { expect, test } from "@playwright/test";
import { watch } from "./watch.js";
import { reactive } from "./reactive.js";

function createComplexObject() {
    return {
        a: {
            b: {
                c: 1,
                d: [
                    { e: 2, f: 3 },
                    { g: 4, h: 5 },
                ],
            },
            i: {
                j: {
                    k: 6,
                    l: [
                        { m: 7, n: 8 },
                        { o: 9, p: 10 },
                    ],
                },
            },
        },
        q: {
            r: {
                s: 11,
                t: [
                    { u: 12, v: 13 },
                    { w: 14, x: 15 },
                ],
            },
            y: {
                z: 16,
            },
        },
    };
}

test.describe("The watch function", () => {
    test("can watch simple properties", () => {
        const obj = reactive({
            a: 1,
            b: 2,
            c: 3,
        });

        const names: string[] = [];
        watch(obj, (subject, propertyName) => {
            names.push(propertyName);
        });

        obj.a = 2;
        obj.b = 3;
        obj.c = 4;

        expect(names).toEqual(expect.arrayContaining(["a", "b", "c"]));
        expect(names.length).toBe(3);
    });

    test("can dispose the watcher for simple properties", () => {
        const obj = reactive({
            a: 1,
            b: 2,
            c: 3,
        });

        const names: string[] = [];
        const subscription = watch(obj, (subject, propertyName) => {
            names.push(propertyName);
        });

        subscription.dispose();

        obj.a = 2;
        obj.b = 3;
        obj.c = 4;

        expect(names).toEqual([]);
    });

    test("can watch array items", () => {
        const array = reactive([
            {
                a: 1,
                b: 2,
                c: 3,
            },
            {
                d: 4,
                e: 5,
                f: 6,
            },
        ]);

        const names: string[] = [];
        watch(array, (subject, propertyName) => {
            names.push(propertyName);
        });

        array[0].a = 2;
        array[0].b = 3;
        array[0].c = 4;
        array[1].d = 5;
        array[1].e = 6;
        array[1].f = 7;

        expect(names).toEqual(expect.arrayContaining(["a", "b", "c", "d", "e", "f"]));
        expect(names.length).toBe(6);
    });

    test("can dispose the watcher for array items", () => {
        const array = reactive([
            {
                a: 1,
                b: 2,
                c: 3,
            },
            {
                d: 4,
                e: 5,
                f: 6,
            },
        ]);

        const names: string[] = [];
        const subscription = watch(array, (subject, propertyName) => {
            names.push(propertyName);
        });

        subscription.dispose();

        array[0].a = 2;
        array[0].b = 3;
        array[0].c = 4;
        array[1].d = 5;
        array[1].e = 6;
        array[1].f = 7;

        expect(names).toEqual([]);
    });

    test("can watch arrays", async ({ page }) => {
        await page.goto("/");

        const { splicesLength, isInstanceOfSplice } = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { watch, reactive, Splice, Updates } = await import("/main.js");

            const array: any[] = reactive([
                {
                    a: 1,
                    b: 2,
                    c: 3,
                },
            ]);

            const splices: any[] = [];
            watch(array, (subject: any, args: any) => {
                splices.push(...args);
            });

            array.push({
                d: 4,
                e: 5,
                f: 6,
            });

            await Updates.next();

            return {
                splicesLength: splices.length,
                isInstanceOfSplice: splices[0] instanceof Splice,
            };
        });

        expect(splicesLength).toBe(1);
        expect(isInstanceOfSplice).toBe(true);
    });

    test("can dispose the watcher for an array", async ({ page }) => {
        await page.goto("/");

        const splicesLength = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { watch, reactive, Updates } = await import("/main.js");

            const array: any[] = reactive([
                {
                    a: 1,
                    b: 2,
                    c: 3,
                },
            ]);

            const splices: any[] = [];
            const subscription = watch(array, (subject: any, splice: any) => {
                splices.push(splice);
            });

            subscription.dispose();

            array.push({
                d: 4,
                e: 5,
                f: 6,
            });

            await Updates.next();

            return splices.length;
        });

        expect(splicesLength).toBe(0);
    });

    test("can deeply watch objects", () => {
        const obj = reactive(createComplexObject(), true);

        const names: string[] = [];
        watch(obj, (subject, propertyName) => {
            names.push(propertyName);
        });

        obj.a.b.d[0].e = 1000;
        obj.a.i.j.l[1].p = 1000;
        obj.q.y.z = 1000;

        expect(names).toEqual(expect.arrayContaining(["e", "p", "z"]));
        expect(names.length).toBe(3);
    });

    test("can dispose a deep watcher", () => {
        const obj = reactive(createComplexObject(), true);

        const names: string[] = [];
        const subscription = watch(obj, (subject, propertyName) => {
            names.push(propertyName);
        });

        subscription.dispose();

        obj.a.b.d[0].e = 1000;
        obj.a.i.j.l[1].p = 1000;
        obj.q.y.z = 1000;

        expect(names).toEqual([]);
    });
});
