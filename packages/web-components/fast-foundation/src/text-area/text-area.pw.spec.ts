import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTextArea } from "./text-area.js";

test.describe("TextArea", () => {
    test("should set the boolean attribute on the internal input", async ({ page }) => {
        const attributes = {
            autofocus: true,
            disabled: true,
            readOnly: true,
            required: true,
            spellcheck: true,
        };

        await page.goto(fixtureURL("text-area--text-area", attributes));

        const control = page.locator("fast-text-area .control");

        for (const attribute of Object.keys(attributes)) {
            await expect(control).toHaveBooleanAttribute(attribute);
        }
    });

    test("should set the attribute on the internal control", async ({ page }) => {
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

        await page.goto(fixtureURL("text-area--text-area", attributes));

        const control = page.locator("fast-text-area .control");

        for (const [attribute, value] of Object.entries(attributes)) {
            await expect(control).toHaveAttribute(spinalCase(attribute), `${value}`);
        }
    });

    test("should initialize to the initial value if no value property is set", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area"));

        const element = page.locator("fast-text-area");

        await expect(element).toHaveJSProperty("value", "");
    });

    test("should initialize to the provided value attribute if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-text-area");

        await page.evaluate(() => {
            const node = document.createElement("fast-text-area");

            node.setAttribute("value", "foo");

            document.getElementById("root")?.append(node);
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value property if set pre-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-text-area");

        await page.evaluate(() => {
            const node = document.createElement("fast-text-area") as FASTTextArea;

            node.value = "foo";

            document.getElementById("root")?.append(node);
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should initialize to the provided value attribute if set post-connection", async ({
        page,
    }) => {
        await page.goto(fixtureURL("debug--blank"));

        const element = page.locator("fast-text-area");

        await page.evaluate(() => {
            const node = document.createElement("fast-text-area");

            document.getElementById("root")?.append(node);

            node.setAttribute("value", "foo");
        });

        await expect(element).toHaveJSProperty("value", "foo");
    });

    test("should fire a `change` event when the internal control emits a `change` event", async ({
        page,
    }) => {
        await page.goto(fixtureURL("text-area--text-area"));

        const element = page.locator("fast-text-area");

        const control = element.locator(".control");

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
        test("should reset the `value` property to an empty string when no `value` attribute is set", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-area--text-area-in-form"));

            const element = page.locator("fast-text-area");

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

        test("should reset the `value` property to match the `value` attribute", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-area--text-area-in-form", { value: "foo" }));

            const element = page.locator("fast-text-area");

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

        test("should put the control into a clean state, where `value` attribute modifications change the `value` property prior to user or programmatic interaction", async ({
            page,
        }) => {
            await page.goto(fixtureURL("text-area--text-area-in-form"));

            const element = page.locator("fast-text-area");

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
