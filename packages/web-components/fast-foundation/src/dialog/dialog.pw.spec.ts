import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTDialog } from "./index.js";

test.describe("Dialog", () => {
    test("should include a role of `dialog` on the control", async ({ page }) => {
        await page.goto(fixtureURL("dialog--dialog"));

        const element = page.locator("fast-dialog");

        const control = element.locator(`[role="dialog"]`);

        await expect(control).toHaveClass("control");
    });

    test("should add an attribute of `hidden` when passed", async ({ page }) => {
        await page.goto(fixtureURL("dialog--dialog"));

        const element = page.locator("fast-dialog");

        await element.evaluate((node: FASTDialog) => {
            node.hidden = true;
            return new Promise(requestAnimationFrame);
        });

        expect(await element.evaluate(node => node.hasAttribute("hidden"))).toBeTruthy();

        await element.evaluate((node: FASTDialog) => {
            node.hidden = false;
            return new Promise(requestAnimationFrame);
        });

        expect(await element.evaluate(node => node.hasAttribute("hidden"))).toBeFalsy();
    });

    test("should NOT add an attribute of `hidden` when passed", async ({ page }) => {
        await page.goto(fixtureURL("dialog--dialog"));

        const element = page.locator("fast-dialog");

        expect(await element.evaluate(node => node.hasAttribute("hidden"))).toBeFalsy();
    });

    test("should add an attribute of `aria-modal` with a value equal to the modal attribute", async ({
        page,
    }) => {
        await page.goto(fixtureURL("dialog--dialog"));

        const element = page.locator("fast-dialog");

        await element.evaluate((node: FASTDialog) => {
            node.modal = true;
        });

        await expect(element.locator(`[role="dialog"]`)).toHaveAttribute(
            "aria-modal",
            "true"
        );

        await element.evaluate((node: FASTDialog) => {
            node.modal = false;
        });

        const dialog = element.locator(`[role="dialog"]`);

        await expect(dialog).toHaveAttribute("aria-modal", "");
    });

    test("should NOT add the `aria-modal` attribute when the `modal` attribute is not provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("dialog--dialog"));

        const element = page.locator("fast-dialog");

        await expect(element.locator(`[role="dialog"]`)).toHaveAttribute(
            "aria-modal",
            ""
        );
    });

    test("should add an overlay element with a role of `presentation` when `modal` is true", async ({
        page,
    }) => {
        await page.goto(fixtureURL("dialog--dialog", { modal: true }));

        const element = page.locator("fast-dialog");

        await expect(element.locator(".overlay")).toHaveAttribute("role", "presentation");
    });

    test("should add a tabindex of -1 to the dialog control", async ({ page }) => {
        await page.goto(fixtureURL("dialog--dialog"));

        const element = page.locator(`fast-dialog [role="dialog"]`);

        await expect(element).toHaveAttribute("tabindex", "-1");
    });

    test("should add an attribute of `no-focus-trap` when `noFocusTrap` is true", async ({
        page,
    }) => {
        await page.goto(fixtureURL("dialog--dialog", { noFocusTrap: true }));

        const element = page.locator("fast-dialog");

        expect(await element.getAttribute("no-focus-trap")).toBe("");
    });

    test("should NOT add a default attribute of `no-focus-trap` when noFocusTrap not defined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("dialog--dialog"));

        const element = page.locator("fast-dialog");

        await expect(element).toHaveJSProperty("noFocusTrap", false);

        expect(await element.getAttribute("no-focus-trap")).toBeFalsy();
    });

    test("should set the `aria-describedby` attribute on the dialog control when provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("dialog--dialog"));

        const element = page.locator("fast-dialog");

        const dialog = element.locator(`[role="dialog"]`);

        const ariaDescribedby = "testId";

        await element.evaluate((node: FASTDialog, ariaDescribedby) => {
            node.ariaDescribedby = ariaDescribedby;
        }, ariaDescribedby);

        await expect(dialog).toHaveAttribute("aria-describedby", ariaDescribedby);
    });

    test("should set the `aria-labelledby` attribute on the dialog control when provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("dialog--dialog"));

        const element = page.locator("fast-dialog");

        const dialog = element.locator(`[role="dialog"]`);

        const ariaLabelledby = "testId";

        await element.evaluate((node: FASTDialog, ariaLabelledby) => {
            node.ariaLabelledby = ariaLabelledby;
        }, ariaLabelledby);

        await expect(dialog).toHaveAttribute("aria-labelledby", ariaLabelledby);
    });

    test("should set the `aria-label` attribute on the dialog control when provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("dialog--dialog"));

        const element = page.locator("fast-dialog");

        const dialog = element.locator(`[role="dialog"]`);

        const ariaLabel = "test label";

        await element.evaluate((node: FASTDialog, ariaLabel) => {
            node.ariaLabel = ariaLabel;
        }, ariaLabel);

        await expect(dialog).toHaveAttribute("aria-label", ariaLabel);
    });

    test.describe("methods", () => {
        test("should set the hidden attribute to `false` when the `show()` method is invoked", async ({
            page,
        }) => {
            await page.goto(fixtureURL("dialog--dialog"));

            const element = page.locator("fast-dialog");

            await element.evaluate((node: FASTDialog) => {
                node.hidden = true;
            });

            await expect(element).toHaveJSProperty("hidden", true);

            await element.evaluate((node: FASTDialog) => {
                node.show();
            });

            await expect(element).toHaveJSProperty("hidden", false);
        });

        test("should set the hidden attribute to `true` when the `hide()` method is invoked", async ({
            page,
        }) => {
            await page.goto(fixtureURL("dialog--dialog"));

            const element = page.locator("fast-dialog");

            await expect(element).toHaveJSProperty("hidden", false);

            await element.evaluate((node: FASTDialog) => {
                node.hide();
            });

            await expect(element).toHaveJSProperty("hidden", true);
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
