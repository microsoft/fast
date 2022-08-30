import { spinalCase } from "@microsoft/fast-web-utilities";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTBreadcrumbItem } from "./breadcrumb-item.js";

test.describe("Breadcrumb item", () => {
    test.describe("States, Attributes, and Properties", () => {
        let page: Page;
        let element: Locator;

        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();

            element = page.locator("fast-breadcrumb-item");

            await page.goto(fixtureURL("breadcrumb-item--breadcrumb-item"));
        });

        test.afterAll(async () => {
            await page.close();
        });

        test("should include a `role` of `listitem`", async () => {
            await expect(element.locator("> div")).toHaveAttribute("role", "listitem");
        });

        test("should render an internal anchor when the `href` attribute is not provided", async () => {
            const anchor = element.locator("a");

            await expect(element).not.hasAttribute("href");

            await expect(element).toHaveJSProperty("href", undefined);

            await expect(anchor).toHaveCount(1);

            await expect(element.locator("a")).toHaveCount(1);
        });

        test("should render an internal anchor when the `href` attribute is provided", async () => {
            await element.evaluate(node => {
                node.setAttribute("href", "https://fast.design");
            });

            const anchor = element.locator("a");

            await expect(anchor).toHaveCount(1);

            await expect(anchor).toHaveAttribute("href", "https://fast.design");

            await element.evaluate(node => {
                node.removeAttribute("href");
            });
        });

        test("should add an element with a class of `separator` when the `separator` property is true", async () => {
            await element.evaluate<void, FASTBreadcrumbItem>(node => {
                node.separator = true;
            });

            await expect(element.locator(".separator")).toHaveCount(1);
        });

        test.describe("should set the attribute on the internal control", () => {
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

            test.beforeAll(async () => {
                await page.goto(
                    fixtureURL("breadcrumb-item--breadcrumb-item-with-href", attributes)
                );
            });

            for (const [attribute, value] of Object.entries(attributes)) {
                const attrToken = spinalCase(attribute);

                test(`should set the \`${attrToken}\` attribute to \`${value}\``, async () => {
                    await expect(element).toHaveAttribute(attrToken, `${value}`);
                });
            }
        });
    });
});
