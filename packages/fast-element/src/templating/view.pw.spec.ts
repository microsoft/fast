import { expect, test } from "@playwright/test";

test.describe("The HTMLView", () => {
    test.describe("when binding hosts", () => {
        test("gracefully handles empty template elements", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { html } = await import("/main.js");

                const template = html`
                    <template></template>
                `;

                const view = template.create();
                view.bind({});

                return {
                    firstChildNotNull: view.firstChild !== null,
                    lastChildNotNull: view.lastChild !== null,
                };
            });

            expect(result.firstChildNotNull).toBe(true);
            expect(result.lastChildNotNull).toBe(true);
        });

        test("gracefully handles empty template literals", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { html } = await import("/main.js");

                const template = html``;

                const view = template.create();
                view.bind({});

                return {
                    firstChildNotNull: view.firstChild !== null,
                    lastChildNotNull: view.lastChild !== null,
                };
            });

            expect(result.firstChildNotNull).toBe(true);
            expect(result.lastChildNotNull).toBe(true);
        });

        test("warns on class bindings when host not present", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { html, FAST } = await import("/main.js");

                const currentWarn = FAST.warn;
                const list: { code: number; values?: Record<string, any> }[] = [];
                FAST.warn = function (code: number, values?: Record<string, any>) {
                    list.push({ code, values });
                };

                const template = html`
                    <template class="foo"></template>
                `;

                const view = template.create();
                view.bind({});

                FAST.warn = currentWarn;

                return {
                    count: list.length,
                    code: list[0]?.code,
                    name: list[0]?.values?.name,
                };
            });

            expect(result.count).toBe(1);
            expect(result.code).toBe(1204);
            expect(result.name).toBe("setAttribute");
        });

        test("warns on style bindings when host not present", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { html, FAST } = await import("/main.js");

                const currentWarn = FAST.warn;
                const list: { code: number; values?: Record<string, any> }[] = [];
                FAST.warn = function (code: number, values?: Record<string, any>) {
                    list.push({ code, values });
                };

                const template = html`
                    <template style="color: red"></template>
                `;

                const view = template.create();
                view.bind({});

                FAST.warn = currentWarn;

                return {
                    count: list.length,
                    code: list[0]?.code,
                    name: list[0]?.values?.name,
                };
            });

            expect(result.count).toBe(1);
            expect(result.code).toBe(1204);
            expect(result.name).toBe("setAttribute");
        });

        test("warns on boolean bindings when host not present", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { html, FAST } = await import("/main.js");

                const currentWarn = FAST.warn;
                const list: { code: number; values?: Record<string, any> }[] = [];
                FAST.warn = function (code: number, values?: Record<string, any>) {
                    list.push({ code, values });
                };

                const template = html`
                    <template ?disabled="${() => false}"></template>
                `;

                const view = template.create();
                view.bind({});

                FAST.warn = currentWarn;

                return {
                    count: list.length,
                    code: list[0]?.code,
                    name: list[0]?.values?.name,
                };
            });

            expect(result.count).toBe(1);
            expect(result.code).toBe(1204);
            expect(result.name).toBe("removeAttribute");
        });

        test("warns on property bindings when host not present", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { html, FAST } = await import("/main.js");

                const currentWarn = FAST.warn;
                const list: { code: number; values?: Record<string, any> }[] = [];
                FAST.warn = function (code: number, values?: Record<string, any>) {
                    list.push({ code, values });
                };

                const template = html`
                    <template :myProperty="${() => false}"></template>
                `;

                const view = template.create();
                view.bind({});

                FAST.warn = currentWarn;

                return {
                    count: list.length,
                    code: list[0]?.code,
                    name: list[0]?.values?.name,
                };
            });

            expect(result.count).toBe(1);
            expect(result.code).toBe(1204);
            expect(result.name).toBe("myProperty");
        });

        test("warns on className bindings when host not present", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { html, FAST } = await import("/main.js");

                const currentWarn = FAST.warn;
                const list: { code: number; values?: Record<string, any> }[] = [];
                FAST.warn = function (code: number, values?: Record<string, any>) {
                    list.push({ code, values });
                };

                const template = html`
                    <template :className="${() => "test"}"></template>
                `;

                const view = template.create();
                view.bind({});

                FAST.warn = currentWarn;

                return {
                    count: list.length,
                    code: list[0]?.code,
                    name: list[0]?.values?.name,
                };
            });

            expect(result.count).toBe(1);
            expect(result.code).toBe(1204);
            expect(result.name).toBe("className");
        });

        test("warns on event bindings when host not present", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { html, FAST } = await import("/main.js");

                const currentWarn = FAST.warn;
                const list: { code: number; values?: Record<string, any> }[] = [];
                FAST.warn = function (code: number, values?: Record<string, any>) {
                    list.push({ code, values });
                };

                const template = html`
                    <template @click="${() => void 0}"></template>
                `;

                const view = template.create();
                view.bind({});

                FAST.warn = currentWarn;

                return {
                    count: list.length,
                    code: list[0]?.code,
                    name: list[0]?.values?.name,
                };
            });

            expect(result.count).toBe(1);
            expect(result.code).toBe(1204);
            expect(result.name).toBe("addEventListener");
        });
    });

    test.describe("when rebinding", () => {
        test("properly unbinds the old source before binding the new source", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { html, HTMLDirective, Markup } = await import("/main.js");

                const sources: any[] = [];
                const boundStates: boolean[] = [];

                class SourceCaptureDirective {
                    id;
                    nodeId;

                    createHTML(add) {
                        return Markup.attribute(add(this));
                    }

                    createBehavior() {
                        return this;
                    }

                    bind(controller) {
                        sources.push(controller.source);
                        boundStates.push(controller.isBound);
                    }
                }

                HTMLDirective.define(SourceCaptureDirective);

                const template = html`
                    <div ${new SourceCaptureDirective()}></div>
                `;

                const view = template.create();
                const firstSource = {};
                view.bind(firstSource);

                const secondSource = {};
                view.bind(secondSource);

                return {
                    source0IsFirst: sources[0] === firstSource,
                    boundState0: boundStates[0],
                    source1IsSecond: sources[1] === secondSource,
                    boundState1: boundStates[1],
                };
            });

            expect(result.source0IsFirst).toBe(true);
            expect(result.boundState0).toBe(false);
            expect(result.source1IsSecond).toBe(true);
            expect(result.boundState1).toBe(false);
        });
    });

    test.describe("execution context", () => {
        test("can get the current event", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HTMLView, ExecutionContext } = await import("/main.js");

                const detail = { hello: "world" };
                const event = new CustomEvent("my-event", { detail });

                const view = new HTMLView(document.createDocumentFragment(), [], {});
                const context = view.context;

                ExecutionContext.setEvent(event);

                const match = context.event === event;

                ExecutionContext.setEvent(null);

                return match;
            });

            expect(result).toBe(true);
        });

        test("can get the current event detail", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HTMLView, ExecutionContext } = await import("/main.js");

                const detail = { hello: "world" };
                const event = new CustomEvent("my-event", { detail });

                const view = new HTMLView(document.createDocumentFragment(), [], {});
                const context = view.context;

                ExecutionContext.setEvent(event);

                const detailMatch = context.eventDetail() === detail;
                const helloMatch = context.eventDetail().hello === detail.hello;

                ExecutionContext.setEvent(null);

                return detailMatch && helloMatch;
            });

            expect(result).toBe(true);
        });

        test("can connect a child context to a parent source", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HTMLView } = await import("/main.js");

                const parentSource = {};
                const parentView = new HTMLView(
                    document.createDocumentFragment(),
                    [],
                    {}
                );
                const parentContext = parentView.context;
                const childView = new HTMLView(document.createDocumentFragment(), [], {});
                const childContext = childView.context;

                childContext.parent = parentSource;
                childContext.parentContext = parentContext;

                return {
                    parentMatch: childContext.parent === parentSource,
                    parentContextMatch: childContext.parentContext === parentContext,
                };
            });

            expect(result.parentMatch).toBe(true);
            expect(result.parentContextMatch).toBe(true);
        });

        test("can create an item context from a child context", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HTMLView } = await import("/main.js");

                const parentSource = {};
                const parentView = new HTMLView(
                    document.createDocumentFragment(),
                    [],
                    {}
                );
                const parentContext = parentView.context;
                const itemView = new HTMLView(document.createDocumentFragment(), [], {});
                const itemContext = itemView.context;

                itemContext.parent = parentSource;
                itemContext.parentContext = parentContext;
                itemContext.index = 7;
                itemContext.length = 42;

                return {
                    parentMatch: itemContext.parent === parentSource,
                    parentContextMatch: itemContext.parentContext === parentContext,
                    index: itemContext.index,
                    length: itemContext.length,
                };
            });

            expect(result.parentMatch).toBe(true);
            expect(result.parentContextMatch).toBe(true);
            expect(result.index).toBe(7);
            expect(result.length).toBe(42);
        });

        test.describe("item context", () => {
            const scenarios = [
                {
                    name: "even is first",
                    index: 0,
                    length: 42,
                    isEven: true,
                    isOdd: false,
                    isFirst: true,
                    isMiddle: false,
                    isLast: false,
                },
                {
                    name: "odd in middle",
                    index: 7,
                    length: 42,
                    isEven: false,
                    isOdd: true,
                    isFirst: false,
                    isMiddle: true,
                    isLast: false,
                },
                {
                    name: "even in middle",
                    index: 8,
                    length: 42,
                    isEven: true,
                    isOdd: false,
                    isFirst: false,
                    isMiddle: true,
                    isLast: false,
                },
                {
                    name: "odd at end",
                    index: 41,
                    length: 42,
                    isEven: false,
                    isOdd: true,
                    isFirst: false,
                    isMiddle: false,
                    isLast: true,
                },
                {
                    name: "even at end",
                    index: 40,
                    length: 41,
                    isEven: true,
                    isOdd: false,
                    isFirst: false,
                    isMiddle: false,
                    isLast: true,
                },
            ];

            for (const scenario of scenarios) {
                test(`has correct position when ${scenario.name}`, async ({ page }) => {
                    await page.goto("/");

                    const result = await page.evaluate(async s => {
                        // @ts-expect-error: Client module.
                        const { HTMLView } = await import("/main.js");

                        const parentSource = {};
                        const parentView = new HTMLView(
                            document.createDocumentFragment(),
                            [],
                            {}
                        );
                        const parentContext = parentView.context;
                        const itemView = new HTMLView(
                            document.createDocumentFragment(),
                            [],
                            {}
                        );
                        const itemContext = itemView.context;

                        itemContext.parent = parentSource;
                        itemContext.parentContext = parentContext;
                        itemContext.index = s.index;
                        itemContext.length = s.length;

                        return {
                            index: itemContext.index,
                            length: itemContext.length,
                            isEven: itemContext.isEven,
                            isOdd: itemContext.isOdd,
                            isFirst: itemContext.isFirst,
                            isInMiddle: itemContext.isInMiddle,
                            isLast: itemContext.isLast,
                        };
                    }, scenario);

                    expect(result.index).toBe(scenario.index);
                    expect(result.length).toBe(scenario.length);
                    expect(result.isEven).toBe(scenario.isEven);
                    expect(result.isOdd).toBe(scenario.isOdd);
                    expect(result.isFirst).toBe(scenario.isFirst);
                    expect(result.isInMiddle).toBe(scenario.isMiddle);
                    expect(result.isLast).toBe(scenario.isLast);
                });
            }

            test("can update its index and length", async ({ page }) => {
                await page.goto("/");

                const result = await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const { HTMLView } = await import("/main.js");

                    const scenario1 = {
                        index: 0,
                        length: 42,
                        isEven: true,
                        isOdd: false,
                        isFirst: true,
                        isMiddle: false,
                        isLast: false,
                    };
                    const scenario2 = {
                        index: 7,
                        length: 42,
                        isEven: false,
                        isOdd: true,
                        isFirst: false,
                        isMiddle: true,
                        isLast: false,
                    };

                    const parentSource = {};
                    const parentView = new HTMLView(
                        document.createDocumentFragment(),
                        [],
                        {}
                    );
                    const parentContext = parentView.context;
                    const itemView = new HTMLView(
                        document.createDocumentFragment(),
                        [],
                        {}
                    );
                    const itemContext = itemView.context;

                    itemContext.parent = parentSource;
                    itemContext.parentContext = parentContext;
                    itemContext.index = scenario1.index;
                    itemContext.length = scenario1.length;

                    const first = {
                        index: itemContext.index,
                        length: itemContext.length,
                        isEven: itemContext.isEven,
                        isOdd: itemContext.isOdd,
                        isFirst: itemContext.isFirst,
                        isInMiddle: itemContext.isInMiddle,
                        isLast: itemContext.isLast,
                    };

                    itemContext.index = scenario2.index;
                    itemContext.length = scenario2.length;

                    const second = {
                        index: itemContext.index,
                        length: itemContext.length,
                        isEven: itemContext.isEven,
                        isOdd: itemContext.isOdd,
                        isFirst: itemContext.isFirst,
                        isInMiddle: itemContext.isInMiddle,
                        isLast: itemContext.isLast,
                    };

                    return { first, second };
                });

                // scenario1 assertions
                expect(result.first.index).toBe(0);
                expect(result.first.length).toBe(42);
                expect(result.first.isEven).toBe(true);
                expect(result.first.isOdd).toBe(false);
                expect(result.first.isFirst).toBe(true);
                expect(result.first.isInMiddle).toBe(false);
                expect(result.first.isLast).toBe(false);

                // scenario2 assertions
                expect(result.second.index).toBe(7);
                expect(result.second.length).toBe(42);
                expect(result.second.isEven).toBe(false);
                expect(result.second.isOdd).toBe(true);
                expect(result.second.isFirst).toBe(false);
                expect(result.second.isInMiddle).toBe(true);
                expect(result.second.isLast).toBe(false);
            });
        });
    });
});
