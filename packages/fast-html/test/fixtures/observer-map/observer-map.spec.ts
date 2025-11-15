import { test, expect } from "@playwright/test";

test.describe("ObserverMap", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/fixtures/observer-map/");
        await page.waitForSelector("observer-map-test-element");
    });

    test("should render initial users with deeply nested properties", async ({ page }) => {
        // Check that initial users are rendered
        await expect(page.locator(".user-card")).toHaveCount(2);

        // Check deeply nested properties are displayed
        await expect(page.locator("text=Alice Johnson")).toHaveCount(3);
        await expect(page.locator("text=Bob Smith")).toHaveCount(2);

        // Check nested location data
        await expect(page.locator("text=New York, USA")).toBeVisible();
        await expect(page.locator("text=London, UK")).toBeVisible();

        // Check deeply nested preferences
        await expect(page.locator("text=Theme: dark")).toBeVisible();
        await expect(page.locator("text=Theme: light")).toBeVisible();
    });

    test("should update deeply nested age property", async ({ page }) => {
        // Initial age should be 28 for Alice
        await expect(page.locator("text=Age: 28 years old")).toBeVisible();

        // Click the age increment button for Alice (user ID 1)
        await page.locator("button:has-text('Age +1')").first().click();

        // Age should now be 29
        await expect(page.locator("text=Age: 29 years old")).toBeVisible();
        await expect(page.locator("text=Age: 28 years old")).not.toBeVisible();
    });

    test("should toggle theme in deeply nested preferences", async ({ page }) => {
        // Initial theme should be dark for Alice
        await expect(page.locator("text=Theme: dark").first()).toBeVisible();

        // Click the toggle theme button for Alice
        await page.locator("button:has-text('Toggle Theme')").first().click();

        // Theme should now be light
        await expect(page.locator("text=Theme: light").first()).toBeVisible();
    });

    test("should update location", async ({ page }) => {
        // Initial location should be New York, USA
        await expect(page.locator("text=New York, USA")).toBeVisible();

        // Click the change location button for Alice
        await page.locator("button:has-text('Change Location')").first().click();

        // Location should now be Tokyo, Japan
        await expect(page.locator("text=Tokyo, Japan")).toBeVisible();
        await expect(page.locator("text=New York, USA")).not.toBeVisible();
    });

    test("should update notification settings", async ({ page }) => {
        // Check initial notification settings for Alice
        await expect(page.locator("text=Email Notifications: true").first()).toBeVisible();
        await expect(page.locator("text=Push Notifications: false").first()).toBeVisible();
        await expect(page.locator("text=Notification Frequency: daily").first()).toBeVisible();

        // Click update notifications button
        await page.locator("button:has-text('Update Notifications')").first().click();

        // Settings should be toggled
        await expect(page.locator("text=Email Notifications: false").first()).toBeVisible();
        await expect(page.locator("text=Push Notifications: true").first()).toBeVisible();
        await expect(page.locator("text=Notification Frequency: weekly").first()).toBeVisible();
    });

    test("should add and remove categories in deeply nested arrays", async ({ page }) => {
        // Check initial categories for Alice (should include "tech")
        await expect(page.locator(".tag:has-text('tech')")).toHaveCount(2);

        // Add sports category
        await page.locator("button:has-text('Add Category')").first().click();
        await expect(page.locator(".tag:has-text('sports')").first()).toBeVisible();

        // Remove tech category
        await page.locator("button:has-text('Remove Tech Category')").first().click();
        await expect(page.locator(".tag:has-text('tech')")).toHaveCount(1);
    });

    test("should increment post likes and update nested metadata", async ({ page }) => {
        const aliceCard = page.locator(".user-card").first();
        const firstPost = aliceCard.locator(".post-card").first();

        // Check initial likes (should be 25)
        await expect(firstPost.locator("text=25 likes")).toBeVisible();

        // Click like button
        await firstPost.locator("button:has-text('Like Post')").click();

        // Likes should increment to 26
        await expect(firstPost.locator("text=26 likes")).toBeVisible();

        // Views should also increment (random amount)
        await expect(firstPost.locator("text=views")).toBeVisible();
    });

    test("should add new posts to users", async ({ page }) => {
        const aliceCard = page.locator(".user-card").first();

        // Initial post count should be 2
        await expect(aliceCard.locator(".post-card")).toHaveCount(2);

        // Add new post
        await aliceCard.locator("button:has-text('Add New Post')").click();

        // Should now have 3 posts
        await expect(aliceCard.locator(".post-card")).toHaveCount(3);
    });

    test("should update the likes on a new post", async ({ page }) => {
        const aliceCard = page.locator(".user-card").first();

        // Add new post first
        await aliceCard.locator("button:has-text('Add New Post')").click();

        // Should now have 3 posts
        await expect(aliceCard.locator(".post-card")).toHaveCount(3);

        // Get the newly added post (should be the last one)
        const newPost = aliceCard.locator(".post-card").nth(2);

        // Check initial likes on the new post (should be 0)
        await expect(newPost.locator("text=0 likes")).toBeVisible();

        // Click like button on the new post
        await newPost.locator("button:has-text('Like Post')").click();

        // Likes should increment to 1
        await expect(newPost.locator("text=1 likes")).toBeVisible();
        await expect(newPost.locator("text=0 likes")).not.toBeVisible();
    });

    test("should add and remove users from the array", async ({ page }) => {
        // Initial user count should be 2
        await expect(page.locator(".user-card")).toHaveCount(2);
        await expect(page.locator("text=Total Users: 2")).toBeVisible();

        // Add new user
        await page.locator("button:has-text('Add New User')").click();

        // Should now have 3 users
        await expect(page.locator(".user-card")).toHaveCount(3);
        await expect(page.locator("text=Total Users: 3")).toBeVisible();
        await expect(page.locator("text=User 3")).toBeVisible();

        // Remove a user (Alice - first remove button)
        await page.locator("button:has-text('Remove User')").first().click();

        // Should be back to 2 users
        await expect(page.locator(".user-card")).toHaveCount(2);
        await expect(page.locator("text=Total Users: 2")).toBeVisible();
    });

    test("should be able to update nested properties on added users", async ({ page }) => {
        // Initial user count should be 2
        await expect(page.locator(".user-card")).toHaveCount(2);

        // Add new user
        await page.locator("button:has-text('Add New User')").click();

        // Should now have 3 users
        await expect(page.locator(".user-card")).toHaveCount(3);

        const userCard3 = await page.locator(".user-card").nth(2);

        // Initial theme should be dark for User 3
        await expect(userCard3.locator("text=Theme: dark")).toBeVisible();

        // Click the toggle theme button for User 3
        await userCard3.locator("button:has-text('Toggle Theme')").click();

        // Theme should now be light
        await expect(userCard3.locator("text=Theme: light")).toBeVisible();
    });

    test("should be able to update nested properties on added users after the items array has been emptied", async ({ page }) => {
        // Initial item count should be 1
        await expect(page.locator(".item")).toHaveCount(1);

        // Remove item
        await page.locator("button:has-text('Remove all items')").click();

        // Should now have 0 items
        await expect(page.locator(".item")).toHaveCount(0);

        // Click the add item button
        await page.locator("button:has-text('Add an item')").click();

        // There should now be 1 item
        await expect(page.locator(".item")).toHaveCount(1);

        // Click the update item button
        await page.locator("button:has-text('Update an item')").click();

        // The item should have updated text
        await expect(page.locator(".item")).toHaveText('item C')
    });

    test("should be able to update nested properties on added users after the group array has been emptied", async ({ page }) => {
        // Initial item count should be 1
        await expect(page.locator(".item")).toHaveCount(1);

        // Remove groups
        await page.locator("button:has-text('Remove groups')").click();

        // Should now have 0 items
        await expect(page.locator(".item")).toHaveCount(0);

        // Click the add group button
        await page.locator("button:has-text('Add group')").click();

        // There should now be 1 item
        await expect(page.locator(".item")).toHaveCount(1);

        // Click the update item button
        await page.locator("button:has-text('Update an item')").click();

        // The item should have updated text
        await expect(page.locator(".item")).toHaveText('item C');

        // Click the update action label
        await page.locator("button:has-text('Update an action label')").click();

        // The action label should have updated text
        await expect(page.locator(".action-label")).toHaveText('action label B');
    });

    test("should update global stats with nested metrics", async ({ page }) => {
        // Check initial engagement stats
        const initialDaily = await page.locator(".stats .nested-info").nth(1).textContent();

        // Update stats
        await page.locator(".stats .controls button").nth(0).click();

        await page.evaluate(() => {
            return new Promise((resolve) => {
                requestAnimationFrame(() => resolve(true));
            });
        });

        // Stats should be updated (values should change)
        const updatedDaily = await page.locator(".stats .nested-info").nth(1).textContent();

        expect(updatedDaily).not.toBe(initialDaily);
    });

    test("should handle user selection with conditional rendering", async ({ page }) => {
        // Initially, Alice (ID 1) should be selected
        await expect(page.locator("text=⭐ SELECTED").first()).toBeVisible();

        // Select Bob (user ID 2)
        await page.locator(".user-card").nth(1).locator("button:has-text('Select User')").click();

        // Bob should now show as selected
        const bobCard = page.locator(".user-card").nth(1);
        await expect(bobCard.locator("text=⭐ SELECTED")).toBeVisible();

        // Alice should no longer show as selected
        const aliceCard = page.locator(".user-card").first();
        await expect(aliceCard.locator("text=⭐ SELECTED")).not.toBeVisible();
    });

    test("should update a defined object when a nested property has been defined", async ({ page }) => {
        const undefinedText = await page.locator(".nested-define").textContent();

        await expect(undefinedText).toEqual("");

        // Define the object
        await page.locator("button:has-text('Define B')").nth(0).click();

        await page.evaluate(() => {
            return new Promise((resolve) => {
                requestAnimationFrame(() => resolve(true));
            });
        });

        const definedText = await page.locator(".nested-define").textContent();

        await expect(definedText).toEqual("Hello world");
    });

    test("should update a defined object when a nested property has been updated", async ({ page }) => {
        // Define the object
        await page.locator("button:has-text('Define B')").nth(0).click();

        // Update the object
        await page.locator("button:has-text('Update C')").nth(0).click();

        await page.evaluate(() => {
            return new Promise((resolve) => {
                requestAnimationFrame(() => resolve(true));
            });
        });

        const updatedText = await page.locator(".nested-define").textContent();

        await expect(updatedText).toEqual("Hello pluto");
    });

    test("should update an undefined object when a nested property has been defined", async ({ page }) => {
        const undefinedText = await page.locator(".nested-define-2");

        await expect(undefinedText).toHaveCount(0);

        // Define the object
        await page.locator("button:has-text('Define Y')").nth(0).click();

        await page.evaluate(() => {
            return new Promise((resolve) => {
                requestAnimationFrame(() => resolve(true));
            });
        });

        const definedText = await page.locator(".nested-define-2").textContent();

        await expect(definedText).toEqual("Z1");
    });

    test("should update an undefined object when a nested property has been updated", async ({ page }) => {
        // Define the object
        await page.locator("button:has-text('Define Y')").nth(0).click();

        // Update the object
        await page.locator("button:has-text('Update Z')").nth(0).click();

        await page.evaluate(() => {
            return new Promise((resolve) => {
                requestAnimationFrame(() => resolve(true));
            });
        });

        const updatedText = await page.locator(".nested-define-2").textContent();

        await expect(updatedText).toEqual("Z2");
    });
});
