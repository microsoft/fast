import { expect, test } from "@playwright/test";

test.describe("f-template", async () => {
    test("create a when directive for a boolean: true", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;

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
    test("create a when directive for multiple string cases", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;

        const customElementWorld = await page.locator("#multiple1");
        const customElementPluto = await page.locator("#multiple2");
        const customElementMars = await page.locator("#multiple3");

        await expect(customElementWorld).toHaveText("Hello world");
        await expect(customElementWorld).not.toHaveText("Hello pluto");
        await expect(customElementWorld).not.toHaveText("Hello mars");

        await expect(customElementPluto).not.toHaveText("Hello world");
        await expect(customElementPluto).toHaveText("Hello pluto");
        await expect(customElementPluto).not.toHaveText("Hello mars");

        await expect(customElementMars).not.toHaveText("Hello world");
        await expect(customElementMars).not.toHaveText("Hello pluto");
        await expect(customElementMars).toHaveText("Hello mars");

        await page.evaluate(() => {
            const customElementPluto = document.getElementById("multiple2");
            customElementPluto?.setAttribute("planet", "mars");
        });

        await expect(customElementPluto).not.toHaveText("Hello world");
        await expect(customElementPluto).not.toHaveText("Hello pluto");
        await expect(customElementPluto).toHaveText("Hello mars");
    });
    test("create a when directive for a boolean: false", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;

        const customElementShow = await page.locator("#show-not");
        const customElementHide = await page.locator("#hide-not");

        await expect(customElementShow).toHaveText("Hello world");
        await expect(customElementHide).not.toHaveText("Hello world");
    });
    test("create a when directive value uses equals", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;

        const customElementShow = await page.locator("#equals-true");
        const customElementHide = await page.locator("#equals-false");

        await expect(customElementShow).toHaveText("Equals 3");
        await expect(customElementHide).not.toHaveText("Equals 3");
    });
    test("create a when directive value uses not equals", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;

        const customElementShow = await page.locator("#not-equals-true");
        const customElementHide = await page.locator("#not-equals-false");

        await expect(customElementShow).toHaveText("Not equals 3");
        await expect(customElementHide).not.toHaveText("Not equals 3");
    });
    test("create a when directive value uses greater than or equals", async ({
        page,
    }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;

        const customElementShow = await page.locator("#ge-true");
        const customElementHide = await page.locator("#ge-false");

        await expect(customElementShow).toHaveText("Two and Over");
        await expect(customElementHide).not.toHaveText("Two and Over");
    });
    test("create a when directive value uses greater than", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;

        const customElementShow = await page.locator("#gt-true");
        const customElementHide = await page.locator("#gt-false");

        await expect(customElementShow).toHaveText("Over two");
        await expect(customElementHide).not.toHaveText("Over two");
    });
    test("create a when directive value uses less than or equals", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;

        const customElementShow = await page.locator("#le-true");
        const customElementHide = await page.locator("#le-false");

        await expect(customElementShow).toHaveText("Two and Under");
        await expect(customElementHide).not.toHaveText("Two and Under");
    });
    test("create a when directive value uses less than", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;

        const customElementShow = await page.locator("#lt-true");
        const customElementHide = await page.locator("#lt-false");

        await expect(customElementShow).toHaveText("Under two");
        await expect(customElementHide).not.toHaveText("Under two");
    });
    test("create a when directive value uses or", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;

        const customElementShow = await page.locator("#or-true");
        const customElementHide = await page.locator("#or-false");

        await expect(customElementShow).toHaveText("This or That");
        await expect(customElementHide).not.toHaveText("This or That");
    });
    test("create a when directive value uses and", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;

        const customElementShow = await page.locator("#and-true");
        const customElementHide = await page.locator("#and-false");

        await expect(customElementShow).toHaveText("This and That");
        await expect(customElementHide).not.toHaveText("This and That");
    });

    test("when false with repeat: initially hidden, shows items when toggled to true, and items can be updated", async ({
        page,
    }) => {
        await page.goto("/fixtures/directives/when/");
        const element = page.locator("#when-false-repeat");
        const listItems = element.locator("li");

        // Initially the when condition is false, so no list items should be visible
        await expect(listItems).toHaveCount(0);
        await expect(element.locator("ul")).toHaveCount(0);

        // Flip the when condition to true
        await page.evaluate(() => {
            document.getElementById("when-false-repeat")?.setAttribute("show", "");
        });

        // Now the repeated items should be visible
        await expect(listItems).toHaveCount(3);
        await expect(listItems).toContainText(["Alpha", "Beta", "Gamma"]);

        // Update the list to verify repeat reactivity inside when
        await page.evaluate(() => {
            (document.getElementById("when-false-repeat") as any).list = ["One", "Two"];
        });

        await expect(listItems).toHaveCount(2);
        await expect(listItems).toContainText(["One", "Two"]);

        // Toggle when back to false
        await page.evaluate(() => {
            document.getElementById("when-false-repeat")?.removeAttribute("show");
        });

        await expect(listItems).toHaveCount(0);

        // Toggle when back to true again to verify items persist
        await page.evaluate(() => {
            document.getElementById("when-false-repeat")?.setAttribute("show", "");
        });

        await expect(listItems).toHaveCount(2);
        await expect(listItems).toContainText(["One", "Two"]);
    });

    test("should fire events inside a when directive", async ({ page }) => {
        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/directives/when/");
        await hydrationCompleted;
        const element = page.locator("#event-show");
        const button = element.locator("button");

        // Click pre-hydrated button
        await button.click();
        await expect(element).toHaveJSProperty("clickCount", 1);

        // Remove the when condition
        await page.evaluate(() => {
            document.getElementById("event-show")?.removeAttribute("show");
        });
        await expect(button).toHaveCount(0);

        // Re-add the when condition
        await page.evaluate(() => {
            document.getElementById("event-show")?.setAttribute("show", "");
        });
        await expect(button).toHaveCount(1);

        // Click re-added button
        await button.click();
        await expect(element).toHaveJSProperty("clickCount", 2);
    });

    test.describe("nested-when", () => {
        test("initial state shows progress and hides error/button/retry", async ({
            page,
        }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/directives/when/");
            await hydrationCompleted;
            const element = page.locator("#nested-when");

            await expect(element.locator("progress")).toBeVisible();
            await expect(element.locator(".error")).toHaveCount(0);
            await expect(element.locator("button")).toHaveCount(0);
        });

        test("error state shows error div and retry button, hides progress", async ({
            page,
        }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/directives/when/");
            await hydrationCompleted;
            const element = page.locator("#nested-when");

            await expect(element.locator("progress")).toBeVisible();
            await expect(element).not.toHaveAttribute("needs-hydration");

            await page.evaluate(() => {
                (document.getElementById("nested-when") as any).error = true;
            });

            await expect(element.locator(".error")).toBeVisible();
            await expect(element.locator(".error")).toHaveText("Error occurred");
            await expect(element.locator("button")).toHaveText("Retry");
            await expect(element.locator("progress")).toHaveCount(0);

            await page.evaluate(() => {
                (document.getElementById("nested-when") as any).showProgress = false;
            });

            await expect(element.locator(".error")).toBeVisible();
            await expect(element.locator("progress")).toHaveCount(0);

            await page.evaluate(() => {
                (document.getElementById("nested-when") as any).enableContinue = true;
            });

            await expect(element.locator(".error")).toBeVisible();

            await page.evaluate(() => {
                (document.getElementById("nested-when") as any).error = false;
            });

            const button = element.locator("button");
            await expect(button).toBeVisible();
            await expect(button).toHaveText("Continue");
            await expect(button).not.toBeDisabled();
            await button.click();
            await expect(element).toHaveJSProperty("clickCount", 1);

            await page.evaluate(() => {
                (document.getElementById("nested-when") as any).enableContinue = false;
            });
            await expect(button).toBeDisabled();
        });

        test("showProgress false shows continue button without disabled", async ({
            page,
        }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/directives/when/");
            await hydrationCompleted;
            const element = page.locator("#nested-when");

            await expect(element.locator("progress")).toBeVisible();
            await expect(element).not.toHaveAttribute("needs-hydration");

            await page.evaluate(() => {
                (document.getElementById("nested-when") as any).showProgress = false;
            });

            const button = element.locator("button");
            await expect(button).toBeVisible();
            await expect(button).toHaveText("Continue");
            await expect(button).toBeDisabled();
            await expect(element.locator("progress")).toHaveCount(0);
        });

        test("toggling showProgress switches between progress and button", async ({
            page,
        }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/directives/when/");
            await hydrationCompleted;
            const element = page.locator("#nested-when");

            await expect(element.locator("progress")).toBeVisible();
            await expect(element.locator("button")).toHaveCount(0);

            await page.evaluate(() => {
                (document.getElementById("nested-when") as any).showProgress = false;
            });

            await expect(element.locator("progress")).toHaveCount(0);
            await expect(element.locator("button")).toBeVisible();

            await page.evaluate(() => {
                (document.getElementById("nested-when") as any).showProgress = true;
            });

            await expect(element.locator("progress")).toBeVisible();
            await expect(element.locator("button")).toHaveCount(0);
        });

        test("toggling error switches between error/retry and normal state", async ({
            page,
        }) => {
            const hydrationCompleted = page.waitForFunction(
                () => (window as any).hydrationCompleted === true,
            );
            await page.goto("/fixtures/directives/when/");
            await hydrationCompleted;
            const element = page.locator("#nested-when");

            await expect(element.locator(".error")).toHaveCount(0);
            await expect(element.locator("progress")).toBeVisible();

            await page.evaluate(() => {
                (document.getElementById("nested-when") as any).error = true;
            });

            await expect(element.locator(".error")).toBeVisible();
            await expect(element.locator("progress")).toHaveCount(0);
            await expect(element.locator("button")).toHaveText("Retry");

            await page.evaluate(() => {
                (document.getElementById("nested-when") as any).error = false;
            });

            await expect(element.locator(".error")).toHaveCount(0);
            await expect(element.locator("progress")).toBeVisible();
            await expect(element.locator("button")).toHaveCount(0);
        });
    });
});
