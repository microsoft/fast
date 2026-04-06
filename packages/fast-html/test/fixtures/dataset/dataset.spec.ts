import { expect, test } from "@playwright/test";

test.describe("f-template dataset binding", async () => {
    test("should display initial dataset property value from pre-rendered content", async ({
        page,
    }) => {
        await page.goto("/fixtures/dataset/");

        const customElement = page.locator("test-element");

        await expect(customElement.locator("span")).toHaveText("1990-01-01");
    });

    test("should update binding when dateOfBirth property changes", async ({ page }) => {
        await page.goto("/fixtures/dataset/");

        const customElement = page.locator("test-element");

        await expect(customElement.locator("span")).toHaveText("1990-01-01");

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName(
                "test-element",
            ) as HTMLCollectionOf<Element & { dateOfBirth: string }>;
            customElement.item(0)!.dateOfBirth = "2000-05-15";
        });

        await expect(customElement.locator("span")).toHaveText("2000-05-15");
    });

    test("should update binding when data-date-of-birth attribute is set directly", async ({
        page,
    }) => {
        await page.goto("/fixtures/dataset/");

        const customElement = page.locator("test-element");

        await page.evaluate(() => {
            document
                .getElementsByTagName("test-element")
                .item(0)
                ?.setAttribute("data-date-of-birth", "1985-12-25");
        });

        await expect(customElement.locator("span")).toHaveText("1985-12-25");
    });
});
