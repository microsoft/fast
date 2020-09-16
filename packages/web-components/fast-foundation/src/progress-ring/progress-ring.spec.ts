import { expect } from "chai";
import { BaseProgress as Progress } from "../progress";
import { ProgressRingTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";

describe("Progress ring", () => {
    const name = "Progress ring";

    @customElement({
        name: "fast-progress-ring",
        template,
    })
    class FASTProgressRing extends Progress {}

    it("should include a role of progressbar", async () => {
        const { element, connect, disconnect } = await fixture<FASTProgressRing>(
            "fast-progress-ring"
        );

        await connect();

        expect(element.getAttribute("role")).to.equal("progressbar");

        await disconnect();
    });

    it("should set the `aria-valuenow` attribute with the `value` property when provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTProgressRing>(
            "fast-progress-ring"
        );

        element.value = 50;

        await connect();

        expect(element.getAttribute("aria-valuenow")).to.equal("50");

        await disconnect();
    });

    it("should set the `aria-valuemin` attribute with the `min` property when provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTProgressRing>(
            "fast-progress-ring"
        );

        element.min = 0;

        await connect();

        expect(element.getAttribute("aria-valuemin")).to.equal("0");

        await disconnect();
    });

    it("should set the `aria-valuemax` attribute with the `max` property when provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTProgressRing>(
            "fast-progress-ring"
        );

        element.max = 75;

        await connect();

        expect(element.getAttribute("aria-valuemax")).to.equal("75");

        await disconnect();
    });

    it("should add a `paused` class when `paused` is true", async () => {
        const { element, connect, disconnect } = await fixture<FASTProgressRing>(
            "fast-progress-ring"
        );

        element.paused = true;

        await connect();

        expect(element.classList.contains("paused")).to.equal(true);

        await disconnect();
    });

    it("should render an element with a `determinate` slot when a value is provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTProgressRing>(
            "fast-progress-ring"
        );

        element.value = 50;

        await connect();

        expect(
            element.shadowRoot?.querySelector(".progress")?.getAttribute("slot")
        ).to.equal("determinate");

        await disconnect();
    });
});
