import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("Button", () => {
    test("should set the `autofocus` boolean attribute on the internal button", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { autofocus: true }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveBooleanAttribute("autofocus");
    });

    test("should set the `disabled` boolean attribute on the internal button", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { disabled: true }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveBooleanAttribute("disabled");
    });

    test("should set the `formnovalidate` boolean attribute on the internal button", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { formnovalidate: true }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveBooleanAttribute("formnovalidate");
    });

    test("should set the `formaction` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { formaction: "foo" }));

        const element = page.locator("fast-button");

        const control = element.locator("button");

        await expect(control).toHaveAttribute("formaction", "foo");
    });

    test("should set the `formenctype` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { formenctype: "foo" }));

        const element = page.locator("fast-button");

        const control = element.locator("button");

        await expect(control).toHaveAttribute("formenctype", "foo");
    });

    test("should set the `formmethod` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { formmethod: "post" }));

        const element = page.locator("fast-button");

        const control = element.locator("button");

        await expect(control).toHaveAttribute("formmethod", "post");
    });

    test("should set the `formtarget` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { formtarget: "_blank" }));

        const element = page.locator("fast-button");

        const control = element.locator("button");

        await expect(control).toHaveAttribute("formtarget", "_blank");
    });

    test("should set the `name` attribute on the internal control", async ({ page }) => {
        await page.goto(fixtureURL("button--button", { name: "foo" }));

        const element = page.locator("fast-button");

        const control = element.locator("button");

        await expect(control).toHaveAttribute("name", "foo");
    });

    test("should set the `type` attribute on the internal control", async ({ page }) => {
        await page.goto(fixtureURL("button--button", { type: "submit" }));

        const element = page.locator("fast-button");

        const control = element.locator("button");

        await expect(control).toHaveAttribute("type", "submit");
    });

    test("should set the `value` attribute on the internal control", async ({ page }) => {
        await page.goto(fixtureURL("button--button", { value: "Reset" }));

        const element = page.locator("fast-button");

        const control = element.locator("button");

        await expect(control).toHaveAttribute("value", "Reset");
    });

    test("should set the `form` attribute on the internal button when `formId` is provided", async ({
        page,
    }) => {
        const formId = "foo";

        await page.goto(fixtureURL("button--button", { formId }));

        const button = page.locator("fast-button button");

        await expect(button).toHaveAttribute("form", formId);
    });

    test("should set the `aria-atomic` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaAtomic: "true" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-atomic", "true");
    });

    test("should set the `aria-busy` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaBusy: "false" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-busy", "false");
    });

    test("should set the `aria-controls` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaControls: "testId" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-controls", "testId");
    });

    test("should set the `aria-current` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaCurrent: "page" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-current", "page");
    });

    test("should set the `aria-describedby` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaDescribedby: "testId" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-describedby", "testId");
    });

    test("should set the `aria-details` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaDetails: "testId" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-details", "testId");
    });

    test("should set the `aria-disabled` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaDisabled: "true" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-disabled", "true");
    });

    test("should set the `aria-errormessage` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaErrormessage: "test" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-errormessage", "test");
    });

    test("should set the `aria-expanded` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaExpanded: "true" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-expanded", "true");
    });

    test("should set the `aria-flowto` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaFlowto: "testId" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-flowto", "testId");
    });

    test("should set the `aria-haspopup` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaHaspopup: "true" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-haspopup", "true");
    });

    test("should set the `aria-hidden` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaHidden: "true" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-hidden", "true");
    });

    test("should set the `aria-invalid` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaInvalid: "spelling" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-invalid", "spelling");
    });

    test("should set the `aria-keyshortcuts` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaKeyshortcuts: "F4" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-keyshortcuts", "F4");
    });

    test("should set the `aria-label` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaLabel: "Foo label" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-label", "Foo label");
    });

    test("should set the `aria-labelledby` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaLabelledby: "testId" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-labelledby", "testId");
    });

    test("should set the `aria-live` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaLive: "polite" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-live", "polite");
    });

    test("should set the `aria-owns` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaOwns: "testId" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-owns", "testId");
    });

    test("should set the `aria-pressed` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaPressed: "true" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-pressed", "true");
    });

    test("should set the `aria-relevant` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaRelevant: "removals" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-relevant", "removals");
    });

    test("should set the `aria-roledescription` attribute on the internal control", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button", { ariaRoledescription: "slide" }));

        const element = page.locator("fast-button");

        const button = element.locator("button");

        await expect(button).toHaveAttribute("aria-roledescription", "slide");
    });

    test("of type `submit` should submit the parent form when clicked", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button-with-submit-type"));

        const element = page.locator("fast-button");

        const form = page.locator("form");

        const [wasSubmitted] = await Promise.all([
            form.evaluate(node => {
                return new Promise(resolve => {
                    node.addEventListener("submit", () => resolve(true));
                });
            }),

            element.click(),
        ]);

        expect(wasSubmitted).toBeTruthy();
    });

    test("of type `reset` should reset the parent form when clicked", async ({
        page,
    }) => {
        await page.goto(fixtureURL("button--button-with-reset-type"));

        const element = page.locator("fast-button");

        const form = page.locator("form");

        const [wasReset] = await Promise.all([
            form.evaluate(node => {
                return new Promise(resolve => {
                    node.addEventListener("reset", () => resolve(true));
                });
            }),

            element.click(),
        ]);

        expect(wasReset).toBeTruthy();
    });

    test("should not propagate when clicked and `disabled` is true", async ({ page }) => {
        await page.goto(fixtureURL("button--button", { disabled: true }));

        const element = page.locator("fast-button");

        const span = element.locator("span");

        const [wasClicked] = await Promise.all([
            element.evaluate(node =>
                Promise.race([
                    new Promise(resolve => {
                        node.addEventListener("click", () => resolve(false));
                    }),
                    new Promise(requestAnimationFrame).then(() => Promise.resolve(true)),
                ])
            ),

            span.evaluate(node =>
                Promise.race([
                    new Promise(resolve => {
                        node.addEventListener("click", () => resolve(false));
                    }),
                    new Promise(requestAnimationFrame).then(() => Promise.resolve(true)),
                ])
            ),

            element.click(),
        ]);

        expect(wasClicked).not.toBeFalsy();
    });
});
