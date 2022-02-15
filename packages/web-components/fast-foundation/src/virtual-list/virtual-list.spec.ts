import { expect } from "chai";
import { VirtualList, virtualListTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
import { Orientation } from "@microsoft/fast-web-utilities";
import { DOM, customElement, html } from "@microsoft/fast-element";
import { timeout } from "../test-utilities/timeout";

const FASTVirtualList = VirtualList.compose({
    baseName: "virtual-list",
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

function newDataSet(rowCount: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            value: i,
        });
    }
    return newData;
}

async function setup() {
    const { element, connect, disconnect } = await fixture([FASTVirtualList()]);

    element.itemTemplate = itemTemplate;

    return { element, connect, disconnect };
}

describe("VirtualList", () => {
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

    it("should have a default orientation of 'vertical'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.orientation).to.equal(Orientation.vertical);

        await disconnect();
    });

    it("should have a default visibleItemSpans of 'undefined'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.visibleItemSpans).to.be.empty;

        await disconnect();
    });

    it("should have a default 'itemTemplate'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.itemTemplate).to.not.be.empty;

        await disconnect();
    });

    it("should render all items when virtualize is false", async () => {
        const { element, connect, disconnect } = await setup();

        element.items = newDataSet(100);
        element.virtualize = false;
        await connect();

        expect(element.visibleItems.length).to.equal(100);

        await disconnect();
    });

    it("should emit an event when rendered range changes", async () => {
        const { element, connect, disconnect } = await setup();

        const newItems  =  newDataSet(100);
        await connect();

        await DOM.nextUpdate();

        let eventEmitted = false;
        element.addEventListener("rendered-range-change", e => {
            eventEmitted = true;
        });

        element.items = newItems;

        await DOM.nextUpdate();

        expect(eventEmitted).to.be.true;

        await disconnect();
    });

    it("should use spanmap to calculate spans when one is provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.items = newDataSet(3);
        element.virtualize = false;
        element.spanmap = [
            {start: 0, span: 100, end: 100},
            {start: 100, span: 200, end: 300},
            {start: 300, span: 300, end: 600},
        ]
        await connect();

        expect(element.totalListSpan).to.equal(600);

        await disconnect();
    });

    it("should return the correct spanMap when getItemSpanMap is called and spanmap is specified", async () => {
        const { element, connect, disconnect } = await setup();

        element.items = newDataSet(3);
        element.virtualize = false;
        element.spanmap = [
            {start: 0, span: 100, end: 100},
            {start: 100, span: 200, end: 300},
            {start: 300, span: 300, end: 600},
        ];
        await connect();

        expect(element.getItemSpanMap(0)?.end).to.equal(100);
        expect(element.getItemSpanMap(2)?.end).to.equal(600);

        await disconnect();
    });

    it("should return the correct spanMap when getItemSpanMap is called when no spanmap is specified", async () => {
        const { element, connect, disconnect } = await setup();

        element.items = newDataSet(3);
        element.virtualize = false;

        await connect();

        expect(element.getItemSpanMap(0)?.end).to.equal(50);
        expect(element.getItemSpanMap(2)?.end).to.equal(150);

        await disconnect();
    });
});
