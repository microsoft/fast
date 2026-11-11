import { expect, test } from "@playwright/test";

test("restores default-slot fallback when conditional light DOM is absent", async ({
    page,
}) => {
    await page.goto("/fixtures/directives/slot-fallback/");
    await page.waitForFunction(() => (window as any).hydrationCompleted === true);
    const hidden = page.locator("#slot-hidden");
    const shown = page.locator("#slot-shown");
    await expect(hidden.locator(".fallback")).toBeVisible();
    await expect(shown.locator(".fallback")).toBeHidden();

    await hidden.evaluate(element => element.setAttribute("show", ""));
    await shown.evaluate(element => element.removeAttribute("show"));
    await expect(hidden.locator(".fallback")).toBeHidden();
    await expect(shown.locator(".fallback")).toBeVisible();

    await hidden.evaluate(element => element.removeAttribute("show"));
    await shown.evaluate(element => element.setAttribute("show", ""));
    await expect(hidden.locator(".fallback")).toBeVisible();
    await expect(shown.locator(".fallback")).toBeHidden();
});
