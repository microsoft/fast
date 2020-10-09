import { expect } from "chai";
import { customElement, DOM, html } from "@microsoft/fast-element";
import { fixture } from "../fixture";
import { Tooltip, TooltipTemplate as template } from "./index";
import { TooltipPosition } from './tooltip';
import { delay } from 'lodash-es';

@customElement({
    name: "fast-tooltip",
    template,
})
class FASTTooltip extends Tooltip {}

async function setup() {

    const { element, connect, disconnect } = await fixture(html<HTMLDivElement>`
                <div>
                    <button id="anchor">anchor</button>
                    <fast-tooltip
                        anchor="anchor"
                        id="tooltip"
                    >
                        helpful text
                    </fast-tooltip>
                </div>
            `);
    return { element, connect, disconnect };
}

describe("Tooltip", () => {
    it("should not render the toolip by default", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;
        tooltip.delay = 0;

        await connect();
        await DOM.nextUpdate();

        expect(tooltip.tooltipVisible).to.equal(false);
        expect(tooltip.shadowRoot?.querySelector("fast-anchored-region")).to.equal(null);

        await disconnect();
    });

    it("should render the toolip when visible is true", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.visible = true;
        tooltip.delay = 0;

        await connect();
        await DOM.nextUpdate();

        expect(tooltip.tooltipVisible).to.equal(true);
        expect(tooltip.shadowRoot?.querySelector("fast-anchored-region")).not.to.equal(null);

        await disconnect();
    });

    it("should not render the toolip when visible is false", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;
        
        tooltip.visible = false;
        tooltip.delay = 0;

        await connect();
        await DOM.nextUpdate();

        expect(tooltip.tooltipVisible).to.equal(false);
        expect(tooltip.shadowRoot?.querySelector("fast-anchored-region")).to.equal(null);

        await disconnect();
    });

    it("should set positioning mode to dynamic by default", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        await connect();

        expect(tooltip.verticalPositioningMode).to.equal("dynamic");
        expect(tooltip.horizontalPositioningMode).to.equal("dynamic");

        await disconnect();
    });

    it("should not set a default position by default", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        await connect();

        expect(tooltip.verticalDefaultPosition).to.equal(undefined);
        expect(tooltip.horizontalDefaultPosition).to.equal(undefined);

        await disconnect();
    });

    it("should set horizontal scaling to match anchor and vertical scaling to match content by default", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        await connect();

        expect(tooltip.verticalScaling).to.equal("content");
        expect(tooltip.horizontalScaling).to.equal("anchor");

        await disconnect();
    });

    // top position settings

    it("should set vertical positioning mode to locked and horizontal to dynamic when position is set to top", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.top;

        await connect();

        expect(tooltip.verticalPositioningMode).to.equal("locktodefault");
        expect(tooltip.horizontalPositioningMode).to.equal("dynamic");

        await disconnect();
    });

    it("should set default vertical position to top when position is set to top", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.top;

        await connect();

        expect(tooltip.verticalDefaultPosition).to.equal("top");
        expect(tooltip.horizontalDefaultPosition).to.equal(undefined);

        await disconnect();
    });

    it("should set horizontal scaling to match anchor and vertical scaling to match content when position is set to top", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.top;

        await connect();

        expect(tooltip.verticalScaling).to.equal("content");
        expect(tooltip.horizontalScaling).to.equal("anchor");

        await disconnect();
    });

     // bottom position settings

     it("should set vertical positioning mode to locked and horizontal to dynamic when position is set to bottom", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.bottom;

        await connect();

        expect(tooltip.verticalPositioningMode).to.equal("locktodefault");
        expect(tooltip.horizontalPositioningMode).to.equal("dynamic");

        await disconnect();
    });

    it("should set default vertical position to top when position is set to top", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.bottom;

        await connect();

        expect(tooltip.verticalDefaultPosition).to.equal("bottom");
        expect(tooltip.horizontalDefaultPosition).to.equal(undefined);

        await disconnect();
    });

    it("should set horizontal scaling to match anchor and vertical scaling to match content when position is set to bottom", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.bottom;

        await connect();

        expect(tooltip.verticalScaling).to.equal("content");
        expect(tooltip.horizontalScaling).to.equal("anchor");

        await disconnect();
    });

     // left position settings

     it("should set horizontal positioning mode to locked and vertical to dynamic when position is set to left", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.left;

        await connect();

        expect(tooltip.verticalPositioningMode).to.equal("dynamic");
        expect(tooltip.horizontalPositioningMode).to.equal("locktodefault");

        await disconnect();
    });

    it("should set default horizontal position to left when position is set to left", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.left;

        await connect();

        expect(tooltip.verticalDefaultPosition).to.equal(undefined);
        expect(tooltip.horizontalDefaultPosition).to.equal("left");

        await disconnect();
    });

    it("should set vertical scaling to match anchor and horizontal scaling to match content when position is set to bottom", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.left;

        await connect();

        expect(tooltip.verticalScaling).to.equal("anchor");
        expect(tooltip.horizontalScaling).to.equal("content");

        await disconnect();
    });

    // right position settings

    it("should set horizontal positioning mode to locked and vertical to dynamic when position is set to right", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.right;

        await connect();

        expect(tooltip.verticalPositioningMode).to.equal("dynamic");
        expect(tooltip.horizontalPositioningMode).to.equal("locktodefault");

        await disconnect();
    });

    it("should set default horizontal position to right when position is set to right", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.right;

        await connect();

        expect(tooltip.verticalDefaultPosition).to.equal(undefined);
        expect(tooltip.horizontalDefaultPosition).to.equal("right");

        await disconnect();
    });

    it("should set vertical scaling to match anchor and horizontal scaling to match content when position is set to rig", async () => {
        const { element, connect, disconnect } = await setup();
        const tooltip: FASTTooltip = element.querySelector("fast-tooltip") as FASTTooltip;

        tooltip.position = TooltipPosition.right;

        await connect();

        expect(tooltip.verticalScaling).to.equal("anchor");
        expect(tooltip.horizontalScaling).to.equal("content");

        await disconnect();
    });

});
