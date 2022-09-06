import { expect } from "chai";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTBaseList, baseListTemplate } from "./index.js";
import { FASTBaseListItem, baseListItemTemplate } from "./index.js";
import { Orientation } from "@microsoft/fast-web-utilities";
import { DOM, html } from "@microsoft/fast-element";


const baseListItemName = uniqueElementName();
FASTBaseListItem.define({
    name: baseListItemName,
    template: baseListItemTemplate()
});

const baseListName = uniqueElementName();
FASTBaseList.define({
    name: baseListName,
    template: baseListTemplate({
        baseListItem: baseListItemName
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
    const { document, element, connect, disconnect } = await fixture<FASTBaseList>(baseListName);

    element.itemTemplate = itemTemplate;

    return { element, connect, disconnect };
}

describe("BaseList", () => {
    it("should have a default orientation of 'vertical'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.orientation).to.equal(Orientation.vertical);

        await disconnect();
    });

    it("should have a default 'itemTemplate'", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.itemTemplate).to.not.be.empty;

        await disconnect();
    });
});
