import { expect } from "chai";
import { FASTSliderLabel, sliderLabelTemplate } from "../index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { Updates } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";

const SliderLabel = FASTSliderLabel.define({
    name: uniqueElementName("slider-label"),
    template: sliderLabelTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture(SliderLabel)

    return { element, connect, disconnect };
}

// TODO: Need to add tests for positioning and slider configuration
describe("Slider label", () => {
    it("should set the `aria-disabled` attribute when `disabled` value is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("true");

        await disconnect();
    });

    it("should NOT set a default `aria-disabled` value when `disabled` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal(null);

        await disconnect();
    });

    it("should add a class equal to the `sliderOrientation` value", async () => {
        const { element, connect, disconnect } = await setup();

        (element as FASTSliderLabel).sliderOrientation = Orientation.horizontal;

        await connect();

        expect(element.classList.contains(`${Orientation.horizontal}`)).to.equal(true);

        (element as FASTSliderLabel).sliderOrientation = Orientation.vertical;

        await Updates.next();

        expect(element.classList.contains(`${Orientation.vertical}`)).to.equal(true);
        await disconnect();
    });

    it("should add an element with a class of `mark` by default", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.shadowRoot?.querySelector(".mark")).to.exist;

        await disconnect();
    });

    it("should NOT add an element with a class of `mark` when `hideMark` is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.hideMark = true;

        await connect();

        expect(element.shadowRoot?.querySelector(".mark")).to.not.exist;

        await disconnect();
    });
});
