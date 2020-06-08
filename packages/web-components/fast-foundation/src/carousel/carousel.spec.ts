import { assert, expect } from "chai";
import { Carousel, CarouselTemplate as template } from "./index";
import { Tab, TabTemplate } from "../tab";
import { TabPanel, TabPanelTemplate } from "../tab-panel";
import { Flipper, FlipperTemplate } from "../flipper";
import { fixture } from "../fixture";
import { DOM, customElement, ElementStyles } from "@microsoft/fast-element";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { CarouselPattern } from "./carousel";
import { Button, ButtonTemplate } from "../button";

@customElement({
    name: "fast-carousel",
    template,
})
class FASTCarousel extends Carousel {}

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
    name: "fast-flipper",
    template: FlipperTemplate,
})
class FASTFlipper extends Flipper {}

@customElement({
    name: "fast-button",
    template: ButtonTemplate,
})
class FASTButton extends Button {}

async function tabbedSetup() {
    const { connect, disconnect, element, parent } = await fixture<FASTCarousel>(
        "fast-carousel"
    );

    const tab1 = document.createElement("fast-tab") as FASTTab;
    tab1.id = "tab-1";
    const tab2 = document.createElement("fast-tab") as FASTTab;
    tab2.id = "tab-2";
    const tab3 = document.createElement("fast-tab") as FASTTab;
    tab3.id = "tab-3";

    const tabPanel1 = document.createElement("fast-tab-panel") as FASTTabPanel;
    tabPanel1.id = "panel-1";
    const tabPanel2 = document.createElement("fast-tab-panel") as FASTTabPanel;
    tabPanel2.id = "panel-2";
    const tabPanel3 = document.createElement("fast-tab-panel") as FASTTabPanel;
    tabPanel3.id = "panel-3";

    const img = document.createElement("img") as HTMLImageElement;
    img.src = "https://placehold.it/1300x600";
    tabPanel1.appendChild(img);
    tabPanel2.appendChild(img);
    tabPanel3.appendChild(img);

    element.appendChild(tab1);
    element.appendChild(tabPanel1);
    element.appendChild(tab2);
    element.appendChild(tabPanel2);
    element.appendChild(tab3);
    element.appendChild(tabPanel3);

    return {
        connect,
        disconnect,
        element,
        parent,
        document,
        tab1,
        tab2,
        tab3,
        tabPanel1,
        tabPanel2,
        tabPanel3,
    };
}
async function basicSetup() {
    const { connect, disconnect, element, parent } = await fixture<FASTCarousel>(
        "fast-carousel"
    );

    element.pattern = CarouselPattern.basic;
    const slide1 = document.createElement("img") as HTMLImageElement;
    slide1.src = "https://placehold.it/300";
    const slide2 = document.createElement("img") as HTMLImageElement;
    slide2.src = "https://placehold.it/300";
    const slide3 = document.createElement("img") as HTMLImageElement;
    slide3.src = "https://placehold.it/300";

    element.appendChild(slide1);
    element.appendChild(slide2);
    element.appendChild(slide3);

    return {
        connect,
        disconnect,
        element,
        parent,
        document,
        slide1,
        slide2,
        slide3,
    };
}

describe.only("Carousel", () => {
    describe("Tabbed", () => {
        it("should have a role of `group` on the host", async () => {
            const { element, connect, disconnect } = await tabbedSetup();

            await connect();

            assert.strictEqual(element.getAttribute("role"), "group");

            await disconnect();
        });
        it("Should have a role of tablist on the tablist", async () => {
            const { element, connect, disconnect } = await tabbedSetup();

            await connect();
            const tablist: HTMLDivElement = element.shadowRoot?.querySelector(
                ".tablist"
            ) as HTMLDivElement;

            expect(element.pattern).to.equal("tabbed");
            expect(tablist.getAttribute("role")).to.equal("tablist");

            await disconnect();
        });
        it("should emit a 'change' event when changing to the next tab", async () => {
            const { element, connect, disconnect } = await tabbedSetup();

            let wasChanged: boolean = false;

            await connect();

            element.addEventListener("change", e => {
                e.preventDefault();
                wasChanged = true;
            });

            element.adjust(1);

            await DOM.nextUpdate();

            expect(wasChanged).to.be.true;

            await disconnect();
        });
        it("should emit a 'change' event when changing to previous tab", async () => {
            const { element, connect, disconnect } = await tabbedSetup();

            let wasChanged: boolean = false;

            await connect();

            element.addEventListener("change", e => {
                e.preventDefault();
                wasChanged = true;
            });

            element.adjust(-1);

            await DOM.nextUpdate();

            expect(wasChanged).to.be.true;

            await disconnect();
        });
        it("should set an `aria-selected` attribute on the active tab when `activeid` is provided", async () => {
            const { element, connect, disconnect, tab2 } = await tabbedSetup();

            await connect();
            element.activeid = "tab-2";

            await DOM.nextUpdate();

            expect(tab2.getAttribute("aria-selected")).to.equal("true");

            await disconnect();
        });

        it("should start on the tab with the defined activeid", async () => {
            const { element, connect, disconnect } = await tabbedSetup();

            element.activeid = "tab-2";

            await connect();

            const activeTab: FASTTabPanel = element.querySelector(
                "[aria-selected='true']"
            ) as FASTTabPanel;

            await DOM.nextUpdate();

            expect(element.activeid).to.equal(activeTab.id);

            await disconnect();
        });
        it("should show previous tab when previous-flipper is clicked", async () => {
            const { element, connect, disconnect, tab3 } = await tabbedSetup();

            await connect();

            const previousFlipper: FASTFlipper = element.shadowRoot?.querySelector(
                "fast-flipper.previous"
            ) as FASTFlipper;

            previousFlipper.click();

            await DOM.nextUpdate();

            expect(tab3.getAttribute("aria-selected")).to.equal("true");

            await disconnect();
        });
        it("should show next tab when next-flipper is clicked", async () => {
            const { element, connect, disconnect, tab2 } = await tabbedSetup();

            await connect();

            const previousFlipper: FASTFlipper = element.shadowRoot?.querySelector(
                "fast-flipper.next"
            ) as FASTFlipper;

            previousFlipper.click();

            await DOM.nextUpdate();

            expect(tab2.getAttribute("aria-selected")).to.equal("true");

            await disconnect();
        });
        // it("should show previous tab on arrow left keypress and focus is within tablist", async () => {
        //     const { element, connect, disconnect, tab2, tab3, document } = await tabbedSetup();

        //     const event = new KeyboardEvent("keydown", {
        //         key:"ArrowLeft",
        //         keyCode: KeyCodes.arrowLeft,
        //     } as KeyboardEventInit);

        //     let wasInvoked = false;
        //     let tab: FASTTab;

        //     await connect();

        //     const tablist: HTMLDivElement = element.shadowRoot?.querySelector(
        //         ".tablist"
        //     ) as HTMLDivElement;

        //     tab = element.querySelector("fast-tab") as FASTTab;

        //     tablist.addEventListener("keydown", e => {
        //         console.log("saw tablist keydown: ", e, document.activeElement);
        //         wasInvoked = true;
        //         DOM.nextUpdate().then(() => {
        //             console.log(document.activeElement);
        //         })
        //     })

        //     tab.focus();

        //     expect(document.activeElement).to.equal(tab);

        //     tablist.dispatchEvent(event);
        //     tablist.dispatchEvent(event);
        //     expect(wasInvoked).to.be.true;

        //     expect(tab3.getAttribute("aria-selected")).to.equal("true")

        //     await disconnect();
        // });
        //TODO: Test right arrow keydown
        //TODO: Test autoplay rotation
    });
    describe("Basic", () => {
        it("should NOT have a tablist", async () => {
            const { element, connect, disconnect } = await basicSetup();
            element.pattern = CarouselPattern.basic;

            await connect();

            expect(element.shadowRoot?.querySelector(".tablist")).to.be.null;

            await disconnect();
        });
        // TODO: autoplay rotation
        // TODO: no rotation with autoplay off
        // TODO: rotation control clicking
        it("should pause when rotation control is clicked for the first time", async () => {
            const { element, connect, disconnect, slide1, slide3 } = await basicSetup();

            await connect();

            await DOM.nextUpdate();
            const rotationControlContainer: HTMLDivElement = element.shadowRoot?.querySelector(
                ".rotation-control-container"
            ) as HTMLDivElement;

            rotationControlContainer.addEventListener("click", e =>
                console.log("click on rotation container")
            );

            const rotationButton: FASTButton = rotationControlContainer.querySelector(
                "fast-button"
            ) as FASTButton;
            rotationButton.click();

            await DOM.nextUpdate();
            await DOM.nextUpdate();

            console.log(element);

            expect(element.getAttribute("paused")).to.equal("true");

            await disconnect();
        });
        it("should show previous slide when previous-flipper is clicked", async () => {
            const { element, connect, disconnect, slide1, slide3 } = await basicSetup();

            await connect();

            const previousFlipper: FASTFlipper = element.shadowRoot?.querySelector(
                "fast-flipper.previous"
            ) as FASTFlipper;

            previousFlipper.click();

            expect(slide3.className.includes("active-slide")).to.be.true;
            expect(slide1.className.includes("active-slide")).to.be.false;

            await disconnect();
        });
        it("should show next slide when next-flipper is clicked", async () => {
            const { element, connect, disconnect, slide1, slide2 } = await basicSetup();

            await connect();

            const nextFlipper: FASTFlipper = element.shadowRoot?.querySelector(
                "fast-flipper.next"
            ) as FASTFlipper;

            nextFlipper.click();

            expect(slide2.className.includes("active-slide")).to.be.true;
            expect(slide1.className.includes("active-slide")).to.be.false;

            await disconnect();
        });
    });
});
