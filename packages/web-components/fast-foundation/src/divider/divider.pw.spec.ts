import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import { DividerOrientation, DividerRole } from "./divider.options.js";
import type { FASTDivider } from "./index.js";

test.describe("Divider", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-divider");

        root = page.locator("#root");

        await page.goto(fixtureURL("divider--divider"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('should set a default `role` attribute of "separator"', async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-divider></fast-divider>
            `;
        });

        await expect(element).toHaveAttribute("role", DividerRole.separator);
    });

    test("should set the `role` attribute equal to the role provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-divider role="presentation"></fast-divider>
            `;
        });

        await expect(element).toHaveAttribute("role", "presentation");

        await element.evaluate((node: FASTDivider, DividerRole) => {
            node.role = DividerRole.separator;
        }, DividerRole);

        await expect(element).toHaveAttribute("role", DividerRole.separator);
    });

    test("should set the `aria-orientation` attribute equal to the `orientation` value", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-divider orientation="vertical"></fast-divider>
            `;
        });

        await expect(element).toHaveAttribute(
            "aria-orientation",
            DividerOrientation.vertical
        );

        await element.evaluate((node: FASTDivider, DividerOrientation) => {
            node.orientation = DividerOrientation.horizontal;
        }, DividerOrientation);

        await expect(element).toHaveAttribute(
            "aria-orientation",
            DividerOrientation.horizontal
        );
    });

    test("should NOT set the `aria-orientation` attribute equal to the `orientation` value if the `role` is presentational", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-divider orientation="vertical"></fast-divider>
            `;
        });

        await expect(element).toHaveAttribute(
            "aria-orientation",
            DividerOrientation.vertical
        );

        await element.evaluate((node: FASTDivider, DividerRole) => {
            node.role = DividerRole.presentation;
        }, DividerRole);

        await expect(element).not.toHaveAttribute(
            "aria-orientation",
            DividerOrientation.horizontal
        );
        await expect(element).not.toHaveAttribute(
            "aria-orientation",
            DividerOrientation.vertical
        );
    });
});
