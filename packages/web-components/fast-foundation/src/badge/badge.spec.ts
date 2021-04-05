import { expect } from "chai";
import { Badge, BadgeTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";

@customElement({
    name: "fast-badge",
    template,
})
class FASTBadge extends Badge {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTBadge>("fast-badge");

    return { element, connect, disconnect };
}

let expectedFill = (fill?: string) => `background-color: var(--badge-fill-${fill});`;

let expectedColor = (color?: string) => `color: var(--badge-color-${color});`;

describe("Badge", () => {
    it("should set both the background-color and fill on the control as an inline style when `fill` and `color` are provided", async () => {
        const { element, connect, disconnect } = await setup();
        const fill: string = "foo";
        const color: string = "bar";

        element.fill = fill;
        element.color = color;

        await connect();

        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("style")
        ).to.equal(`${expectedColor(color)} ${expectedFill(fill)}`);

        await disconnect();
    });

    it("should set the background-color on the control as an inline style when `fill` is provided", async () => {
        const { element, connect, disconnect } = await setup();
        const fill: string = "foo";

        element.fill = fill;

        await connect();

        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("style")
        ).to.equal(expectedFill(fill));

        await disconnect();
    });

    it("should NOT set the background-color on the control as an inline style when `fill` is NOT provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("style")
        ).to.equal(null);

        await disconnect();
    });

    it("should set the color on the control as an inline style when `color` is provided", async () => {
        const { element, connect, disconnect } = await setup();
        const color: string = "bar";

        element.color = color;

        await connect();

        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("style")
        ).to.equal(expectedColor(color));

        await disconnect();
    });

    it("should NOT set the color on the control as an inline style when `color` is NOT provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("style")
        ).to.equal(null);

        await disconnect();
    });

    it("should NOT set an inline style when neither `fill` or `color` are provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("style")
        ).to.equal(null);

        await disconnect();
    });
});
