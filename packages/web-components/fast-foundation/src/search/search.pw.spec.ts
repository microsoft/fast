import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTSearch } from "./search.js";

test.describe("Search", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let control: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-search");

        root = page.locator("#root");

        control = element.locator(".field");

        await page.goto(fixtureURL("search--search"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test.describe("should set the boolean attribute on the internal input", () => {
        const attributes = {
            autofocus: true,
            disabled: true,
            readonly: true,
            required: true,
            spellcheck: true,
        };

        for (const attribute of Object.keys(attributes)) {
            test(`should set ${attribute}`, async () => {
                await root.evaluate(
                    (node, { attribute }) => {
                        node.innerHTML = /* html */ `
                            <fast-search ${attribute}>Search</fast-search>
                        `;
                    },
                    { attribute }
                );

                await expect(element).toHaveBooleanAttribute(attribute);
            });
        }
    });

    test.describe("should set the attribute on the internal control", () => {
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

        for (const [attribute, value] of Object.entries(attributes)) {
            const attrToken = spinalCase(attribute);
            test(`should set ${attrToken} to ${value}`, async () => {
                await root.evaluate(node => {
                    node.innerHTML = /* html */ `
                        <fast-search>Search</fast-search>
                    `;
                });

                await element.evaluate(
                    (node: FASTSearch, { attrToken, value }) => {
                        node.setAttribute(attrToken, `${value}`);
                    },
                    { attrToken, value }
                );

                await expect(control).toHaveAttribute(spinalCase(attribute), `${value}`);
            });
        }
    });

    test("should initialize to the initial value if no value property is set", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-search>Search</fast-search>
            `;
        });

        await expect(element).toHaveJSProperty("value", "");
    });

    test("should initialize to the provided value attribute if set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-search value="foo">Search</fast-search>
            `;
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value attribute if set post-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-search>Search</fast-search>
            `;
        });

        await element.evaluate(node => {
            node.setAttribute("value", "foo");
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value property if set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = "";

            const searchElement = document.createElement("fast-search") as FASTSearch;
            searchElement.value = "foo";
            node.append(searchElement);
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should hide the label when no default slotted content is provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-search></fast-search>
            `;
        });

        const label = element.locator(".label");

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when start content is provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-search><span slot="start">Start</span></fast-search>
            `;
        });

        const label = element.locator(".label");

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when end content is provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-search><span slot="end">End</span></fast-search>
            `;
        });

        const label = element.locator(".label");

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when start and end content is provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-search>
                    <span slot="start">Start</span>
                    <span slot="end">End</span>
                </fast-search>
            `;
        });

        const label = element.locator(".label");

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should hide the label when space-only text nodes are slotted", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-search>label</fast-search>
            `;
        });

        const label = element.locator(".label");

        await expect(label).not.toHaveClass(/label__hidden/);

        await element.evaluate(node => {
            node.innerHTML = `    \r    `;
        });

        await expect(label).toHaveClass(/label__hidden/);
    });

    test("should fire a change event when the internal control emits a change event", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-search>Search</fast-search>
            `;
        });

        const control = element.locator(".control");

        const [wasChanged] = await Promise.all([
            element.evaluate(
                node =>
                    new Promise(resolve => {
                        node.addEventListener("change", () => resolve(true));
                    })
            ),
            element.type("foo").then(() => control.press("Enter")),
        ]);

        expect(wasChanged).toBeTruthy();
    });

    test.describe("when the owning form's reset() method is invoked", () => {
        test("should reset its `value` property to an empty string when no value attribute is set", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-search>Search</fast-search>
                    </form>
                `;
            });

            const form = page.locator("form");

            await element.evaluate<any, FASTSearch>(node => {
                node.value = "test value";
            });

            await expect(element).toHaveJSProperty("value", "test value");

            await expect(element).not.hasAttribute("value");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).not.hasAttribute("value");

            await expect(element).toHaveJSProperty("value", "");
        });

        test("should reset its `value` property to the value of the value attribute if it is set", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-search value="test value">Search</fast-search>
                    </form>
                `;
            });

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

        test("should put the control into a clean state, where `value` attribute modifications change the `value` property prior to user or programmatic interaction", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-search>Search</fast-search>
                    </form>
                `;
            });

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
