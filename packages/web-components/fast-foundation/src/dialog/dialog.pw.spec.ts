import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDialog } from "./index.js";

test.describe("Dialog", () => {
    test("should include a role of `dialog` on the control", async ({ page }) => {
        const element = page.locator("fast-dialog");

        const control = element.locator(`[role="dialog"]`);

        await page.goto(fixtureURL("dialog--dialog"));

        await expect(control).toHaveClass(/control/);
    });

    test('should set the `tabindex` attribute on the control to "-1" by default', async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        const control = element.locator(`[role="dialog"]`);

        await page.goto(fixtureURL("dialog--dialog"));

        await expect(control).toHaveAttribute("tabindex", "-1");
    });

    test("should set the `hidden` attribute to equal the value of the `hidden` property", async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        await page.goto(fixtureURL("dialog--dialog"));

        await element.evaluate((node: FASTDialog) => {
            node.hidden = true;
        });

        await expect(element).toHaveAttribute("hidden");

        await element.evaluate((node: FASTDialog) => {
            node.hidden = false;
        });

        await expect(element).not.toHaveAttribute("hidden");
    });

    test("should set the `aria-describedby` attribute on the control when provided", async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        const root = page.locator("#root");

        const control = element.locator(`[role="dialog"]`);

        await page.goto(fixtureURL("dialog--dialog"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog aria-describedby="description">
                    <div id="description">Description</div>
                </fast-dialog>
            `;
        });

        await expect(control).toHaveAttribute("aria-describedby", "description");
    });

    test("should set the `aria-labelledby` attribute on the dialog control when provided", async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        const root = page.locator("#root");

        const control = element.locator(`[role="dialog"]`);

        await page.goto(fixtureURL("dialog--dialog"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog aria-labelledby="label">
                    <div id="label">Label</div>
                </fast-dialog>
            `;
        });

        await expect(control).toHaveAttribute("aria-labelledby", "label");
    });

    test("should set the `aria-label` attribute on the dialog control when provided", async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        const root = page.locator("#root");

        const control = element.locator(`[role="dialog"]`);

        await page.goto(fixtureURL("dialog--dialog"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog aria-label="Label"></fast-dialog>
            `;
        });

        await expect(control).toHaveAttribute("aria-label", "Label");
    });

    test("should add an attribute of `aria-modal` with a value equal to the `modal` attribute", async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        const root = page.locator("#root");

        const control = element.locator(`[role="dialog"]`);

        await page.goto(fixtureURL("dialog--dialog"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog modal></fast-dialog>
            `;
        });

        await expect(control).toHaveAttribute("aria-modal", "true");

        await element.evaluate((node: FASTDialog) => {
            node.modal = false;
        });

        await expect(control).not.toHaveAttribute("aria-modal");
    });

    test('should add an overlay element with a `role` attribute of "presentation" when the `modal` property is true', async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        const root = page.locator("#root");

        const overlay = element.locator(".overlay");

        await page.goto(fixtureURL("dialog--dialog"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog modal></fast-dialog>
            `;
        });

        await expect(overlay).toHaveAttribute("role", "presentation");

        await element.evaluate((node: FASTDialog) => {
            node.modal = false;
        });

        await expect(overlay).toHaveCount(0);
    });

    test("should add an attribute of `no-focus-trap` when `noFocusTrap` is true", async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        const root = page.locator("#root");

        await page.goto(fixtureURL("dialog--dialog"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog no-focus-trap></fast-dialog>
            `;
        });

        await element.evaluate((node: FASTDialog) => {
            node.noFocusTrap = true;
        });

        await expect(element).toHaveAttribute("no-focus-trap");

        await element.evaluate((node: FASTDialog) => {
            node.noFocusTrap = false;
        });

        await expect(element).not.toHaveAttribute("no-focus-trap");
    });

    test("should add the `hidden` attribute when the `hide()` method is invoked", async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        await page.goto(fixtureURL("dialog--dialog"));

        await element.evaluate((node: FASTDialog) => {
            node.hidden = false;
        });

        await expect(element).toHaveJSProperty("hidden", false);

        await expect(element).not.toHaveAttribute("hidden");

        await element.evaluate((node: FASTDialog) => {
            node.hide();
        });

        await expect(element).toHaveJSProperty("hidden", true);
    });

    test("should remove the `hidden` attribute when the `show()` method is invoked", async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        await page.goto(fixtureURL("dialog--dialog"));

        await element.evaluate((node: FASTDialog) => {
            node.hidden = true;
        });

        await expect(element).toHaveJSProperty("hidden", true);

        await expect(element).toHaveAttribute("hidden");

        await element.evaluate((node: FASTDialog) => {
            node.show();
        });

        await expect(element).toHaveJSProperty("hidden", false);

        await expect(element).not.toHaveAttribute("hidden");
    });

    test("should fire a 'dismiss' event when its overlay is clicked", async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        const root = page.locator("#root");

        const overlay = element.locator(".overlay");

        await page.goto(fixtureURL("dialog--dialog"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog modal></fast-dialog>
            `;
        });

        await (await overlay.elementHandle())?.waitForElementState("stable");

        const [wasDismissed] = await Promise.all([
            element.evaluate(
                node =>
                    new Promise(resolve => {
                        node.addEventListener("dismiss", () => resolve(true));
                    })
            ),
            // click the overlay in the top-left corner to avoid the dialog element
            overlay.click({ position: { x: 0, y: 0 } }),
        ]);

        expect(wasDismissed).toBeTruthy();
    });

    test("should fire a `cancel` event when its overlay is clicked", async ({ page }) => {
        const element = page.locator("fast-dialog");

        const root = page.locator("#root");

        const overlay = element.locator(".overlay");

        await page.goto(fixtureURL("dialog--dialog"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog modal></fast-dialog>
            `;
        });

        await (await overlay.elementHandle())?.waitForElementState("stable");

        const [wasDismissed] = await Promise.all([
            element.evaluate(
                node =>
                    new Promise(resolve => {
                        node.addEventListener("cancel", () => resolve(true));
                    })
            ),
            // click the overlay in the top-left corner to avoid the dialog element
            overlay.click({ position: { x: 0, y: 0 } }),
        ]);

        expect(wasDismissed).toBeTruthy();
    });

    test("should fire a 'dismiss' event when keydown is invoked on the document", async ({
        page,
    }) => {
        const element = page.locator("fast-dialog");

        const root = page.locator("#root");

        const overlay = element.locator(".overlay");

        await page.goto(fixtureURL("dialog--dialog"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog modal></fast-dialog>
            `;
        });

        await (await overlay.elementHandle())?.waitForElementState("stable");

        const [wasDismissed] = await Promise.all([
            element.evaluate(
                node =>
                    new Promise(resolve => {
                        node.addEventListener("dismiss", () => resolve(true));
                    })
            ),
            element
                .elementHandle()
                .then(handle => handle?.waitForElementState("stable"))
                .then(() => page.keyboard.press("Escape")),
        ]);

        expect(wasDismissed).toBeTruthy();
    });
});
