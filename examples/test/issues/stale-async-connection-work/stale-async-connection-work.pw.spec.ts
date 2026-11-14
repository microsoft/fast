import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Mount same element" })).toBeEnabled();
    await expect(page.getByLabel("Connection", { exact: true })).toHaveText(
        "disconnected",
    );
    await expect(page.getByLabel("Requests started")).toHaveText("0");
});

test("same-connection work completes correctly", async ({ page }) => {
    await page.getByRole("button", { name: "Mount same element" }).click();
    await expect(page.getByLabel("Requests started")).toHaveText("1");
    await expect(page.getByLabel("Connection", { exact: true })).toHaveText("connected");
    await page.getByRole("button", { name: "Resolve request 1" }).click();
    await expect(page.getByLabel("Request 1 status")).toHaveText(
        "applied while connected",
    );
    await expect(page.getByLabel("Value", { exact: true })).toHaveText(
        "Old connection result",
    );
});

test("work resolved while disconnected is ignored", async ({ page }) => {
    await page.getByRole("button", { name: "Mount same element" }).click();
    await expect(page.getByLabel("Request 1 status")).toHaveText("pending");
    await page.getByRole("button", { name: "Detach element" }).click();
    await expect(page.getByLabel("Connection", { exact: true })).toHaveText(
        "disconnected",
    );
    await expect(page.locator("stale-async-connection-work")).toHaveCount(0);
    await page.getByRole("button", { name: "Resolve request 1" }).click();
    await expect(page.getByLabel("Request 1 status")).toHaveText(
        "ignored while disconnected",
    );
    await page.getByRole("button", { name: "Mount same element" }).click();
    await expect(page.getByLabel("Requests started")).toHaveText("2");
    await expect(page.getByLabel("Value", { exact: true })).toHaveText(
        "Waiting for result",
    );
});

test("old connection work must not overwrite the current connection result", async ({
    page,
}) => {
    await page.getByRole("button", { name: "Mount same element" }).click();
    await expect(page.getByLabel("Request 1 status")).toHaveText("pending");
    await page.getByRole("button", { name: "Detach element" }).click();
    await expect(page.getByLabel("Connection", { exact: true })).toHaveText(
        "disconnected",
    );
    await expect(page.locator("stale-async-connection-work")).toHaveCount(0);
    await page.getByRole("button", { name: "Mount same element" }).click();
    await expect(page.getByLabel("Requests started")).toHaveText("2");
    await expect(page.getByLabel("Connection", { exact: true })).toHaveText("connected");
    await expect(page.getByLabel("Request 1 status")).toHaveText("pending");
    await expect(page.getByLabel("Request 2 status")).toHaveText("pending");

    await page.getByRole("button", { name: "Resolve request 2" }).click();
    await expect(page.getByLabel("Request 2 status")).toHaveText(
        "applied while connected",
    );
    await expect(page.getByLabel("Value", { exact: true })).toHaveText(
        "Current connection result",
    );
    await page.getByRole("button", { name: "Resolve request 1" }).click();
    await expect(page.getByLabel("Request 1 status")).toHaveText(
        "applied while connected",
    );
    await expect(page.getByRole("button", { name: "Resolve request 1" })).toBeDisabled();
    await expect(page.getByLabel("Connection", { exact: true })).toHaveText("connected");

    // Intentionally red: the consumer's boolean guard accepts a previous lifetime.
    await expect(page.getByLabel("Value", { exact: true })).toHaveText(
        "Current connection result",
    );
});
