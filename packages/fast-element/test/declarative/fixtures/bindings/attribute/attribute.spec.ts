import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("omits nullable attributes before any client JavaScript runs", async ({
        browser,
        baseURL,
    }) => {
        const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
        try {
            const page = await context.newPage();
            await page.goto("/fixtures/bindings/attribute/");
            const element = page.locator("test-element-nullable");
            for (const attribute of ["href", "role", "tabindex"]) {
                await expect(element.locator("#nullable-link")).not.toHaveAttribute(
                    attribute,
                );
            }
            await expect(element.locator("#empty-link")).toHaveAttribute("href", "");
            await expect(element.locator("#nullable-input")).not.toHaveAttribute(
                "disabled",
            );
            await expect(element.locator("#nullable-input")).not.toHaveAttribute("value");
        } finally {
            await context.close();
        }
    });
    test("hydrates omitted binding slots and updates nullable attributes", async ({
        page,
    }) => {
        await page.goto("/fixtures/bindings/attribute/");
        await page.waitForFunction(
            () =>
                (window as Window & { hydrationCompleted?: boolean }).hydrationCompleted,
        );
        const element = page.locator("test-element-nullable");
        await expect(element.locator("#nullable-link")).not.toHaveAttribute("href");
        await page.evaluate(() => {
            const element = document.querySelector<
                HTMLElement & {
                    nullableHref: string | null;
                    missingRole: string | undefined;
                    nullableTabIndex: number | null;
                    isDisabled: boolean;
                    nullableValue: string | null;
                }
            >("test-element-nullable");
            if (!element) throw new Error("Missing nullable fixture element");
            element.nullableHref = "";
            element.missingRole = "button";
            element.nullableTabIndex = 0;
            element.isDisabled = true;
            element.nullableValue = "ready";
        });
        await expect(element.locator("#nullable-link")).toHaveAttribute("href", "");
        await expect(element.locator("#nullable-link")).toHaveAttribute("role", "button");
        await expect(element.locator("#nullable-link")).toHaveAttribute("tabindex", "0");
        await expect(element.locator("#nullable-input")).toHaveAttribute("disabled");
        await expect(element.locator("#nullable-input")).toHaveAttribute(
            "value",
            "ready",
        );
    });
    test("create a non-binding attribute", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/attribute/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");
        const customElementInput = customElement.locator("input");
        await expect(customElementInput).toHaveAttribute("disabled");
    });
    test("create an attribute binding", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/attribute/");
        await hydrationCompleted;

        const customElement = page.locator("test-element");

        await expect(customElement).toHaveAttribute("type", "checkbox");
        await expect(customElement.locator("input[type='checkbox']")).toHaveCount(1);

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element");
            customElement.item(0)?.setAttribute("type", "radio");
        });

        await expect(customElement).toHaveAttribute("type", "radio");
        await expect(customElement.locator("input[type='radio']")).toHaveCount(1);
    });
    test("create a property to attribute binding", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/attribute/");
        await hydrationCompleted;

        const customElement = page.locator("test-element-property");

        await expect(customElement.locator("input[disabled]")).toHaveCount(1);

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName("test-element-property");
            (customElement.item(0) as any)!.isEnabled = true;
        });

        await expect(customElement.locator("input[disabled]")).toHaveCount(0);
    });
    test("create an attribute binding with an expression", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/bindings/attribute/");
        await hydrationCompleted;

        const customElement = await page.locator("test-element-expression");
        const customElementInput = await customElement.locator("input");

        await expect(customElementInput).toHaveAttribute("disabled");

        await page.evaluate(() => {
            const customElement = document.getElementsByTagName(
                "test-element-expression",
            );
            customElement.item(0)?.setAttribute("active-group", "home");
        });

        await expect(customElementInput).not.toHaveAttribute("disabled");
    });
});
