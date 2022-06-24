import { css, Updates } from "@microsoft/fast-element";
import { expect } from "chai";
import { TabPanel, tabPanelTemplate } from "../tab-panel/index.js";
import { Tab, tabTemplate } from "../tab/index.js";
import { fixture } from "../testing/fixture.js";
import { Tabs, TabsOrientation, tabsTemplate as template } from "./index.js";

const FASTTab = Tab.compose({
    baseName: "tab",
    template: tabTemplate,
})

const FASTTabPanel = TabPanel.compose({
    baseName: "tab-panel",
    template: tabPanelTemplate,
})


const FASTTabs = Tabs.compose({
    baseName: "tabs",
    template,
    styles: css`
        .activeIndicatorTransition {
            transition: transform 1ms;
        }
    `,
})

async function setup() {
    const { element, connect, disconnect } = await fixture([FASTTabs(), FASTTabPanel(), FASTTab()])

    for (let i = 1; i < 4; i++) {
        const tab = document.createElement("fast-tab") as Tab;
        tab.id = `tab${i}`;

        const panel = document.createElement("fast-tab-panel") as TabPanel;
        panel.id = `panel${i}`;
        element.appendChild(panel);
        element.insertBefore(tab, element.querySelector("fast-tab-panel"));
    }

    const [tabPanel1, tabPanel2, tabPanel3] = Array.from(
        element.querySelectorAll("fast-tab-panel")
    );
    const [tab1, tab2, tab3] = Array.from(element.querySelectorAll("fast-tab"));

    return {
        element,
        connect,
        disconnect,
        tab1,
        tab2,
        tab3,
        tabPanel1,
        tabPanel2,
        tabPanel3,
    };
}

// TODO: Need to add tests for keyboard handling, activeIndicator position, and focus management
describe("Tabs", () => {
    it("should have an internal element with a role of `tablist`", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(
            element.shadowRoot?.querySelector(".tablist")?.getAttribute("role")
        ).to.equal("tablist");

        await disconnect();
    });

    it("should set a default value of `orientation` when orientation is not provided", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.orientation).to.equal(TabsOrientation.horizontal);

        await disconnect();
    });

    it("should add a class equal to the `orientation` value", async () => {
        const { element, connect, disconnect } = await setup();
        element.orientation = TabsOrientation.horizontal;

        await connect();

        expect(element.classList.contains(TabsOrientation.horizontal)).to.equal(true);

        element.orientation = TabsOrientation.vertical;

        await Updates.next();

        expect(element.classList.contains(TabsOrientation.vertical)).to.equal(true);
        await disconnect();
    });

    it("should set a property equal to hideActiveIndicator when `hideActiveIndicator` property is true", async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute("hide-active-indicator", "true");

        await connect();

        expect(element.hideActiveIndicator).to.equal(true);

        await disconnect();
    });

    it("should set a default value of `hideActiveIndicator` to false", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.hideActiveIndicator).to.equal(false);
        expect(element.hasAttribute("hide-active-indicator")).to.equal(false);

        await disconnect();
    });

    it("should render an internal element with a class of 'active-indicator' when `hide-active-indicator` is false", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.shadowRoot?.querySelector(".active-indicator")).to.exist;

        await disconnect();
    });

    it("should set an `id` attribute on the active tab when an `id` is provided", async () => {
        const { element, connect, disconnect, tab1, tab2, tab3 } = await setup();

        tab1.id = "01";
        tab2.id = "02";
        tab3.id = "03";

        await connect();

        expect(element.querySelector("fast-tab")?.getAttribute("id")).to.equal("01");
        expect(element.querySelectorAll("fast-tab")[1]?.getAttribute("id")).to.equal(
            "02"
        );

        await disconnect();
    });

    it("should set an `id` attribute tab items with a unique ID when an `id is NOT provided", async () => {
        const { element, connect, disconnect } = await fixture([FASTTabs(), FASTTabPanel(), FASTTab()])

        for (let i = 0; i < 4; i++) {
            const tab = document.createElement("fast-tab") as Tab;
            const panel = document.createElement("fast-tab-panel") as TabPanel;

            element.appendChild(panel);
            element.insertBefore(tab, element.querySelector("fast-tab-panel"));
        }

        await connect();

        expect(element.querySelectorAll("fast-tab")[0]?.getAttribute("id")).to.not.be.undefined;
        expect(element.querySelectorAll("fast-tab")[1]?.getAttribute("id")).to.not.be.undefined;
        expect(element.querySelectorAll("fast-tab")[2]?.getAttribute("id")).to.not.be.undefined;
        expect(element.querySelectorAll("fast-tab")[3]?.getAttribute("id")).to.not.be.undefined;

        await disconnect();
    });

    it("should set the corresponding tab panel aria-labelledby attribute to the corresponding tab unique ID when a tab id is NOT provided", async () => {
        const { element, connect, disconnect } = await fixture([FASTTabs(), FASTTabPanel(), FASTTab()])

        for (let i = 0; i < 4; i++) {
            const tab = document.createElement("fast-tab") as Tab;
            const panel = document.createElement("fast-tab-panel") as TabPanel;

            element.appendChild(panel);
            element.insertBefore(tab, element.querySelector("fast-tab-panel"));
        }

        await connect();

        let tabId0: string | null = element.querySelectorAll("fast-tab")[0]?.getAttribute("id");
        let tabId1: string | null = element.querySelectorAll("fast-tab")[1]?.getAttribute("id");
        let tabId2: string | null = element.querySelectorAll("fast-tab")[2]?.getAttribute("id");
        let tabId3: string | null = element.querySelectorAll("fast-tab")[3]?.getAttribute("id");

        expect(element.querySelectorAll("fast-tab-panel")[0]?.getAttribute("aria-labelledby")).to.equal(tabId0);
        expect(element.querySelectorAll("fast-tab-panel")[1]?.getAttribute("aria-labelledby")).to.equal(tabId1);
        expect(element.querySelectorAll("fast-tab-panel")[2]?.getAttribute("aria-labelledby")).to.equal(tabId2);
        expect(element.querySelectorAll("fast-tab-panel")[3]?.getAttribute("aria-labelledby")).to.equal(tabId3);

        await disconnect();
    });

    it("should set the corresponding tab panel aria-labelledby attribute to the corresponding tab unique ID when a tab id is NOT provided and additional tabs and panels are added", async () => {
        const { element, connect, disconnect } = await fixture([FASTTabs(), FASTTabPanel(), FASTTab()])

        for (let i = 0; i < 4; i++) {
            const tab = document.createElement("fast-tab") as Tab;
            const panel = document.createElement("fast-tab-panel") as TabPanel;

            element.appendChild(panel);
            element.insertBefore(tab, element.querySelector("fast-tab-panel"));
        }

        await connect();

        let tabId0: string | null = element.querySelectorAll("fast-tab")[0]?.getAttribute("id");
        let tabId1: string | null = element.querySelectorAll("fast-tab")[1]?.getAttribute("id");
        let tabId2: string | null = element.querySelectorAll("fast-tab")[2]?.getAttribute("id");
        let tabId3: string | null = element.querySelectorAll("fast-tab")[3]?.getAttribute("id");

        expect(element.querySelectorAll("fast-tab-panel")[0]?.getAttribute("aria-labelledby")).to.equal(tabId0);
        expect(element.querySelectorAll("fast-tab-panel")[1]?.getAttribute("aria-labelledby")).to.equal(tabId1);
        expect(element.querySelectorAll("fast-tab-panel")[2]?.getAttribute("aria-labelledby")).to.equal(tabId2);
        expect(element.querySelectorAll("fast-tab-panel")[3]?.getAttribute("aria-labelledby")).to.equal(tabId3);

        const newTab = document.createElement("fast-tab") as Tab;
        const newPanel = document.createElement("fast-tab-panel") as TabPanel;

        element.appendChild(newPanel);
        element.insertBefore(newTab, element.querySelector("fast-tab-panel"));

        await Updates.next();

        tabId0 = element.querySelectorAll("fast-tab")[0]?.getAttribute("id");
        tabId1 = element.querySelectorAll("fast-tab")[1]?.getAttribute("id");
        tabId2 = element.querySelectorAll("fast-tab")[2]?.getAttribute("id");
        tabId3 = element.querySelectorAll("fast-tab")[3]?.getAttribute("id");
        let tabId4 = element.querySelectorAll("fast-tab")[4]?.getAttribute("id");

        expect(element.querySelectorAll("fast-tab-panel")[0]?.getAttribute("aria-labelledby")).to.equal(tabId0);
        expect(element.querySelectorAll("fast-tab-panel")[1]?.getAttribute("aria-labelledby")).to.equal(tabId1);
        expect(element.querySelectorAll("fast-tab-panel")[2]?.getAttribute("aria-labelledby")).to.equal(tabId2);
        expect(element.querySelectorAll("fast-tab-panel")[3]?.getAttribute("aria-labelledby")).to.equal(tabId3);
        expect(element.querySelectorAll("fast-tab-panel")[4]?.getAttribute("aria-labelledby")).to.equal(tabId4);

        await disconnect();
    });

    it("should set an `id` attribute on the tabpanel when an `id is provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.querySelector("fast-tab-panel")?.getAttribute("id")).to.equal(
            "panel1"
        );
        expect(
            element.querySelectorAll("fast-tab-panel")[1]?.getAttribute("id")
        ).to.equal("panel2");

        await disconnect();
    });

    it("should set the tabpanel id to the corresponding tab aria-controls attribute when a tabpanel id is NOT provided", async () => {
        const { element, connect, disconnect } = await fixture([FASTTabs(), FASTTabPanel(), FASTTab()])

        for (let i = 0; i < 4; i++) {
            const tab = document.createElement("fast-tab") as Tab;
            const panel = document.createElement("fast-tab-panel") as TabPanel;

            element.appendChild(panel);
            element.insertBefore(tab, element.querySelector("fast-tab-panel"));
        }

        await connect();

        let tabpanelId0: string | null = element.querySelectorAll("fast-tab-panel")[0]?.getAttribute("id");
        let tabpanelId1: string | null = element.querySelectorAll("fast-tab-panel")[1]?.getAttribute("id");
        let tabpanelId2: string | null = element.querySelectorAll("fast-tab-panel")[2]?.getAttribute("id");
        let tabpanelId3: string | null = element.querySelectorAll("fast-tab-panel")[3]?.getAttribute("id");

        expect(element.querySelectorAll("fast-tab")[0]?.getAttribute("aria-controls")).to.equal(tabpanelId0);
        expect(element.querySelectorAll("fast-tab")[1]?.getAttribute("aria-controls")).to.equal(tabpanelId1);
        expect(element.querySelectorAll("fast-tab")[2]?.getAttribute("aria-controls")).to.equal(tabpanelId2);
        expect(element.querySelectorAll("fast-tab")[3]?.getAttribute("aria-controls")).to.equal(tabpanelId3);

        await disconnect();
    });

    it("should set the tabpanel id to the corresponding tab aria-controls attribute when a tabpanel id is NOT provided and new tabs and tabpanels are added", async () => {
        const { element, connect, disconnect } = await fixture([FASTTabs(), FASTTabPanel(), FASTTab()])

        for (let i = 0; i < 4; i++) {
            const tab = document.createElement("fast-tab") as Tab;
            const panel = document.createElement("fast-tab-panel") as TabPanel;

            element.appendChild(panel);
            element.insertBefore(tab, element.querySelector("fast-tab-panel"));
        }

        await connect();

        let tabpanelId0: string | null = element.querySelectorAll("fast-tab-panel")[0]?.getAttribute("id");
        let tabpanelId1: string | null = element.querySelectorAll("fast-tab-panel")[1]?.getAttribute("id");
        let tabpanelId2: string | null = element.querySelectorAll("fast-tab-panel")[2]?.getAttribute("id");
        let tabpanelId3: string | null = element.querySelectorAll("fast-tab-panel")[3]?.getAttribute("id");

        expect(element.querySelectorAll("fast-tab")[0]?.getAttribute("aria-controls")).to.equal(tabpanelId0);
        expect(element.querySelectorAll("fast-tab")[1]?.getAttribute("aria-controls")).to.equal(tabpanelId1);
        expect(element.querySelectorAll("fast-tab")[2]?.getAttribute("aria-controls")).to.equal(tabpanelId2);
        expect(element.querySelectorAll("fast-tab")[3]?.getAttribute("aria-controls")).to.equal(tabpanelId3);

        const newTab = document.createElement("fast-tab") as Tab;
        const newPanel = document.createElement("fast-tab-panel") as TabPanel;

        element.appendChild(newPanel);
        element.insertBefore(newTab, element.querySelector("fast-tab-panel"));

        await Updates.next();

        tabpanelId0 = element.querySelectorAll("fast-tab-panel")[0]?.getAttribute("id");
        tabpanelId1 = element.querySelectorAll("fast-tab-panel")[1]?.getAttribute("id");
        tabpanelId2 = element.querySelectorAll("fast-tab-panel")[2]?.getAttribute("id");
        tabpanelId3 = element.querySelectorAll("fast-tab-panel")[3]?.getAttribute("id");
        let tabpanelId4 = element.querySelectorAll("fast-tab-panel")[4]?.getAttribute("id");

        expect(element.querySelectorAll("fast-tab")[0]?.getAttribute("aria-controls")).to.equal(tabpanelId0);
        expect(element.querySelectorAll("fast-tab")[1]?.getAttribute("aria-controls")).to.equal(tabpanelId1);
        expect(element.querySelectorAll("fast-tab")[2]?.getAttribute("aria-controls")).to.equal(tabpanelId2);
        expect(element.querySelectorAll("fast-tab")[3]?.getAttribute("aria-controls")).to.equal(tabpanelId3);
        expect(element.querySelectorAll("fast-tab")[4]?.getAttribute("aria-controls")).to.equal(tabpanelId4);

        await disconnect();
    });

    describe("active tab", () => {
        it("should set an `aria-selected` attribute on the active tab when `activeId` is provided", async () => {
            const { element, connect, disconnect, tab2 } = await setup();

            await connect();

            element.activeid = "tab2";

            expect(tab2.getAttribute("aria-selected")).to.equal("true");

            await disconnect();
        });

        it("should default the first tab as the active index if `activeId` is NOT provided", async () => {
            const { connect, disconnect, tab1 } = await setup();

            await connect();

            expect(tab1.getAttribute("aria-selected")).to.equal("true");

            await disconnect();
        });

        it("should set an `aria-selected` attribute on the active tab when `activeId` is provided", async () => {
            const { element, connect, disconnect, tab2 } = await setup();

            element.activeid = "tab2";

            await connect();

            expect(tab2.getAttribute("aria-selected")).to.equal("true");

            await disconnect();
        });

        it("should update `aria-selected` attribute on the active tab when `activeId` is updated", async () => {
            const { element, connect, disconnect, tab2, tab3 } = await setup();

            element.setAttribute("activeId", "tab2");

            await connect();

            expect(tab2.getAttribute("aria-selected")).to.equal("true");

            element.setAttribute("activeId", "tab3");

            expect(tab3.getAttribute("aria-selected")).to.equal("true");

            await disconnect();
        });

        it("should skip updating the active indicator if click twice on the same tab", async () => {
            const { element, connect, disconnect, tab2 } = await setup();

            await connect();

            const activeIndicator = element.activeIndicatorRef;

            await new Promise(resolve => {
                activeIndicator.addEventListener("transitionend", resolve, {
                    once: true,
                });

                tab2.click();

                expect(activeIndicator.classList.contains("activeIndicatorTransition")).to
                    .be.true;
            });

            await Updates.next();

            tab2.click();

            expect(activeIndicator.classList.contains("activeIndicatorTransition")).to.be
                .false;

            await disconnect();
        });
    });

    describe("active tabpanel", () => {
        it("should set an `aria-labelledby` attribute on the tabpanel with a value of the tab id when `activeid` is provided", async () => {
            const { element, connect, disconnect, tabPanel2 } = await setup();

            await connect();

            element.activeid = "tab2";

            expect(tabPanel2.getAttribute("aria-labelledby")).to.equal("tab2");

            await disconnect();
        });

        it("should set an attribute of hidden if the tabpanel is not active", async () => {
            const { element, connect, disconnect, tabPanel1, tabPanel3 } = await setup();

            await connect();

            element.activeid = "tab2";

            expect(tabPanel1.hasAttribute("hidden")).to.equal(true);

            expect(tabPanel3.hasAttribute("hidden")).to.equal(true);

            await disconnect();
        });

        it("should NOT set an attribute of hidden if the tabpanel is active", async () => {
            const { element, connect, disconnect, tabPanel2 } = await setup();

            await connect();

            element.activeid = "tab2";

            expect(tabPanel2.hasAttribute("hidden")).to.equal(false);

            await disconnect();
        });
    });

    describe("disabled tab", () => {
        it("should not display an active indicator if all tabs are disabled", async () => {
            const { element, connect, disconnect } = await fixture([FASTTabs(), FASTTabPanel(), FASTTab()]);

            for (let i = 1; i < 4; i++) {
                const tab = document.createElement("fast-tab") as Tab;
                tab.disabled = true;

                const panel = document.createElement("fast-tab-panel") as TabPanel;
                panel.id = `panel${i}`;
                element.appendChild(panel);
                element.insertBefore(tab, element.querySelector("fast-tab-panel"));
            }

            await connect();

            expect(element.showActiveIndicator).to.be.false;

            await disconnect();
        });

        it("should display an active indicator if the last tab is disabled", async () => {
            const { element, connect, disconnect } = await fixture([FASTTabs(), FASTTabPanel(), FASTTab()]);

            for (let i = 1; i < 4; i++) {
                const tab = document.createElement("fast-tab") as Tab;
                tab.id = `tab${i}`;

                if (i === 3) {
                    tab.disabled = true;
                }

                const panel = document.createElement("fast-tab-panel") as TabPanel;
                panel.id = `panel${i}`;
                element.appendChild(panel);
                element.insertBefore(tab, element.querySelector("fast-tab-panel"));
            }

            await connect();

            expect(element.showActiveIndicator).to.be.true;

            await disconnect();
        });

        it("should not allow selecting tab that has been disabled after it has been connected", async () => {
            const { element, connect, disconnect } = await fixture([FASTTabs(), FASTTabPanel(), FASTTab()]);

            for (let i = 1; i < 4; i++) {
                const tab = document.createElement("fast-tab") as Tab;
                tab.id = `tab${i}`;

                const panel = document.createElement("fast-tab-panel") as TabPanel;
                panel.id = `panel${i}`;
                element.appendChild(panel);
                element.insertBefore(tab, element.querySelector("fast-tab-panel"));
            }

            await connect();

            element.activeid = "tab1";
            const tab3 = element.querySelectorAll("fast-tab")[2] as Tab;
            tab3.disabled = true;
            await Updates.next();
            tab3.click();

            expect(element.activeid).to.equal("tab1");

            await disconnect();
        });

        it("should allow selecting tab that has been enabled after it has been connected", async () => {
            const { element, connect, disconnect } = await fixture([FASTTabs(), FASTTabPanel(), FASTTab()]);

            for (let i = 1; i < 4; i++) {
                const tab = document.createElement("fast-tab") as Tab;
                tab.id = `tab${i}`;

                if (i === 3) {
                    tab.disabled = true;
                }

                const panel = document.createElement("fast-tab-panel") as TabPanel;
                panel.id = `panel${i}`;
                element.appendChild(panel);
                element.insertBefore(tab, element.querySelector("fast-tab-panel"));
            }

            await connect();

            element.activeid = "tab1";
            const tab3 = element.querySelectorAll("fast-tab")[2] as Tab;
            tab3.disabled = false;
            await Updates.next();
            tab3.click();

            expect(element.activeid).to.equal("tab3");

            await disconnect();
        });
    });
});
