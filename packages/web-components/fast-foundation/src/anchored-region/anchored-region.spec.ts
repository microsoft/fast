import { expect } from "chai";
import { FASTAnchoredRegion, anchoredRegionTemplate } from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { Updates } from "@microsoft/fast-element";

const anchoredRegionName = uniqueElementName();
FASTAnchoredRegion.define({
    name: anchoredRegionName,
    template: anchoredRegionTemplate()
});

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<FASTAnchoredRegion>(anchoredRegionName);

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
        await Updates.next();

        expect(element.anchorElement?.id).to.equal("anchor");
        expect(element.viewportElement?.id).to.equal("viewport");

        await disconnect();
    });

    it("should be sized to match content by default", async () => {
        const { element, connect, disconnect, content } = await setup();

        await connect();
        await Updates.next();

        expect(element.clientHeight).to.equal(content.clientHeight);
        expect(element.clientWidth).to.equal(content.clientWidth);

        await disconnect();
    });
});
