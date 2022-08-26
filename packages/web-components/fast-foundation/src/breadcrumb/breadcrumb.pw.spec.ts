import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("Breadcrumb", () => {
    test("should include a `role` of `navigation`", async ({ page }) => {
        await page.goto(fixtureURL("breadcrumb--breadcrumb"));

        const element = page.locator("fast-breadcrumb");

        await expect(element).toHaveAttribute("role", "navigation");
    });

    test("should include an internal element with a `role` of `list`", async ({
        page,
    }) => {
        await page.goto(fixtureURL("breadcrumb--breadcrumb"));

        const list = page.locator("fast-breadcrumb .list");

        await expect(list).toHaveAttribute("role", "list");
    });

    test("should not render a separator on last item", async ({ page }) => {
        await page.goto(fixtureURL("breadcrumb--breadcrumb"));

        const items = page.locator("fast-breadcrumb fast-breadcrumb-item");

        await expect(items).toHaveCount(3);

        await expect(items.last()).toHaveJSProperty("separator", false);
    });

    test("should set `aria-current` on the internal anchor of the last node when `href` is present", async ({
        page,
    }) => {
        await page.goto(fixtureURL("breadcrumb--breadcrumb"));

        const a = page.locator("fast-breadcrumb fast-breadcrumb-item:last-of-type a");

        await expect(a).toHaveAttribute("aria-current", "page");
    });

    test("should remove `aria-current` from any prior breadcrumb item children with child anchors when a new node is appended", async ({
        page,
    }) => {
        await page.goto(fixtureURL("breadcrumb--breadcrumb"));

        const element = page.locator("fast-breadcrumb");
        const items = element.locator("fast-breadcrumb-item");
        const lastItemAnchor = items.last();
        const secondItemAnchor = items.nth(2).locator("a");

        await expect(lastItemAnchor).toHaveAttribute("aria-current", "page");

        await element.evaluate(node => {
            node.append(document.createElement("fast-breadcrumb-item"));
        });

        await expect(secondItemAnchor).not.toHaveAttribute("aria-current", "page");
    });
});
