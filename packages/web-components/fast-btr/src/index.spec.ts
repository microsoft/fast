import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a binding", async ({ page }) => {
        await page.goto("/binding");

        const customElement = await page.locator("custom-element");

        await expect(await customElement.getAttribute("text")).toEqual("Hello world");
        await expect((await customElement.textContent()) || "".includes("Hello world")).toBeTruthy();

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("custom-element");
            customElement.item(0)?.setAttribute("text", "Hello pluto");
        });

        await expect(await customElement.getAttribute("text")).toEqual("Hello pluto");
        await expect((await customElement.textContent()) || "".includes("Hello pluto")).toBeTruthy();
    });
});
