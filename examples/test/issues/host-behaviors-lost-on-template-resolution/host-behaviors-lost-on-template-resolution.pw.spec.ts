import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("retains host behaviors when the template was supplied before registration", async ({
    page,
}) => {
    await expect(page.locator("#ready-connected")).toHaveText("1");
    await expect(page.locator("#ready-host").getByText("Template ready")).toBeVisible();

    await page.getByRole("button", { name: "Detach ready component" }).click();
    await expect(page.locator("#ready-disconnected")).toHaveText("1");

    await page.getByRole("button", { name: "Reconnect ready component" }).click();
    await expect(page.locator("#ready-connected")).toHaveText("2");
});

test("disconnects constructor host behaviors after the pending template resolves", async ({
    page,
}) => {
    await expect(page.locator("#pending-connected")).toHaveText("1");
    await page.getByRole("button", { name: "Resolve pending template" }).click();
    await expect(page.locator("#pending-host").getByText("Template ready")).toBeVisible();
    const disconnected = page.locator("#pending-disconnected");
    const beforeDetach = Number(await disconnected.textContent());

    await page.getByRole("button", { name: "Detach pending component" }).click();
    await expect(disconnected).toHaveText(String(beforeDetach + 1));
});

test("reconnects constructor host behaviors after the pending template resolves", async ({
    page,
}) => {
    await expect(page.locator("#pending-connected")).toHaveText("1");
    await page.getByRole("button", { name: "Resolve pending template" }).click();
    await expect(page.locator("#pending-host").getByText("Template ready")).toBeVisible();
    const connected = page.locator("#pending-connected");
    const beforeReconnect = Number(await connected.textContent());

    await page.getByRole("button", { name: "Detach pending component" }).click();
    await page.getByRole("button", { name: "Reconnect pending component" }).click();
    await expect(page.locator("#pending-host").getByText("Template ready")).toBeVisible();
    await expect(connected).toHaveText(String(beforeReconnect + 1));
});
