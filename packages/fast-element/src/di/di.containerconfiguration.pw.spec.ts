import { expect, test } from "@playwright/test";

test.describe("ContainerConfiguration", () => {
    test.describe("child", () => {
        test.describe("defaultResolver - transient", () => {
            test.describe("root container", () => {
                test("class", async ({ page }) => {
                    await page.goto("/");

                    const results = await page.evaluate(async () => {
                        // @ts-expect-error: Client module.
                        const { DI, ContainerConfiguration, DefaultResolver } =
                            await import("/main.js");

                        const container0 = DI.createContainer({
                            ...ContainerConfiguration.default,
                            defaultResolver: DefaultResolver.transient,
                        });

                        const container1 = container0.createChild();
                        const container2 = container0.createChild();

                        class Foo {
                            public test(): string {
                                return "hello";
                            }
                        }

                        const foo1 = container1.get(Foo);
                        const foo2 = container2.get(Foo);

                        return {
                            foo1Test: foo1.test(),
                            foo2Test: foo2.test(),
                            sameChildDifferent: container1.get(Foo) !== foo1,
                            differentChildDifferent: foo1 !== foo2,
                            rootHas: container0.has(Foo, true),
                        };
                    });

                    expect(results.foo1Test).toBe("hello");
                    expect(results.foo2Test).toBe("hello");
                    expect(results.sameChildDifferent).toBe(true);
                    expect(results.differentChildDifferent).toBe(true);
                    expect(results.rootHas).toBe(true);
                });
            });

            test.describe("one child container", () => {
                test("class", async ({ page }) => {
                    await page.goto("/");

                    const results = await page.evaluate(async () => {
                        // @ts-expect-error: Client module.
                        const { DI, ContainerConfiguration, DefaultResolver } =
                            await import("/main.js");

                        const container0 = DI.createContainer();

                        const container1 = container0.createChild({
                            ...ContainerConfiguration.default,
                            defaultResolver: DefaultResolver.transient,
                        });
                        const container2 = container0.createChild();

                        class Foo {
                            public test(): string {
                                return "hello";
                            }
                        }

                        const foo1 = container1.get(Foo);
                        const foo2 = container2.get(Foo);

                        return {
                            foo1Test: foo1.test(),
                            foo2Test: foo2.test(),
                            sameChildDifferent: container1.get(Foo) !== foo2,
                            differentChildDifferent: foo1 !== foo2,
                            rootHas: container0.has(Foo, true),
                        };
                    });

                    expect(results.foo2Test).toBe("hello");
                    expect(results.foo1Test).toBe("hello");
                    expect(results.sameChildDifferent).toBe(true);
                    expect(results.differentChildDifferent).toBe(true);
                    expect(results.rootHas).toBe(true);
                });
            });
        });
    });
});
