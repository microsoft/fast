import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTFlipper } from "./flipper.js";
import { FlipperDirection } from "./flipper.options.js";

test.describe("Flipper", () => {
    test("should include a role of button", async ({ page }) => {
        await page.goto(fixtureURL("flipper--flipper"));

        const element = page.locator("fast-flipper");

        await expect(element).toHaveAttribute("role", "button");
    });

    test("should include an attribute of `aria-disabled` when disabled is true", async ({
        page,
    }) => {
        await page.goto(fixtureURL("flipper--flipper", { disabled: true }));

        const element = page.locator("fast-flipper");

        await expect(element).toHaveAttribute("aria-disabled", "true");
    });

    test("should include a `tabindex` of -1 when `hiddenFromAT` is true", async ({
        page,
    }) => {
        await page.goto(fixtureURL("flipper--flipper"));

        const element = page.locator("fast-flipper");

        await element.evaluate((node: FASTFlipper) => {
            node.hiddenFromAT = true;
        });

        await expect(element).toHaveAttribute("tabindex", "-1");
    });

    test("should set `aria-hidden` true by default", async ({ page }) => {
        await page.goto(fixtureURL("flipper--flipper"));

        const element = page.locator("fast-flipper");

        await expect(element).toHaveAttribute("aria-hidden", "true");
    });

    test("should set a default value of true for `hiddenFromAT` property", async ({
        page,
    }) => {
        await page.goto(fixtureURL("flipper--flipper"));

        const element = page.locator("fast-flipper");

        await expect(element).toHaveJSProperty("hiddenFromAT", true);
    });

    test("should set a `tabindex` of 0 when `aria-hidden` is false", async ({ page }) => {
        await page.goto(fixtureURL("flipper--flipper"));

        const element = page.locator("fast-flipper");

        await element.evaluate(node => node.setAttribute("aria-hidden", "false"));

        await expect(element).toHaveAttribute("tabindex", "0");
    });

    test("should render a span with a class of `next` when direction is `next`", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("flipper--flipper", {
                direction: FlipperDirection.next,
            })
        );

        const element = page.locator("fast-flipper");

        await expect(element.locator("span")).toHaveClass("next");
    });

    test("should render a span with a class of `previous` when direction is `previous`", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("flipper--flipper", {
                direction: FlipperDirection.previous,
            })
        );

        const element = page.locator("fast-flipper");

        await expect(element.locator("span")).toHaveClass("previous");
    });

    test("should render a span with a class of `next` when direction is NOT passed", async ({
        page,
    }) => {
        await page.goto(fixtureURL("flipper--flipper"));

        const element = page.locator("fast-flipper");

        await expect(element.locator("span")).toHaveClass("next");
    });
});
