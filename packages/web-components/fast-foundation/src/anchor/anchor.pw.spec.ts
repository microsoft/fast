import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("Anchor", () => {
    test.describe("should set the attribute on the internal anchor", () => {
        const attributes = {
            href: "href",
            ping: "ping",
            hreflang: "en-GB",
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
                await page.goto(fixtureURL("anchor--anchor", { [key]: value }));

                const anchor = page.locator("fast-anchor a");

                await expect(anchor).toHaveAttribute(spinalCase(key), `${value}`);
            });
        });
    });
});
