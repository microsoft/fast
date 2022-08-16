import { spinalCase } from "@microsoft/fast-web-utilities";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTextArea } from "./text-area.js";

test.describe("TextArea", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let control: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-text-area");

        root = page.locator("#root");

        control = element.locator(".field");

        await page.goto(fixtureURL("text-area--text-area"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test.describe("should set the boolean attribute on the internal input", () => {
        const attributes = {
            autofocus: true,
            disabled: true,
            readOnly: true,
            required: true,
            spellcheck: true,
        };

        for (const attribute of Object.keys(attributes)) {
            test(attribute, async () => {
                await root.evaluate((node, attribute: string) => {
                    node.innerHTML = /* html */ `
                        <fast-text-area ${attribute}></fast-text-area>
                    `;
                }, attribute);

                await expect(control).toHaveBooleanAttribute(attribute);
            });
        }
    });

    test.describe("should set the attribute on the internal control", () => {
        const attributes = {
            cols: 4,
            maxlength: 14,
            minlength: 14,
            name: "foo",
            placeholder: "foo",
            rows: 4,
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
            const attributeSpinalCase = spinalCase(attribute);

            test(attribute, async () => {
                await root.evaluate(
                    (node, { attributeSpinalCase, value }) => {
                        node.innerHTML = /* html */ `
                            <fast-text-area ${attributeSpinalCase}="${value}"></fast-text-area>
                        `;
                    },
                    { attributeSpinalCase, value }
                );

                await expect(control).toHaveAttribute(attributeSpinalCase, `${value}`);
            });
        }
    });

    test("should initialize to the initial value if no value property is set", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-area></fast-text-area>
            `;
        });

        await expect(element).toHaveJSProperty("value", "");
    });

    test("should initialize to the provided value attribute if set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-area value="foo"></fast-text-area>
            `;
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value property if set pre-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = "";

            const textArea = document.createElement("fast-text-area") as FASTTextArea;
            textArea.value = "foo";
            node.append(textArea);
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value attribute if set post-connection", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-area></fast-text-area>
            `;
        });

        await element.evaluate((node: FASTTextArea) => {
            node.setAttribute("value", "foo");
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should fire a `change` event when the internal control emits a `change` event", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-text-area></fast-text-area>
            `;
        });

        const [wasChanged] = await Promise.all([
            element.evaluate(
                node =>
                    new Promise(resolve => {
                        node.addEventListener("change", () => resolve(true));
                    })
            ),
            control.evaluate(node => {
                node.dispatchEvent(
                    new Event("change", {
                        key: "a",
                    } as EventInit)
                );
            }),
        ]);

        expect(wasChanged).toBeTruthy();
    });

    test.describe("when the owning form's reset() method is invoked", () => {
        test("should reset the `value` property to an empty string when no `value` attribute is set", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-text-area></fast-text-area>
                    </form>
                `;
            });

            const form = page.locator("form");

            await element.evaluate<void, FASTTextArea>(node => {
                node.value = "foo";
            });

            await expect(element).not.hasAttribute("value");

            await expect(element).toHaveJSProperty("value", "foo");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).not.hasAttribute("value");

            await expect(element).toHaveJSProperty("value", "");
        });

        test("should reset the `value` property to match the `value` attribute", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-text-area value="foo"></fast-text-area>
                    </form>
                `;
            });

            const form = page.locator("form");

            await element.evaluate((node: FASTTextArea) => {
                node.value = "bar";
            });

            await expect(element).toHaveAttribute("value", "foo");

            await expect(element).toHaveJSProperty("value", "bar");

            await form.evaluate<void, HTMLFormElement>(node => {
                node.reset();
            });

            await expect(element).toHaveAttribute("value", "foo");

            await expect(element).toHaveJSProperty("value", "foo");
        });

        test("should put the control into a clean state, where `value` attribute modifications change the `value` property prior to user or programmatic interaction", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <form>
                        <fast-text-area></fast-text-area>
                    </form>
                `;
            });

            const form = page.locator("form");

            await element.evaluate((node: FASTTextArea) => {
                node.value = "prop-value";
                node.setAttribute("value", "attr-value");
            });

            await expect(element).toHaveJSProperty("value", "prop-value");

            await form.evaluate((node: HTMLFormElement) => {
                node.reset();
            });

            await expect(element).toHaveJSProperty("value", "attr-value");

            await element.evaluate((node: FASTTextArea) => {
                node.setAttribute("value", "new-attr-value");
            });

            await expect(element).toHaveJSProperty("value", "new-attr-value");
        });
    });
});
