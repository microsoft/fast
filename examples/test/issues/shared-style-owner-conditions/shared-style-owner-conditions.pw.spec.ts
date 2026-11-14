import { expect, test } from "@playwright/test";

const sharedBackground = "rgb(17, 93, 157)";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("styles the overflow menu when it is the only enabled feature", async ({ page }) => {
    await page.getByLabel("Show overflow menu").check();

    const menu = page.getByRole("button", { name: "Overflow menu", exact: true });
    await expect(menu).toBeVisible();
    await expect(menu).toHaveCSS("background-color", sharedBackground);
});

test("keeps the overflow menu styled when the action buttons are disabled", async ({
    page,
}) => {
    const actionsToggle = page.getByLabel("Show action buttons");
    const menuToggle = page.getByLabel("Show overflow menu");
    const actions = page.getByRole("button", { name: "Action buttons", exact: true });
    const menu = page.getByRole("button", { name: "Overflow menu", exact: true });

    await actionsToggle.check();
    await expect(actions).toBeVisible();
    await expect(actions).toHaveCSS("background-color", sharedBackground);

    await menuToggle.check();
    await expect(menu).toBeVisible();
    await expect(menu).toHaveCSS("background-color", sharedBackground);

    await actionsToggle.uncheck();
    await expect(actions).toBeHidden();
    await expect(menuToggle).toBeChecked();
    await expect(menu).toBeVisible();
    await expect(menu).toHaveCSS("background-color", sharedBackground);
});
