import { expect } from "chai";
import { Updates } from "@microsoft/fast-element";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { tooltipTemplate, FASTTooltip } from "./index.js";
import { TooltipPosition } from "./tooltip.js";
import { FASTAnchoredRegion, anchoredRegionTemplate } from '../anchored-region/index.js';

const anchoredRegionName = uniqueElementName();
FASTAnchoredRegion.define({
    name: anchoredRegionName,
    template: anchoredRegionTemplate()
});

const tooltipName = uniqueElementName();
FASTTooltip.define({
    name: tooltipName,
    template: tooltipTemplate({
        anchoredRegion: anchoredRegionName
    })
});

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<FASTTooltip>(tooltipName);

    const button = document.createElement("button");
    button.id = "anchor";

    const button2 = document.createElement("button");
    button2.id = "anchor2";

    parent.insertBefore(button, element);
    parent.insertBefore(button2, element);

    element.setAttribute("anchor", "anchor");
    element.id = "tooltip";

    return { element, connect, disconnect };
}

describe("Tooltip", () => {
    it("should not render the tooltip by default", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;
        tooltip.delay = 0;

        await connect();
        await Updates.next();

        expect(tooltip.tooltipVisible).to.equal(false);
        expect(tooltip.shadowRoot?.querySelector(anchoredRegionName)).to.equal(null);

        await disconnect();
    });

    it("should render the tooltip when visible is true", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.visible = true;
        tooltip.delay = 0;

        await connect();
        await Updates.next();

        expect(tooltip.tooltipVisible).to.equal(true);
        expect(tooltip.shadowRoot?.querySelector(anchoredRegionName)).not.to.equal(
            null
        );

        await disconnect();
    });

    it("should not render the tooltip when visible is false", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.visible = false;
        tooltip.delay = 0;

        await connect();
        await Updates.next();

        expect(tooltip.tooltipVisible).to.equal(false);
        expect(tooltip.shadowRoot?.querySelector(anchoredRegionName)).to.equal(null);

        await disconnect();
    });

    it("should set positioning mode to dynamic by default", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        await connect();

        expect(tooltip.verticalPositioningMode).to.equal("dynamic");
        expect(tooltip.horizontalPositioningMode).to.equal("dynamic");

        await disconnect();
    });

    it("should set update mode to 'anchor' by default", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        await connect();

        expect(tooltip.autoUpdateMode).to.equal("anchor");

        await disconnect();
    });

    it("should set horizontal position to 'center' and vertical position to 'undefined' by default", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        await connect();

        expect(tooltip.verticalDefaultPosition).to.equal(undefined);
        expect(tooltip.horizontalDefaultPosition).to.equal("center");

        await disconnect();
    });

    it("should set horizontal scaling and vertical scaling to match content by default", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        await connect();

        expect(tooltip.verticalScaling).to.equal("content");
        expect(tooltip.horizontalScaling).to.equal("content");

        await disconnect();
    });

    // top position settings

    it("should set vertical and horizontal positioning mode to locktodefault when position is set to top", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.top;

        await connect();

        expect(tooltip.verticalPositioningMode).to.equal("locktodefault");
        expect(tooltip.horizontalPositioningMode).to.equal("locktodefault");

        await disconnect();
    });

    it("should set default vertical position to top when position is set to top", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.top;

        await connect();

        expect(tooltip.verticalDefaultPosition).to.equal("top");
        expect(tooltip.horizontalDefaultPosition).to.equal("center");

        await disconnect();
    });

    it("should set scaling to match content when position is set to top", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.top;

        await connect();

        expect(tooltip.verticalScaling).to.equal("content");
        expect(tooltip.horizontalScaling).to.equal("content");

        await disconnect();
    });

    // bottom position settings

    it("should set vertical positioning mode to locked when position is set to bottom", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.bottom;

        await connect();

        expect(tooltip.verticalPositioningMode).to.equal("locktodefault");
        expect(tooltip.horizontalPositioningMode).to.equal("locktodefault");

        await disconnect();
    });

    it("should set default vertical position to bottom when position is set to bottom", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.bottom;

        await connect();

        expect(tooltip.verticalDefaultPosition).to.equal("bottom");
        expect(tooltip.horizontalDefaultPosition).to.equal("center");

        await disconnect();
    });

    it("should set horizontal scaling to match anchor and vertical scaling to match content when position is set to bottom", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.bottom;

        await connect();

        expect(tooltip.verticalScaling).to.equal("content");
        expect(tooltip.horizontalScaling).to.equal("content");

        await disconnect();
    });

    // left position settings

    it("should set positioning mode to locked when position is set to left", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.left;

        await connect();

        expect(tooltip.verticalPositioningMode).to.equal("locktodefault");
        expect(tooltip.horizontalPositioningMode).to.equal("locktodefault");

        await disconnect();
    });

    it("should set default horizontal position to left when position is set to left", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.left;

        await connect();

        expect(tooltip.verticalDefaultPosition).to.equal("center");
        expect(tooltip.horizontalDefaultPosition).to.equal("left");

        await disconnect();
    });

    it("should set vertical scaling to match content when position is set to bottom", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.left;

        await connect();

        expect(tooltip.verticalScaling).to.equal("content");
        expect(tooltip.horizontalScaling).to.equal("content");

        await disconnect();
    });

    // right position settings

    it("should set positioning mode to locked when position is set to right", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.right;

        await connect();

        expect(tooltip.verticalPositioningMode).to.equal("locktodefault");
        expect(tooltip.horizontalPositioningMode).to.equal("locktodefault");

        await disconnect();
    });

    it("should set default horizontal position to right when position is set to right", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.right;

        await connect();

        expect(tooltip.verticalDefaultPosition).to.equal("center");
        expect(tooltip.horizontalDefaultPosition).to.equal("right");

        await disconnect();
    });

    it("should set scaling to match content when position is set to right", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        tooltip.position = TooltipPosition.right;

        await connect();

        expect(tooltip.verticalScaling).to.equal("content");
        expect(tooltip.horizontalScaling).to.equal("content");

        await disconnect();
    });

    it("should set viewport lock attributes to undefined(false) by default", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        await connect();

        expect(tooltip.verticalViewportLock).to.equal(undefined);
        expect(tooltip.horizontalViewportLock).to.equal(undefined);

        await disconnect();
    });

    it("should change anchor element when the anchor attribute changes", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element;

        await connect();

        expect(tooltip.anchorElement?.id).to.equal("anchor");
        tooltip.setAttribute("anchor", "anchor2")
        expect(tooltip.anchorElement?.id).to.equal("anchor2");

        await disconnect();
    });


});
