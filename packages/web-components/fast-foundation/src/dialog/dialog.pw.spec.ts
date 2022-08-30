import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDialog } from "./index.js";

test.describe("Dialog", () => {
    test.describe("States, Attributes, and Properties", () => {
        let page: Page;
        let element: Locator;
        let control: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-dialog");

            control = element.locator(`[role="dialog"]`);

            await page.goto(fixtureURL("dialog--dialog"));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should include a role of `dialog` on the control", async () => {
            await expect(control).toHaveClass("control");
        });

        test('should set the `tabindex` attribute on the control to "-1" by default', async ({
            page,
        }) => {
            await page.goto(fixtureURL("dialog--dialog"));

            const element = page.locator(`fast-dialog [role="dialog"]`);

            await expect(element).toHaveAttribute("tabindex", "-1");
        });

        test("should set the `hidden` attribute to equal the value of the `hidden` property", async () => {
            await element.evaluate((node: FASTDialog) => {
                node.hidden = true;
                return new Promise(requestAnimationFrame);
            });

            await expect(element).toHaveBooleanAttribute("hidden");

            await element.evaluate((node: FASTDialog) => {
                node.hidden = false;
                return new Promise(requestAnimationFrame);
            });

            await expect(element).not.toHaveBooleanAttribute("hidden");
        });

        test("should set the `aria-describedby` attribute on the control when provided", async () => {
            const ariaDescribedby = "testId";

            await element.evaluate((node: FASTDialog, ariaDescribedby) => {
                node.ariaDescribedby = ariaDescribedby;
            }, ariaDescribedby);

            await expect(control).toHaveAttribute("aria-describedby", ariaDescribedby);
        });

        test("should set the `aria-labelledby` attribute on the dialog control when provided", async () => {
            const ariaLabelledby = "testId";

            await element.evaluate((node: FASTDialog, ariaLabelledby) => {
                node.ariaLabelledby = ariaLabelledby;
            }, ariaLabelledby);

            await expect(control).toHaveAttribute("aria-labelledby", ariaLabelledby);
        });

        test("should set the `aria-label` attribute on the dialog control when provided", async () => {
            const ariaLabel = "test label";

            await element.evaluate((node: FASTDialog, ariaLabel) => {
                node.ariaLabel = ariaLabel;
            }, ariaLabel);

            await expect(control).toHaveAttribute("aria-label", ariaLabel);
        });

        test("should add an attribute of `aria-modal` with a value equal to the `modal` attribute", async () => {
            await expect(control).not.hasAttribute("aria-modal");

            await element.evaluate((node: FASTDialog) => {
                node.modal = true;
                return new Promise(requestAnimationFrame);
            });

            await expect(control).toHaveAttribute("aria-modal", "true");

            await element.evaluate((node: FASTDialog) => {
                node.modal = false;
                return new Promise(requestAnimationFrame);
            });

            await expect(control).not.hasAttribute("aria-modal");
        });

        test('should add an overlay element with a `role` attribute of "presentation" when the `modal` property is true', async () => {
            const overlay = element.locator(".overlay");

            await element.evaluate((node: FASTDialog) => {
                node.modal = true;
            });

            await expect(overlay).toHaveAttribute("role", "presentation");

            await element.evaluate((node: FASTDialog) => {
                node.modal = false;
            });

            await expect(overlay).toHaveCount(0);
        });

        test("should add an attribute of `no-focus-trap` when `noFocusTrap` is true", async () => {
            await element.evaluate((node: FASTDialog) => {
                node.noFocusTrap = true;
                return new Promise(requestAnimationFrame);
            });

            await expect(element).toHaveBooleanAttribute("no-focus-trap");

            await element.evaluate((node: FASTDialog) => {
                node.noFocusTrap = false;
                return new Promise(requestAnimationFrame);
            });

            await expect(element).not.toHaveBooleanAttribute("no-focus-trap");
        });

        test("should add the `hidden` attribute when the `hide()` method is invoked", async () => {
            await element.evaluate((node: FASTDialog) => {
                node.hidden = false;
            });

            await expect(element).toHaveJSProperty("hidden", false);

            await expect(element).not.hasAttribute("hidden");

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

            await expect(element).toHaveBooleanAttribute("hidden");

            await element.evaluate((node: FASTDialog) => {
                node.show();
            });

            await expect(element).toHaveJSProperty("hidden", false);

            await expect(element).not.toHaveBooleanAttribute("hidden");
        });
    });

    test.describe("events", () => {
        test("should fire a 'dismiss' event when its overlay is clicked", async ({
            page,
        }) => {
            await page.goto(fixtureURL("dialog--dialog-with-dismiss"));

            const element = page.locator("fast-dialog");

            const overlay = page.locator(".overlay");

            await overlay.waitFor({ state: "visible" });

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

        test("should fire a `cancel` event when its overlay is clicked", async ({
            page,
        }) => {
            await page.goto(fixtureURL("dialog--dialog-with-dismiss"));

            const element = page.locator("fast-dialog");

            const overlay = page.locator(".overlay");

            await overlay.waitFor({ state: "visible" });

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

        test("should fire a `close` event when its button is clicked", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("dialog--dialog-with-dismiss", {
                    modal: false,
                })
            );

            const element = page.locator("fast-dialog");

            const hideButton = element.locator("fast-button.hide-dialog");

            const [wasDismissed] = await Promise.all([
                element.evaluate(
                    node =>
                        new Promise(resolve => {
                            node.addEventListener("close", () => resolve(true));
                        })
                ),
                hideButton.click(),
            ]);

            expect(wasDismissed).toBeTruthy();
        });

        test("should fire a 'dismiss' event when keydown is invoked on the document", async ({
            page,
        }) => {
            await page.goto(fixtureURL("dialog--dialog-with-dismiss"));

            const element = page.locator("fast-dialog");

            const overlay = page.locator(".overlay");

            await overlay.waitFor({ state: "visible" });

            const [wasDismissed] = await Promise.all([
                element.evaluate(
                    node =>
                        new Promise(resolve => {
                            node.addEventListener("dismiss", () => resolve(true));
                        })
                ),
                element
                    .evaluate(() => new Promise(requestAnimationFrame))
                    .then(() => page.keyboard.press("Escape")),
            ]);

            expect(wasDismissed).toBeTruthy();
        });
    });
});
