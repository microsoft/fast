import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDialog } from "./index.js";

test.describe("Dialog", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let control: Locator;
    let overlay: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-dialog");

        root = page.locator("#root");

        control = element.locator(`[role="dialog"]`);

        overlay = element.locator(".overlay");

        await page.goto(fixtureURL("dialog--dialog"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should include a role of `dialog` on the control", async () => {
        await expect(control).toHaveClass(/control/);
    });

    test('should set the `tabindex` attribute on the control to "-1" by default', async () => {
        await expect(control).toHaveAttribute("tabindex", "-1");
    });

    test("should set the `hidden` attribute to equal the value of the `hidden` property", async () => {
        await element.evaluate((node: FASTDialog) => {
            node.hidden = true;
        });

        await expect(element).toHaveAttribute("hidden");

        await element.evaluate((node: FASTDialog) => {
            node.hidden = false;
        });

        await expect(element).not.toHaveAttribute("hidden");
    });

    test("should set the `aria-describedby` attribute on the control when provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog aria-describedby="description">
                    <div id="description">Description</div>
                </fast-dialog>
            `;
        });

        await expect(control).toHaveAttribute("aria-describedby", "description");
    });

    test("should set the `aria-labelledby` attribute on the dialog control when provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog aria-labelledby="label">
                    <div id="label">Label</div>
                </fast-dialog>
            `;
        });

        await expect(control).toHaveAttribute("aria-labelledby", "label");
    });

    test("should set the `aria-label` attribute on the dialog control when provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-dialog aria-label="Label"></fast-dialog>
            `;
        });

        await expect(control).toHaveAttribute("aria-label", "Label");
    });

    test("should add an attribute of `aria-modal` with a value equal to the `modal` attribute", async () => {
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

    test('should add an overlay element with a `role` attribute of "presentation" when the `modal` property is true', async () => {
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

    test("should add an attribute of `no-focus-trap` when `noFocusTrap` is true", async () => {
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

    test("should add the `hidden` attribute when the `hide()` method is invoked", async () => {
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

    test("should remove the `hidden` attribute when the `show()` method is invoked", async () => {
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

    test("should fire a 'dismiss' event when its overlay is clicked", async () => {
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

    test("should fire a `cancel` event when its overlay is clicked", async () => {
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

    test("should fire a 'dismiss' event when keydown is invoked on the document", async () => {
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
