import { expect, test } from "@playwright/test";
import type { HostDirectiveElement } from "./main.js";

test.describe("Host Bindings Hydration", async () => {
    test.describe("prerendered f-host", () => {
        test.use({ javaScriptEnabled: false });

        test("applies host attributes without emitting a directive element", async ({
            page,
        }) => {
            await page.goto("/fixtures/bindings/host/");
            const element = page.locator("host-directive-element");
            await expect(element).toHaveAttribute("role", "button");
            await expect(element).toHaveAttribute("tabindex", "0");
            await expect(element).toHaveAttribute("class", "prefix host directive");
            await expect(element).toHaveAttribute("data-host-label", "tooltip");
            await expect(element).toHaveAttribute("attr", "value");
            await expect(element).toHaveAttribute("disabled", "");
            await expect(element.locator("span").first()).toHaveText("host directive");
            await expect(element.locator("span").last()).toHaveAttribute(
                "title",
                "host directive",
            );
            await expect(element.locator("f-host")).toHaveCount(0);
            await expect(element.locator("style")).toHaveCount(1);
        });
    });

    test("hydrates f-host bindings and renders new client-only instances", async ({
        page,
    }) => {
        await page.goto("/fixtures/bindings/host/");
        await page.waitForFunction(() => (window as any).hydrationCompleted === true);
        const element = page.locator("host-directive-element");
        expect(
            await element.evaluate(
                (component: HostDirectiveElement) => component.$fastController.isHydrated,
            ),
        ).toBe(true);
        await expect(element).toHaveAttribute("title", "permutation tooltip");
        await element.dispatchEvent("click");
        expect(
            await element.evaluate(
                (component: HostDirectiveElement) => component.clickCount,
            ),
        ).toBe(1);

        await element.evaluate((component: HostDirectiveElement) => {
            component.text = "outer update";
        });
        await expect(element.locator("span").first()).toHaveText("outer update");
        await expect(element).toHaveAttribute("data-host-label", "tooltip");

        await element.evaluate((component: HostDirectiveElement) => {
            component.text = "updated host";
            component.hostTitle = "updated title";
            component.hostAttr = "updated value";
            component.isDisabled = false;
        });
        await expect(element).toHaveAttribute("class", "prefix updated host");
        await expect(element).toHaveAttribute("title", "updated title");
        await expect(element).toHaveAttribute("data-host-label", "updated title");
        await expect(element).toHaveAttribute("attr", "updated value");
        await expect(element).not.toHaveAttribute("disabled");
        await expect(element.locator("span").first()).toHaveText("updated host");
        await expect(element.locator("span").last()).toHaveAttribute(
            "title",
            "updated host",
        );
        await expect(element.locator("f-host")).toHaveCount(0);

        await page.evaluate(() => {
            const component = document.createElement("host-directive-element");
            component.id = "client-host";
            document.body.appendChild(component);
        });
        const client = page.locator("#client-host");
        await expect(client).toHaveAttribute("role", "button");
        await expect(client).toHaveAttribute("tabindex", "0");
        await expect(client).toHaveAttribute("class", "prefix host directive");
        await expect(client).toHaveAttribute("data-host-label", "permutation tooltip");
        await expect(client.locator("span").first()).toHaveText("host directive");
        await expect(client.locator("f-host")).toHaveCount(0);
        await expect(client.locator("style")).toHaveJSProperty(
            "textContent",
            ".x { color:red; }",
        );
        expect(
            await client.evaluate(
                (component: HostDirectiveElement) => component.$fastController.isHydrated,
            ),
        ).toBe(false);
    });

    test.describe("should restart marker indexes inside the template after host bindings", () => {
        test("single host event binding with content text binding", async ({ page }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/bindings/host/");
            await hydrationCompleted;

            const element = page.locator("host-event-element");

            // Verify initial state - content binding rendered correctly
            await expect(element.locator("span")).toHaveText("Hello");

            // Verify event binding works after hydration
            const messages: string[] = [];
            page.on("console", msg => messages.push(msg.text()));

            await element.click();

            expect(messages.some(m => m.includes("host-event clicked: 1"))).toBe(true);

            // KEY TEST: Verify updating content binding works (proves correct index offset)
            await element.evaluate((el: any) => {
                el.greeting = "Updated";
            });

            await expect(element.locator("span")).toHaveText("Updated");
        });

        test("multiple host bindings (event + boolean attr) with content text binding", async ({
            page,
        }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/bindings/host/");
            await hydrationCompleted;

            const element = page.locator("host-multi-element");

            // Verify initial state
            await expect(element.locator("span")).toHaveText("World");
            await expect(element).toHaveAttribute("disabled", "");

            // Verify event binding works after hydration
            const messages: string[] = [];
            page.on("console", msg => messages.push(msg.text()));

            await element.click({ force: true }); // force because element is disabled

            expect(messages.some(m => m.includes("host-multi clicked: 1"))).toBe(true);

            // KEY TEST: Verify updating content binding works (proves correct index offset with 2 host bindings)
            await element.evaluate((el: any) => {
                el.text = "Updated World";
            });

            await expect(element.locator("span")).toHaveText("Updated World");
        });

        test("host bindings with static attribute and multiple content text bindings", async ({
            page,
        }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/bindings/host/");
            await hydrationCompleted;

            const element = page.locator("host-static-element");

            // Verify static id attribute is preserved
            await expect(element).toHaveAttribute("id", "static-host");

            // Verify content bindings work - check the span contains both values
            const span = element.locator("span");
            await expect(span).toContainText("first");
            await expect(span).toContainText("second");

            // Verify click event binding works
            const messages: string[] = [];
            page.on("console", msg => messages.push(msg.text()));

            await element.click();

            expect(messages.some(m => m.includes("host-static clicked: 1"))).toBe(true);

            // KEY TEST: Verify updating content bindings works (proves indexes 0 and 1 are correct)
            await element.evaluate((el: any) => {
                el.first = "updated-first";
                el.second = "updated-second";
            });
            await expect(span).toContainText("updated-first");
            await expect(span).toContainText("updated-second");
        });

        test("multiple host events with content text binding", async ({ page }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/bindings/host/");
            await hydrationCompleted;

            const element = page.locator("host-events-element");

            // Verify content text binding rendered
            await expect(element).toContainText("content text");

            // Verify click event binding works
            const messages: string[] = [];
            page.on("console", msg => messages.push(msg.text()));

            await element.click();
            expect(messages.some(m => m.includes("host-events clicked: 1"))).toBe(true);

            // Verify mouseenter event binding also works
            await element.hover();
            expect(messages.some(m => m.includes("host-events mouseenter: 1"))).toBe(
                true,
            );

            // KEY TEST: Verify updating content binding works (proves correct offset with 2 host events)
            await element.evaluate((el: any) => {
                el.text = "updated content";
            });
            await expect(element).toContainText("updated content");
        });
    });

    test.describe("should restart marker indexes with host bindings and multiple content bindings", () => {
        test("host event with multiple content attribute bindings on same element", async ({
            page,
        }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/bindings/host/");
            await hydrationCompleted;

            const element = page.locator("host-multi-content-element");
            const span = element.locator("span");

            // Verify initial attribute values
            await expect(span).toHaveAttribute("first", "a");
            await expect(span).toHaveAttribute("second", "b");

            // Verify event binding works after hydration
            const messages: string[] = [];
            page.on("console", msg => messages.push(msg.text()));

            await element.click();

            expect(messages.some(m => m.includes("host-multi-content clicked: 1"))).toBe(
                true,
            );

            // KEY TEST: Update both attribute bindings to prove indexes 0,1 are correct
            await element.evaluate((el: any) => {
                el.first = "updated-a";
                el.second = "updated-b";
            });

            await expect(span).toHaveAttribute("first", "updated-a");
            await expect(span).toHaveAttribute("second", "updated-b");
        });

        test("host event with content text binding in element", async ({ page }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/bindings/host/");
            await hydrationCompleted;

            const element = page.locator("host-text-binding-element");
            const span = element.locator("span");

            // Verify initial text content
            await expect(span).toHaveText("text content");

            // Verify event binding works after hydration
            const messages: string[] = [];
            page.on("console", msg => messages.push(msg.text()));

            await element.click();

            expect(messages.some(m => m.includes("host-text-binding clicked: 1"))).toBe(
                true,
            );

            // KEY TEST: Verify updating text binding works (proves correct index offset)
            await element.evaluate((el: any) => {
                el.text = "updated text";
            });

            await expect(span).toHaveText("updated text");
        });
    });

    test.describe("should restart marker indexes after host bindings of different types", () => {
        test("host property binding with content text binding", async ({ page }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/bindings/host/");
            await hydrationCompleted;

            const element = page.locator("host-property-element");
            const span = element.locator("span");

            // Verify initial content
            await expect(span).toHaveText("property test");

            // Verify host property binding was applied
            const title = await element.evaluate((el: any) => el.title);
            expect(title).toBe("tooltip text");

            // KEY TEST: Verify updating content binding works (proves correct index offset)
            await element.evaluate((el: any) => {
                el.text = "updated property test";
            });

            await expect(span).toHaveText("updated property test");
        });

        test("all host binding types (event + boolean + property + attribute) with content binding", async ({
            page,
        }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/bindings/host/");
            await hydrationCompleted;

            const element = page.locator("host-all-types-element");
            const span = element.locator("span");

            // Verify initial state with all host binding types
            await expect(span).toHaveText("all types");
            await expect(element).toHaveAttribute("disabled", "");
            await expect(element).toHaveAttribute("attr", "value");

            // Verify host property binding was applied
            const title = await element.evaluate((el: any) => el.title);
            expect(title).toBe("all types tooltip");

            // Verify event binding works after hydration
            const messages: string[] = [];
            page.on("console", msg => messages.push(msg.text()));

            await element.click({ force: true }); // force because element is disabled

            expect(messages.some(m => m.includes("host-all-types clicked: 1"))).toBe(
                true,
            );

            // KEY TEST: Verify updating content binding works regardless of host binding types/order
            await element.evaluate((el: any) => {
                el.text = "updated all types";
            });

            await expect(span).toHaveText("updated all types");
        });
    });

    test.describe("should restart marker indexes regardless of host binding order", () => {
        // These tests verify that the order of host bindings doesn't affect content indexing
        const permutations = [
            {
                name: "attribute first (attr, property, boolean, event)",
                selector: "host-perm-attr-first",
                initialText: "perm attr first",
            },
            {
                name: "boolean first (boolean, event, attr, property)",
                selector: "host-perm-bool-first",
                initialText: "perm bool first",
            },
            {
                name: "property first (property, attr, event, boolean)",
                selector: "host-perm-prop-first",
                initialText: "perm prop first",
            },
        ];

        for (const { name, selector, initialText } of permutations) {
            test(`host binding permutation: ${name}`, async ({ page }) => {
                const hydrationCompleted = page.waitForFunction(
                    () => (window as any).hydrationCompleted === true,
                );
                await page.goto("/fixtures/bindings/host/");
                await hydrationCompleted;

                const element = page.locator(selector);
                const span = element.locator("span");

                // Verify initial state
                await expect(span).toHaveText(initialText);
                await expect(element).toHaveAttribute("disabled", "");
                await expect(element).toHaveAttribute("attr", "value");

                // Verify host property binding was applied
                const title = await element.evaluate((el: any) => el.title);
                expect(title).toBe("permutation tooltip");

                // Verify event binding works after hydration
                const messages: string[] = [];
                page.on("console", msg => messages.push(msg.text()));

                await element.click({ force: true }); // force because element is disabled

                expect(messages.some(m => m.includes(`${selector} clicked: 1`))).toBe(
                    true,
                );

                // KEY TEST: Verify updating content binding works regardless of host binding order
                await element.evaluate((el: any) => {
                    el.text = "updated permutation";
                });

                await expect(span).toHaveText("updated permutation");
            });
        }
    });

    test.describe("should correctly offset binding indexes when host has bindings", () => {
        test("updating content bindings after hydration proves correct index offset", async ({
            page,
        }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/bindings/host/");
            await hydrationCompleted;

            // Test across multiple elements to verify the fix works consistently
            const elements = [
                {
                    locator: "host-event-element",
                    prop: "greeting",
                    expected: "NewHello",
                    selector: "span",
                },
                {
                    locator: "host-multi-element",
                    prop: "text",
                    expected: "NewWorld",
                    selector: "span",
                },
                {
                    locator: "host-text-binding-element",
                    prop: "text",
                    expected: "NewText",
                    selector: "span",
                },
            ];

            for (const { locator, prop, expected, selector } of elements) {
                const element = page.locator(locator);
                const target = element.locator(selector);

                // Update the binding
                await element.evaluate(
                    (el: any, data: { prop: string; expected: string }) => {
                        el[data.prop] = data.expected;
                    },
                    { prop, expected },
                );

                // Verify the binding updated correctly
                await expect(target).toContainText(expected);
            }
        });
    });

    test.describe("should propagate host attributes from the template's <template>", () => {
        test("host-autofocus has author-provided autofocus and template-provided tabindex", async ({
            page,
        }) => {
            test.skip(
                !!process.env.FAST_WEBUI_INTEGRATION,
                "WebUI does not propagate static inner <template> attributes to the host output",
            );

            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/bindings/host/");
            await hydrationCompleted;

            const element = page.locator("host-autofocus");

            // Author-provided attribute survives the SSR pipeline.
            await expect(element).toHaveAttribute("autofocus", "");

            // Template <template tabindex="0"> attribute is propagated to the host tag.
            await expect(element).toHaveAttribute("tabindex", "0");
        });
    });
});
