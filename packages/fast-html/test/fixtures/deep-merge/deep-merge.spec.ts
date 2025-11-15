import { expect, test } from "@playwright/test";

test.describe("Deep Merge Test Fixture", () => {
    test("should render initial state correctly", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");

        // Check stats
        await expect(page.locator(".stats")).toContainText("Total Orders: 3");
        await expect(page.locator(".stats")).toContainText("Total Revenue: $425.5");
        await expect(page.locator(".stats")).toContainText("Active Users: 2");

        // Check users count
        await expect(page.locator(".users h2")).toContainText("Users (2 total)");

        // Check first user details
        await expect(page.locator(".user-card").first()).toContainText("Alice Johnson (ID: 1)");
        await expect(page.locator(".user-card").first()).toContainText("alice@example.com");
        await expect(page.locator(".user-card").first()).toContainText("Age: 28");
        await expect(page.locator(".user-card").first()).toContainText("New York, USA");
        await expect(page.locator(".user-card").first()).toContainText("Theme: dark");
    });

    test("should update user profile via deepMerge", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        await page.click('button:has-text("Update User Profile")');

        // Check that nested properties were updated
        await expect(page.locator(".user-card").first()).toContainText("Age: 29");
        await expect(page.locator(".user-card").first()).toContainText("San Francisco, USA");
        await expect(page.locator(".user-card").first()).toContainText("Theme: light");

        // Verify country wasn't changed (partial merge)
        await expect(page.locator(".user-card").first()).toContainText("USA");
    });

    test("should replace orders array via deepMerge", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        // Initially has 2 orders
        await expect(page.locator(".user-card").first()).toContainText("Orders (2)");

        await page.click('button:has-text("Replace Orders")');

        // Now has 1 order with new content
        await expect(page.locator(".user-card").first()).toContainText("Orders (1)");
        await expect(page.locator(".user-card").first()).toContainText("Order #103");
        await expect(page.locator(".user-card").first()).toContainText("Monitor");
    });

    test("should remove array items via deepMerge", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        // First order initially has 2 items
        const firstOrder = page.locator(".order").first();
        const itemsCount = await firstOrder.locator(".item").count();
        expect(itemsCount).toBe(2);

        await page.click('button:has-text("Remove Order Items")');

        await page.waitForTimeout(100);

        // Now should have only 1 item
        const updatedItemsCount = await firstOrder.locator(".item").count();
        expect(updatedItemsCount).toBe(1);

        // Verify the remaining item is correct
        await expect(firstOrder).toContainText("Laptop");
        await expect(firstOrder).not.toContainText("Mouse");
    });

    test("should update nested array tags via deepMerge", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        const firstItem = page.locator(".item").first();

        // Check initial tags
        await expect(firstItem).toContainText("electronics");
        await expect(firstItem).toContainText("computers");

        await page.click('button:has-text("Update Product Tags")');


        // Check updated tags
        await expect(firstItem).toContainText("tech");
        await expect(firstItem).toContainText("premium");
        await expect(firstItem).toContainText("sale");
        await expect(firstItem).not.toContainText("electronics");

        // Check updated metadata
        await expect(firstItem).toContainText("Views: 300");
    });

    test("should add new user to array", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        await expect(page.locator(".users h2")).toContainText("Users (2 total)");

        await page.click('button:has-text("Add New User")');


        await expect(page.locator(".users h2")).toContainText("Users (3 total)");
        await expect(page.locator(".user-card").nth(2)).toContainText("Charlie Davis");
        await expect(page.locator(".user-card").nth(2)).toContainText("Tokyo, Japan");
    });

    test("should toggle conditional rendering", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        // Details should be visible initially
        await expect(page.locator(".profile").first()).toBeVisible();
        await expect(page.locator(".metadata").first()).toBeVisible();

        await page.click('button:has-text("Toggle Details")');


        // Details should be hidden
        await expect(page.locator(".profile").first()).not.toBeVisible();
        await expect(page.locator(".metadata").first()).not.toBeVisible();

        await page.click('button:has-text("Toggle Details")');


        // Details should be visible again
        await expect(page.locator(".profile").first()).toBeVisible();
        await expect(page.locator(".metadata").first()).toBeVisible();
    });

    test("should increment age directly", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        await expect(page.locator(".user-card").first()).toContainText("Age: 28");

        await page.click('button:has-text("Increment Age")');


        await expect(page.locator(".user-card").first()).toContainText("Age: 29");

        await page.click('button:has-text("Increment Age")');


        await expect(page.locator(".user-card").first()).toContainText("Age: 30");
    });

    test("should update stats via deepMerge", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        await expect(page.locator(".stats")).toContainText("Total Orders: 3");
        await expect(page.locator(".stats")).toContainText("Total Revenue: $425.5");

        await page.click('button:has-text("Update Stats")');


        await expect(page.locator(".stats")).toContainText("Total Orders: 4");
        await expect(page.locator(".stats")).toContainText("Total Revenue: $525.49");

        // activeUsers should remain unchanged
        await expect(page.locator(".stats")).toContainText("Active Users: 2");
    });

    test("should handle undefined values in deepMerge", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        await expect(page.locator(".user-card").first()).toContainText("Age: 28");
        await expect(page.locator(".user-card").first()).toContainText("New York");

        await page.click('button:has-text("Test Undefined Merge")');


        // Age should remain unchanged (undefined skipped)
        await expect(page.locator(".user-card").first()).toContainText("Age: 28");

        // City should be updated
        await expect(page.locator(".user-card").first()).toContainText("Boston");
    });

    test("should display nested repeats correctly", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        // Check nested structure: users -> orders -> items -> tags
        const firstUser = page.locator(".user-card").first();
        const firstOrder = firstUser.locator(".order").first();
        const firstItem = firstOrder.locator(".item").first();

        await expect(firstItem).toContainText("Laptop");

        const tags = firstItem.locator(".tag");
        const tagCount = await tags.count();
        expect(tagCount).toBe(2);

        await expect(tags.first()).toContainText("electronics");
    });

    test("should handle conditional with comparison operators", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        const secondUser = page.locator(".user-card").nth(1);

        // Bob has 1 order
        await expect(secondUser).toContainText("Orders (1)");

        // The "Orders (1)" heading should be visible (length > 0 condition)
        const ordersList = secondUser.locator(".order");
        await expect(ordersList).toBeVisible();
    });

    test("should display in-stock and out-of-stock items correctly", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        const items = page.locator(".item");

        // First two items should be in stock
        await expect(items.first()).toContainText("✓ In Stock");

        // After updating, second item should be out of stock
        await page.click('button:has-text("Update Product Tags")');


        await expect(items.nth(1)).toContainText("✗ Out of Stock");
    });

    test("should handle empty orders array", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        await page.click('button:has-text("Add New User")');


        const newUser = page.locator(".user-card").nth(2);
        await expect(newUser).toContainText("Charlie Davis");
        await expect(newUser).toContainText("No orders yet");
    });

    test("should preserve object identity for observable arrays when using deepMerge", async ({ page }) => {
        await page.goto("/fixtures/deep-merge/");
        // This test verifies that splice is used internally by checking
        // that updates work correctly multiple times (proving the array
        // reference is maintained)

        await page.click('button:has-text("Update Product Tags")');


        const firstItem = page.locator(".item").first();
        await expect(firstItem).toContainText("Views: 300");

        // Update again - if array identity wasn't preserved, this might fail
        await page.click('button:has-text("Update Product Tags")');


        // Should still work correctly
        await expect(firstItem).toContainText("Views: 300");
    });
});
