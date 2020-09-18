import { expect } from "chai";
import { TabsOrientation, Tabs, TabsTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement, html } from "@microsoft/fast-element";

@customElement({
    name: "fast-tabs",
    template,
})
class FASTTabs extends Tabs {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTTabs>("fast-tabs");

    return { element, connect, disconnect };
}

// TODO: Need to add tests for keyboard handling, activeIndicator position, and focus managemen
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

        expect(element.orientation).to.equal(`${TabsOrientation.horizontal}`);

        await disconnect();
    });

    it("should add a class equal to the `orientation` value", async () => {
        const { element, connect, disconnect } = await setup();
        element.orientation = TabsOrientation.horizontal;

        await connect();

        expect(element.classList.contains(`${TabsOrientation.horizontal}`)).to.equal(
            true
        );

        element.orientation = TabsOrientation.vertical;

        await DOM.nextUpdate();

        expect(element.classList.contains(`${TabsOrientation.vertical}`)).to.equal(true);
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

    it("should set an `id` attribute on the active tab when an `id is provided", async () => {
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
            const { element, connect, disconnect } = await fixture(html<FASTTabs>`
                <fast-tabs activeId="02">
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

            expect(
                element.querySelectorAll("fast-tab")[1]?.getAttribute("aria-selected")
            ).to.equal("true");

            await disconnect();
        });

        it("should default the first tab as the active index if `activeId` is NOT provided", async () => {
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

            expect(
                element.querySelector("fast-tab")?.getAttribute("aria-selected")
            ).to.equal("true");

            await disconnect();
        });

        it("should set an `aria-controls` attribute on the tab with a value of the panel id when `activeId` is provided", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTTabs>`
                <fast-tabs activeId="02">
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

            expect(
                element.querySelectorAll("fast-tab")[1]?.getAttribute("aria-controls")
            ).to.equal("panel02");

            await disconnect();
        });
    });

    describe("active tabpanel", () => {
        it("should set an `aria-labelledby` attribute on the tabpanel with a value of the tab id when `activeId` is provided", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTTabs>`
                <fast-tabs activeId="02">
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

            expect(
                element
                    .querySelectorAll("fast-tab-panel")[1]
                    ?.getAttribute("aria-labelledby")
            ).to.equal("02");

            await disconnect();
        });

        it("should set an attribute of hidden if the tabpanel is not active", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTTabs>`
                <fast-tabs activeId="02">
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

            expect(
                element.querySelectorAll("fast-tab-panel")[0]?.hasAttribute("hidden")
            ).to.equal(true);
            expect(
                element.querySelectorAll("fast-tab-panel")[2]?.hasAttribute("hidden")
            ).to.equal(true);

            await disconnect();
        });

        it("should NOT set an attribute of hidden if the tabpanel is active", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTTabs>`
                <fast-tabs activeId="02">
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

            expect(
                element.querySelectorAll("fast-tab-panel")[1]?.hasAttribute("hidden")
            ).to.equal(false);

            await disconnect();
        });
    });
});
