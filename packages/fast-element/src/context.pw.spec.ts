import { expect, test } from "@playwright/test";
import { Context } from "./context.js";

test.describe("Context", () => {
    test.describe(`create()`, () => {
        test(`returns a context that has the specified name`, async () => {
            const TestContext = Context.create("TestContext");

            expect(TestContext.name).toBe("TestContext");
        });

        test(`returns a context that stringifies its name`, async () => {
            const TestContext = Context.create("TestContext");
            const expected = "Context<TestContext>";

            expect(TestContext.toString()).toBe(expected);
            expect(String(TestContext)).toBe(expected);
            expect(`${TestContext}`).toBe(expected);
        });

        test(`returns a context that gets the initial value if not handled`, async ({
            page,
        }) => {
            await page.goto("/");

            const initialValue = "hello world";

            const value = await page.evaluate(async initialValue => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                const TestContext = Context.create("TestContext", initialValue);

                const node = document.createElement("div");
                return TestContext.get(node);
            }, initialValue);

            expect(value).toBe(initialValue);
        });

        test(`returns a context that can be used for a protocol request`, async ({
            page,
        }) => {
            await page.goto("/");

            const value = "hello world";
            const capture = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                const TestContext = Context.create("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                TestContext.handle(parent, event => {
                    if (event.context === TestContext) {
                        event.stopImmediatePropagation();
                        event.callback(value);
                    }
                });

                let capture = "";
                TestContext.request(child, response => {
                    capture = response;
                });

                return capture;
            }, value);

            expect(capture).toBe(value);
        });

        test(`returns a context that can be used for a get request`, async ({ page }) => {
            await page.goto("/");

            const value = "hello world";
            const capture = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                const TestContext = Context.create("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                TestContext.handle(parent, event => {
                    if (event.context === TestContext) {
                        event.stopImmediatePropagation();
                        event.callback(value);
                    }
                });

                return TestContext.get(child);
            }, value);

            expect(capture).toBe(value);
        });

        test(`returns a context that can be used to provide a value`, async ({
            page,
        }) => {
            await page.goto("/");

            const value = "hello world";
            const capture = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                const TestContext = Context.create("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                TestContext.provide(parent, value);

                return TestContext.get(child);
            }, value);

            expect(capture).toBe(value);
        });

        test(`returns a context that can be used as a decorator`, async ({ page }) => {
            test.fixme(true, "Decorator doesn’t work in page.evaluate");

            await page.goto("/");

            const value = "hello world";
            const childTest = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context, uniqueElementName } = await import("/main.js");

                const TestContext = Context.create("TestContext");
                const elementName = uniqueElementName();

                class TestElement extends HTMLElement {
                    @TestContext test: string;
                }

                customElements.define(elementName, TestElement);

                const parent = document.createElement("div");
                const child = document.createElement(elementName) as TestElement;
                parent.append(child);

                TestContext.handle(parent, event => {
                    if (event.context === TestContext) {
                        event.stopImmediatePropagation();
                        event.callback(value);
                    }
                });

                return child.test;
            }, value);

            expect(childTest).toBe(value);
        });
    });

    test.describe("for()", () => {
        test("returns the same context for successive calls with the same name", async () => {
            const ctx1 = Context.for("test");
            const ctx2 = Context.for("test");

            expect(ctx1).toBe(ctx2);
            expect(ctx1.name).toBe("test");
            expect(ctx2.name).toBe("test");
        });

        test("returns different context for successive calls with different names", async () => {
            const ctx1 = Context.for("test1");
            const ctx2 = Context.for("test2");

            expect(ctx1).not.toBe(ctx2);
            expect(ctx1.name).toBe("test1");
            expect(ctx2.name).toBe("test2");
        });
    });

    test.describe(`get()`, () => {
        test(`gets the value for a context`, async ({ page }) => {
            await page.goto("/");

            const value = "hello world";
            const capture = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                const TestContext = Context.create("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                Context.handle(
                    parent,
                    event => {
                        event.stopImmediatePropagation();
                        event.callback(value);
                    },
                    TestContext
                );

                return Context.get(child, TestContext);
            }, value);

            expect(capture).toBe(value);
        });
    });

    test.describe(`request()`, () => {
        test(`makes a protocol request`, async ({ page }) => {
            await page.goto("/");

            const value = "hello world";
            const capture = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                const TestContext = Context.create("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                Context.handle(
                    parent,
                    event => {
                        event.stopImmediatePropagation();
                        event.callback(value);
                    },
                    TestContext
                );

                let capture = "";
                Context.request(child, TestContext, response => {
                    capture = response as string;
                });

                return capture;
            }, value);

            expect(capture).toBe(value);
        });
    });

    test.describe(`provide()`, () => {
        test(`configures a context value without callbacks`, async ({ page }) => {
            await page.goto("/");

            const value = "hello world";
            const capture = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                const TestContext = Context.create("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                Context.provide(parent, TestContext, value);

                return Context.get(child, TestContext);
            }, value);

            expect(capture).toBe(value);
        });
    });

    test.describe(`dispatch()`, () => {
        test(`dispatches an event even when the request strategy has been changed`, async ({
            page,
        }) => {
            await page.goto("/");

            const wrongValue = "hello world";
            const rightValue = "bye bye";
            const capture = await page.evaluate(
                async ([wrongValue, rightValue]) => {
                    // @ts-expect-error: Client module.
                    const { Context } = await import("/main.js");

                    const TestContext = Context.create("TestContext");
                    const parent = document.createElement("div");
                    const child = document.createElement("div");
                    parent.append(child);

                    Context.setDefaultRequestStrategy((target, context, callback) => {
                        callback(wrongValue as any);
                    });

                    Context.handle(
                        parent,
                        event => {
                            event.stopImmediatePropagation();
                            event.callback(rightValue);
                        },
                        TestContext
                    );

                    let capture = "";

                    Context.dispatch(parent, TestContext, value => {
                        capture = value;
                    });

                    return capture;
                },
                [wrongValue, rightValue]
            );

            expect(capture).toBe(rightValue);

            // Context.setDefaultRequestStrategy(Context.dispatch);
        });
    });

    test.describe(`defineProperty()`, () => {
        test(`defines a property on a target that returns the context value`, async ({
            page,
        }) => {
            await page.goto("/");

            const value = "hello world";
            const childTest = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                const TestContext = Context.create("TestContext");

                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                Context.defineProperty(child, "test", TestContext);

                TestContext.handle(parent, event => {
                    if (event.context === TestContext) {
                        event.stopImmediatePropagation();
                        event.callback(value);
                    }
                });

                return (child as any).test;
            }, value);

            expect(childTest).toBe(value);
        });
    });

    test.describe(`setDefaultRequestStrategy()`, () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/");
        });

        test(`changes how request() works`, async ({ page }) => {
            const value = "hello world";
            const capture = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                const TestContext = Context.create("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                Context.setDefaultRequestStrategy((target, context, callback) => {
                    callback(value as any);
                });

                let capture = "";

                Context.request(parent, TestContext, response => {
                    capture = response;
                });

                return capture;
            }, value);

            expect(capture).toBe(value);
        });

        test(`changes how get() works`, async ({ page }) => {
            const value = "hello world";
            const capture = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                const TestContext = Context.create("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                Context.setDefaultRequestStrategy((target, context, callback) => {
                    callback(value as any);
                });

                return Context.get(child, TestContext);
            }, value);

            expect(capture).toBe(value);
        });

        test(`changes how defineProperty() works`, async ({ page }) => {
            const value = "hello world";
            const childTest = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context } = await import("/main.js");

                const TestContext = Context.create("TestContext");
                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.append(child);

                Context.setDefaultRequestStrategy((target, context, callback) => {
                    callback(value as any);
                });

                Context.defineProperty(child, "test", TestContext);

                return (child as any).test;
            }, value);

            expect(childTest).toBe(value);
        });

        test(`changes how context decorators work`, async ({ page }) => {
            test.fixme(true, "Decorator doesn’t work in page.evaluate");

            const value = "hello world";
            const childTest = await page.evaluate(async value => {
                // @ts-expect-error: Client module.
                const { Context, uniqueElementName } = await import("/main.js");

                const TestContext = Context.create("TestContext");
                const elementName = uniqueElementName();

                class TestElement extends HTMLElement {
                    @TestContext test: string;
                }

                customElements.define(elementName, TestElement);

                const parent = document.createElement("div");
                const child = document.createElement(elementName);
                parent.append(child);

                Context.setDefaultRequestStrategy((target, context, callback) => {
                    callback(value as any);
                });

                return child.test;
            }, value);

            expect(childTest).toBe(value);
        });
    });
});
