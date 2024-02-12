import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTBreadcrumbItem } from "./breadcrumb-item.js";

test.describe("Breadcrumb item", () => {
    test("should include a `role` of `listitem`", async ({ page }) => {
        const element = page.locator("fast-breadcrumb-item");

        const root = page.locator("#root");

        await page.goto(fixtureURL("breadcrumb-item--breadcrumb-item"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-breadcrumb-item></fast-breadcrumb-item>
            `;
        });

        await expect(element).toHaveAttribute("role", "listitem");
    });

    test("should render an internal anchor when the `href` attribute is not provided", async ({
        page,
    }) => {
        const element = page.locator("fast-breadcrumb-item");

        const root = page.locator("#root");

        await page.goto(fixtureURL("breadcrumb-item--breadcrumb-item"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-breadcrumb-item></fast-breadcrumb-item>
            `;
        });

        const anchor = element.locator("a");

        await expect(element).not.toHaveAttribute("href");

        await expect(element).toHaveJSProperty("href", undefined);

        await expect(anchor).toHaveCount(1);

        await expect(element.locator("a")).toHaveCount(1);
    });

    test("should render an internal anchor when the `href` attribute is provided", async ({
        page,
    }) => {
        const element = page.locator("fast-breadcrumb-item");

        const root = page.locator("#root");

        await page.goto(fixtureURL("breadcrumb-item--breadcrumb-item"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-breadcrumb-item href="https://fast.design"></fast-breadcrumb-item>
            `;
        });

        const anchor = element.locator("a");

        await expect(anchor).toHaveCount(1);

        await expect(anchor).toHaveAttribute("href", "https://fast.design");

        await element.evaluate(node => {
            node.removeAttribute("href");
        });
    });

    test("should add an element with a class of `separator` when the `separator` property is true", async ({
        page,
    }) => {
        const element = page.locator("fast-breadcrumb-item");

        const root = page.locator("#root");

        await page.goto(fixtureURL("breadcrumb-item--breadcrumb-item"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-breadcrumb-item></fast-breadcrumb-item>
            `;
        });

        await element.evaluate<void, FASTBreadcrumbItem>(node => {
            node.separator = true;
        });

        await expect(element.locator(".separator")).toHaveCount(1);
    });

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

    for (const [attribute, value] of Object.entries(attributes)) {
        const attrToken = spinalCase(attribute);

        test(`should set the \`${attrToken}\` attribute to \`${value}\` on the internal anchor`, async ({
            page,
        }) => {
            const element = page.locator("fast-breadcrumb-item");

            const root = page.locator("#root");

            const control = element.locator(".control");

            await page.goto(fixtureURL("breadcrumb-item--breadcrumb-item"));

            await root.evaluate(
                (node, { attrToken, value }) => {
                    node.innerHTML = /* html */ `
                        <fast-breadcrumb-item ${attrToken}="${value}" href="#"></fast-breadcrumb-item>
                    `;
                },
                { attrToken, value }
            );

            await expect(control).toHaveAttribute(attrToken, `${value}`);
        });
    }
});
