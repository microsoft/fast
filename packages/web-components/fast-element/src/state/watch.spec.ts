import { watch } from "./watch.js";
import { Updates } from "../observation/update-queue.js";
import { Splice } from "../observation/arrays.js";
import { reactive } from "./reactive.js";
import { expect } from "chai";
import { createComplexObject } from "./reactive.spec.js";

describe("The watch function", () => {
    it("can watch simple properties", () => {
        const obj = reactive({
            a: 1,
            b: 2,
            c: 3
        });

        const names: string[] = [];
        watch(obj, (subject, propertyName) => {
            names.push(propertyName);
        });

        obj.a = 2;
        obj.b = 3;
        obj.c = 4;

        expect(names).members(["a", "b", "c"]);
    });

    it("can dispose the watcher for simple properties", () => {
        const obj = reactive({
            a: 1,
            b: 2,
            c: 3
        });

        const names: string[] = [];
        const subscription = watch(obj, (subject, propertyName) => {
            names.push(propertyName);
        });

        subscription.dispose();

        obj.a = 2;
        obj.b = 3;
        obj.c = 4;

        expect(names).members([]);
    });

    it("can watch array items", () => {
        const array = reactive([
            {
                a: 1,
                b: 2,
                c: 3
            },
            {
                d: 4,
                e: 5,
                f: 6
            }
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

        expect(names).members(["a", "b", "c", "d", "e", "f"]);
    });

    it("can dispose the watcher for array items", () => {
        const array = reactive([
            {
                a: 1,
                b: 2,
                c: 3
            },
            {
                d: 4,
                e: 5,
                f: 6
            }
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

        expect(names).members([]);
    });

    it("can watch arrays", async () => {
        const array: any[] = reactive([
            {
                a: 1,
                b: 2,
                c: 3
            }
        ]);

        const splices: string[] = [];
        watch(array, (subject, args) => {
            splices.push(...args);
        });

        array.push({
            d: 4,
            e: 5,
            f: 6
        });

        await Updates.next();

        expect(splices.length).equal(1);
        expect(splices[0]).instanceOf(Splice);
    });

    it("can dispose the watcher for an array", async () => {
        const array: any[] = reactive([
            {
                a: 1,
                b: 2,
                c: 3
            }
        ]);

        const splices: string[] = [];
        const subscription = watch(array, (subject, splice) => {
            splices.push(splice);
        });

        subscription.dispose();

        array.push({
            d: 4,
            e: 5,
            f: 6
        });

        await Updates.next();

        expect(splices.length).equal(0);
    });

    it("can deeply watch objects", () => {
        const obj = reactive(createComplexObject(), true);

        const names: string[] = [];
        watch(obj, (subject, propertyName) => {
            names.push(propertyName);
        });

        obj.a.b.d[0].e = 1000;
        obj.a.i.j.l[1].p = 1000;
        obj.q.y.z = 1000;

        expect(names).members(["e", "p", "z"]);
    });

    it("can dispose a deep watcher", () => {
        const obj = reactive(createComplexObject(), true);

        const names: string[] = [];
        const subscription = watch(obj, (subject, propertyName) => {
            names.push(propertyName);
        });

        subscription.dispose();

        obj.a.b.d[0].e = 1000;
        obj.a.i.j.l[1].p = 1000;
        obj.q.y.z = 1000;

        expect(names).members([]);
    });
});
