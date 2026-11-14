import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Upgrade supplied hosts" }).click();
    await expect(page.locator("#status")).toHaveText("Upgrade complete");
});

test("before replay: supplied input must drive the first-bound output", async ({
    page,
}) => {
    const section = page.locator("#before-replay");
    await expect(section.locator(".restored-input")).toHaveText("SUPPLIED");
    await expect(section.locator(".display")).toHaveText("Derived: DEFAULT");
    expect(await section.locator(".first-output").textContent()).toBe(
        "Derived: SUPPLIED",
    );
});

test("after bind: eventual correction must not replace the first-bound output", async ({
    page,
}) => {
    const section = page.locator("#after-bind");
    await expect(section.locator(".restored-input")).toHaveText("SUPPLIED");
    await expect(section.locator(".display")).toHaveText("Derived: SUPPLIED");
    expect(await section.locator(".first-output").textContent()).toBe(
        "Derived: SUPPLIED",
    );
});

test("pre-bind HostBehavior control: restored input drives the first-bound output", async ({
    page,
}) => {
    const section = page.locator("#pre-bind");
    await expect(section.locator(".restored-input")).toHaveText("SUPPLIED");
    await expect(section.locator(".display")).toHaveText("Derived: SUPPLIED");
    expect(await section.locator(".first-output").textContent()).toBe(
        "Derived: SUPPLIED",
    );
});
