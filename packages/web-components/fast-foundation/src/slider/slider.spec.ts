import { expect } from "chai";
import { Slider, SliderTemplate as template } from "./index";
import { SliderLabel, SliderLabelTemplate as itemTemplate } from "../slider-label";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";
import { Orientation, Direction } from "@microsoft/fast-web-utilities";

@customElement({
    name: "fast-slider",
    template,
})
class FASTSlider extends Slider {}

@customElement({
    name: "fast-slider-label",
    template: itemTemplate,
})
class FASTSliderLabel extends SliderLabel {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTSlider>("fast-slider");

    return { element, connect, disconnect };
}

// TODO: Need to add tests for keyboard handling, position, and focus management
describe("Slider", () => {
    it("should have a role of `slider`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("slider");

        await disconnect();
    });

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

    it("should set the `aria-readonly` attribute when `readonly` value is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.readOnly = true;

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal("true");

        await disconnect();
    });

    it("should NOT set a default `aria-readonly` value when `readonly` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal(null);

        await disconnect();
    });

    it("should add a class of `readonly` when readonly is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.readOnly = true;

        await connect();

        expect(element.classList.contains("readonly")).to.equal(true);

        await disconnect();
    });

    it("should set the `aria-orientation` attribute equal to the `orientation` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.orientation = Orientation.horizontal;

        await connect();

        expect(element.getAttribute("aria-orientation")).to.equal(
            `${Orientation.horizontal}`
        );

        element.orientation = Orientation.vertical;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-orientation")).to.equal(
            `${Orientation.vertical}`
        );

        await disconnect();
    });

    it("should add a class equal to the `orientation` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.orientation = Orientation.horizontal;

        await connect();

        expect(element.classList.contains(`${Orientation.horizontal}`)).to.equal(true);

        element.orientation = Orientation.vertical;

        await DOM.nextUpdate();

        expect(element.classList.contains(`${Orientation.vertical}`)).to.equal(true);
        await disconnect();
    });

    it("should set direction equal to the `direction` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.direction = Direction.ltr;

        await connect();

        expect(element.direction).to.equal(Direction.ltr);

        element.direction = Direction.rtl;

        await DOM.nextUpdate();

        expect(element.direction).to.equal(Direction.rtl);
        await disconnect();
    });

    it("should set a default `aria-orientation` value when `orientation` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-orientation")).to.equal(
            `${Orientation.horizontal}`
        );

        await disconnect();
    });

    it("should set the `aria-valuenow` attribute with the `value` property when provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.value = "50";

        await connect();

        expect(element.getAttribute("aria-valuenow")).to.equal("50");

        await disconnect();
    });

    it("should set a default `min` property of 0 when `min` is not provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.min).to.equal(0);

        await disconnect();
    });

    it("should set the `aria-valuemin` attribute with the `min` property when provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.min = 0;

        await connect();

        expect(element.getAttribute("aria-valuemin")).to.equal("0");

        await disconnect();
    });

    it("should set a default `max` property of 0 when `max` is not provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.max).to.equal(10);

        await disconnect();
    });

    it("should constrain and normalize the value between `min` and `max` when the value is out of range", async () => {
        const { element, connect, disconnect } = await setup();

        element.value = "50";

        await connect();
        await DOM.nextUpdate();

        expect(element.value).to.equal("5");
        expect(element.getAttribute("aria-valuenow")).to.equal("5");

        await disconnect();
    });

    it("should set the `aria-valuemax` attribute with the `max` property when provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.max = 75;

        await connect();

        expect(element.getAttribute("aria-valuemax")).to.equal("75");

        await disconnect();
    });
    it("should set an `aria-valuestring` attribute with the result of the valueTextFormatter() method", async () => {
        const { element, connect, disconnect } = await setup();

        element.valueTextFormatter = () => "Seventy Five Years";

        await connect();

        expect(element.getAttribute("aria-valuetext")).to.equal("Seventy Five Years");

        await disconnect();
    });

    it("should set a tabindex of 0 on the element", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should NOT set a tabindex when disabled is `true`", async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.hasAttribute("tabindex")).to.equal(false);
        expect(element.getAttribute("tabindex")).to.equal(null);

        await disconnect();
    });

    describe("methods", () => {
        it("should increment the value when the `increment()` method is invoked", async () => {
            const { element, connect, disconnect } = await setup();

            element.min = 0;
            element.max = 100;
            element.value = "50";
            element.step = 5;

            await connect();

            expect(element.getAttribute("aria-valuenow")).to.equal("50");

            element.increment();

            await DOM.nextUpdate();

            expect(element.value).to.equal("55");
            expect(element.getAttribute("aria-valuenow")).to.equal("55");

            await disconnect();
        });

        it("should decrement the value when the `decrement()` method is invoked", async () => {
            const { element, connect, disconnect } = await setup();

            element.min = 0;
            element.max = 100;
            element.value = "50";
            element.step = 5;

            await connect();

            expect(element.getAttribute("aria-valuenow")).to.equal("50");

            element.decrement();

            await DOM.nextUpdate();

            expect(element.value).to.equal("45");
            expect(element.getAttribute("aria-valuenow")).to.equal("45");

            await disconnect();
        });
    });
});
