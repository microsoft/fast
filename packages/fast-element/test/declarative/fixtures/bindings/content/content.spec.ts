import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a binding", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/content/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");

        await expect(await customElement.getAttribute("text")).toEqual("Hello world");
        await expect(customElement).toHaveText("Hello world");

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");
            customElement.item(0)?.setAttribute("text", "Hello pluto");
        });

        await expect(await customElement.getAttribute("text")).toEqual("Hello pluto");
        await expect(customElement).toHaveText("Hello pluto");
    });
    test("create an unescaped binding", async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", error => errors.push(error.message));
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/content/");
        await hydrationCompleted;

        const customElement = page.locator("test-element-unescaped");

        expect(await customElement.locator("p").count()).toEqual(1);
        await expect(customElement).toHaveText("Hello world");

        await page.evaluate(() => {
            document.body.append(document.createElement("test-element-unescaped"));
        });
        const clientElement = page.locator("test-element-unescaped").nth(1);
        await expect(clientElement.locator("p")).toHaveCount(1);
        await expect(clientElement).toHaveText("Hello world");
        expect(errors).toEqual([]);
    });
});
