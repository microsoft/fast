import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import type { FASTTab } from "../tab/tab.js";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTabs } from "./tabs.js";

// TODO: Need to add tests for keyboard handling, activeIndicator position, and focus management
test.describe("Tabs", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;
    let tablist: Locator;
    let tabs: Locator;

    const template = /* html */ `
        <fast-tabs>
            <fast-tab>Tab one</fast-tab>
            <fast-tab>Tab two</fast-tab>
            <fast-tab>Tab three</fast-tab>
            <fast-tab-panel>Tab panel one</fast-tab-panel>
            <fast-tab-panel>Tab panel two</fast-tab-panel>
            <fast-tab-panel>Tab panel three</fast-tab-panel>
        </fast-tabs>
    `;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-tabs");

        root = page.locator("#root");

        tablist = element.locator(".tablist");

        tabs = element.locator("fast-tab");

        await page.goto(fixtureURL("tabs--tabs"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test("should have an internal element with a role of `tablist`", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-tabs></fast-tabs>
            `;
        });

        await expect(tablist).toHaveAttribute("role", "tablist");
    });

    test("should set a default orientation value of `horizontal` when `orientation` is not provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-tabs></fast-tabs>
            `;
        });

        await expect(element).toHaveJSProperty("orientation", "horizontal");
    });

    test("should set an `id` attribute on the active tab when an `id` is provided", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-tabs></fast-tabs>
            `;
        });

        const tabCount = await tabs.count();

        for (let i = 0; i < tabCount; i++) {
            const tab = tabs.nth(i);

            await tab.evaluate((node, i) => {
                node.id = `custom-id-${i}`;
            }, i);

            await expect(tab).toHaveAttribute("id", `custom-id-${i}`);
        }
    });

    test("should set an `id` attribute on tab items with a unique ID when an `id` is NOT provided", async () => {
        await root.evaluate(
            (node, { template }) => {
                node.innerHTML = template;
            },
            { template }
        );

        const tabCount = await tabs.count();

        for (let i = 0; i < tabCount; i++) {
            const tab = tabs.nth(i);

            const id = await tab.getAttribute("id");

            // The ID function may not start at 0 so we need to check that the ID is unique
            expect(id).toMatch(/tab-\d+/);

            const tabPanel = element.locator(`#${id}`);

            await expect(tabPanel).toHaveCount(1);
        }
    });

    test("should set `aria-labelledby` on the tab panel and `aria-controls` on the tab which corresponds to the matching ID when IDs are NOT provided", async () => {
        await root.evaluate(
            (node, { template }) => {
                node.innerHTML = template;
            },
            { template }
        );

        const tabCount = await tabs.count();

        for (let i = 0; i < tabCount; i++) {
            const tab = tabs.nth(i);

            const panelId = (await tab.getAttribute("aria-controls")) as string;

            expect(panelId).toMatch(/panel-\d+/);

            const tabPanel = element.locator(`#${panelId}`);

            await expect(tabPanel).toHaveCount(1);

            const tabId = (await tab.getAttribute("id")) as string;

            expect(tabId).toMatch(/tab-\d+/);

            await expect(tabPanel).toHaveAttribute("aria-labelledby", tabId);

            await expect(tab).toHaveAttribute("aria-controls", panelId);
        }
    });

    test("should set `aria-labelledby` on the tab panel and `aria-controls` on the tab which corresponds to the matching ID when IDs are NOT provided and additional tabs and panels are added", async () => {
        await root.evaluate(
            (node, { template }) => {
                node.innerHTML = template;
            },
            { template }
        );

        let tabCount = await tabs.count();

        for (let i = 0; i < tabCount; i++) {
            const tab = tabs.nth(i);

            const panelId = (await tab.getAttribute("aria-controls")) as string;

            expect(panelId).toMatch(/panel-\d+/);

            const tabPanel = element.locator(`#${panelId}`);

            await expect(tabPanel).toHaveCount(1);

            const tabId = (await tab.getAttribute("id")) as string;

            expect(tabId).toMatch(/tab-\d+/);

            await expect(tabPanel).toHaveAttribute("aria-labelledby", tabId);

            await expect(tab).toHaveAttribute("aria-controls", panelId);
        }

        await element.evaluate<void, FASTTabs>(node => {
            const tabs = Array.from(node.querySelectorAll("fast-tab"));

            const newTab = document.createElement("fast-tab");
            newTab.textContent = "New Tab";
            node.insertBefore(newTab, tabs[1]);

            const newPanel = document.createElement("fast-tab-panel");
            newPanel.textContent = "New Panel";
            node.insertBefore(newPanel, tabs[1]);
        });

        tabCount = await tabs.count();

        for (let i = 0; i < tabCount; i++) {
            const tab = tabs.nth(i);

            const panelId = (await tab.getAttribute("aria-controls")) as string;

            expect(panelId).toMatch(/panel-\d+/);

            const tabPanel = element.locator(`#${panelId}`);

            await expect(tabPanel).toHaveCount(1);

            const tabId = (await tab.getAttribute("id")) as string;

            expect(tabId).toMatch(/tab-\d+/);

            await expect(tabPanel).toHaveAttribute("aria-labelledby", tabId);

            await expect(tab).toHaveAttribute("aria-controls", panelId);
        }
    });

    test.describe("active tab", () => {
        test("should set an `aria-selected` attribute on the active tab when `activeid` is provided", async () => {
            await root.evaluate(
                (node, { template }) => {
                    node.innerHTML = template;
                },
                { template }
            );

            const secondTab = tabs.nth(1);

            const secondTabId = (await secondTab.getAttribute("id")) ?? "";

            await element.evaluate((node: FASTTabs, secondTabId) => {
                node.activeid = secondTabId;
            }, secondTabId);

            await expect(secondTab).toHaveAttribute("aria-selected", "true");
        });

        test("should default the first tab as the active index if `activeid` is NOT provided", async () => {
            await root.evaluate(
                (node, { template }) => {
                    node.innerHTML = template;
                },
                { template }
            );

            await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

            await expect(element).toHaveJSProperty("activeTabIndex", 0);
        });

        test("should update `aria-selected` attribute on the active tab when `activeId` is updated", async () => {
            await root.evaluate(
                (node, { template }) => {
                    node.innerHTML = template;
                },
                { template }
            );

            await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

            const secondTab = tabs.nth(1);

            const secondTabId = (await secondTab.getAttribute("id")) ?? "";

            await element.evaluate((node: FASTTabs, secondTabId) => {
                node.setAttribute("activeId", secondTabId);
            }, secondTabId);

            await expect(secondTab).toHaveAttribute("aria-selected", "true");
        });
    });

    test.describe("active tabpanel", () => {
        test("should set an `aria-labelledby` attribute on the tabpanel with a value of the tab id when `activeid` is provided", async () => {
            await root.evaluate(
                (node, { template }) => {
                    node.innerHTML = template;
                },
                { template }
            );

            const secondTab = tabs.nth(1);

            const secondTabId = (await secondTab.getAttribute("id")) ?? "";

            const tabPanels = element.locator("fast-tab-panel");

            await element.evaluate((node: FASTTabs, secondTabId) => {
                node.activeid = secondTabId;
            }, secondTabId);

            await expect(tabPanels.nth(1)).toHaveAttribute(
                "aria-labelledby",
                secondTabId
            );
        });

        test("should set an attribute of hidden if the tabpanel is not active", async () => {
            await root.evaluate(
                (node, { template }) => {
                    node.innerHTML = template;
                },
                { template }
            );

            const tabPanels = element.locator("fast-tab-panel");

            await expect(tabPanels.nth(0)).not.toHaveBooleanAttribute("hidden");

            await expect(tabPanels.nth(1)).toHaveBooleanAttribute("hidden");

            await expect(tabPanels.nth(2)).toHaveBooleanAttribute("hidden");
        });
    });

    test("should not allow selecting a tab that has been disabled after it has been connected", async () => {
        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-tabs>
                    <fast-tab id="tab-1">Tab one</fast-tab>
                    <fast-tab id="tab-2">Tab two</fast-tab>
                    <fast-tab id="tab-3">Tab three</fast-tab>
                    <fast-tab-panel>Tab panel one</fast-tab-panel>
                    <fast-tab-panel>Tab panel two</fast-tab-panel>
                    <fast-tab-panel>Tab panel three</fast-tab-panel>
                </fast-tabs>
            `;
        });

        await (await element.elementHandle())?.waitForElementState("stable");

        const firstTab = tabs.nth(0);

        const firstTabId = await firstTab.getAttribute("id");

        expect(firstTabId).toBe("tab-1");

        await element.evaluate((node: FASTTabs, firstTabId) => {
            node.activeid = `${firstTabId}`;
        }, firstTabId);

        await (await element.elementHandle())?.waitForElementState("stable");

        await expect(element).toHaveJSProperty("activeid", firstTabId);

        const secondTab = tabs.nth(1);

        await secondTab.evaluate((node: FASTTab) => {
            node.disabled = true;
        });

        await (await element.elementHandle())?.waitForElementState("stable");

        await secondTab.click({ force: true });

        await expect(element).toHaveJSProperty("activeid", firstTabId);
    });

    test("should allow selecting tab that has been enabled after it has been connected", async () => {
        test.slow();

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-tabs>
                    <fast-tab>Tab one</fast-tab>
                    <fast-tab disabled>Tab two</fast-tab>
                    <fast-tab>Tab three</fast-tab>
                    <fast-tab-panel>Tab panel one</fast-tab-panel>
                    <fast-tab-panel>Tab panel two</fast-tab-panel>
                    <fast-tab-panel>Tab panel three</fast-tab-panel>
                </fast-tabs>
            `;
        });

        const firstTab = tabs.nth(0);

        const secondTab = tabs.nth(1);

        const firstTabId = (await firstTab.getAttribute("id")) ?? "";

        const secondTabId = (await secondTab.getAttribute("id")) ?? "";

        await element.evaluate((node: FASTTabs, firstTabId) => {
            node.activeid = firstTabId;
        }, firstTabId);

        await expect(element).toHaveJSProperty("activeid", firstTabId);

        await secondTab.click({ force: true });

        await expect(element).toHaveJSProperty("activeid", firstTabId);

        await secondTab.evaluate((node: FASTTab) => {
            node.disabled = false;
        });

        await (await element.elementHandle())?.waitForElementState("stable");

        await secondTab.click({ force: true });

        await expect(element).toHaveJSProperty("activeid", secondTabId);
    });
});
