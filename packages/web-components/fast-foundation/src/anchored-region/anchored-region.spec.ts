import { expect } from "chai";
import { AnchoredRegion, AnchoredRegionTemplate as template } from "./index";
import { fixture } from "../fixture";
import { customElement, html } from "@microsoft/fast-element";

@customElement({
    name: "fast-anchored-region",
    template,
})
class FASTAnchoredRegion extends AnchoredRegion {}

async function setup() {
    const { element, connect, disconnect } = await fixture(html<HTMLDivElement>`
        <div>
            <button id="anchor">anchor</button>
            <fast-anchored-region anchor="anchor" id="region">
                helpful text
            </fast-anchored-region>
        </div>
    `);
    return { element, connect, disconnect };
}

describe("AnchoredRegion", () => {
    it("should set positioning modes to 'uncontrolled' by default", async () => {
        const { element, connect, disconnect } = await setup();
        const region: FASTAnchoredRegion = element.querySelector(
            "fast-anchored-region"
        ) as FASTAnchoredRegion;

        await connect();

        expect(region.verticalPositioningMode).to.equal("uncontrolled");
        expect(region.horizontalPositioningMode).to.equal("uncontrolled");

        await disconnect();
    });
});
