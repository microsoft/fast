import { expect } from "chai";
import { progressTemplate } from "./progress.template.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTProgress } from "./progress.js";

const progressName = uniqueElementName();
FASTProgress.define({
    name: progressName,
    template: progressTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTProgress>(progressName);

    return { element, connect, disconnect };
}

describe("Progress ring", () => {
    it("should include a role of progressbar", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("progressbar");

        await disconnect();
    });

    it("should set the `aria-valuenow` attribute with the `value` property when provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.value = 50;

        await connect();

        expect(element.getAttribute("aria-valuenow")).to.equal("50");

        await disconnect();
    });

    it("should set the `aria-valuemin` attribute with the `min` property when provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.min = 0;

        await connect();

        expect(element.getAttribute("aria-valuemin")).to.equal("0");

        await disconnect();
    });

    it("should set the `aria-valuemax` attribute with the `max` property when provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.max = 75;

        await connect();

        expect(element.getAttribute("aria-valuemax")).to.equal("75");

        await disconnect();
    });

    it("should add a `paused` class when `paused` is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.paused = true;

        await connect();

        expect(element.classList.contains("paused")).to.equal(true);

        await disconnect();
    });

    it("should render an element with a `determinate` slot when a value is provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.value = 50;

        await connect();

        expect(
            element.shadowRoot?.querySelector(".progress")?.getAttribute("slot")
        ).to.equal("determinate");

        await disconnect();
    });

    it("should render an element with an `indeterminate` slot when no value is provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element.shadowRoot?.querySelector(".progress")?.getAttribute("slot")
        ).to.equal("indeterminate");

        await disconnect();
    });

    it("should have a `percentComplete` value to match the inputs", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.percentComplete).to.equal(0);

        element.setAttribute("value", "50");

        expect(element.percentComplete).to.equal(50);

        element.setAttribute("value", "100");

        expect(element.percentComplete).to.equal(100);

        element.setAttribute("max", "200");

        expect(element.percentComplete).to.equal(50);

        element.setAttribute("min", "100");

        expect(element.percentComplete).to.equal(0);

        await disconnect();
    });
});
