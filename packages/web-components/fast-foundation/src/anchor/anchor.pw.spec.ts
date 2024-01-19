import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";

test.describe("Anchor", () => {
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

        test(`should set the \`${attributeSpinalCase}\` attribute to \`${value}\` on the internal control`, async ({
            page,
        }) => {
            const element = page.locator("fast-anchor");

            await page.goto("http://localhost:6006");

            await page.locator("#root").evaluate(
                (root, [attribute, value]) => {
                    const anchor = document.createElement("fast-anchor");
                    anchor[attribute] = value;
                    root.append(anchor);
                },
                [attribute, value]
            );

            await expect(element).toHaveAttribute(attributeSpinalCase, `${value}`);
        });
    }
});
