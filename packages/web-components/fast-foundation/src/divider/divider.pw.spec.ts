import { Orientation } from "@microsoft/fast-web-utilities";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import { DividerRole } from "./divider.options.js";
import type { FASTDivider } from "./index.js";

test.describe("Divider", () => {
    let page: Page;
    let element: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-divider");

        await page.goto(fixtureURL("divider--divider"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('should set a default `role` attribute of "separator"', async () => {
        await expect(element).toHaveAttribute("role", DividerRole.separator);
    });

    test("should set the `role` attribute equal to the role provided", async () => {
        await element.evaluate((node: FASTDivider, DividerRole) => {
            node.role = DividerRole.separator;
        }, DividerRole);

        await expect(element).toHaveAttribute("role", DividerRole.separator);

        await element.evaluate((node: FASTDivider, DividerRole) => {
            node.role = DividerRole.presentation;
        }, DividerRole);

        await expect(element).toHaveAttribute("role", DividerRole.presentation);
    });

    test("should set the `aria-orientation` attribute equal to the `orientation` value", async () => {
        await element.evaluate((node: FASTDivider, Orientation) => {
            node.orientation = Orientation.horizontal;
        }, Orientation);

        await expect(element).toHaveAttribute("aria-orientation", Orientation.horizontal);

        await element.evaluate((node: FASTDivider, Orientation) => {
            node.orientation = Orientation.vertical;
        }, Orientation);

        await expect(element).toHaveAttribute("aria-orientation", Orientation.vertical);
    });
});
