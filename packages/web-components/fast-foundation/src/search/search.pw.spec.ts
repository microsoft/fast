import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSearch } from "./search.js";

test.describe("Search", () => {
    test.describe("should set the boolean attribute on the internal input", () => {
        let page: Page;
        let element: Locator;

        const attributes = {
            autofocus: true,
            disabled: true,
            readonly: true,
            required: true,
            spellcheck: true,
        };

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-search .control");

            await page.goto(fixtureURL("search--search", attributes));
        });

        test.afterAll(async () => {
            await page.close();
        });

        for (const attribute of Object.keys(attributes)) {
            test(`should set ${attribute}`, async () => {
                await expect(element).toHaveBooleanAttribute(attribute);
            });
        }
    });

    test.describe("should set the attribute on the internal control", () => {
        let page: Page;

        const attributes = {
            maxlength: 14,
            minlength: 14,
            placeholder: "foo",
            size: 8,
            list: "listId",
            ariaAtomic: "true",
            ariaBusy: "false",
            ariaControls: "testId",
            ariaCurrent: "page",
            ariaDescribedby: "testId",
            ariaDetails: "testId",
            ariaDisabled: "true",
            ariaErrormessage: "test",
            ariaFlowto: "testId",
            ariaHaspopup: "true",
            ariaHidden: "true",
            ariaInvalid: "spelling",
            ariaKeyshortcuts: "F4",
            ariaLabel: "Foo label",
            ariaLabelledby: "testId",
            ariaLive: "polite",
            ariaOwns: "testId",
            ariaRelevant: "removals",
            ariaRoledescription: "search",
        };

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();
            await page.goto(fixtureURL("search--search", attributes));
        });

        test.afterAll(async () => {
            await page.close();
        });

        for (const [attribute, value] of Object.entries(attributes)) {
            test(`should set ${attribute} to ${value}`, async () => {
                const control = page.locator("fast-search .control");

                await expect(control).toHaveAttribute(spinalCase(attribute), `${value}`);
            });
        }
    });

    test("should initialize to the initial value if no value property is set", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search"));

        const element = page.locator("fast-search");

        await expect(element).toHaveJSProperty("value", "");
    });

    test("should initialize to the provided value attribute if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-search");

        await page.evaluate(() => {
            const node = document.createElement("fast-search");
            node.setAttribute("value", "initial value");

            document.getElementById("root")?.append(node);
        });

        await expect(element).toHaveJSProperty("value", "initial value");
    });

    test("should initialize to the provided value attribute if set post-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search"));

        const element = page.locator("fast-search");

        await element.evaluate(node => {
            node.setAttribute("value", "foobar");
        });

        await expect(element).toHaveJSProperty("value", "foobar");
    });

    test("should initialize to the provided value property if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-search");

        await page.evaluate(() => {
            const node = document.createElement("fast-search") as FASTSearch;

            node.value = "foobar";

            document.getElementById("root")?.append(node);
        });

        await expect(element).toHaveJSProperty("value", "foobar");
    });

    test("should hide the label when no default slotted content is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { storyContent: "" }));

        const element = page.locator("fast-search");

        const label = element.locator(".label");

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when start or end content is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search", { storyContent: "" }));

        const element = page.locator("fast-search");

        await element.evaluate(node => {
            const svg = document.createElement("svg");
            svg.id = "start-end-content";
            svg.setAttribute("slot", "start");
            svg.setAttribute("height", "100px");
            svg.setAttribute("width", "100px");

            node.append(svg);
        });

        const label = element.locator(".label");

        await expect(label).toHaveClass(/label__hidden/);

        const svg = element.locator("#start-end-content");

        await svg.evaluate(node => {
            node.setAttribute("slot", "end");
        });

        await expect(label).toHaveClass(/label__hidden/);

        await element.evaluate(node => {
            node.innerHTML = "label";
        });

        await expect(label).not.toHaveClass(/label__hidden/);
    });

    test("should hide the label when space-only text nodes are slotted", async ({
        page,
    }) => {
        await page.goto(fixtureURL("search--search"));

        const element = page.locator("fast-search");

        const label = element.locator(".label");

        await expect(label).not.toHaveClass(/label__hidden/);

        await element.evaluate(node => {
            node.innerHTML = `    \r    `;
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test.describe("events", () => {
        test("should fire a change event when the internal control emits a change event", async ({
            page,
        }) => {
            await page.goto(fixtureURL("search--search"));

            const element = page.locator("fast-search");

            const control = element.locator(".control");

            const [wasChanged] = await Promise.all([
                element.evaluate(
                    node =>
                        new Promise(resolve => {
                            node.addEventListener("change", () => resolve(true));
                        })
                ),
                control.evaluate(node => {
                    node.dispatchEvent(new KeyboardEvent("change"));
                }),
            ]);

            expect(wasChanged).toBeTruthy();
        });
    });

    test.describe("when the owning form's reset() method is invoked", () => {
        test("should reset its `value` property to an empty string when no value attribute is set", async ({
            page,
        }) => {
            await page.goto(fixtureURL("search--search-in-form"));

            const element = page.locator("fast-search");

            const form = page.locator("form");

            await element.evaluate<any, FASTSearch>(node => {
                node.value = "test value";
            });

            await expect(element).toHaveJSProperty("value", "test value");

            expect(await element.getAttribute("value")).toBeNull();

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "");

            expect(await element.getAttribute("value")).toBeNull();
        });

        test("should reset its `value` property to the value of the value attribute if it is set", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("search--search-in-form", { value: "test value" })
            );

            const element = page.locator("fast-search");

            const form = page.locator("form");

            await element.evaluate<any, FASTSearch>(node => {
                node.value = "new value";
            });

            await expect(element).toHaveJSProperty("value", "new value");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "test value");
        });

        test("should put the control into a clean state, where `value` attribute modifications change the `value` property prior to user or programmatic interaction", async ({
            page,
        }) => {
            await page.goto(fixtureURL("search--search-in-form"));

            const element = page.locator("fast-search");

            const form = page.locator("form");

            await element.evaluate<void, FASTSearch>(node => {
                node.value = "test value";
            });

            await element.evaluate(node => {
                node.setAttribute("value", "attr value");
            });

            await expect(element).toHaveJSProperty("value", "test value");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "attr value");

            await element.evaluate(node => {
                node.setAttribute("value", "new attr value");
            });

            await expect(element).toHaveJSProperty("value", "new attr value");
        });
    });
});
