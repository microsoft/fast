import { expect } from "chai";
import { VirtualizingStack, virtualizingStackTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
import { Orientation } from "@microsoft/fast-web-utilities";
import { DOM, customElement, html } from "@microsoft/fast-element";

const FASTVirtualizingStack = VirtualizingStack.compose({
    baseName: "virtualizing-stack",
    template
})

const itemTemplate = html`
    <div
        style="
            height:100%;
            width:100%;
            grid-row: ${(x, c) =>
            c.parent.orientation === Orientation.vertical
                ? c.index + c.parent.virtualizedIndexOffset
                : 1};
            grid-column: ${(x, c) =>
            c.parent.orientation === Orientation.horizontal
                ? c.index + c.parent.virtualizedIndexOffset
                : 1};
        "
    >
        ${x => x.value}
    </div>
`;

async function setup() {
    const { element, connect, disconnect } = await fixture([FASTVirtualizingStack()]);

    element.itemTemplate = itemTemplate;

    return { element, connect, disconnect };
}

describe("VirtualizingStack", () => {
    it("should have a default auto-update-mode of 'manual'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.autoUpdateMode).to.equal("manual");

        await disconnect();
    });

    it("should have a default virtualize attr of 'true'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.virtualize).to.equal(true);

        await disconnect();
    });

    it("should have a default item-span of '50'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.itemSpan).to.equal(50);

        await disconnect();
    });

    it("should have a default viewport-buffer of '100'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.viewportBuffer).to.equal(100);

        await disconnect();
    });

    it("should have a default layoutUpdateDelay of '0'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.layoutUpdateDelay).to.equal(0);

        await disconnect();
    });

    it("should have a default orientation of 'vertical'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.orientation).to.equal(Orientation.vertical);

        await disconnect();
    });

    it("should have a default regionSpan's of '0'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.startRegionSpan).to.equal(0);
        expect(element.endRegionSpan).to.equal(0);

        await disconnect();
    });

    it("should have a default spanMap of 'undefined'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.spanMap).to.equal(undefined);

        await disconnect();
    });

    it("should have a default 'itemTemplate'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.itemTemplate).to.not.equal(undefined);

        await disconnect();
    });
});
