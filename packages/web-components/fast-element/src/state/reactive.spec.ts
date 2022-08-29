import { Observable } from "../observation/observable.js";
import { reactive } from "./reactive.js";
import { expect } from "chai";
import { watch } from "./watch.js";
import { Updates } from "../observation/update-queue.js";
import { Splice } from "../observation/arrays.js";

function createComplexObject() {
    return {
        a: {
            b: {
                c: 1,
                d: [
                    {
                        e: 2,
                        f: 3
                    },
                    {
                        g: 4,
                        h: 5
                    }
                ]
            },
            i: {
                j: {
                    k: 6,
                    l: [
                        {
                            m: 7,
                            n: 8
                        },
                        {
                            o: 9,
                            p: 10
                        }
                    ]
                },

            }
        },
        q: {
            r: {
                s: 11,
                t: [
                    {
                        u: 12,
                        v: 13
                    },
                    {
                        w: 14,
                        x: 15
                    }
                ]
            },
            y: {
                z: 16
            }
        }
    };
}

describe("The reactive function", () => {
    it("makes all root properties on the object observable", () => {
        const obj = reactive({
            a: 1,
            b: 2,
            c: 3
        });

        const names: string[] = [];
        const subscriber = {
            handleChange(subject, propertyName) {
                names.push(propertyName);
            }
        };

        Observable.getNotifier(obj).subscribe(subscriber);

        obj.a = 2;
        obj.b = 3;
        obj.c = 4;

        expect(names).members(["a", "b", "c"]);
    });

    it("doesn't fail when making the same object observable multiple times", () => {
        const obj = reactive({
            a: 1,
            b: 2,
            c: 3
        });

        reactive(obj);

        const names: string[] = [];
        const subscriber = {
            handleChange(subject, propertyName) {
                names.push(propertyName);
            }
        };

        Observable.getNotifier(obj).subscribe(subscriber);

        obj.a = 2;
        obj.b = 3;
        obj.c = 4;

        reactive(obj);

        expect(names).members(["a", "b", "c"]);
    });

    it("makes properties on array items observable", () => {
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
        const subscriber = {
            handleChange(subject, propertyName) {
                names.push(propertyName);
            }
        };

        Observable.getNotifier(array[0]).subscribe(subscriber);

        Observable.getNotifier(array[1]).subscribe(subscriber);

        array[0].a = 2;
        array[0].b = 3;
        array[0].c = 4;
        array[1].d = 5;
        array[1].e = 6;
        array[1].f = 7;

        expect(names).members(["a", "b", "c", "d", "e", "f"]);
    });

    function subscribeToComplexObject(obj: ReturnType<typeof createComplexObject>) {
        const names: string[] = [];
        const subscriber = {
            handleChange(subject, propertyName) {
                names.push(propertyName);
            }
        };

        Observable.getNotifier(obj.a).subscribe(subscriber);
        Observable.getNotifier(obj.a.b).subscribe(subscriber);
        Observable.getNotifier(obj.a.b.d[0]).subscribe(subscriber);
        Observable.getNotifier(obj.a.b.d[1]).subscribe(subscriber);
        Observable.getNotifier(obj.a.i).subscribe(subscriber);
        Observable.getNotifier(obj.a.i.j).subscribe(subscriber);
        Observable.getNotifier(obj.a.i.j.l[0]).subscribe(subscriber);
        Observable.getNotifier(obj.a.i.j.l[1]).subscribe(subscriber);
        Observable.getNotifier(obj.q).subscribe(subscriber);
        Observable.getNotifier(obj.q.r).subscribe(subscriber);
        Observable.getNotifier(obj.q.r.t[0]).subscribe(subscriber);
        Observable.getNotifier(obj.q.r.t[1]).subscribe(subscriber);
        Observable.getNotifier(obj.q.y).subscribe(subscriber);

        return names;
    }

    it("does not deeply convert by default", () => {
        const obj = reactive(createComplexObject());
        const names = subscribeToComplexObject(obj);

        obj.a.b.d[0].e = 1000;
        obj.a.i.j.l[1].p = 1000;
        obj.q.y.z = 1000;

        expect(names).members([]);
    });

    it("can make deeply observable objects", () => {
        const obj = reactive(createComplexObject(), true);
        const names = subscribeToComplexObject(obj);

        obj.a.b.d[0].e = 1000;
        obj.a.i.j.l[1].p = 1000;
        obj.q.y.z = 1000;

        expect(names).members(["e", "p", "z"]);
    });

    it("handles circular references", () => {
        const obj = {
            a: 1,
            b: 2,
            c: null as any
        };

        const obj2 = {
            d: 3,
            e: 4,
            f: obj
        };

        obj.c = obj2;

        reactive(obj, true);

        const names: string[] = [];
        const subscriber = {
            handleChange(subject, propertyName) {
                names.push(propertyName);
            }
        };

        Observable.getNotifier(obj).subscribe(subscriber);
        Observable.getNotifier(obj2).subscribe(subscriber);

        obj.a = 2;
        obj.b = 3;
        obj.c.d = 4;
        obj.c.e = 5;
        obj.c.f.a = 6;

        expect(names).members(["a", "b", "d", "e", "a"]);
    });
});

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
