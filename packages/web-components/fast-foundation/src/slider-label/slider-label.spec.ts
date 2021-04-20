import { expect } from "chai";
import { SliderLabel, sliderLabelTemplate as template } from "../index";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";

const FASTSliderLabel = SliderLabel.compose({
    baseName: "slider-label",
    template
})

async function setup() {
    const { element, connect, disconnect } = await fixture(FASTSliderLabel())

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

        (element as SliderLabel).sliderOrientation = Orientation.horizontal;

        await connect();

        expect(element.classList.contains(`${Orientation.horizontal}`)).to.equal(true);

        (element as SliderLabel).sliderOrientation = Orientation.vertical;

        await DOM.nextUpdate();

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
