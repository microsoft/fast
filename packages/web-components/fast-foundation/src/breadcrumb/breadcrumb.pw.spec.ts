import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTBreadcrumb } from "./breadcrumb.js";

test.describe("Breadcrumb", () => {
    test.describe("States, Attributes, and Properties", () => {
        let page: Page;
        let element: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-breadcrumb");

            await page.goto(fixtureURL("breadcrumb--breadcrumb"));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should have a role of 'navigation'", async () => {
            await expect(element).toHaveAttribute("role", "navigation");
        });

        test("should include an internal element with a `role` of `list`", async () => {
            await expect(element.locator(".list")).toHaveAttribute("role", "list");
        });

        test("should not render a separator on last item", async () => {
            const items = element.locator("fast-breadcrumb-item");

            await expect(items).toHaveCount(3);

            await expect(items.last()).toHaveJSProperty("separator", false);
        });

        test("should set `aria-current` on the internal anchor of the last node when `href` is present", async () => {
            await expect(
                element.locator("fast-breadcrumb-item:last-of-type a")
            ).toHaveAttribute("aria-current", "page");
        });

        test("should remove `aria-current` from any prior breadcrumb item children with child anchors when a new node is appended", async () => {
            await expect(
                element.locator("fast-breadcrumb-item:last-of-type a")
            ).toHaveAttribute("aria-current", "page");

            await element.evaluate<void, FASTBreadcrumb>(node => {
                node.append(document.createElement("fast-breadcrumb-item"));
            });

            await expect(
                element.locator("fast-breadcrumb-item:nth-of-type(2) a")
            ).not.toHaveAttribute("aria-current", "page");
        });
    });
});
