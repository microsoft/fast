import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("Breadcrumb item", () => {
    test("should include a `role` of `listitem`", async ({ page }) => {
        await page.goto(fixtureURL("breadcrumb-item--breadcrumb-item"));

        const listitem = page.locator(`fast-breadcrumb-item > div`);

        await expect(listitem).toHaveAttribute("role", "listitem");
    });

    test("should add an element with a class of `separator` when `separator` is true", async ({
        page,
    }) => {
        await page.goto(
            fixtureURL("breadcrumb-item--breadcrumb-item", { separator: true })
        );

        const separator = page.locator("fast-breadcrumb-item .separator");

        await expect(separator).toHaveCount(1);
    });

    test("should render an internal anchor when `href` is provided", async ({ page }) => {
        // Storybook doesn't allow URLs to be passed as arg values
        // https://storybook.js.org/docs/react/writing-stories/args#setting-args-through-the-url

        const href = "foo";

        await page.goto(fixtureURL("breadcrumb-breadcrumb-item", { href }));

        const a = page.locator("fast-breadcrumb-item a");

        await expect(a).toHaveCount(1);

        await expect(a).toHaveAttribute("href", href);
    });

    test("should render an internal anchor when `href` is not provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("breadcrumb-item--breadcrumb-item"));

        const a = page.locator("fast-breadcrumb-item a");

        await expect(a).toHaveCount(1);
    });

    test.describe("should set the attribute on the internal anchor", () => {
        const attributes = {
            download: "foo",
            hreflang: "en-GB",
            ping: "foo",
            referrerpolicy: "no-referrer",
            rel: "external",
            target: "_blank",
            type: "foo",
            ariaAtomic: "true",
            ariaBusy: "false",
            ariaControls: "testId",
            ariaCurrent: "page",
            ariaDescribedby: "testId",
            ariaDetails: "testId",
            ariaDisabled: "true",
            ariaErrormessage: "test",
            ariaExpanded: "true",
            ariaFlowto: "testId",
            ariaHaspopup: "true",
            ariaHidden: "true",
            ariaInvalid: "spelling",
            ariaKeyshortcuts: "F4",
            ariaLabel: "foo",
            ariaLabelledby: "testId",
            ariaLive: "polite",
            ariaOwns: "testId",
            ariaRelevant: "removals",
            ariaRoledescription: "slide",
        };

        Object.entries(attributes).forEach(([key, value]) => {
            test(key, async ({ page }) => {
                await page.goto(
                    fixtureURL("breadcrumb-item--breadcrumb-item-with-href", {
                        [key]: value,
                    })
                );

                const a = page.locator("fast-breadcrumb-item a");

                await expect(a).toHaveAttribute(spinalCase(key), value);
            });
        });
    });
});
