import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("Anchor", () => {
    let page: Page;
    let element: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-anchor");

        await page.goto(fixtureURL("anchor", attributes));
    });

    test.afterAll(async () => {
        await page.close();
    });

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

    for (const [attribute, value] of Object.entries(attributes)) {
        const attributeSpinalCase = spinalCase(attribute);

        test(`should set the \`${attributeSpinalCase}\` attribute to \`${value}\` on the internal control`, async () => {
            await expect(element).toHaveAttribute(attributeSpinalCase, `${value}`);
        });
    }
});
