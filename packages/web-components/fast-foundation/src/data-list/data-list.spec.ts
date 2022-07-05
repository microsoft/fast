import { expect } from "chai";
import { FASTDataList, dataListTemplate } from "./index.js";
import { FASTDataListItem, dataListItemTemplate } from "./index.js";
import { fixture, uniqueElementName } from "../testing/fixture.js";
import { Orientation } from "@microsoft/fast-web-utilities";
import { DOM, html } from "@microsoft/fast-element";


const dataListItemName = uniqueElementName();
FASTDataListItem.define({
    name: dataListItemName,
    template: dataListItemTemplate()
});

const dataListName = uniqueElementName();
FASTDataList.define({
    name: dataListName,
    template: dataListTemplate({
        dataListItem: dataListItemName
    })
});

const itemTemplate = html`
    <div
        style="
            height:100%;
            width:100%;
            grid-row: ${(x, c) =>
            c.parent.orientation === Orientation.vertical
                ? c.index
                : 1};
            grid-column: ${(x, c) =>
            c.parent.orientation === Orientation.horizontal
                ? c.index
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
    const { document, element, connect, disconnect } = await fixture<FASTDataList>(dataListName);

    element.itemTemplate = itemTemplate;

    return { element, connect, disconnect };
}

describe("DataList", () => {
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
