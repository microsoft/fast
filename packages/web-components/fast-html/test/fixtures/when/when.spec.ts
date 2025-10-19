import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a when directive for a boolean: true", async ({ page }) => {
        await page.goto("/fixtures/when/");

        const customElementShow = await page.locator("#show");
        const customElementHide = await page.locator("#hide");

        await expect(customElementShow).toHaveText("Hello world");
        await expect(customElementHide).not.toHaveText("Hello world");

        await page.evaluate(() => {
            const customElementShow = document.getElementById("show");
            const customElementHide = document.getElementById("hide");
            customElementShow?.removeAttribute("show");
            customElementHide?.setAttribute("show", "");
        });

        await expect(customElementShow).not.toHaveText("Hello world");
        await expect(customElementHide).toHaveText("Hello world");
    });
    test("create a when directive for a boolean: false", async ({ page }) => {
        await page.goto("/fixtures/when/");

        const customElementShow = await page.locator("#show-not");
        const customElementHide = await page.locator("#hide-not");

        await expect(customElementShow).toHaveText("Hello world");
        await expect(customElementHide).not.toHaveText("Hello world");
    });
    test("create a when directive value uses equals", async ({ page }) => {
        await page.goto("/fixtures/when/");

        const customElementShow = await page.locator("#equals-true");
        const customElementHide = await page.locator("#equals-false");

        await expect(customElementShow).toHaveText("Equals 3");
        await expect(customElementHide).not.toHaveText("Equals 3");
    });
    test("create a when directive value uses not equals", async ({ page }) => {
        await page.goto("/fixtures/when/");

        const customElementShow = await page.locator("#not-equals-true");
        const customElementHide = await page.locator("#not-equals-false");

        await expect(customElementShow).toHaveText("Not equals 3");
        await expect(customElementHide).not.toHaveText("Not equals 3");
    });
    test("create a when directive value uses greater than or equals", async ({ page }) => {
        await page.goto("/fixtures/when/");

        const customElementShow = await page.locator("#ge-true");
        const customElementHide = await page.locator("#ge-false");

        await expect(customElementShow).toHaveText("Two and Over");
        await expect(customElementHide).not.toHaveText("Two and Over");
    });
    test("create a when directive value uses greater than", async ({ page }) => {
        await page.goto("/fixtures/when/");

        const customElementShow = await page.locator("#gt-true");
        const customElementHide = await page.locator("#gt-false");

        await expect(customElementShow).toHaveText("Over two");
        await expect(customElementHide).not.toHaveText("Over two");
    });
    test("create a when directive value uses less than or equals", async ({ page }) => {
        await page.goto("/fixtures/when/");

        const customElementShow = await page.locator("#le-true");
        const customElementHide = await page.locator("#le-false");

        await expect(customElementShow).toHaveText("Two and Under");
        await expect(customElementHide).not.toHaveText("Two and Under");
    });
    test("create a when directive value uses less than", async ({ page }) => {
        await page.goto("/fixtures/when/");

        const customElementShow = await page.locator("#lt-true");
        const customElementHide = await page.locator("#lt-false");

        await expect(customElementShow).toHaveText("Under two");
        await expect(customElementHide).not.toHaveText("Under two");
    });
    test("create a when directive value uses or", async ({ page }) => {
        await page.goto("/fixtures/when/");

        const customElementShow = await page.locator("#or-true");
        const customElementHide = await page.locator("#or-false");

        await expect(customElementShow).toHaveText("This or That");
        await expect(customElementHide).not.toHaveText("This or That");
    });
    test("create a when directive value uses and", async ({ page }) => {
        await page.goto("/fixtures/when/");

        const customElementShow = await page.locator("#and-true");
        const customElementHide = await page.locator("#and-false");

        await expect(customElementShow).toHaveText("This and That");
        await expect(customElementHide).not.toHaveText("This and That");
    });
});
