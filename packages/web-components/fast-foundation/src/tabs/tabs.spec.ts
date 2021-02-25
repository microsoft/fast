import { assert, expect } from "chai";
import { css, DOM, customElement, html } from "@microsoft/fast-element";
import { fixture } from "../fixture";
import { Tab, TabTemplate } from "../tab";
import { TabPanel, TabPanelTemplate } from "../tab-panel";
import { TabsOrientation, Tabs, TabsTemplate as template } from "./index";

@customElement({
    name: "fast-tab",
    template: TabTemplate,
})
class FASTTab extends Tab {}

@customElement({
    name: "fast-tab-panel",
    template: TabPanelTemplate,
})
class FASTTabPanel extends TabPanel {}

@customElement({
    name: "fast-tabs",
    template,
    styles: css`
        .activeIndicatorTransition {
            transition: transform 1ms;
        }
    `,
})
class FASTTabs extends Tabs {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTTabs>("fast-tabs");

    for (let i = 1; i < 4; i++) {
        const tab = document.createElement("fast-tab") as FASTTab;
        tab.id = `tab${i}`;

        const panel = document.createElement("fast-tab-panel") as FASTTabPanel;
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

        await DOM.nextUpdate();

        expect(element.classList.contains(TabsOrientation.vertical)).to.equal(true);
        await disconnect();
    });

    it("should set a property equal to activeIndicator when `activeIndicator` property is true", async () => {
        const { element, connect, disconnect } = await setup();
        element.setAttribute("activeIndicator", "false");

        await connect();

        expect(element.activeindicator).to.equal(false);

        await disconnect();
    });

    it("should render an internal element with a class of 'activeIndicator' when `activeIndicator` is true", async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        expect(element.shadowRoot?.querySelector(".activeIndicator")).to.exist;

        await disconnect();
    });

    it("should set an `id` attribute on the active tab when an `id` is provided", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTTabs>`
            <fast-tabs>
                <fast-tab id="01">Tab one</fast-tab>
                <fast-tab id="02">Tab two</fast-tab>
                <fast-tab id="03">Tab three</fast-tab>
                <fast-tab-panel>
                    Tab one content. This is for testing.
                </fast-tab-panel>
                <fast-tab-panel>
                    Tab two content. This is for testing.
                </fast-tab-panel>
                <fast-tab-panel>
                    Tab three content. This is for testing.
                </fast-tab-panel>
            </fast-tabs>
        `);

        await connect();

        expect(element.querySelector("fast-tab")?.getAttribute("id")).to.equal("01");
        expect(element.querySelectorAll("fast-tab")[1]?.getAttribute("id")).to.equal(
            "02"
        );

        await disconnect();
    });

    it("should set an `id` attribute tab items relative to the index if an `id is NOT provided", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTTabs>`
            <fast-tabs>
                <fast-tab>Tab one</fast-tab>
                <fast-tab>Tab two</fast-tab>
                <fast-tab>Tab three</fast-tab>
                <fast-tab-panel>
                    Tab one content. This is for testing.
                </fast-tab-panel>
                <fast-tab-panel>
                    Tab two content. This is for testing.
                </fast-tab-panel>
                <fast-tab-panel>
                    Tab three content. This is for testing.
                </fast-tab-panel>
            </fast-tabs>
        `);

        await connect();

        expect(element.querySelector("fast-tab")?.getAttribute("id")).to.equal("tab-1");
        expect(element.querySelectorAll("fast-tab")[1]?.getAttribute("id")).to.equal(
            "tab-2"
        );

        await disconnect();
    });

    it("should set an `id` attribute on the tabpanel when an `id is provided", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTTabs>`
            <fast-tabs>
                <fast-tab id="01">Tab one</fast-tab>
                <fast-tab id="02">Tab two</fast-tab>
                <fast-tab id="03">Tab three</fast-tab>
                <fast-tab-panel id="panel01">
                    Tab one content. This is for testing.
                </fast-tab-panel>
                <fast-tab-panel id="panel02">
                    Tab two content. This is for testing.
                </fast-tab-panel>
                <fast-tab-panel id="panel03">
                    Tab three content. This is for testing.
                </fast-tab-panel>
            </fast-tabs>
        `);

        await connect();

        expect(element.querySelector("fast-tab-panel")?.getAttribute("id")).to.equal(
            "panel01"
        );
        expect(
            element.querySelectorAll("fast-tab-panel")[1]?.getAttribute("id")
        ).to.equal("panel02");

        await disconnect();
    });

    it("should set an `id` attribute on tabpanel items relative to the index if an `id is NOT provided", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTTabs>`
            <fast-tabs>
                <fast-tab>Tab one</fast-tab>
                <fast-tab>Tab two</fast-tab>
                <fast-tab>Tab three</fast-tab>
                <fast-tab-panel>
                    Tab one content. This is for testing.
                </fast-tab-panel>
                <fast-tab-panel>
                    Tab two content. This is for testing.
                </fast-tab-panel>
                <fast-tab-panel>
                    Tab three content. This is for testing.
                </fast-tab-panel>
            </fast-tabs>
        `);

        await connect();

        expect(element.querySelector("fast-tab-panel")?.getAttribute("id")).to.equal(
            "panel-1"
        );
        expect(
            element.querySelectorAll("fast-tab-panel")[1]?.getAttribute("id")
        ).to.equal("panel-2");

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

            const activeIndicator = element.shadowRoot!.querySelector(
                '[part="activeIndicator"]'
            )!;

            await new Promise(resolve => {
                activeIndicator.addEventListener("transitionend", resolve, {
                    once: true,
                });

                tab2.click();

                expect(activeIndicator.classList.contains("activeIndicatorTransition")).to
                    .be.true;
            });

            await DOM.nextUpdate();

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
            const { element, connect, disconnect } = await fixture<FASTTabs>(html<
                FASTTabs
            >`
                <fast-tabs>
                    <fast-tab disabled>Tab one</fast-tab>
                    <fast-tab disabled>Tab two</fast-tab>
                    <fast-tab disabled>Tab three</fast-tab>
                    <fast-tab-panel>
                        Tab one content. This is for testing.
                    </fast-tab-panel>
                    <fast-tab-panel>
                        Tab two content. This is for testing.
                    </fast-tab-panel>
                    <fast-tab-panel>
                        Tab three content. This is for testing.
                    </fast-tab-panel>
                </fast-tabs>
            `);

            await connect();

            expect(element.showActiveIndicator).to.be.false;

            await disconnect();
        });

        it("should display an active indicator if the last tab is disabled", async () => {
            const { element, connect, disconnect } = await fixture<FASTTabs>(html<
                FASTTabs
            >`
                <fast-tabs>
                    <fast-tab>Tab one</fast-tab>
                    <fast-tab>Tab two</fast-tab>
                    <fast-tab disabled>Tab three</fast-tab>
                    <fast-tab-panel>
                        Tab one content. This is for testing.
                    </fast-tab-panel>
                    <fast-tab-panel>
                        Tab two content. This is for testing.
                    </fast-tab-panel>
                    <fast-tab-panel>
                        Tab three content. This is for testing.
                    </fast-tab-panel>
                </fast-tabs>
            `);

            await connect();

            expect(element.showActiveIndicator).to.be.true;

            await disconnect();
        });
    });
});
