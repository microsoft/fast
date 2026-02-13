import { expect, test } from "@playwright/test";

test.describe("Metadata", () => {
    test.describe("getDesignParamTypes()", () => {
        test("returns emptyArray if the class has no constructor or decorators", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Metadata, emptyArray } = await import("/main.js");

                class Foo {}

                const actual = Metadata.getDesignParamTypes(Foo);

                return actual === emptyArray;
            });

            expect(result).toBe(true);
        });

        test("returns emptyArray if the class has a decorator but no constructor", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Metadata, emptyArray } = await import("/main.js");

                function decorator(): (target: any) => any {
                    return (target: any) => target;
                }

                class Foo {}
                decorator()(Foo);

                const actual = Metadata.getDesignParamTypes(Foo);

                return actual === emptyArray;
            });

            expect(result).toBe(true);
        });

        test("returns emptyArray if the class has no constructor args or decorators", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Metadata, emptyArray } = await import("/main.js");

                class Foo {
                    constructor() {
                        return;
                    }
                }

                const actual = Metadata.getDesignParamTypes(Foo);

                return actual === emptyArray;
            });

            expect(result).toBe(true);
        });

        test("returns emptyArray if the class has constructor args but no decorators", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Metadata, emptyArray } = await import("/main.js");

                class Bar {}
                class Foo {
                    bar: any;
                    constructor(bar: any) {
                        this.bar = bar;
                    }
                }

                const actual = Metadata.getDesignParamTypes(Foo);

                return actual === emptyArray;
            });

            expect(result).toBe(true);
        });

        test("returns emptyArray if the class has constructor args and the decorator is applied via a function call", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Metadata, emptyArray } = await import("/main.js");

                function decorator(): (target: any) => any {
                    return (target: any) => target;
                }

                class Bar {}
                class Foo {
                    bar: any;
                    constructor(bar: any) {
                        this.bar = bar;
                    }
                }

                decorator()(Foo);
                const actual = Metadata.getDesignParamTypes(Foo);

                return actual === emptyArray;
            });

            expect(result).toBe(true);
        });

        test("returns an empty mutable array if the class has a decorator but no constructor args", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Metadata, emptyArray } = await import("/main.js");

                function decorator(): (target: any) => any {
                    return (target: any) => target;
                }

                class Foo {
                    constructor() {
                        return;
                    }
                }

                (Reflect as any).defineMetadata("design:paramtypes", [], Foo);
                decorator()(Foo);

                const actual = Metadata.getDesignParamTypes(Foo);

                return actual !== emptyArray && actual.length === 0;
            });

            expect(result).toBe(true);
        });

        test.describe("falls back to Object for declarations that cannot be statically analyzed", () => {
            const argCtorNames = [
                "Bar",
                "",
                "",
                "",
                "undefined",
                "Error",
                "Array",
                "undefined",
                "Bar",
            ];

            for (let i = 0; i < argCtorNames.length; i++) {
                const name = argCtorNames[i];

                test(`FooDecoratorInvocation { constructor(${name}) } [${i}]`, async ({
                    page,
                }) => {
                    await page.goto("/");

                    const result = await page.evaluate(async () => {
                        // @ts-expect-error: Client module.
                        const { Metadata } = await import("/main.js");

                        function decorator(): (target: any) => any {
                            return (target: any) => target;
                        }

                        class FooDecoratorInvocation {
                            arg: any;
                            constructor(arg: any) {
                                this.arg = arg;
                            }
                        }

                        (Reflect as any).defineMetadata(
                            "design:paramtypes",
                            [Object],
                            FooDecoratorInvocation
                        );
                        decorator()(FooDecoratorInvocation);

                        const actual =
                            Metadata.getDesignParamTypes(FooDecoratorInvocation);

                        return actual.length === 1 && actual[0] === Object;
                    });

                    expect(result).toBe(true);
                });

                test(`FooDecoratorNonInvocation { constructor(${name}) } [${i}]`, async ({
                    page,
                }) => {
                    await page.goto("/");

                    const result = await page.evaluate(async () => {
                        // @ts-expect-error: Client module.
                        const { Metadata } = await import("/main.js");

                        function decorator(): (target: any) => any {
                            return (target: any) => target;
                        }

                        class FooDecoratorInvocation {
                            arg: any;
                            constructor(arg: any) {
                                this.arg = arg;
                            }
                        }

                        (Reflect as any).defineMetadata(
                            "design:paramtypes",
                            [Object],
                            FooDecoratorInvocation
                        );
                        decorator()(FooDecoratorInvocation);

                        class FooDecoratorNonInvocation {
                            arg: any;
                            constructor(arg: any) {
                                this.arg = arg;
                            }
                        }

                        (Reflect as any).defineMetadata(
                            "design:paramtypes",
                            [Object],
                            FooDecoratorNonInvocation
                        );
                        (decorator as any)(FooDecoratorNonInvocation);

                        const actual =
                            Metadata.getDesignParamTypes(FooDecoratorInvocation);

                        return actual.length === 1 && actual[0] === Object;
                    });

                    expect(result).toBe(true);
                });
            }
        });

        test.describe("returns the correct types for valid declarations", () => {
            test.describe("decorator invocation", () => {
                test("Class { constructor(public arg: Bar) }", async ({ page }) => {
                    await page.goto("/");

                    const result = await page.evaluate(async () => {
                        // @ts-expect-error: Client module.
                        const { Metadata } = await import("/main.js");

                        function decorator(): (target: any) => any {
                            return (target: any) => target;
                        }

                        class Bar {}
                        class FooBar {
                            arg: any;
                            constructor(arg: any) {
                                this.arg = arg;
                            }
                        }

                        (Reflect as any).defineMetadata(
                            "design:paramtypes",
                            [Bar],
                            FooBar
                        );
                        decorator()(FooBar);

                        const actual = Metadata.getDesignParamTypes(FooBar);

                        return actual.length === 1 && actual[0] === Bar;
                    });

                    expect(result).toBe(true);
                });

                test("Class { constructor(public arg1: Bar, public arg2: Foo) }", async ({
                    page,
                }) => {
                    await page.goto("/");

                    const result = await page.evaluate(async () => {
                        // @ts-expect-error: Client module.
                        const { Metadata } = await import("/main.js");

                        function decorator(): (target: any) => any {
                            return (target: any) => target;
                        }

                        class Bar {}
                        class Foo {}
                        class FooBar {
                            arg1: any;
                            arg2: any;
                            constructor(arg1: any, arg2: any) {
                                this.arg1 = arg1;
                                this.arg2 = arg2;
                            }
                        }

                        (Reflect as any).defineMetadata(
                            "design:paramtypes",
                            [Bar, Foo],
                            FooBar
                        );
                        decorator()(FooBar);

                        const actual = Metadata.getDesignParamTypes(FooBar);

                        return (
                            actual.length === 2 && actual[0] === Bar && actual[1] === Foo
                        );
                    });

                    expect(result).toBe(true);
                });

                test("Class { constructor(public arg1: Bar, public arg2: Foo, public arg3: Baz) }", async ({
                    page,
                }) => {
                    await page.goto("/");

                    const result = await page.evaluate(async () => {
                        // @ts-expect-error: Client module.
                        const { Metadata } = await import("/main.js");

                        function decorator(): (target: any) => any {
                            return (target: any) => target;
                        }

                        class Bar {}
                        class Foo {}
                        class Baz {}
                        class FooBar {
                            arg1: any;
                            arg2: any;
                            arg3: any;
                            constructor(arg1: any, arg2: any, arg3: any) {
                                this.arg1 = arg1;
                                this.arg2 = arg2;
                                this.arg3 = arg3;
                            }
                        }

                        (Reflect as any).defineMetadata(
                            "design:paramtypes",
                            [Bar, Foo, Baz],
                            FooBar
                        );
                        decorator()(FooBar);

                        const actual = Metadata.getDesignParamTypes(FooBar);

                        return (
                            actual.length === 3 &&
                            actual[0] === Bar &&
                            actual[1] === Foo &&
                            actual[2] === Baz
                        );
                    });

                    expect(result).toBe(true);
                });
            });
        });
    });

    test.describe("getAnnotationParamTypes()", () => {
        test("returns emptyArray if the class has no annotations", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Metadata, emptyArray } = await import("/main.js");

                class Foo {}

                const actual = Metadata.getAnnotationParamTypes(Foo);

                return actual === emptyArray;
            });

            expect(result).toBe(true);
        });

        test("returns added annotations", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Metadata } = await import("/main.js");

                class Foo {}

                const a = Metadata.getOrCreateAnnotationParamTypes(Foo);
                a.push("test");

                const actual = Metadata.getAnnotationParamTypes(Foo);

                return actual.length === 1 && actual[0] === "test";
            });

            expect(result).toBe(true);
        });
    });

    test.describe("getOrCreateAnnotationParamTypes()", () => {
        test("returns an empty mutable array if the class has no annotations", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Metadata, emptyArray } = await import("/main.js");

                class Foo {}

                const actual = Metadata.getOrCreateAnnotationParamTypes(Foo);

                return actual !== emptyArray && actual.length === 0;
            });

            expect(result).toBe(true);
        });

        test("returns added annotations", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Metadata } = await import("/main.js");

                class Foo {}

                const a = Metadata.getOrCreateAnnotationParamTypes(Foo);
                a.push("test");

                const actual = Metadata.getOrCreateAnnotationParamTypes(Foo);

                return actual.length === 1 && actual[0] === "test";
            });

            expect(result).toBe(true);
        });
    });
});
