import { spinalCase } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import type { FASTBreadcrumbItem } from "./breadcrumb-item.js";

test.describe("Breadcrumb item", () => {
    test("should include a `role` of `listitem`", async ({ page }) => {
        await page.goto("http://localhost:6006");

        const element = page.locator("fast-breadcrumb-item");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-breadcrumb-item></fast-breadcrumb-item>
            `;
        });

        await expect(element.locator("> div")).toHaveAttribute("role", "listitem");
    });

    test("should render an internal anchor when the `href` attribute is not provided", async ({
        page,
    }) => {
        await page.goto("http://localhost:6006");

        const element = page.locator("fast-breadcrumb-item");

        await page.locator("#root").evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-breadcrumb-item></fast-breadcrumb-item>
            `;
        });

        const anchor = element.locator("a");

        await expect(element).not.hasAttribute("href");

        await expect(element).toHaveJSProperty("href", undefined);

        await expect(anchor).toHaveCount(1);

        await expect(element.locator("a")).toHaveCount(1);
    });

    test("should render an internal anchor when the `href` attribute is provided", async ({
        page,
    }) => {
        await page.goto("http://localhost:6006");

        const element = page.locator("fast-breadcrumb-item");

        await page.locator("#root").evaluate(node => {
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
        await page.goto("http://localhost:6006");

        const element = page.locator("fast-breadcrumb-item");

        await page.locator("#root").evaluate(node => {
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
        const attributeSpinalCase = spinalCase(attribute);

        test(`should set the \`${attributeSpinalCase}\` attribute to \`${value}\` on the internal anchor`, async ({
            page,
        }) => {
            await page.goto("http://localhost:6006");

            const element = page.locator("fast-breadcrumb-item");

            const control = element.locator(".control");

            await page.locator("#root").evaluate(
                (root, [attribute, value]) => {
                    const breadcrumbItem = document.createElement("fast-breadcrumb-item");
                    breadcrumbItem[attribute] = value;
                    root.append(breadcrumbItem);
                },
                [attribute, value]
            );

            await expect(control).toHaveAttribute(attributeSpinalCase, `${value}`);
        });
    }
});
