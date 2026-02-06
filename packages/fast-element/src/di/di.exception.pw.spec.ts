import { expect, test } from "@playwright/test";

test.describe("DI Exception", () => {
    test("No registration for interface", async ({ page }) => {
        await page.goto("/");

        const { throwsOnce, throwsTwice, throwsOnInject } = await page.evaluate(
            async () => {
                // @ts-expect-error: Client module.
                const { DI } = await import("/main.js");

                const container = DI.createContainer();

                const Foo = DI.createContext("Foo");

                class Bar {
                    public constructor(public readonly foo: any) {}
                }

                // Manually set inject property since decorators don't work in evaluate
                (Bar as any).inject = [Foo];

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

                return { throwsOnce, throwsTwice, throwsOnInject };
            }
        );

        expect(throwsOnce).toBe(true);
        expect(throwsTwice).toBe(true);
        expect(throwsOnInject).toBe(true);
    });

    test("cyclic dependency", async ({ page }) => {
        await page.goto("/");

        const throwsCyclic = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { DI, optional } = await import("/main.js");

            const container = DI.createContainer();

            const Foo = DI.createContext("IFoo", x => x.singleton(FooImpl));

            class FooImpl {
                public constructor(public parent: any) {}
            }

            // Manually set inject property with optional decorator behavior
            (FooImpl as any).inject = [optional(Foo)];

            let throwsCyclic = false;

            try {
                container.get(Foo);
            } catch (e: any) {
                throwsCyclic = /.*Cycl*/.test(e.message);
            }

            return throwsCyclic;
        });

        expect(throwsCyclic).toBe(true);
    });
});
