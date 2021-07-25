import { expect } from "chai";
import { AnchoredRegion, anchoredRegionTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";

const FASTAnchoredRegion = AnchoredRegion.compose({
    baseName: "anchored-region",
    template
})

async function setup() {
    const { element, connect, disconnect, parent } = await fixture(FASTAnchoredRegion());

    const button = document.createElement("button");
    const content = document.createElement("div");

    button.id = "anchor";
    button.setAttribute("style", "width: 100px; height: 100px;");

    content.id = "content";
    content.setAttribute("style", "width: 100px; height: 100px;");

    parent.id = "viewport";
    parent.setAttribute("style", "width: 1000px; height: 1000px;");
    parent.insertBefore(button, element);

    element.appendChild(content);
    element.setAttribute("viewport", "viewport");
    element.setAttribute("anchor", "anchor");
    element.id = "region";

    return { element, connect, disconnect, content };
}

describe("Anchored Region", () => {
    it("should set positioning modes to 'uncontrolled' by default", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.verticalPositioningMode).to.equal("uncontrolled");
        expect(element.horizontalPositioningMode).to.equal("uncontrolled");

        await disconnect();
    });

    it("should assign anchor and viewport elements by id", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        await DOM.nextUpdate();

        expect(element.anchorElement?.id).to.equal("anchor");
        expect(element.viewportElement?.id).to.equal("viewport");

        await disconnect();
    });

    it("should be sized to match content by default", async () => {
        const { element, connect, disconnect, content } = await setup();

        await connect();
        await DOM.nextUpdate();
        
        expect(element.clientHeight).to.equal(content.clientHeight);
        expect(element.clientWidth).to.equal(content.clientWidth);

        await disconnect();
    });
});