import { expect, test } from "@playwright/test";
import type { TestEventOptions } from "./main.js";

for (const mode of ["ssr", "csr"]) {
    test.describe(`event options (${mode})`, () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/fixtures/bindings/event-options/");
            await page.waitForFunction(() => (window as any).hydrationCompleted === true);
            await expect(page.locator(`#${mode} #once`)).toBeVisible();
        });

        test("captures non-bubbling events from new repeat items", async ({ page }) => {
            const element = page.locator(`#${mode}`);
            await element.evaluate((node: TestEventOptions) => {
                node.items = ["first", "second"];
            });
            const items = element.locator(".repeat-target");
            await expect(items).toHaveCount(2);
            await items.nth(1).dispatchEvent("pointerenter", { bubbles: false });
            await expect(element).toHaveJSProperty("captureCalls", 1);
            await expect(element).toHaveJSProperty("capturePhase", 1);
        });

        test("runs a once listener once per binding", async ({ page }) => {
            const element = page.locator(`#${mode}`);
            await element.locator("#once").click();
            await element.locator("#once").click();
            await expect(element).toHaveJSProperty("onceCalls", 1);
        });

        test("passive listeners cannot prevent the default action", async ({ page }) => {
            const element = page.locator(`#${mode}`);
            const result = await element.locator("#passive").evaluate(node => {
                const event = new WheelEvent("wheel", {
                    bubbles: true,
                    cancelable: true,
                });
                node.dispatchEvent(event);
                return event.defaultPrevented;
            });
            await expect(element).toHaveJSProperty("passiveCalls", 1);
            expect(result).toBe(false);
        });

        test("combines capture, passive, and once", async ({ page }) => {
            const element = page.locator(`#${mode}`);
            const button = element.locator("#combined button");
            await button.dispatchEvent("pointerenter", { bubbles: false });
            await button.dispatchEvent("pointerenter", { bubbles: false });
            await expect(element).toHaveJSProperty("combinedCalls", 1);
            await expect(element).toHaveJSProperty("combinedPhase", 1);
        });

        test("preserves separate capture and bubble bindings on one element", async ({
            page,
        }) => {
            const element = page.locator(`#${mode}`);
            await element.locator("#phases button").click();
            await expect(element).toHaveJSProperty("phases", [1, 3]);
        });

        test("ordinary handlers still prevent the default action", async ({ page }) => {
            const element = page.locator(`#${mode}`);
            const prevented = await element.locator("#ordinary").evaluate(node => {
                const event = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                });
                node.dispatchEvent(event);
                return event.defaultPrevented;
            });
            expect(prevented).toBe(true);
            await expect(element).toHaveJSProperty("ordinaryCalls", 1);
        });

        test("removes capture listeners on disconnect and rebinds once listeners", async ({
            page,
        }) => {
            const element = page.locator(`#${mode}`);
            await element.locator("#once").click();
            await expect(element).toHaveJSProperty("onceCalls", 1);
            const removed = await element.evaluate((node: TestEventOptions) => {
                const target = node.shadowRoot!.querySelector("#capture")!;
                const remove = target.removeEventListener.bind(target);
                const removed: { type: string; capture: boolean }[] = [];
                target.removeEventListener = (type, listener, options) => {
                    removed.push({
                        type,
                        capture:
                            typeof options === "boolean" ? options : !!options?.capture,
                    });
                    remove(type, listener, options);
                };
                node.remove();
                target
                    .querySelector("button")!
                    .dispatchEvent(new PointerEvent("pointerenter"));
                document.body.appendChild(node);
                return removed;
            });
            expect(removed).toContainEqual({ type: "pointerenter", capture: true });
            await expect(element).toHaveJSProperty("captureCalls", 0);
            await element.locator("#once").click();
            await element.locator("#once").click();
            await expect(element).toHaveJSProperty("onceCalls", 2);
            await element
                .locator(".repeat-target")
                .dispatchEvent("pointerenter", { bubbles: false });
            await expect(element).toHaveJSProperty("captureCalls", 1);
        });
    });
}
