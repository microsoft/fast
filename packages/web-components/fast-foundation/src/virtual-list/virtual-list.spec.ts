import { expect } from "chai";
import { FASTVirtualList, virtualListTemplate } from "./index.js";
import { FASTVirtualListItem, virtualListItemTemplate } from "./index.js";
import { fixture, uniqueElementName } from "../testing/fixture.js";
import { Orientation } from "@microsoft/fast-web-utilities";
import { Updates, html } from "@microsoft/fast-element";


const virtualListItemName = uniqueElementName();
FASTVirtualListItem.define({
    name: virtualListItemName,
    template: virtualListItemTemplate()
});

const virtualListName = uniqueElementName();
FASTVirtualList.define({
    name: virtualListName,
    template: virtualListTemplate({
        virtualListItem: virtualListItemName
    })
});

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
    const { document, element, connect, disconnect } = await fixture<FASTVirtualList>(virtualListName);

    element.itemTemplate = itemTemplate;

    return { element, connect, disconnect };
}

describe("VirtualList", () => {
    it("should have a default auto-update-mode of 'viewport'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.autoUpdateMode).to.equal("viewport");

        await disconnect();
    });

    it("should have a default virtualization-enabled attr of 'true'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.virtualizationEnabled).to.equal(true);

        await disconnect();
    });

    it("should have a default item-size of '50'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.itemSize).to.equal(50);

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

    it("should have a default visibleItemMap of 'undefined'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.renderedItemMap).to.be.empty;

        await disconnect();
    });

    it("should have a default 'itemTemplate'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.itemTemplate).to.not.be.empty;

        await disconnect();
    });

    it("should render all items when virtualization-enabled is false", async () => {
        const { element, connect, disconnect } = await setup();

        element.items = newDataSet(100);
        element.virtualizationEnabled = false;
        await connect();

        await Updates.next();

        expect(element.renderItems.length).to.equal(100);

        await disconnect();
    });

    it("should emit an event when rendered range changes", async () => {
        const { element, connect, disconnect } = await setup();

        const newItems  =  newDataSet(100);
        await connect();

        await Updates.next();

        let eventEmitted = false;
        element.addEventListener("renderedrangechange", e => {
            eventEmitted = true;
        });

        element.items = newItems;

        await Updates.next();

        expect(eventEmitted).to.be.true;

        await disconnect();
    });

    it("should use sizemap to calculate sizes when one is provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.items = newDataSet(3);
        element.virtualizationEnabled = false;
        element.sizemap = [
            {start: 0, size: 100, end: 100},
            {start: 100, size: 200, end: 300},
            {start: 300, size: 300, end: 600},
        ]
        await connect();

        expect(element.totalListSize).to.equal(600);

        await disconnect();
    });

    it("should return the correct sizeMap when getItemSizeMap is called and sizemap is specified", async () => {
        const { element, connect, disconnect } = await setup();

        element.items = newDataSet(3);
        element.virtualizationEnabled = false;
        element.sizemap = [
            {start: 0, size: 100, end: 100},
            {start: 100, size: 200, end: 300},
            {start: 300, size: 300, end: 600},
        ];
        await connect();

        expect(element.getItemSizeMap(0)?.end).to.equal(100);
        expect(element.getItemSizeMap(2)?.end).to.equal(600);

        await disconnect();
    });

    it("should return the correct sizeMap when getItemSizeMap is called when no sizemap is specified", async () => {
        const { element, connect, disconnect } = await setup();

        element.items = newDataSet(3);
        element.virtualizationEnabled = false;

        await connect();

        expect(element.getItemSizeMap(0)?.end).to.equal(50);
        expect(element.getItemSizeMap(2)?.end).to.equal(150);

        await disconnect();
    });
});
