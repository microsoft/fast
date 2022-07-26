import { expect, assert } from "chai";
import { FASTSlider, sliderTemplate } from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { Updates } from "@microsoft/fast-element";
import { Orientation, Direction } from "@microsoft/fast-web-utilities";

const sliderName = uniqueElementName();
FASTSlider.define({
    name: sliderName,
    template: sliderTemplate()
});

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<FASTSlider>(sliderName);

    return { element, connect, disconnect, parent };
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

        await Updates.next();

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

        await Updates.next();

        expect(element.classList.contains(`${Orientation.vertical}`)).to.equal(true);
        await disconnect();
    });

    it("should set direction equal to the `direction` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.direction = Direction.ltr;

        await connect();

        expect(element.direction).to.equal(Direction.ltr);

        element.direction = Direction.rtl;

        await Updates.next();

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
        await Updates.next();

        expect(element.value).to.equal("5");
        expect(element.getAttribute("aria-valuenow")).to.equal("5");

        await disconnect();
    });

    it("should constrain and normalize the value when the `step` attribute has been provided and is a float", async () => {
        const { element, connect, disconnect } = await setup();

        element.step = 0.1;
        element.value = "0.5";

        await connect();

        expect((element as any).calculateNewValue(47)).to.equal(0.6);

        await disconnect();
    });

    it("should update the `stepMultiplier` when the `step` attribute has been updated", async () => {
        const { element, connect, disconnect } = await setup();

        element.step = 2;
        element.value = "4";

        await connect();

        expect((element as any).calculateNewValue(430)).to.equal(6);

        element.step = 0.1;
        element.value = "0.5";

        expect((element as any).calculateNewValue(47)).to.equal(0.6);

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

    it("should initialize to the initial value if no value property is set", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        expect(element.value).to.equal(element["initialValue"]);

        await disconnect();
    });

    it("should initialize to the provided value attribute if set pre-connection", async () => {
        const { element, connect, disconnect } = await setup();

        element.setAttribute("value", ".5");
        await connect();

        expect(element.value).to.equal(".5");

        await disconnect();
    });

    it("should initialize to the provided value attribute if set post-connection", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        element.setAttribute("value", ".5");

        expect(element.value).to.equal(".5");

        await disconnect();
    });

    it("should initialize to the provided value property if set pre-connection", async () => {
        const { element, connect, disconnect } = await setup();
        element.value = ".5";
        await connect();

        expect(element.value).to.equal(".5");

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

            await Updates.next();

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

            await Updates.next();

            expect(element.value).to.equal("45");
            expect(element.getAttribute("aria-valuenow")).to.equal("45");

            await disconnect();
        });
    });

    describe("when the owning form's reset() method is invoked", () => {
        it("should reset its value property to an empty string if no value attribute is set", async () => {
            const { connect, disconnect, element, parent } = await setup();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.value = "3";

            assert.strictEqual(element.getAttribute("value"), null);
            assert.strictEqual(element.value, "3");

            form.reset();

            assert.strictEqual(element.value, "5");

            await disconnect();
        });

        it("should reset its value property to the value of the value attribute if it is set", async () => {
            const { connect, disconnect, element, parent } = await setup();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.setAttribute("value", "7");
            element.value = "8";

            assert.strictEqual(element.getAttribute("value"), "7");
            assert.strictEqual(element.value, "8");

            form.reset();

            assert.strictEqual(element.value, "7");

            await disconnect();
        });

        it("should put the control into a clean state, where the value attribute changes the value property prior to user or programmatic interaction", async () => {
            const { connect, disconnect, element, parent } = await setup();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.value = "7";

            element.setAttribute("value", "8");

            assert.strictEqual(element.value, "7");

            form.reset();

            assert.strictEqual(element.value, "8");

            element.setAttribute("value", "3");

            assert.strictEqual(element.value, "3");

            await disconnect();
        });
    });

    describe("valueAsNumber", () => {
        it("should allow setting value with number", async () => {
            const { element, disconnect } = await setup();

            element.valueAsNumber = 18;

            expect(element.value).to.equal("18");

            await disconnect();
        });

        it("should allow reading value as number", async () => {
            const { element, disconnect } = await setup();

            element.value = "18";

            expect(element.valueAsNumber).to.equal(18);

            await disconnect();
        });
    });
});
