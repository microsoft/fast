import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("Accordion item", () => {
    test("should set an `aria-level` to the heading when provided", async ({ page }) => {
        await page.goto(
            fixtureURL("accordion-item--accordion-item", {
                headinglevel: 4,
            })
        );

        const element = page.locator("fast-accordion-item");

        await expect(element).toHaveJSProperty("headinglevel", 4);

        const heading = element.locator(`[role="heading"]`);

        await expect(heading).toHaveAttribute("aria-level", "4");
    });

    test("should set a default heading level of 2 when NOT provided a `headinglevel`", async ({
        page,
    }) => {
        await page.goto(fixtureURL("accordion-item--accordion-item"));

        const element = page.locator("fast-accordion-item");

        await expect(element).toHaveJSProperty("headinglevel", 2);

        const heading = page.locator(`[role="heading"]`);

        await expect(heading).toHaveAttribute("aria-level", "2");
    });

    test("should set `aria-expanded` value to false on the internal button when expanded is undefined", async ({
        page,
    }) => {
        await page.goto(fixtureURL("accordion-item--accordion-item"));

        const element = page.locator("fast-accordion-item button");

        await expect(element).toHaveAttribute("aria-expanded", "false");
    });

    test.describe("when not expanded", () => {
        test("should NOT have a class of `expanded`", async ({ page }) => {
            await page.goto(
                fixtureURL("accordion-item--accordion-item", {
                    expanded: false,
                })
            );

            const element = page.locator("fast-accordion-item");

            await expect(element).not.toHaveClass("expanded");
        });

        test("should set `aria-expanded` value to false on the internal button", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("accordion-item--accordion-item", {
                    expanded: false,
                })
            );

            const element = page.locator("fast-accordion-item button");

            await expect(element).toHaveAttribute("aria-expanded", "false");
        });
    });

    test.describe("when expanded", () => {
        test("should have a class of `expanded`", async ({ page }) => {
            await page.goto(
                fixtureURL("accordion-item--accordion-item", {
                    expanded: true,
                })
            );

            const element = page.locator("fast-accordion-item");

            await expect(element).toHaveClass("expanded");
        });

        test("should set `aria-expanded` value to true on the internal button", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("accordion-item--accordion-item", {
                    expanded: true,
                })
            );

            const element = page.locator("fast-accordion-item button");

            await expect(element).toHaveAttribute("aria-expanded", "true");
        });
    });

    test("should set internal properties to match the id when provided", async ({
        page,
    }) => {
        const id = "testId";

        await page.goto(fixtureURL("accordion-item--accordion-item", { id }));

        const element = page.locator("fast-accordion-item");

        const region = element.locator(`[role="region"]`);

        await expect(region).toHaveAttribute("aria-labelledby", id);

        const button = element.locator("button");

        await expect(button).toHaveId(id);
    });
});
