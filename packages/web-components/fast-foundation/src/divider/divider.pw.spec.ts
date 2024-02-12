import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import { DividerOrientation, DividerRole } from "./divider.options.js";
import type { FASTDivider } from "./index.js";

test.describe("Divider", () => {
    test('should set a default `role` attribute of "separator"', async ({ page }) => {
        const element = page.locator("fast-divider");

        const root = page.locator("#root");

        await page.goto(fixtureURL("divider--divider"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-divider></fast-divider>
            `;
        });

        await expect(element).toHaveAttribute("role", DividerRole.separator);
    });

    test("should set the `role` attribute equal to the role provided", async ({
        page,
    }) => {
        const element = page.locator("fast-divider");

        const root = page.locator("#root");

        await page.goto(fixtureURL("divider--divider"));

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

    test("should set the `aria-orientation` attribute equal to the `orientation` value", async ({
        page,
    }) => {
        const element = page.locator("fast-divider");

        const root = page.locator("#root");

        await page.goto(fixtureURL("divider--divider"));

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

    test("should NOT set the `aria-orientation` attribute equal to the `orientation` value if the `role` is presentational", async ({
        page,
    }) => {
        const element = page.locator("fast-divider");

        const root = page.locator("#root");

        await page.goto(fixtureURL("divider--divider"));

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
