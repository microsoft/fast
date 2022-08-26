import { Orientation } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import { DividerRole } from "./divider.options.js";
import type { FASTDivider } from "./index.js";

test.describe("Divider", () => {
    test("should include a role attribute equal to the role provided", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("divider--divider", {
                role: "separator",
            })
        );

        const element = page.locator("fast-divider");

        await element.evaluate((node: FASTDivider, DividerRole) => {
            node.role = DividerRole.separator;
        }, DividerRole);

        await expect(element).toHaveAttribute("role", DividerRole.separator);

        await element.evaluate((node: FASTDivider, DividerRole) => {
            node.role = DividerRole.presentation;
        }, DividerRole);

        await expect(element).toHaveAttribute("role", DividerRole.presentation);
    });

    test("should include a default role of `separator` if no role is passed", async ({
        page,
    }) => {
        await page.goto(fixtureURL("divider--divider"));

        const element = page.locator("fast-divider");

        await expect(element).toHaveAttribute("role", DividerRole.separator);
    });

    test("should set the `aria-orientation` attribute equal to the `orientation` value", async ({
        page,
    }) => {
        await page.goto(fixtureURL("divider--divider"));

        const element = page.locator("fast-divider");

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
