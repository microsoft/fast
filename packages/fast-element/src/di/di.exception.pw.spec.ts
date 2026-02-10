import { expect, test } from "@playwright/test";
import "../debug";
import { DI, inject, optional } from "./di.js";

test.describe("DI Exception", () => {
    test("No registration for interface", async () => {
        const container = DI.createContainer();

        const Foo = DI.createContext("Foo");

        class Bar {
            public constructor(public readonly foo: any) {}
        }
        inject(...[Foo])(Bar, "Foo", 0);

        let throwsOnce = false;
        let throwsTwice = false;
        let throwsOnInject = false;

        try {
            container.get(Foo);
        } catch (e: any) {
            throwsOnce = /.*Foo*/.test(e.message);
        }

        try {
            container.get(Foo);
        } catch (e: any) {
            throwsTwice = /.*Foo*/.test(e.message);
        }

        try {
            container.get(Bar);
        } catch (e: any) {
            throwsOnInject = /.*Foo.*/.test(e.message);
        }

        expect(throwsOnce).toBe(true);
        expect(throwsTwice).toBe(true);
        expect(throwsOnInject).toBe(true);
    });

    test("cyclic dependency", async () => {
        const container = DI.createContainer();

        const Foo = DI.createContext("IFoo", x => x.singleton(FooImpl));

        class FooImpl {
            public constructor(public parent: any) {}
        }
        inject(...[optional(Foo)])(FooImpl, "IFoo", 0);

        let throwsCyclic = false;

        try {
            container.get(Foo);
        } catch (e: any) {
            throwsCyclic = /.*Cycl*/.test(e.message);
        }

        expect(throwsCyclic).toBe(true);
    });
});
