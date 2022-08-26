import { Orientation } from "@microsoft/fast-web-utilities";
import { expect, test } from "@playwright/test";
import type { FASTTab } from "../tab/tab.js";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTTabs } from "./tabs.js";

// TODO: Need to add tests for keyboard handling, activeIndicator position, and focus management
test.describe("Tabs", () => {
    test("should have an internal element with a role of `tablist`", async ({ page }) => {
        await page.goto(fixtureURL("tabs--tabs"));

        const element = page.locator("fast-tabs");

        const tablist = element.locator(".tablist");

        await expect(tablist).toHaveAttribute("role", "tablist");
    });

    test("should set a default orientation value of `horizontal` when `orientation` is not provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tabs--tabs"));

        const element = page.locator("fast-tabs");

        await expect(element).toHaveJSProperty("orientation", "horizontal");
    });

    test("should add a class equal to the `orientation` value", async ({ page }) => {
        await page.goto(fixtureURL("tabs--tabs"));

        const element = page.locator("fast-tabs");

        await expect(element).toHaveClass(/horizontal/);

        await element.evaluate<void, typeof Orientation, FASTTabs>(
            (node, Orientation) => {
                node.orientation = Orientation.vertical;
            },
            Orientation
        );

        await expect(element).toHaveClass(/vertical/);
    });

    test("should set the `hideActiveIndicator` property when the `hide-active-indicator` attribute is present", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tabs--tabs", { hideActiveIndicator: true }));

        const element = page.locator("fast-tabs");

        await expect(element).toHaveBooleanAttribute("hide-active-indicator");

        await expect(element).toHaveJSProperty("hideActiveIndicator", true);
    });

    test("should default the `hideActiveIndicator` property to false", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tabs--tabs"));

        const element = page.locator("fast-tabs");

        await expect(element).not.toHaveBooleanAttribute("hide-active-indicator");

        await expect(element).toHaveJSProperty("hideActiveIndicator", false);
    });

    test("should render an internal element with a class of 'active-indicator' when `hide-active-indicator` is false", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tabs--tabs"));

        const element = page.locator("fast-tabs");

        const activeIndicator = element.locator(".active-indicator");

        await expect(activeIndicator).toHaveCount(1);
    });

    test("should set an `id` attribute on the active tab when an `id` is provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tabs--tabs"));

        const element = page.locator("fast-tabs");

        const tabs = element.locator("fast-tab");

        const tabCount = await tabs.count();

        for (let i = 0; i < tabCount; i++) {
            const tab = tabs.nth(i);

            await tab.evaluate((node, i) => {
                node.id = `custom-id-${i}`;
            }, i);

            await expect(tab).toHaveAttribute("id", `custom-id-${i}`);
        }
    });

    test("should set an `id` attribute on tab items with a unique ID when an `id` is NOT provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tabs--tabs"));

        const element = page.locator("fast-tabs");

        const tabs = element.locator("fast-tab");

        const tabCount = await tabs.count();

        for (let i = 0; i < tabCount; i++) {
            const tab = tabs.nth(i);

            await expect(tab).toHaveAttribute("id", `tab-${i}`);
        }
    });

    test("should set `aria-labelledby` on the tab panel and `aria-controls` on the tab which corresponds to the matching ID when IDs are NOT provided", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tabs--tabs"));

        const element = page.locator("fast-tabs");

        const tabs = element.locator("fast-tab");

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

    test("should set `aria-labelledby` on the tab panel and `aria-controls` on the tab which corresponds to the matching ID when IDs are NOT provided and additional tabs and panels are added", async ({
        page,
    }) => {
        await page.goto(fixtureURL("tabs--tabs"));

        const element = page.locator("fast-tabs");

        const tabs = element.locator("fast-tab");

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

            // const panels = Array.from(node.querySelectorAll("fast-tab-panel"));

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
        test("should set an `aria-selected` attribute on the active tab when `activeId` is provided", async ({
            page,
        }) => {
            await page.goto(fixtureURL("tabs--tabs", { activeid: "tab-1" }));

            const element = page.locator("fast-tabs");

            const tabs = element.locator("fast-tab");

            await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
        });

        test("should default the first tab as the active index if `activeid` is NOT provided", async ({
            page,
        }) => {
            await page.goto(fixtureURL("tabs--tabs"));

            const element = page.locator("fast-tabs");

            const tabs = element.locator("fast-tab");

            await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

            await expect(element).toHaveJSProperty("activeTabIndex", 0);
        });

        test("should update `aria-selected` attribute on the active tab when `activeId` is updated", async ({
            page,
        }) => {
            await page.goto(fixtureURL("tabs--tabs", { activeid: "tab-1" }));

            const element = page.locator("fast-tabs");

            const tabs = element.locator("fast-tab");

            await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

            await element.evaluate(node => {
                node.setAttribute("activeId", "tab-2");
            });

            await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
        });

        test("should skip updating the active indicator if the same tab is clicked twice", async ({
            page,
        }) => {
            await page.goto(fixtureURL("tabs--tabs", { activeid: "tab-2" }));

            const element = page.locator("fast-tabs");

            const activeIndicator = element.locator(".active-indicator");

            const [wasTransitioned] = await Promise.all([
                activeIndicator.evaluate(
                    node =>
                        new Promise(resolve => {
                            node.addEventListener("transitionend", () => resolve(true));
                        })
                ),
                activeIndicator.click(),
            ]);

            expect(wasTransitioned).toBe(true);

            const [wasTransitionedAgain] = await Promise.all([
                activeIndicator.evaluate(node =>
                    Promise.race([
                        new Promise(resolve => {
                            node.addEventListener("transitionend", () => resolve(true));
                        }),
                        new Promise(resolve => setTimeout(() => resolve(false), 20)),
                    ])
                ),
                activeIndicator.click(),
            ]);

            expect(wasTransitionedAgain).toBe(false);
        });
    });

    test.describe("active tabpanel", () => {
        test("should set an `aria-labelledby` attribute on the tabpanel with a value of the tab id when `activeid` is provided", async ({
            page,
        }) => {
            await page.goto(fixtureURL("tabs--tabs", { activeid: "tab-1" }));

            const element = page.locator("fast-tabs");

            const tabPanels = element.locator("fast-tab-panel");

            await expect(tabPanels.nth(1)).toHaveAttribute("aria-labelledby", "tab-1");
        });

        test("should set an attribute of hidden if the tabpanel is not active", async ({
            page,
        }) => {
            await page.goto(fixtureURL("tabs--tabs", { activeid: "tab-1" }));

            const element = page.locator("fast-tabs");

            const tabPanels = element.locator("fast-tab-panel");

            await expect(tabPanels.nth(0)).toHaveBooleanAttribute("hidden");

            await expect(tabPanels.nth(1)).not.toHaveBooleanAttribute("hidden");

            await expect(tabPanels.nth(2)).toHaveBooleanAttribute("hidden");
        });
    });

    test.describe("disabled tab", () => {
        test("should not display an active indicator if all tabs are disabled", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("tabs--tabs", {
                    "storyItems.tabs.[0].disabled": true,
                    "storyItems.tabs.[1].disabled": true,
                    "storyItems.tabs.[2].disabled": true,
                })
            );

            const element = page.locator("fast-tabs");

            const activeIndicator = element.locator(".active-indicator");

            await expect(activeIndicator).not.toBeVisible();
        });

        test("should display an active indicator if the last tab is disabled", async ({
            page,
        }) => {
            await page.goto(fixtureURL("tabs--tabs", { "storyItems[2].disabled": true }));

            const element = page.locator("fast-tabs");

            await expect(element).toHaveJSProperty("showActiveIndicator", true);
        });

        test("should not allow selecting a tab that has been disabled after it has been connected", async ({
            page,
        }) => {
            await page.goto(fixtureURL("tabs--tabs", { activeid: "tab-0" }));

            const element = page.locator("fast-tabs");

            const tabs = element.locator("fast-tab");

            await expect(element).toHaveJSProperty("activeid", "tab-0");

            await tabs.nth(2).evaluate<void, FASTTab>(node => {
                node.disabled = true;
            });

            await tabs.nth(2).click({ force: true });

            await expect(element).toHaveJSProperty("activeid", "tab-0");
        });

        test("should allow selecting tab that has been enabled after it has been connected", async ({
            page,
        }) => {
            await page.goto(
                fixtureURL("tabs--tabs", {
                    activeid: "tab-0",
                    "storyItems.tabs.[2].disabled": true,
                })
            );

            const element = page.locator("fast-tabs");

            const tabs = element.locator("fast-tab");

            await expect(element).toHaveJSProperty("activeid", "tab-0");

            await expect(tabs.nth(2)).toHaveBooleanAttribute("disabled");

            await tabs.nth(2).evaluate<void, FASTTab>(node => {
                node.disabled = false;
            });

            await tabs.nth(2).click();

            await expect(element).toHaveJSProperty("activeid", "tab-2");
        });
    });
});
